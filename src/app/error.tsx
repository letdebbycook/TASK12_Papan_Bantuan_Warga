'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to server or monitoring in production
  }, [error]);

  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full border border-neutral-200 rounded-3xl bg-white p-8 md:p-10 shadow-sm space-y-6">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-rose-600 block">
          [ PERINGATAN SISTEM ]
        </span>
        <h1 className="font-serif text-3xl text-neutral-900">
          Terjadi Kendala Memuat Data
        </h1>
        <p className="text-sm text-neutral-600 font-sans leading-relaxed">
          Mohon maaf atas ketidaknyamanan ini. Permintaan Anda tidak dapat diselesaikan saat ini. Silakan coba kembali atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-neutral-100">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-[0.32em] px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            COBA LAGI
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-[0.32em] px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            BERANDA
          </Link>
        </div>
      </div>
    </div>
  );
}
