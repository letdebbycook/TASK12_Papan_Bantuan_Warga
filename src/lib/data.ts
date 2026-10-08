import type { HelpRequest } from '@/types/database';
import createSupabaseServerClient from '@/lib/supabase-server';

// 11 Realistic Seed Items matching seed.sql
export const SEED_HELP_REQUESTS: HelpRequest[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Dibutuhkan Donor Darah Golongan O Rhesus Negatif Segera',
    description:
      'Mohon bantuan rekan-rekan warga untuk pasien operasi darurat bypass jantung di RSUP Dr. M. Djamil Padang. Diperlukan 3 kantong darah gol O Rhesus Negatif hari ini sebelum pukul 17:00 WIB.',
    category: 'Medis & Darurat',
    location: 'Padang, Sumatera Barat',
    status: 'menunggu',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    contact: 'WhatsApp: 0812-7788-9900 (Keluarga Pasien - Budi)',
    helper_id: null,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    requester_name: 'Budi Santoso',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Peminjaman Tabung Oksigen 1m3 untuk Pasien Lansia Sesak Nafas',
    description:
      'Ibu kami (usia 74 tahun) mengalami saturasi drop pasca infeksi paru-paru. Kami butuh pinjaman tabung oksigen beserta regulatornya selama masa pemulihan di rumah (estimasi 4 hari). Tabung akan dikembalikan dalam kondisi prima.',
    category: 'Peminjaman Alat',
    location: 'Surabaya Timur, Jawa Timur',
    status: 'menunggu',
    user_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    contact: 'WhatsApp / Telp: 0813-3344-5566 (Siti Rahmawati)',
    helper_id: null,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    requester_name: 'Siti Rahmawati',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    title: 'Paket Sembako Darurat untuk Warga Lansia Terisolir Pasca Longsor',
    description:
      'Akses jalan desa Cisarua sempat tertutup material tanah. Terdapat 4 keluarga lansia yang kehabisan beras, minyak goreng, dan telur. Bantuan logistik bahan pokok kering sangat diapresiasi.',
    category: 'Sembako',
    location: 'Bogor, Jawa Barat',
    status: 'menunggu',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    contact: 'WhatsApp: 0811-9988-7711 (Ketua RT 03)',
    helper_id: null,
    created_at: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    requester_name: 'Budi Santoso',
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    title: 'Relawan Distribusi Makanan & Pembersihan Lumpur Pasca Banjir',
    description:
      'Dibutuhkan 6 orang relawan tenaga untuk membantu dapur umum dan mendistribusikan nasi bungkus ke pemukiman terdampak banjir rob Karanganyar Demak. Titik kumpul di Masjid Baiturrahman.',
    category: 'Tenaga Relawan',
    location: 'Demak, Jawa Tengah',
    status: 'menunggu',
    user_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    contact: 'WhatsApp: 0852-6677-8899 (Posko Peduli Demak)',
    helper_id: null,
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    requester_name: 'dr. Hendra Wijaya',
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    title: 'Peminjaman Kursi Roda Lipat untuk Anak Disabilitas',
    description:
      'Anak kami sedang memulai tahun ajaran baru sekolah luar biasa dan membutuhkan kursi roda portabel selama proses asesmen fisioterapi (sekitar 2 minggu). Mohon info bila ada warga yang bersedia meminjamkan.',
    category: 'Peminjaman Alat',
    location: 'Bandung Kota, Jawa Barat',
    status: 'menunggu',
    user_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    contact: 'WhatsApp: 0821-4455-6677 (Ibu Siti)',
    helper_id: null,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    requester_name: 'Siti Rahmawati',
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    title: 'Bantuan Ambulans Siaga Pengantaran Pasien Kemoterapi',
    description:
      'Mencari kontak ambulans gratis/komunitas untuk mengantar pasien dhuafa dari Bantul ke RSUP Dr Sardjito untuk jadwal kemoterapi hari Jumat pagi. Pasien memakai kursi roda.',
    category: 'Medis & Darurat',
    location: 'Bantul, D.I. Yogyakarta',
    status: 'menunggu',
    user_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    contact: 'WhatsApp: 0877-2233-4455 (dr. Hendra / Pendamping)',
    helper_id: null,
    created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    requester_name: 'dr. Hendra Wijaya',
  },
  {
    id: '77777777-7777-4777-8777-777777777777',
    title: 'Bantuan Susu Formula Khusus & Popok Bayi Prasejahtera',
    description:
      'Keluarga nelayan di Cilincing dengan bayi kembar usia 8 bulan membutuhkan bantuan susu formula bebas laktosa dan popok karena kondisi ekonomi sedang terhimpit gelombang tinggi melaut.',
    category: 'Sembako',
    location: 'Jakarta Utara, DKI Jakarta',
    status: 'menunggu',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    contact: 'WhatsApp: 0812-1122-3344 (Komunitas Nelayan Cilincing)',
    helper_id: null,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    requester_name: 'Budi Santoso',
  },
  {
    id: '88888888-8888-4888-8888-888888888888',
    title: 'Pinjam Nebulizer Portabel untuk Balita Asma Akut',
    description:
      'Balita kami sering kumat asma pada cuaca dingin ekstrem malam hari. Alat nebulizer kami rusak. Membutuhkan pinjaman selama 3 hari selagi menunggu pesanan unit baru tiba.',
    category: 'Peminjaman Alat',
    location: 'Semarang, Jawa Tengah',
    status: 'menunggu',
    user_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    contact: 'WhatsApp: 0896-7788-9900 (Keluarga Rahma)',
    helper_id: null,
    created_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    requester_name: 'Siti Rahmawati',
  },
  {
    id: '99999999-9999-4999-8999-999999999999',
    title: 'Pendamping Lansia Tunggal ke Fasilitas Kesehatan Kontrol Rutin',
    description:
      'Mbah Suparmi (82 tahun) tinggal sebatang kara di Jebres dan perlu pendampingan ramah untuk kontrol rutin jantung di RSUD Moewardi pada Kamis pagi jam 08:00.',
    category: 'Tenaga Relawan',
    location: 'Surakarta (Solo), Jawa Tengah',
    status: 'menunggu',
    user_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    contact: 'WhatsApp: 0819-0123-4567 (Kader Lansia Kelurahan)',
    helper_id: null,
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    requester_name: 'dr. Hendra Wijaya',
  },
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    title: 'Kebutuhan Tabung Oksigen Portable Saat Perjalanan Rujukan',
    description:
      'Keluarga memerlukan tabung oksigen kecil portabel untuk perjalanan evakuasi ambulans dari Binjai ke RS Adam Malik Medan.',
    category: 'Medis & Darurat',
    location: 'Medan, Sumatera Utara',
    status: 'selesai',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    contact: 'WhatsApp: 0813-9988-7766 (Budi)',
    helper_id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 3600 * 1000).toISOString(),
    requester_name: 'Budi Santoso',
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Bantuan Dapur Umum Warga Terkena Banjir Bandang Batu',
    description:
      'Penyediaan bahan sayur mayur dan telur untuk suplai 100 bungkus makan siang bagi warga terdampak.',
    category: 'Sembako',
    location: 'Batu - Malang, Jawa Timur',
    status: 'selesai',
    user_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    contact: 'WhatsApp: 0812-4455-7788 (Siti)',
    helper_id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 110 * 3600 * 1000).toISOString(),
    requester_name: 'Siti Rahmawati',
  },
];

export async function getHelpRequests(): Promise<HelpRequest[]> {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

  if (!isSupabaseConfigured) {
    return SEED_HELP_REQUESTS;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return SEED_HELP_REQUESTS;
    }

    return data as HelpRequest[];
  } catch {
    return SEED_HELP_REQUESTS;
  }
}

export async function getHelpRequestById(id: string): Promise<HelpRequest | null> {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

  if (!isSupabaseConfigured) {
    const found = SEED_HELP_REQUESTS.find((r) => r.id === id);
    return found || null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const found = SEED_HELP_REQUESTS.find((r) => r.id === id);
      return found || null;
    }

    return data as HelpRequest;
  } catch {
    const found = SEED_HELP_REQUESTS.find((r) => r.id === id);
    return found || null;
  }
}
