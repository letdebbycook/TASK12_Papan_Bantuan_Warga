import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative bg-[#171717] text-[#fcfbf9] rounded-t-[5rem] overflow-hidden pt-24 pb-12 mt-32 border-t border-neutral-800">
      {/* Radial glow indigo dari tengah atas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/25 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Kutipan Serif Besar dengan kata penekanan miring (italic) */}
        <div className="max-w-4xl mb-20 text-center md:text-left">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-indigo-400 block mb-4">
            [ SOLIDARITAS WARGA ]
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-neutral-100">
            &ldquo;Ketika satu warga membutuhkan, <span className="italic font-bold text-white">seluruh lingkungan</span> hadir saling menjaga.&rdquo;
          </h2>
        </div>

        {/* Garis batas halus */}
        <div className="w-full h-[1px] bg-neutral-800 mb-16" />

        {/* Grid 3 Kolom: Lokasi, Kontak, Sosial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-20">
          {/* Kolom 1: Lokasi */}
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-400 block">
              01 / LOKASI & CAKUPAN
            </span>
            <p className="font-serif text-xl text-neutral-200">
              Jaringan Warga Indonesia
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">
              Menjangkau komunitas di seluruh Indonesia: Jabodetabek, Surabaya, Bandung, Padang, Semarang, Yogyakarta, hingga pelosok daerah.
            </p>
          </div>

          {/* Kolom 2: Kontak */}
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-400 block">
              02 / PUSAT KOORDINASI
            </span>
            <p className="font-serif text-xl text-neutral-200">
              Relawan & Bantuan Darurat
            </p>
            <div className="text-sm text-neutral-400 space-y-1 font-sans">
              <p>Email: <a href="mailto:halo@wargabantu.id" className="hover:text-white transition-colors">halo@wargabantu.id</a></p>
              <p>Hotline Relawan: +62 812-BANTU-KITA</p>
              <p>Layanan Darurat: 24 Jam Siaga Warga</p>
            </div>
          </div>

          {/* Kolom 3: Sosial & Navigasi Cepat */}
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-400 block">
              03 / KONEKSI & JARINGAN
            </span>
            <p className="font-serif text-xl text-neutral-200">
              Media Sosial Komunitas
            </p>
            <div className="flex flex-col space-y-2 text-sm text-neutral-400 font-sans">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between group">
                <span>Twitter / X (@wargabantu)</span>
                <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between group">
                <span>Instagram (@wargabantu.id)</span>
                <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>
              <Link href="/bantuan" className="hover:text-white transition-colors flex items-center justify-between group">
                <span>Semua Permintaan Bantuan</span>
                <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Copyright Mono */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs tracking-[0.35em] text-neutral-400 uppercase">
            © {new Date().getFullYear()} PAPAN BANTUAN WARGA. NON-PROFIT OPEN INITIATIVE.
          </p>
          <p className="font-mono text-xs tracking-[0.35em] text-neutral-400 uppercase">
            EST. 2026 // ORGANIC INTELLIGENCE
          </p>
        </div>
      </div>
    </footer>
  );
}
