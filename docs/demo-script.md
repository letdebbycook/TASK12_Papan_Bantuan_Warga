# SKRIP ALUR DEMO VIDEO (DURASI: 3 MENIT)
## APLIKASI: "PAPAN BANTUAN WARGA" (Saling Bantu, Saling Jaga)

**Tujuan Demo:** Menunjukkan skenario ujung-ke-ujung (*end-to-end*) di mana seorang warga memposting kebutuhan tabung oksigen darurat di Padang, kemudian seorang relawan lain masuk, menanggapi bantuan, dan status permohonan berubah menjadi selesai secara aman.

---

### RINGKASAN PEMBAGIAN WAKTU (TIMELINE)
* **00:00 - 00:30 (30 detik):** Pembukaan & Tur Singkat Beranda (Design System Organic Intelligence)
* **00:30 - 01:15 (45 detik):** Registrasi/Login Akun Warga & Unggah Permohonan Tabung Oksigen di Padang
* **01:15 - 01:45 (30 detik):** Pengecekan di Halaman "Bantuan Saya" & Verifikasi Feed Publik
* **01:45 - 02:30 (45 detik):** Login Akun Relawan Baru & Akses Detail Bantuan
* **02:30 - 03:00 (30 detik):** Klik "Saya Ingin Membantu", Perubahan Status ke "Selesai", Reveal Kontak, & Penutup

---

### NASKAH DETAIL & PETUNJUK TINDAKAN

#### BABAK 1: PEMBUKAAN & DESAIN (00:00 - 00:30)
* **Visual:** Layar browser menampilkan Beranda (`http://localhost:3000` atau URL Vercel). Kursor menyorot Header bertema `mix-blend-difference`, logo serif italic "WargaBantu", indikator berkedip "Komunitas Aktif", dan tipografi raksasa *"Saling Bantu, Saling Jaga"* dengan lengkungan Wave Container.
* **Narator:**  
  *"Halo semuanya! Hari ini saya mendemokan 'Papan Bantuan Warga', platform gotong royong sosial tempat warga memposting kebutuhan darurat dan relawan dapat langsung merespons secara transparan. Aplikasi ini dibangun dengan Next.js App Router, Supabase Postgres & Auth, dan design system premium Organic Intelligence."*
* **Tindakan:** Scroll perlahan melewati statistik ringkas (Permintaan, Terbantu, Siaga Aktif), preview card dengan hover orb, dan bagian Cara Kerja (accordion interaktif).

---

#### BABAK 2: AKUN WARGA & MINTA BANTUAN (00:30 - 01:15)
* **Visual:** Klik tombol pulse **"+ MINTA BANTUAN"** di puncak lengkungan Wave Container. Sistem mendeteksi belum login dan mengarahkan ke `/login?redirect=/minta-bantu`.
* **Tindakan:**  
  1. Klik tab **"DAFTAR BARU"** di form login.
  2. Isi Nama: `Ahmad Syarif`, Email: `ahmad.padang@wargabantu.test`, Kata Sandi: `password123#`, Konfirmasi: `password123#`.
  3. Klik **"DAFTARKAN AKUN →"**. Muncul toast hijau *"Pendaftaran Berhasil!"*.
  4. Pengguna langsung diarahkan ke halaman `/minta-bantu`.
* **Narator:**  
  *"Sekarang Ahmad, seorang warga di Padang, membutuhkan tabung oksigen untuk keluarganya. Kita isi formulir darurat ini:"*
* **Tindakan Pengisian Form:**
  * **Judul:** `Butuh tabung oksigen di Padang untuk lansia sesak nafas`
  * **Kategori:** Pilih `Peminjaman Alat` (atau `Medis & Darurat`)
  * **Lokasi:** `Padang, Sumatera Barat (Kec. Kuranji)`
  * **Deskripsi:** `Keluarga kami membutuhkan peminjaman tabung oksigen 1m3 segera untuk kakek kami yang saturasi oksigennya turun ke 88%. Mohon bantuan warga terdekat di Kota Padang.`
  * **Kontak:** `WhatsApp: 0812-7711-2233 (Ahmad Syarif)`
  * (Field honeypot anti-spam secara otomatis disembunyikan dari antarmuka manusia).
  * Klik **"PUBLIKASIKAN PERMOHONAN →"**.

---

#### BABAK 3: MANAJEMEN BANTUAN SAYA (01:15 - 01:45)
* **Visual:** Muncul toast *"Permintaan Terkirim!"* dan redirect ke Beranda. Buka menu navigasi **"BANTUAN SAYA"** (`/bantuan-saya`).
* **Narator:**  
  *"Di halaman Bantuan Saya, postingan Ahmad langsung tercatat dengan status awal 'MENUNGGU RELAWAN'. Di sini pemilik postingan dapat melihat detail, memantau perkembangan, atau menghapus postingan jika sudah tidak diperlukan."*
* **Tindakan:** Klik **"CARI BANTUAN"** di navbar. Tunjukkan bahwa postingan Ahmad sudah berada di paling atas daftar feed lengkap dengan label lokasi Padang dan badge status menunggu.
* **Tindakan:** Klik tombol **"KELUAR"** di navbar untuk bersiap masuk sebagai akun relawan.

---

#### BABAK 4: PERSPEKTIF RELAWAN LAIN (01:45 - 02:30)
* **Visual:** Halaman `/login`.
* **Tindakan:**  
  1. Klik tab **"DAFTAR BARU"** (atau masuk akun relawan).
  2. Isi Nama: `dr. Rahmat Relawan`, Email: `relawan.rahmat@padangpeduli.test`, Kata Sandi: `relawan123#`.
  3. Klik **"DAFTARKAN AKUN →"**.
  4. Buka halaman `/bantuan`. Ketik `Padang` pada bilah pencarian atau klik filter kategori.
  5. Klik card permohonan Ahmad: `"Butuh tabung oksigen di Padang untuk lansia sesak nafas"`.
* **Narator:**  
  *"Sekarang dr. Rahmat, seorang relawan medis di Padang, membuka detail bantuan. Perhatikan bahwa dr. Rahmat bukan pemilik postingan, sehingga sistem menampilkan kartu ajakan 'Bisa membantu warga ini?' dan tombol 'SAYA INGIN MEMBANTU'."*

---

#### BABAK 5: AKSI MEMBANTU & STATUS "SELESAI" (02:30 - 03:00)
* **Visual:** Kursor mengarah ke tombol indigo **"🤝 SAYA INGIN MEMBANTU"**.
* **Tindakan:**  
  1. Klik tombol **"🤝 SAYA INGIN MEMBANTU"**.
  2. Sistem menjalankan RPC PostgreSQL aman `volunteer_help(p_request_id)`.
  3. Seketika status postingan berubah:
     * Badge status berubah menjadi **"● TELAH TERBANTU / SELESAI"**.
     * Muncul banner ucapan terima kasih: *"Permohonan Telah Ditanggapi Relawan"*.
     * Kontak pemohon Ahmad Syarif (`WhatsApp: 0812-7711-2233`) terbuka dengan tombol hijau **"💬 BUKA WHATSAPP LANGSUNG"**.
* **Narator:**  
  *"Luar biasa! Dalam satu klik aman yang terlindungi Row Level Security, status permohonan resmi berubah menjadi 'selesai', dr. Rahmat tercatat sebagai helper_id, dan nomor kontak Ahmad langsung terbuka untuk koordinasi pengantaran tabung oksigen."*
* **Penutup:**  
  *"Itulah alur kerja 'Papan Bantuan Warga': cepat, aman, terproteksi, dan berlandaskan semangat gotong royong Indonesia. Terima kasih!"*
