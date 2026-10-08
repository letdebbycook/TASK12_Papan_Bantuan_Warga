'use client';

import React, { useState, useMemo } from 'react';
import type { HelpRequest } from '@/types/database';
import { HelpCard } from '@/components/features/HelpCard';

interface HelpGridProps {
  initialRequests: HelpRequest[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

const CATEGORIES = [
  'Semua',
  'Medis & Darurat',
  'Sembako',
  'Peminjaman Alat',
  'Tenaga Relawan',
] as const;

export function HelpGrid({
  initialRequests,
  title = 'Permintaan Bantuan Warga Terkini',
  subtitle = 'Daftar kebutuhan mendesak yang dapat Anda bantu secara langsung.',
  showFilters = true,
}: HelpGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'menunggu' | 'selesai'>('all');

  const filteredRequests = useMemo(() => {
    return initialRequests.filter((req) => {
      // Category filter
      if (selectedCategory !== 'Semua' && req.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && req.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(query);
        const matchesDesc = req.description.toLowerCase().includes(query);
        const matchesLoc = req.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc) {
          return false;
        }
      }
      return true;
    });
  }, [initialRequests, selectedCategory, statusFilter, searchQuery]);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.38em] text-indigo-700 block mb-3">
            [ DAFTAR SOLIDARITAS ]
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-neutral-900 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-xl font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {/* Counter Info */}
        <div className="font-mono text-xs uppercase tracking-[0.32em] text-neutral-400 bg-white px-4 py-2 rounded-full border border-neutral-200 w-fit">
          TOTAL: {filteredRequests.length} DITEMUKAN
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="mb-12 space-y-6">
          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-mono text-xs uppercase tracking-[0.32em] px-5 py-2.5 rounded-full border transition-all duration-300 ease-premium whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-[0_4px_15px_rgba(0,0,0,0.1)]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Status Filter Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-1">
              <input
                type="text"
                placeholder="Cari berdasarkan kebutuhan atau kota (contoh: Padang, Oksigen)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-indigo-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-mono"
                >
                  RESET
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['all', 'menunggu', 'selesai'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 sm:flex-initial font-mono text-[11px] uppercase tracking-[0.3em] px-4 py-3 rounded-xl border transition-colors ${
                    statusFilter === st
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {st === 'all' ? 'SEMUA STATUS' : st === 'menunggu' ? 'MENUNGGU' : 'SELESAI'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid 2 Kolom dengan Vertikal Bertingkat (Staggered) */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {filteredRequests.map((req, index) => (
            <HelpCard
              key={req.id}
              request={req}
              staggered={index % 2 === 1} // Kolom kanan bertingkat (staggered)
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-24 text-center border border-dashed border-neutral-300 rounded-3xl bg-white/50 p-8">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-400 block mb-3">
            [ KOSONG ]
          </span>
          <h3 className="font-serif text-2xl text-neutral-800">
            Belum Ada Permintaan yang Cocok
          </h3>
          <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto font-sans">
            Tidak ditemukan permintaan bantuan untuk kriteria pencarian ini. Coba ubah kata kunci atau bersihkan filter kategori.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Semua');
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="mt-6 font-mono text-xs uppercase tracking-[0.32em] px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-indigo-700 transition-colors"
          >
            RESET SEMUA FILTER
          </button>
        </div>
      )}
    </section>
  );
}
