-- ==============================================================================
-- SKEMA DATABASE: PAPAN BANTUAN WARGA
-- Target: Supabase Postgres
-- Deskripsi: Skema tabel profiles, help_requests, trigger otomatis, RLS policies,
--            dan RPC Security Definer untuk respon relawan.
-- ==============================================================================

-- 1. EKSTENSI
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (terkait auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 3. TABEL HELP_REQUESTS
CREATE TABLE IF NOT EXISTS public.help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) <= 120),
  description TEXT NOT NULL CHECK (char_length(description) <= 2000),
  category TEXT NOT NULL CHECK (category IN ('Medis & Darurat', 'Sembako', 'Peminjaman Alat', 'Tenaga Relawan')),
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'selesai')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact TEXT NOT NULL,
  helper_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index performa query feed dan filter
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON public.help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_category ON public.help_requests(category);
CREATE INDEX IF NOT EXISTS idx_help_requests_location ON public.help_requests(location);
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON public.help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_helper_id ON public.help_requests(helper_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_created_at ON public.help_requests(created_at DESC);

-- 4. VIEW UNTUK PERLINDUNGAN PRIVASI KONTAK (Public View dengan masking kontak)
-- Kolom kontak hanya terlihat bagi user yang telah login (auth.uid() IS NOT NULL)
CREATE OR REPLACE VIEW public.help_requests_view AS
SELECT 
  hr.id,
  hr.title,
  hr.description,
  hr.category,
  hr.location,
  hr.status,
  hr.user_id,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN hr.contact
    ELSE '*** Silakan login untuk melihat kontak peminta bantuan ***'
  END AS contact,
  hr.helper_id,
  hr.created_at,
  hr.updated_at,
  p.full_name AS requester_name
FROM public.help_requests hr
LEFT JOIN public.profiles p ON p.id = hr.user_id;

-- 5. FUNCTION & TRIGGER: OTOMATIS BUAT PROFIL SAAT SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. FUNCTION & TRIGGER: CEGAH USER BIASA MENGUBAH ROLE DI PROFILES
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_role TEXT;
BEGIN
  -- Ambil role pengguna saat ini dari profile atau klaim
  SELECT role INTO current_role FROM public.profiles WHERE id = auth.uid();
  
  -- Jika role diubah dan yang mengubah bukan admin, batalkan perubahan role
  IF NEW.role <> OLD.role AND (current_role IS DISTINCT FROM 'admin') THEN
    NEW.role := OLD.role;
  END IF;
  
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- 7. FUNCTION: AUTO UPDATE TIMESTAMPTZ PADA HELP_REQUESTS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_help_requests_updated_at ON public.help_requests;
CREATE TRIGGER trg_help_requests_updated_at
  BEFORE UPDATE ON public.help_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. RPC KEAMANAN: RELAWAN MEMBANTU (SECURITY DEFINER)
-- Validasi ketat:
-- - User harus terotentikasi (auth.uid() NOT NULL)
-- - User BUKAN pembuat postingan (user_id != auth.uid())
-- - Status saat ini masih 'menunggu'
CREATE OR REPLACE FUNCTION public.volunteer_help(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_req RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Anda harus login untuk menjadi relawan.';
  END IF;

  -- Lock baris untuk mencegah race condition
  SELECT * INTO v_req 
  FROM public.help_requests 
  WHERE id = p_request_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Permintaan bantuan tidak ditemukan.';
  END IF;

  IF v_req.user_id = v_uid THEN
    RAISE EXCEPTION 'Anda tidak dapat menjadi relawan untuk permintaan bantuan yang Anda buat sendiri.';
  END IF;

  IF v_req.status = 'selesai' THEN
    RAISE EXCEPTION 'Permintaan bantuan ini sudah selesai dibantu oleh relawan lain.';
  END IF;

  UPDATE public.help_requests
  SET 
    status = 'selesai',
    helper_id = v_uid,
    updated_at = timezone('utc'::text, now())
  WHERE id = p_request_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Terima kasih telah bersedia membantu sesama warga!',
    'contact', v_req.contact,
    'title', v_req.title,
    'location', v_req.location
  );
END;
$$;

-- 9. ROW LEVEL SECURITY (RLS) POLICIES

-- Aktifkan RLS di kedua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

-- === POLICIES UNTUK PROFILES ===
-- Publik & user terdaftar dapat membaca profil singkat
CREATE POLICY "Profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- User hanya dapat menyunting profil miliknya sendiri
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- === POLICIES UNTUK HELP_REQUESTS ===
-- Publik dapat melihat semua bantuan (tapi kolom kontak diamankan oleh view atau aplikasi)
CREATE POLICY "Help requests are viewable by everyone"
  ON public.help_requests FOR SELECT
  USING (true);

-- Hanya user terautentikasi yang dapat membuat permintaan bantuan dengan id miliknya
CREATE POLICY "Authenticated users can create help requests"
  ON public.help_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Pemilik postingan dapat memperbarui postingannya
CREATE POLICY "Owners can update own help requests"
  ON public.help_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pemilik postingan ATAU admin dapat menghapus postingan
CREATE POLICY "Owners or admins can delete help requests"
  ON public.help_requests FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Berikan izin akses pada view publik
GRANT SELECT ON public.help_requests_view TO anon, authenticated;
