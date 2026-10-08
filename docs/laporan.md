# LAPORAN TEKNIS ARSITEKTUR & PENGEMBANGAN APLIKASI
## "PAPAN BANTUAN WARGA" (Saling Bantu, Saling Jaga)

**Penulis:** Senior Full-Stack & UI Engineer  
**Platform:** Next.js (App Router) + Supabase (Auth & PostgreSQL) + Tailwind CSS  
**Target:** Lingkungan Produksi Vercel & Supabase Cloud  

---

### 1. STRUKTUR DAN DESAIN DATABASE POSTGRESQL

Sistem basis data dirancang dengan prinsip integritas tinggi, keamanan berlapis melalui **Row Level Security (RLS)**, serta otomatisasi trigger pada tingkat database untuk menjamin keabsahan data tanpa ketergantungan mutlak pada klien.

#### A. Tabel `public.profiles`
Tabel ini bertindak sebagai perpanjangan dari tabel bawaan Supabase `auth.users`, menyimpan profil publik dan kewenangan peran (*role*) pengguna.
* `id` (`UUID`, Primary Key): Berelasi langsung dengan `auth.users(id)` secara `ON DELETE CASCADE`.
* `full_name` (`TEXT`): Nama lengkap warga/relawan.
* `role` (`TEXT`, NOT NULL, DEFAULT `'user'`): Dibatasi oleh constraint `CHECK (role IN ('user', 'admin'))`.
* `created_at` & `updated_at` (`TIMESTAMPTZ`): Pencatatan jejak waktu pembuatan dan perubahan profil.

**Trigger Pengaman `profiles`:**
1. `on_auth_user_created`: Secara otomatis menyisipkan rekaman ke `public.profiles` sesaat setelah pengguna menyelesaikan proses registrasi (`AFTER INSERT ON auth.users`).
2. `trg_prevent_role_escalation`: Mencegah eskalasi peran sepihak. Pengguna biasa tidak memiliki izin untuk memodifikasi kolom `role` miliknya menjadi `'admin'`, perubahan peran hanya dapat diotorisasi oleh akun berkedudukan admin server-side.

#### B. Tabel `public.help_requests`
Pusat dari entitas permohonan bantuan darurat sosial.
* `id` (`UUID`, Primary Key, DEFAULT `gen_random_uuid()`): Pengidentifikasi unik setiap postingan.
* `title` (`TEXT`, NOT NULL, MAX 120): Judul kebutuhan warga yang ringkas dan padat.
* `description` (`TEXT`, NOT NULL, MAX 2000): Penjelasan mendalam mengenai kondisi medis/sosial pasien.
* `category` (`TEXT`, NOT NULL): Terikat constraint ketat whitelist: `'Medis & Darurat'`, `'Sembako'`, `'Peminjaman Alat'`, `'Tenaga Relawan'`.
* `location` (`TEXT`, NOT NULL): Kota atau domisili permohonan bantuan.
* `status` (`TEXT`, NOT NULL, DEFAULT `'menunggu'`): Status permohonan (`'menunggu'` atau `'selesai'`).
* `user_id` (`UUID`, NOT NULL, REFERENCES `auth.users(id)` ON DELETE CASCADE): Pemilik pembuat postingan.
* `contact` (`TEXT`, NOT NULL): Nomor telepon/WhatsApp kontak pemohon bantuan.
* `helper_id` (`UUID`, Nullable, REFERENCES `auth.users(id)` ON DELETE SET NULL): Relawan yang menanggapi bantuan.
* `created_at` & `updated_at` (`TIMESTAMPTZ`): Timestamp audit jejak permohonan.

#### C. Arsitektur Privasi Kontak & RPC `volunteer_help`
* **Masking Kontak Publik:** Disediakan view `public.help_requests_view` dengan proteksi kondisi:
  ```sql
  CASE 
    WHEN auth.uid() IS NOT NULL THEN hr.contact 
    ELSE '*** Silakan login untuk melihat kontak peminta bantuan ***' 
  END AS contact
  ```
  Hal ini melindungi nomor pribadi warga dari scraping atau penyalahgunaan pihak tak bertanggung jawab.
