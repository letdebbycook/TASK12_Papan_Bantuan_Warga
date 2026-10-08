# Papan Bantuan Warga (nextjs-warga-bantu)
> **Tagline:** *"Saling Bantu, Saling Jaga"*  
> **Tujuan:** Platform dampak sosial di mana warga memposting permintaan bantuan darurat (donor darah, kursi roda, tabung oksigen, sembako, tenaga relawan) dan relawan komunitas dapat merespons secara langsung, transparan, dan aman.

---

## 🌟 Fitur Utama & Alur Pengguna

1. **Beranda (`/`)**:
   - Hero dinamis dengan visual *mesh gradient drift*, tipografi editorial besar *Playfair Display*, *wave container*, dan tombol pulse CTA *"Minta Bantuan"*.
   - Statistik ringkas jumlah permintaan bantuan, permohonan terbantu, dan siaga aktif.
   - Preview postingan terbaru dengan efek hover kartu orb.
   - Penjelasan interaktif Cara Kerja & Kategori Bantuan (Accordion 2 kolom).
2. **Katalog & Feed Bantuan (`/bantuan`)**:
   - Grid kartu 2 kolom staggered vertikal.
   - Filter instan kategori: *Semua*, *Medis & Darurat*, *Sembako*, *Peminjaman Alat*, *Tenaga Relawan*.
   - Pencarian berdasarkan kata kunci kebutuhan atau kota.
   - Filter status (*Menunggu* / *Selesai*).
   - Empty state dan indikator skeleton.
3. **Detail Permohonan Bantuan (`/bantuan/[id]`)**:
   - Deskripsi lengkap, lokasi kebutuhan, dan penanda waktu.
   - Tombol **"Saya Ingin Membantu"** (wajib login, dicegah membantu postingan milik sendiri).
   - Saat ditekan, sistem menjalankan RPC PostgreSQL aman `volunteer_help`: status berubah otomatis dari *menunggu* → *selesai*, mencatat ID relawan, serta membuka kontak pemohon (termasuk tombol pintas WhatsApp).
   - Nomor kontak dilindungi secara default dan disembunyikan dari pengunjung publik/anonim demi privasi warga.
4. **Unggah Permintaan Bantuan (`/minta-bantu`)**:
   - Rute terproteksi (wajib login, dilindungi Next.js Middleware).
   - Formulir Judul, Deskripsi, Kategori dropdown, Lokasi kota, dan Kontak.
   - Validasi ganda (klien + server) dengan Zod.
   - Perlindungan anti-spam bot dengan kolom honeypot.
   - Notifikasi toast dan pengalihan ke beranda setelah sukses.
5. **Bantuan Saya (`/bantuan-saya`)**:
   - Daftar riwayat semua permohonan yang pernah dibuat oleh akun login.
   - Opsi Hapus (DELETE) postingan dengan dialog modal konfirmasi.
6. **Autentikasi Terpadu (`/login`)**:
   - Masuk & Daftar akun baru via Supabase Auth (Email & Password).
   - Dukungan Google OAuth satu klik.
   - Pesan error ramah pengguna tanpa membocorkan detail teknis sistem.

---

## 🎨 Design System: "Organic Intelligence" (Premium Fluidity)

Aplikasi dibangun dengan estetika editorial-teknologi *high-end*:
* **Palet Warna**:
  - Background Utama: `#fcfbf9` (Cream)
  - Background Gelap: `#171717` (Dark)
  - Aksen Utama: `#4338ca` (Indigo)
  - Aksen Mesh: `indigo-200/50`, `purple-200/40`
  - Border Subtil: `#e5e5e5`
* **Tipografi**:
  - Tipe Font: **Sans-Serif Murni (Inter)** untuk seluruh elemen teks (Display, Heading, Body Text, dan Label Fungsional).
  - Heading / Display: Sans-serif tebal (weight 600–800) dengan penekanan kata miring (*italic*).
  - Body Text: Sans-serif bersih (Inter, weight 400–500, leading 1.2–1.5).
  - Label Fungsional: Sans-serif uppercase dengan tracking luas `0.3em+` untuk keterbacaan optimal.
