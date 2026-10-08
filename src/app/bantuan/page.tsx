import React from 'react';
import type { Metadata } from 'next';
import { HelpGrid } from '@/components/features/HelpGrid';
import { Footer } from '@/components/layout/Footer';
import { getHelpRequests } from '@/lib/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cari & Salurkan Bantuan Warga',
  description:
    'Temukan permohonan bantuan darurat dari warga di sekitar Anda. Saring berdasarkan kategori Medis, Sembako, Peminjaman Alat, dan Relawan.',
  openGraph: {
    title: 'Cari Bantuan Warga — Papan Bantuan Warga',
    description:
      'Daftar lengkap permohonan bantuan warga yang sedang membutuhkan uluran tangan.',
  },
};

export const revalidate = 30;

export default async function BantuanFeedPage() {
  const requests = await getHelpRequests();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://warga-bantu.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Daftar Bantuan',
        item: 'https://warga-bantu.vercel.app/bantuan',
      },
    ],
  };

  return (
    <main className="min-h-screen pt-28 pb-16 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="w-full">
        {/* Breadcrumb Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-2">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-400 flex items-center gap-2">
            <Link href="/" className="hover:text-neutral-800 transition-colors">
              BERANDA
            </Link>
            <span>/</span>
            <span className="text-neutral-800">CARI BANTUAN</span>
          </nav>
        </div>

        {/* Hero Title Feed */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-4">
          <span className="font-mono text-xs uppercase tracking-[0.38em] text-indigo-700 block mb-3">
            [ KATALOG BANTUAN ]
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-neutral-900 leading-tight">
            Papan <span className="italic font-bold text-indigo-900">Solidaritas</span> Warga
          </h1>
          <p className="mt-4 text-neutral-600 max-w-2xl font-sans text-sm md:text-base leading-relaxed">
            Setiap kartu merupakan permohonan nyata dari sesama warga. Anda dapat menyaring berdasarkan kategori dan langsung menghubungkan diri sebagai relawan.
          </p>
        </div>

        {/* Feed Grid with Interactive Filter */}
        <HelpGrid
          initialRequests={requests}
          title=""
          subtitle=""
          showFilters={true}
        />
      </div>

      <Footer />
    </main>
  );
}
