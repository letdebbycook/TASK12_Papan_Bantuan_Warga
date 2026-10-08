import React from 'react';
import { Hero } from '@/components/features/Hero';
import { StatsSection } from '@/components/features/StatsSection';
import { HelpGrid } from '@/components/features/HelpGrid';
import { AccordionFAQ } from '@/components/features/AccordionFAQ';
import { Footer } from '@/components/layout/Footer';
import { getHelpRequests } from '@/lib/data';
import Link from 'next/link';

export const revalidate = 60; // Revalidate feed every minute

export default async function HomePage() {
  const allRequests = await getHelpRequests();
  const previewRequests = allRequests.slice(0, 4);

  const totalRequests = allRequests.length;
  const completedRequests = allRequests.filter((r) => r.status === 'selesai').length;
  const activeRequests = allRequests.filter((r) => r.status === 'menunggu').length;

  return (
    <main className="min-h-screen flex flex-col justify-between">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Statistik Singkat */}
      <StatsSection
        totalRequests={totalRequests}
        completedRequests={completedRequests}
        activeRequests={activeRequests}
      />

      {/* 3. Preview Postingan Terbaru */}
      <div className="relative">
        <HelpGrid
          initialRequests={previewRequests}
          title="Permintaan Bantuan Terkini"
          subtitle="Beberapa permohonan darurat dari warga yang membutuhkan respon cepat."
          showFilters={false}
        />

        {/* View All Button */}
        <div className="max-w-7xl mx-auto px-6 text-center -mt-6 mb-16">
          <Link
            href="/bantuan"
            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.38em] px-8 py-4 rounded-full border border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 ease-premium shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          >
            <span>JELAJAHI SEMUA PERMINTAAN ({totalRequests})</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* 4. Penjelasan Cara Kerja (Accordion) */}
      <AccordionFAQ />

      {/* 5. Footer */}
      <Footer />
    </main>
  );
}