* **Motion & Animasi**:
  - Easing tunggal terdaftar: `cubic-bezier(0.22, 1, 0.36, 1)` (token Tailwind `ease-premium`).
  - Animasi melayang *background mesh drift* 30s linear infinite.
  - Tombol CTA pulse `scale(1.02)` + blur shadow indigo 20px.
  - Hover card lift `-1rem` dan kemunculan pill tombol "LIHAT".
  - Dukungan aksesibilitas `prefers-reduced-motion`.
* **Header Khusus**:
  - Fixed header dengan efek `mix-blend-difference`.
  - Indikator berkedip "Komunitas Aktif".

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router, Turbopack, TypeScript, `src/` directory)
* **Styling**: Tailwind CSS v4
* **Backend & Database**: Supabase (PostgreSQL, Auth, Row Level Security, RPC)
* **Libraries**: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `clsx`, `tailwind-merge`
* **Deployment**: Vercel

---

## 📁 Struktur Direktori Proyek

```
nextjs-warga-bantu/
├── docs/
│   ├── laporan.md            # Draft laporan 2 halaman (Database, SSR, Refleksi)
│   └── demo-script.md        # Naskah video demo 3 menit step-by-step
├── public/
├── src/
│   ├── app/
│   │   ├── auth/callback/    # Handler Google OAuth redirect
│   │   ├── bantuan/          # Halaman Feed & Detail (/bantuan, /bantuan/[id])
│   │   ├── bantuan-saya/     # Halaman riwayat postingan user & hapus
│   │   ├── login/            # Halaman login, register, OAuth
│   │   ├── minta-bantu/      # Formulir permohonan bantuan darurat
│   │   ├── globals.css       # Token tema Organic Intelligence & keyframes
│   │   ├── layout.tsx        # Root layout, Google Fonts, SEO Schema Organization
│   │   ├── page.tsx          # Halaman Beranda (Hero, Stats, Feed, Accordion)
│   │   ├── error.tsx         # Error boundary ramah pengguna
│   │   ├── not-found.tsx     # Custom 404 page
│   │   ├── robots.ts         # Robots.txt generator
│   │   └── sitemap.ts        # Dynamic XML Sitemap generator
│   ├── components/
│   │   ├── features/         # Hero, HelpCard, HelpGrid, AccordionFAQ, Stats, Detail
│   │   ├── layout/           # Navbar (mix-blend-difference), Footer
│   │   ├── providers/        # AuthProvider & session listener
│   │   └── ui/               # Toast notification system
│   ├── lib/
│   │   ├── analytics.ts      # Safe GA4/Plausible tracking wrapper
│   │   ├── data.ts           # Hybrid data fetching (Supabase + fallback seed)
│   │   ├── supabase.ts       # Browser Supabase client helper
│   │   ├── supabase-server.ts# Server Supabase client helper (cookies)
│   │   └── validators/       # Skema Zod untuk form bantuan & auth
│   ├── middleware.ts         # Auth route protection & in-memory rate limiting
│   └── types/
│       └── database.ts       # TypeScript database definitions
├── supabase/
│   ├── schema.sql            # Tabel, Trigger, RLS Policies, RPC volunteer_help
│   └── seed.sql              # 11 data awal permohonan bantuan realistis
├── .env.example              # Contoh variabel lingkungan
├── next.config.ts            # Security headers (CSP, HSTS, X-Frame-Options)
├── package.json
└── README.md
```

---

## 🚀 Panduan Setup & Menjalankan di Lokal

### 1. Clone Repository & Install Dependensi
```bash
git clone https://github.com/your-username/nextjs-warga-bantu.git
cd nextjs-warga-bantu
npm install
```

