import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center px-6">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-200" />
        <div className="absolute inset-0 rounded-full border-2 border-indigo-700 border-t-transparent animate-spin" />
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-400 block mb-2">
        [ MEMUAT DATA ]
      </span>
      <p className="font-serif text-lg text-neutral-700">
        Menghubungkan ke Jaringan Warga...
      </p>
    </div>
  );
}
