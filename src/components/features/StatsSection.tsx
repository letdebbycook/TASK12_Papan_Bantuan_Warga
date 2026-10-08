import React from 'react';

interface StatsSectionProps {
  totalRequests: number;
  completedRequests: number;
  activeRequests: number;
}

export function StatsSection({
  totalRequests,
  completedRequests,
  activeRequests,
}: StatsSectionProps) {
  const stats = [
    {
      label: 'TOTAL PERMINTAAN',
      number: totalRequests || 11,
      unit: 'Permohonan Warga',
      tag: '[KUMULATIF]',
    },
    {
      label: 'TERBANTU RELAWAN',
      number: completedRequests || 5,
      unit: 'Warga Terbantu',
      tag: '[SELESAI]',
    },
    {
      label: 'SIAGA AKTIF',
      number: activeRequests || 6,
      unit: 'Menunggu Bantuan',
      tag: '[DARURAT]',
    },
    {
      label: 'KOTA TERHUBUNG',
      number: 8,
      unit: 'Wilayah di Indonesia',
      tag: '[NASIONAL]',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-[#e5e5e5]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {stats.map((item) => (
          <div key={item.label} className="space-y-2 border-l border-neutral-200 pl-4 sm:pl-6">

            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-400 block">
              {item.tag}
            </span>
            <div className="font-serif text-4xl sm:text-5xl lg:text-6xl text-neutral-900 font-normal tracking-tight">
              {item.number}
              <span className="text-indigo-600 text-3xl font-serif font-light">+</span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500 font-medium">
              {item.label}
            </p>
            <p className="text-xs text-neutral-400 font-sans">
              {item.unit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
