'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AccordionItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  details: string;
}

const ACCORDION_DATA: AccordionItem[] = [
  {
    id: 'medis',
    tag: '[Medis & Darurat]',
    title: 'Kebutuhan Darah, Oksigen, dan Evakuasi Medis',
    description:
      'Warga memposting kebutuhan mendesak seperti donor darah rhesus langka, tabung oksigen saat kritis, atau bantuan ambulans rujukan ke rumah sakit.',
    details:
      'Relawan yang berada di sekitar lokasi atau memiliki persediaan dapat langsung menghubungi nomor kontak peminta bantuan setelah menekan tombol konfirmasi.',
  },
  {
    id: 'peminjaman',
    tag: '[Peminjaman Alat]',
    title: 'Sirkulasi Alat Kesehatan Komunitas',
    description:
      'Meminjamkan kursi roda, kasur dekubitus, kruk ketiak, dan nebulizer yang tidak terpakai kepada tetangga yang sedang dalam masa penyembuhan.',
    details:
      'Sistem berbasis saling percaya dan gotong royong antar warga. Peminjam berkewajiban merawat barang dan mengembalikan dalam keadaan baik sesuai kesepakatan.',
  },
  {
    id: 'sembako',
    tag: '[Sembako]',
    title: 'Pangan Darurat dan Logistik Kebutuhan Pokok',
    description:
      'Bantuan makanan pokok bagi lansia terlantar, keluarga isolasi mandiri, atau warga terdampak bencana lokal (banjir, longsor, kebakaran).',
    details:
      'Memastikan tidak ada keluarga yang kelaparan di lingkungan terdekat kita dengan penyaluran langsung tanpa birokrasi berbelit.',
  },
  {
    id: 'tenaga',
    tag: '[Tenaga Relawan]',
    title: 'Gotong Royong & Pendampingan Warga',
    description:
      'Kebutuhan tenaga relawan untuk mendampingi lansia ke puskesmas/RS, membersihkan rumah pasca bencana, atau mengantar logistik bantuan.',
    details:
      'Satu jam waktu luang Anda sangat berharga bagi sesama. Bersama membangun ikatan sosial warga yang saling menjaga satu sama lain.',
  },
];

export function AccordionFAQ() {
  const [openId, setOpenId] = useState<string>('medis');

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-[#e5e5e5]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Kolom Kiri: Sticky "Cara Kerja / Kategori Bantuan" (serif) + Link CTA berpanah */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-indigo-700 block">
            02 // PRINSIP OPERASIONAL
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 leading-tight">
            Cara Kerja &amp; <br />
            <span className="italic font-bold text-indigo-900">Kategori Bantuan</span>
          </h2>
          <p className="text-neutral-600 font-sans text-sm md:text-base leading-relaxed">
            Papan Bantuan Warga dirancang ringkas, transparan, dan tanpa perantara pihak ketiga. 
            Permintaan yang diunggah langsung disalurkan ke jejaring relawan lokal terdekat.
          </p>

          <div className="pt-4">
            <Link
              href="/minta-bantu"
              className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-neutral-900 hover:text-indigo-700 transition-colors py-2 border-b border-neutral-900 hover:border-indigo-700"
            >
              <span>BUAT PERMINTAAN SEKARANG</span>
              <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Accordion Vertikal */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-[#e5e5e5]">
          {ACCORDION_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="py-8 transition-colors duration-300">
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full text-left group flex items-start justify-between gap-6 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-2">
                    {/* Tag mono dalam kurung siku seperti [Medis & Darurat] */}
                    <span className="font-mono text-xs uppercase tracking-[0.35em] text-indigo-600 block">
                      {item.tag}
                    </span>
                    {/* Judul serif besar dari neutral-400 ke hitam saat hover */}
                    <h3
                      className={`font-serif text-2xl md:text-3xl transition-colors duration-300 ${
                        isOpen
                          ? 'text-neutral-900 font-normal'
                          : 'text-neutral-400 group-hover:text-neutral-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Icon toggle */}
                  <span
                    className={`font-mono text-xl transition-transform duration-500 ease-premium ${
                      isOpen ? 'rotate-45 text-indigo-700' : 'text-neutral-400 group-hover:text-neutral-900'
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Konten expand mulus */}
                <div
                  className={`grid transition-all duration-500 ease-premium overflow-hidden ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 pt-6' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden space-y-3 font-sans text-neutral-600 text-sm md:text-base leading-relaxed pl-1">
                    <p>{item.description}</p>
                    <p className="text-neutral-500 text-xs md:text-sm border-l-2 border-indigo-200 pl-4 italic">
                      {item.details}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