* **Fungsi Atomic `volunteer_help` (Security Definer):**
  Perubahan status bantuan dari `'menunggu'` ke `'selesai'` oleh relawan diisolasi ke dalam fungsi tersimpan PostgreSQL dengan mekanisme *row-level locking* (`FOR UPDATE`). Fungsi ini memvalidasi:
  1. Pengguna wajib telah terotentikasi (`auth.uid() IS NOT NULL`).
  2. Pengguna tidak diperbolehkan menjadi relawan untuk postingannya sendiri (`user_id <> auth.uid()`).
  3. Status permohonan wajib masih `'menunggu'`.
  Setelah validasi berhasil, status diperbarui menjadi `'selesai'`, mencatat `helper_id = auth.uid()`, dan mengembalikan kontak lengkap pemohon secara aman ke relawan.

---

### 2. CARA NEXT.JS BERKOMUNIKASI DENGAN SUPABASE

Integrasi antara Next.js App Router dan Supabase dibangun menggunakan paket modern `@supabase/ssr` dan `@supabase/supabase-js`, mengikuti pola *Server-First Hybrid Architecture*.

#### A. Sinkronisasi Sesi Autentikasi Menggunakan Cookies HTTP-Only
Berbeda dari implementasi lawas yang mengandalkan `localStorage` (rentan terhadap serangan XSS), paket `@supabase/ssr` menyimpan token autentikasi (access token dan refresh token) di dalam **Cookies**.
1. **Middleware Layer (`src/middleware.ts`):**  
   Setiap permintaan rute HTTP yang masuk diperiksa oleh Next.js Middleware. Sesi disegarkan (*token refresh*) secara transparan. Rute sensitif seperti `/minta-bantu` dan `/bantuan-saya` diverifikasi langsung ke server Supabase melalui `supabase.auth.getUser()`. Jika pengguna anonim mencoba mengakses, mereka dialihkan (*redirect*) ke `/login?redirect=...`.
2. **Server Components Data Fetching:**  
   Pada halaman publik (`/` dan `/bantuan`), Next.js memanfaatkan Server Component melalui `createSupabaseServerClient()`. Next.js membaca cookies secara aman di lingkungan Node.js serverless, melakukan query data secara langsung, dan menyajikan HTML yang telah di-render (*SSR*) ke peramban. Pendekatan ini menghasilkan *Time to First Byte* (TTFB) dan skor SEO yang optimal.
3. **Client Components Mutations & Realtime Interaction:**  
   Pada komponen interaktif seperti formulir unggah bantuan (`MintaBantuPage`) dan konfirmasi aksi relawan (`HelpDetailView`), digunakan `getSupabaseBrowserClient()`. Klien peramban berinteraksi dengan API Supabase melalui query terparametrisasi aman, memicu notifikasi toast instan, dan melakukan optimisasi navigasi menggunakan `router.refresh()`.

---

### 3. REFLEKSI & KESAN-PESAN MEMBANGUN "PAPAN BANTUAN WARGA"

Membangun platform "Papan Bantuan Warga" memberikan pengalaman berharga mengenai bagaimana teknologi perangkat lunak modern dapat difokuskan seutuhnya untuk memecahkan urgensi kemanusiaan riil. 

1. **Teknologi Sebagai Jembatan Empati:**  
   Dalam situasi darurat seperti pencarian donor darah rhesus langka atau tabung oksigen keluarga yang sesak nafas, birokrasi dan jeda waktu adalah ancaman nyata. Membangun sistem yang mendemokratisasi pencarian bantuan—di mana tetangga bisa langsung membantu tetangga tanpa biaya perantara—merupakan kehormatan tersendiri bagi seorang insinyur perangkat lunak.
2. **Keseimbangan Estetika dan Kecepatan (Design System "Organic Intelligence"):**  
   Platform bantuan sosial kerap diasosiasikan dengan tampilan kaku atau seadanya. Melalui design system *"Organic Intelligence"*, kami membuktikan bahwa platform sosial dapat tampil sangat elegan, berkelas (*high-end editorial*), namun tetap memiliki aksesibilitas tinggi dan performa secepat kilat. Tipografi Playfair Display yang dipadukan dengan JetBrains Mono menghadirkan ketenangan sekaligus kesigapan informasi.
3. **Ketahanan dan Keamanan Tanpa Kompromi:**  
   Ketika mengelola data kontak pribadi warga, privasi bukanlah sekadar opsi tambahan, melainkan kewajiban mutlak. Penerapan Row Level Security (RLS), validasi Zod ganda, honeypot anti-spam, dan sanitasi input memastikan bahwa warga dapat meminta pertolongan dengan rasa aman dan tenteram.

Aplikasi ini siap digunakan dan dapat terus dikembangkan menjadi tulang punggung solidaritas komunitas di berbagai daerah di Indonesia.
