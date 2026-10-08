-- ==============================================================================
-- SEED DATA: PAPAN BANTUAN WARGA
-- Deskripsi: Data awal (dummy/seed) untuk pengujian lokal & staging
-- Kategori: Medis & Darurat, Sembako, Peminjaman Alat, Tenaga Relawan
-- ==============================================================================

-- Buat user dummy di auth.users jika di environment lokal Supabase (atau fallback ID umum)
-- Catatan: Jika dieksekusi di Supabase Cloud tanpa mengizinkan insert langsung ke auth.users,
-- Anda dapat mendaftarkan akun via UI Auth lalu mengganti user_id ini.

DO $$
DECLARE
  v_demo_user_1 UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  v_demo_user_2 UUID := 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  v_demo_user_3 UUID := 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  v_helper_user UUID := 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';
BEGIN
  -- 1. Sisipkan user dummy ke auth.users terlebih dahulu agar lolos foreign key auth.users

  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES 
    (v_demo_user_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'budi@wargabantu.test', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Budi Santoso"}', now(), now()),
    (v_demo_user_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'siti@wargabantu.test', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Siti Rahmawati"}', now(), now()),
    (v_demo_user_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hendra@wargabantu.test', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"dr. Hendra Wijaya"}', now(), now()),
    (v_helper_user, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'relawan@wargabantu.test', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Relawan Tanggap Merah Putih"}', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 2. Insert dummy profiles
  INSERT INTO public.profiles (id, full_name, role)
  VALUES 
    (v_demo_user_1, 'Budi Santoso', 'user'),
    (v_demo_user_2, 'Siti Rahmawati', 'user'),
    (v_demo_user_3, 'dr. Hendra Wijaya', 'user'),
    (v_helper_user, 'Relawan Tanggap Merah Putih', 'user')
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;


  -- 1. Medis & Darurat - Padang
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '11111111-1111-4111-8111-111111111111',
    'Dibutuhkan Donor Darah Golongan O Rhesus Negatif Segera',
    'Mohon bantuan rekan-rekan warga untuk pasien operasi darurat bypass jantung di RSUP Dr. M. Djamil Padang. Diperlukan 3 kantong darah gol O Rhesus Negatif hari ini sebelum pukul 17:00 WIB.',
    'Medis & Darurat',
    'Padang, Sumatera Barat',
    'menunggu',
    v_demo_user_1,
    'WhatsApp: 0812-7788-9900 (Keluarga Pasien - Budi)',
    NULL,
    now() - interval '2 hours'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Peminjaman Alat - Surabaya
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '22222222-2222-4222-8222-222222222222',
    'Peminjaman Tabung Oksigen 1m3 untuk Pasien Lansia Sesak Nafas',
    'Ibu kami (usia 74 tahun) mengalami saturasi drop pasca infeksi paru-paru. Kami butuh pinjaman tabung oksigen beserta regulatornya selama masa pemulihan di rumah (estimasi 4 hari). Tabung akan dikembalikan dalam kondisi prima.',
    'Peminjaman Alat',
    'Surabaya Timur, Jawa Timur',
    'menunggu',
    v_demo_user_2,
    'WhatsApp / Telp: 0813-3344-5566 (Siti Rahmawati)',
    NULL,
    now() - interval '5 hours'
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Sembako - Bogor
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '33333333-3333-4333-8333-333333333333',
    'Paket Sembako Darurat untuk Warga Lansia Terisolir Pasca Longsor',
    'Akses jalan desa Cisarua sempat tertutup material tanah. Terdapat 4 keluarga lansia yang kehabisan beras, minyak goreng, dan telur. Bantuan logistik bahan pokok kering sangat diapresiasi.',
    'Sembako',
    'Bogor, Jawa Barat',
    'menunggu',
    v_demo_user_1,
    'WhatsApp: 0811-9988-7711 (Ketua RT 03)',
    NULL,
    now() - interval '9 hours'
  ) ON CONFLICT (id) DO NOTHING;

  -- 4. Tenaga Relawan - Demak
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '44444444-4444-4444-8444-444444444444',
    'Relawan Distribusi Makanan & Pembersihan Lumpur Pasca Banjir',
    'Dibutuhkan 6 orang relawan tenaga untuk membantu dapur umum dan mendistribusikan nasi bungkus ke pemukiman terdampak banjir rob Karanganyar Demak. Titik kumpul di Masjid Baiturrahman.',
    'Tenaga Relawan',
    'Demak, Jawa Tengah',
    'menunggu',
    v_demo_user_3,
    'WhatsApp: 0852-6677-8899 (Posko Peduli Demak)',
    NULL,
    now() - interval '14 hours'
  ) ON CONFLICT (id) DO NOTHING;

  -- 5. Peminjaman Alat - Bandung
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '55555555-5555-4555-8555-555555555555',
    'Peminjaman Kursi Roda Lipat untuk Anak Disabilitas',
    'Anak kami sedang memulai tahun ajaran baru sekolah luar biasa dan membutuhkan kursi roda portabel selama proses asesmen fisioterapi (sekitar 2 minggu). Mohon info bila ada warga yang bersedia meminjamkan.',
    'Peminjaman Alat',
    'Bandung Kota, Jawa Barat',
    'menunggu',
    v_demo_user_2,
    'WhatsApp: 0821-4455-6677 (Ibu Siti)',
    NULL,
    now() - interval '1 day'
  ) ON CONFLICT (id) DO NOTHING;

  -- 6. Medis & Darurat - Yogyakarta
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '66666666-6666-4666-8666-666666666666',
    'Bantuan Ambulans Siaga Pengantaran Pasien Kemoterapi',
    'Mencari kontak ambulans gratis/komunitas untuk mengantar pasien dhuafa dari Bantul ke RSUP Dr Sardjito untuk jadwal kemoterapi hari Jumat pagi. Pasien memakai kursi roda.',
    'Medis & Darurat',
    'Bantul, D.I. Yogyakarta',
    'menunggu',
    v_demo_user_3,
    'WhatsApp: 0877-2233-4455 (dr. Hendra / Pendamping Pasien)',
    NULL,
    now() - interval '1 day'
  ) ON CONFLICT (id) DO NOTHING;

  -- 7. Sembako - Jakarta Utara
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '77777777-7777-4777-8777-777777777777',
    'Bantuan Susu Formula Khusus & Popok Bayi Prasejahtera',
    'Keluarga nelayan di Cilincing dengan bayi kembar usia 8 bulan membutuhkan bantuan susu formula bebas laktosa dan popok karena kondisi ekonomi sedang terhimpit gelombang tinggi melaut.',
    'Sembako',
    'Jakarta Utara, DKI Jakarta',
    'menunggu',
    v_demo_user_1,
    'WhatsApp: 0812-1122-3344 (Komunitas Nelayan Cilincing)',
    NULL,
    now() - interval '2 days'
  ) ON CONFLICT (id) DO NOTHING;

  -- 8. Peminjaman Alat - Semarang
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '88888888-8888-4888-8888-888888888888',
    'Pinjam Nebulizer Portabel untuk Balita Asma Akut',
    'Balita kami sering kumat asma pada cuaca dingin ekstrem malam hari. Alat nebulizer kami rusak. Membutuhkan pinjaman selama 3 hari selagi menunggu pesanan unit baru tiba.',
    'Peminjaman Alat',
    'Semarang, Jawa Tengah',
    'menunggu',
    v_demo_user_2,
    'WhatsApp: 0896-7788-9900 (Keluarga Rahma)',
    NULL,
    now() - interval '2 days'
  ) ON CONFLICT (id) DO NOTHING;

  -- 9. Tenaga Relawan - Solo
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    '99999999-9999-4999-8999-999999999999',
    'Pendamping Lansia Tunggal ke Fasilitas Kesehatan Kontrol Rutin',
    'Mbah Suparmi (82 tahun) tinggal sebatang kara di Jebres dan perlu pendampingan ramah untuk kontrol rutin jantung di RSUD Moewardi pada Kamis pagi jam 08:00.',
    'Tenaga Relawan',
    'Surakarta (Solo), Jawa Tengah',
    'menunggu',
    v_demo_user_3,
    'WhatsApp: 0819-0123-4567 (Kader Lansia Kelurahan)',
    NULL,
    now() - interval '3 days'
  ) ON CONFLICT (id) DO NOTHING;

  -- 10. Medis & Darurat - Medan (Contoh status 'selesai' terbantu oleh relawan)
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Kebutuhan Tabung Oksigen Portable Saat Perjalanan Rujukan',
    'Keluarga memerlukan tabung oksigen kecil portabel untuk perjalanan evakuasi ambulans dari Binjai ke RS Adam Malik Medan.',
    'Medis & Darurat',
    'Medan, Sumatera Utara',
    'selesai',
    v_demo_user_1,
    'WhatsApp: 0813-9988-7766 (Budi)',
    v_helper_user,
    now() - interval '4 days'
  ) ON CONFLICT (id) DO NOTHING;

  -- 11. Sembako - Malang (Contoh status 'selesai')
  INSERT INTO public.help_requests (
    id, title, description, category, location, status, user_id, contact, helper_id, created_at
  ) VALUES (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Bantuan Dapur Umum Warga Terkena Banjir Bandang Batu',
    'Penyediaan bahan sayur mayur dan telur untuk suplai 100 bungkus makan siang bagi warga terdampak.',
    'Sembako',
    'Batu - Malang, Jawa Timur',
    'selesai',
    v_demo_user_2,
    'WhatsApp: 0812-4455-7788 (Siti)',
    v_helper_user,
    now() - interval '5 days'
  ) ON CONFLICT (id) DO NOTHING;

END $$;