### 2. Konfigurasi Variabel Lingkungan
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Buka `.env.local` dan masukkan kunci proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Setup Basis Data di Supabase Cloud
1. Masuk ke dashboard [Supabase](https://supabase.com) dan buat proyek baru.
2. Buka menu **SQL Editor** pada panel kiri dashboard Supabase.
3. Buka file [`/supabase/schema.sql`](file:///d:/magang/task/12/supabase/schema.sql) di repo ini, salin seluruh kodenya, tempel di SQL Editor Supabase, lalu klik **Run**.  
   *(Skema ini otomatis membuat tabel `profiles`, tabel `help_requests`, trigger sinkronisasi user, view `help_requests_view`, seluruh RLS Policy, dan RPC function `volunteer_help`)*.
4. Buka file [`/supabase/seed.sql`](file:///d:/magang/task/12/supabase/seed.sql), salin kodenya, tempel di SQL Editor Supabase, lalu klik **Run** untuk mengisi 11 data awal bantuan simulasi.

### 4. Konfigurasi Google OAuth (Opsional untuk Login Google)
1. Di dashboard Supabase, buka menu **Authentication** → **Providers** → aktifkan **Google**.
2. Masukkan *Client ID* dan *Client Secret* dari Google Cloud Console.
3. Di Google Cloud Console, tambahkan URL redirect callback dari Supabase:  
   `https://<your-project-id>.supabase.co/auth/v1/callback`
4. Di dashboard Supabase (**URL Configuration**), tambahkan redirect URL website Anda:  
   - Lokal: `http://localhost:3000/auth/callback`
   - Production: `https://warga-bantu.vercel.app/auth/callback`

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.

---

## ☁️ Panduan Deployment ke Vercel

1. **Push ke GitHub**: Pastikan commit bersih dan push ke repository GitHub.
2. **Import ke Vercel**:
   - Masuk ke dashboard [Vercel](https://vercel.com) → klik **Add New** → **Project**.
   - Pilih repository `nextjs-warga-bantu`.
3. **Masukkan Environment Variables di Vercel Dashboard**:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL API Supabase Anda.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon Public Key Supabase Anda.
   - `NEXT_PUBLIC_SITE_URL`: Domain produksi Vercel Anda (misal `https://warga-bantu.vercel.app`).
4. **Deploy**: Klik tombol **Deploy**. Vercel akan otomatis menjalankan `npm run build` dan mempublikasikan aplikasi dalam hitungan detik.

---

## 🛡️ Checklist Keamanan

| Parameter Keamanan | Status Implementasi | Keterangan |
|---|---|---|
| **Row Level Security (RLS)** | ✅ Otomatis | Aktif di semua tabel (`profiles`, `help_requests`). Tidak pernah dinonaktifkan. |
| **Masking Kontak Publik** | ✅ Otomatis | Nomor kontak pemohon hanya terbuka jika `auth.uid() IS NOT NULL` atau via RPC relawan. |
| **RPC Security Definer** | ✅ Otomatis | Fungsi `volunteer_help` memvalidasi pemilik, status 'menunggu', dan mengunci baris data (`FOR UPDATE`). |
| **Proteksi Peran Admin** | ✅ Otomatis | Trigger `prevent_role_escalation` mencegah user biasa mengubah kolom role dirinya. |
| **Autentikasi Server-Side** | ✅ Otomatis | Menggunakan `@supabase/ssr` cookies dengan verifikasi `supabase.auth.getUser()`. |
| **Middleware Proteksi Rute** | ✅ Otomatis | Rute `/minta-bantu` dan `/bantuan-saya` dibatasi hanya untuk user terotentikasi. |
| **Rate Limiting & Anti-Brute Force**| ✅ Otomatis | In-memory IP limiter di middleware untuk rute auth/login. |
| **Validasi Form 2 Lapis** | ✅ Otomatis | Menggunakan Zod di klien dan server, termasuk panjang karakter & whitelist kategori. |
| **Anti-Spam Bot** | ✅ Otomatis | Kolom honeypot tersembunyi `website_honeypot` pada form pengajuan bantuan. |
| **Security Headers** | ✅ Otomatis | Dikonfigurasi di `next.config.ts`: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy. |
| **Secret Protection** | ✅ Otomatis | `.gitignore` mengabaikan `.env*` kecuali `.env.example`. Kunci `service_role` tidak pernah diekspos ke klien. |
| **Google Cloud OAuth Consent** | ⚠️ Tindakan Manual | Konfigurasi OAuth Client ID & Secret di konsol Google Cloud pengembang. |

---

## 🌐 Checklist SEO & Petunjuk Pemeliharaan Manual

| Fitur SEO | Status Implementasi | Keterangan |
|---|---|---|
| **Sitemap Dinamis** | ✅ Otomatis | `app/sitemap.ts` menyertakan Beranda, Feed, dan seluruh rute detail `/bantuan/[id]`. |
| **Robots.txt** | ✅ Otomatis | `app/robots.ts` mengizinkan pengindeksan halaman publik dan memblokir rute privat. |
| **Metadata & Open Graph** | ✅ Otomatis | Judul unik, deskripsi, meta keywords, locale `id_ID`, dan kartu pratinjau sosial. |
| **JSON-LD Schema Markup** | ✅ Otomatis | `Organization` di Layout, `BreadcrumbList` di Feed, dan `SpecialAnnouncement` di Detail. |
| **Canonical URL** | ✅ Otomatis | Ditetapkan via `metadataBase` dan canonical tags. |
| **Custom 404 & Error** | ✅ Otomatis | `not-found.tsx` dan `error.tsx` terintegrasi harmonis dengan tema. |
| **Event Tracking Wrapper** | ✅ Otomatis | Wrapper `track()` aman dan modular untuk GA4 atau Plausible. |

### Langkah Manual Penting untuk Administrator:

1. **Submit Sitemap ke Google Search Console (GSC)**:
   - Buka [Google Search Console](https://search.google.com/search-console).
   - Tambahkan domain Vercel Anda (misal `https://warga-bantu.vercel.app`).
   - Masuk ke menu **Sitemaps**, masukkan URL sitemap: `https://warga-bantu.vercel.app/sitemap.xml`, lalu klik **Submit**.
2. **Pengecekan Status Indexing & Broken Links**:
   - Jalankan alat audit seperti *Google Lighthouse* atau *Ahrefs Webmaster Tools* untuk memverifikasi kesehatan tautan internal.
   - Periksa tab *Coverage* di Search Console untuk memastikan tidak ada kesalahan pengindeksan.
3. **Backup Basis Data Berkala (Supabase Database Backup)**:
   - Supabase Hobby Tier menyediakan fitur cadangan terjadwal.
   - Untuk cadangan mandiri (*manual export*), jalankan Supabase CLI:
     ```bash
     supabase db dump --db-url "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" > backup_$(date +%Y%m%d).sql
     ```
   - Simpan berkas cadangan di penyimpanan terenkripsi yang aman.
4. **Uji Responsivitas Peramban Silang (Cross-Browser Testing)**:
   - Lakukan uji visual di Chrome, Safari (iOS), Firefox, dan Edge untuk memverifikasi rendering efek `mix-blend-difference` pada header dan font Playfair Display.

---

## 📄 Dokumen Terkait
* **Laporan Teknis & Refleksi 2 Halaman**: [`docs/laporan.md`](file:///d:/magang/task/12/docs/laporan.md)
* **Naskah Alur Demo Video 3 Menit**: [`docs/demo-script.md`](file:///d:/magang/task/12/docs/demo-script.md)
* **Skema Database SQL**: [`supabase/schema.sql`](file:///d:/magang/task/12/supabase/schema.sql)
* **Seed Data Dummy SQL**: [`supabase/seed.sql`](file:///d:/magang/task/12/supabase/seed.sql)

---
*Dibuat dengan dedikasi penuh untuk kemanusiaan dan solidaritas warga Indonesia.*
