import React from 'react';
import Link from 'next/link';
import type { HelpRequest } from '@/types/database';

interface HelpCardProps {
  request: HelpRequest;
  staggered?: boolean;
}

export function HelpCard({ request, staggered = false }: HelpCardProps) {
  const isSelesai = request.status === 'selesai';

  // Warna aksen dan orb berdasarkan kategori
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Medis & Darurat':
        return {
          bg: 'bg-rose-50/70',
          orb: 'bg-rose-400/30',
          border: 'border-rose-200/60',
          tag: 'text-rose-900 border-rose-300',
        };
      case 'Sembako':
        return {
          bg: 'bg-amber-50/70',
          orb: 'bg-amber-400/30',
          border: 'border-amber-200/60',
          tag: 'text-amber-900 border-amber-300',
        };
      case 'Peminjaman Alat':
        return {
          bg: 'bg-indigo-50/70',
          orb: 'bg-indigo-400/35',
          border: 'border-indigo-200/60',
          tag: 'text-indigo-900 border-indigo-300',
        };
      case 'Tenaga Relawan':
      default:
        return {
          bg: 'bg-emerald-50/70',
          orb: 'bg-emerald-400/30',
          border: 'border-emerald-200/60',
          tag: 'text-emerald-900 border-emerald-300',
        };
    }
  };

  const style = getCategoryStyles(request.category);

  return (
    <div
      className={`group flex flex-col w-full transition-transform duration-500 ease-premium ${
        staggered ? 'md:mt-12' : ''
      }`}
    >
      <Link href={`/bantuan/${request.id}`} className="block focus:outline-none">
        {/* Card Rasio 4:3, rounded 1rem (rounded-2xl), background lembut + orb blur di tengah */}
        <div
          className={`relative aspect-[4/3] w-full rounded-2xl overflow-hidden border ${style.border} ${style.bg} p-6 flex flex-col justify-between transition-all duration-500 ease-premium group-hover:-translate-y-4 group-hover:scale-[1.02] group-hover:shadow-[0_20px_45px_rgba(99,102,241,0.12)]`}
        >
          {/* Inner background orb yang membesar saat hover (scale 1.1) */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full ${style.orb} blur-3xl transition-transform duration-700 ease-premium group-hover:scale-125 pointer-events-none`}
          />

          {/* Bagian Atas Card: Category Tag & Status Badge */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.32em] px-3 py-1 rounded-full border bg-white/70 backdrop-blur-sm ${style.tag}`}
            >
              [{request.category}]
            </span>

            {/* Badge Status (Menunggu/Selesai) bergaya pill mono, tanpa shadow kasar */}
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.32em] px-3 py-1 rounded-full border ${
                isSelesai
                  ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                  : 'bg-white text-indigo-900 border-indigo-200'
              }`}
            >
              {isSelesai ? '● SELESAI' : '○ MENUNGGU'}
            </span>
          </div>

          {/* Tengah Card: Ringkasan & Lokasi */}
          <div className="relative z-10 my-auto">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-neutral-500 mb-2">
              📍 {request.location}
            </p>
            <p className="font-serif text-lg md:text-xl font-normal text-neutral-800 line-clamp-2 leading-snug">
              {request.description}
            </p>
          </div>

          {/* Hover Pill "LIHAT" muncul dari opacity 0 / translateY(1rem) ke 1 / 0 dalam 500ms */}
          <div className="relative z-10 flex items-center justify-end">
            <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-premium px-5 py-2 rounded-full bg-white text-black border border-neutral-200 font-mono text-xs font-bold uppercase tracking-[0.35em] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              LIHAT DETAIL →
            </div>
          </div>
        </div>

        {/* 1px Garis Pembatas di bawah card */}
        <div className="w-full h-[1px] bg-[#e5e5e5] my-4 group-hover:bg-neutral-800 transition-colors duration-500" />

        {/* Di Bawah Card: Judul Serif + Label Kategori Mono */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] tracking-[0.32em] uppercase">
            <span>{request.category}</span>
            <span>{new Date(request.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-normal text-neutral-900 group-hover:text-indigo-900 transition-colors duration-300 leading-snug">
            {request.title}
          </h3>
        </div>
      </Link>
    </div>
  );
}
