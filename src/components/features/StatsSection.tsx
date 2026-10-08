'use client';

import React, { useEffect, useState, useRef } from 'react';

interface StatsSectionProps {
  totalRequests: number;
  completedRequests: number;
  activeRequests: number;
}

function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const startTime = performance.now();
          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out expo curve for smooth organic deceleration
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.round(easeOut * target);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={elementRef}>{count}</span>;
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
          <div
            key={item.label}
            className="group space-y-2 border-l border-neutral-200 pl-4 sm:pl-6 transition-all duration-300 hover:border-indigo-600"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-indigo-600 transition-colors" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-400 group-hover:text-indigo-900 transition-colors block">
                {item.tag}
              </span>
            </div>
            <div className="font-serif text-4xl sm:text-5xl lg:text-6xl text-neutral-900 font-normal tracking-tight flex items-baseline">
              <AnimatedCounter target={item.number} />
              <span className="text-indigo-600 text-3xl font-serif font-light ml-0.5 transform group-hover:scale-125 transition-transform duration-300">
                +
              </span>
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

