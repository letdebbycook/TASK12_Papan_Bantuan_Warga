import React from 'react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden pt-28 pb-16 bg-[#fcfbf9]">
      {/* Background Mesh Gradient yang melayang (drift rotasi/scale linear 30s infinite) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-200/50 blur-[130px] animate-mesh-drift" />
        <div className="absolute top-[20%] -right-[15%] w-[55vw] h-[55vw] rounded-full bg-purple-200/40 blur-[140px] animate-mesh-drift [animation-delay:-15s]" />
        <div className="absolute top-[45%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-indigo-100/60 blur-[100px] animate-mesh-drift [animation-delay:-7s]" />
      </div>

      {/* Konten Tipografi Tengah */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center my-auto flex flex-col items-center">
        {/* Monospace Badge fungsional */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 bg-white/70 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-blink-dot" />
          <span className="font-mono text-xs uppercase tracking-[0.38em] text-indigo-900 font-medium">
            JARINGAN SOLIDARITAS WARGA
          </span>
        </div>

        {/* Serif Besar: 11vw - 14vw, leading 0.85, italic untuk kata penekanan (WAJIB) */}
        <h1
          className="font-serif font-normal text-neutral-900 tracking-tighter"
          style={{
            fontSize: 'clamp(3.8rem, 12vw, 13rem)',
            lineHeight: 0.85,
          }}
        >
          Saling <span className="italic font-bold text-indigo-800">Bantu,</span>
          <br />
          Saling <span className="italic font-bold text-indigo-950">Jaga.</span>
        </h1>

        {/* Subjudul penjelasan ringkas */}
        <p className="mt-8 max-w-2xl text-base md:text-xl text-neutral-600 font-sans font-normal leading-relaxed">
          Ruang gotong royong terbuka saat tetangga membutuhkan pertolongan darurat. Donor darah, kursi roda, oksigen, hingga tenaga relawan — terhubung tanpa perantara.
        </p>

        {/* Dual Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/bantuan"
            className="font-mono text-xs uppercase tracking-[0.35em] px-7 py-4 rounded-full border border-neutral-300 bg-white/80 text-neutral-800 hover:border-neutral-900 hover:text-black transition-all duration-300 ease-premium backdrop-blur-sm"
          >
            LIHAT SEMUA BANTUAN →
          </Link>
        </div>
      </div>

      {/* Wave Container & Curve di bagian bawah Hero */}
      <div className="relative w-full h-[25vh] overflow-hidden mt-auto z-10">
        {/* Lengkungan kurva sesuai rumus prompt */}
        <div className="wave-curve relative">
          {/* Tombol Utama "Minta Bantuan" di puncak lengkungan dengan efek pulse scale(1.02) + blur shadow indigo 20px loop 3s */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <Link
              href="/minta-bantu"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-indigo-700 text-white font-mono text-sm uppercase tracking-[0.35em] font-semibold animate-pulse-cta transition-transform ease-premium cursor-pointer"
            >
              <span>+ MINTA BANTUAN</span>
              <span className="font-serif italic text-lg leading-none">segera</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
