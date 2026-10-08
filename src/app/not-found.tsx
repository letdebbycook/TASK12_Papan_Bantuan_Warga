import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg w-full border border-neutral-200 rounded-3xl bg-white p-10 md:p-14 shadow-sm space-y-6">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-400 block">
          [ KODE STATUS 404 ]
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-neutral-900 leading-tight">
          Halaman <span className="italic font-bold text-indigo-900">Tidak Ditemukan</span>
        </h1>
        <p className="text-sm md:text-base text-neutral-600 font-sans leading-relaxed">
          Tautan yang Anda tuju mungkin sudah kedaluwarsa, telah dihapus oleh pembuatnya, atau alamat URL salah ketik.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-[0.35em] px-8 py-3.5 rounded-full bg-neutral-900 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            KEMBALI KE BERANDA
          </Link>
          <Link
            href="/bantuan"
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-[0.35em] px-8 py-3.5 rounded-full border border-neutral-300 text-neutral-800 hover:border-neutral-900 transition-colors"
          >
            LIHAT SEMUA BANTUAN
          </Link>
        </div>
      </div>
    </div>
  );
}
