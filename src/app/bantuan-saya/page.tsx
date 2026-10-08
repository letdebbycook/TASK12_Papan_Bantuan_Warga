'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import type { HelpRequest } from '@/types/database';
import getSupabaseBrowserClient from '@/lib/supabase';
import { Footer } from '@/components/layout/Footer';

export default function BantuanSayaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [myRequests, setMyRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<HelpRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    if (authLoading) return;

    if (!user) {
      router.push('/login?redirect=/bantuan-saya');
      return;
    }

    const loadData = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase
          .from('help_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (active) {
          setMyRequests((data as HelpRequest[]) || []);
          setLoading(false);
        }
      } catch {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [user, authLoading, router]);


  const handleDelete = async () => {
    if (!deleteTarget || !user) return;

    setIsDeleting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from('help_requests')
        .delete()
        .eq('id', deleteTarget.id)
        .eq('user_id', user.id); // RLS double-guard

      if (error) {
        throw error;
      }

      setMyRequests((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      success('Dihapus', 'Permohonan bantuan berhasil dihapus dari sistem.');
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus postingan.';
      toastError('Kesalahan', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-36 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-700 border-t-transparent animate-spin" />
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-400">
          MEMUAT RIWAYAT POSTINGAN...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16 flex flex-col justify-between">
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-400 flex items-center gap-2 mb-8">
          <Link href="/" className="hover:text-neutral-800 transition-colors">
            BERANDA
          </Link>
          <span>/</span>
          <span className="text-neutral-800">BANTUAN SAYA</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.38em] text-indigo-700 block mb-3">
              [ MANAJEMEN WARGA ]
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 leading-tight">
              Riwayat <span className="italic font-bold text-indigo-900">Permohonan Anda</span>
            </h1>
            <p className="mt-2 text-neutral-600 font-sans text-sm md:text-base">
              Kelola atau pantau status permohonan yang telah Anda publikasikan.
            </p>
          </div>

          <Link
            href="/minta-bantu"
            className="font-mono text-xs uppercase tracking-[0.35em] px-6 py-3.5 rounded-full bg-indigo-700 text-white hover:bg-indigo-800 transition-colors shadow-sm w-fit"
          >
            + BUAT PERMOHONAN BARU
          </Link>
        </div>

        {/* Requests List */}
        {myRequests.length > 0 ? (
          <div className="space-y-4">
            {myRequests.map((req) => {
              const isSelesai = req.status === 'selesai';
              return (
                <div
                  key={req.id}
                  className="border border-[#e5e5e5] rounded-2xl bg-white p-6 transition-all duration-300 hover:border-neutral-400 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                        [{req.category}]
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full border ${
                          isSelesai
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isSelesai ? '● TELAH SELESAI' : '○ MENUNGGU RELAWAN'}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase hidden sm:inline-block">
                        📍 {req.location}
                      </span>
                    </div>

                    <Link
                      href={`/bantuan/${req.id}`}
                      className="font-serif text-xl sm:text-2xl text-neutral-900 hover:text-indigo-800 transition-colors block"
                    >
                      {req.title}
                    </Link>

                    <p className="font-sans text-xs text-neutral-500 line-clamp-1">
                      {req.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#e5e5e5]">
                    <Link
                      href={`/bantuan/${req.id}`}
                      className="font-mono text-xs uppercase tracking-[0.32em] px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      LIHAT
                    </Link>

                    <button
                      onClick={() => setDeleteTarget(req)}
                      className="font-mono text-xs uppercase tracking-[0.32em] px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      HAPUS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-300 rounded-3xl bg-white/60 p-8 space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-400 block">
              [ BELUM ADA RIWAYAT ]
            </span>
            <h3 className="font-serif text-2xl text-neutral-800">
              Anda Belum Pernah Mengunggah Permintaan
            </h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto font-sans">
              Jika Anda atau lingkungan membutuhkan dukungan alat atau donor darurat, buat permohonan pertama Anda sekarang.
            </p>
            <Link
              href="/minta-bantu"
              className="inline-block font-mono text-xs uppercase tracking-[0.35em] px-8 py-3.5 rounded-full bg-neutral-900 text-white hover:bg-indigo-700 transition-colors mt-2"
            >
              MINTA BANTUAN SEKARANG
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modal Dialog for Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#fcfbf9] border border-[#e5e5e5] rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-rose-600 block">
                [ KONFIRMASI HAPUS ]
              </span>
              <h3 className="font-serif text-2xl text-neutral-900">
                Hapus Permintaan Ini?
              </h3>
              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                Apakah Anda yakin ingin menghapus permohonan{' '}
                <span className="font-semibold text-neutral-800">&ldquo;{deleteTarget.title}&rdquo;</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e5e5]">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="font-mono text-xs uppercase tracking-[0.32em] px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                BATAL
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="font-mono text-xs uppercase tracking-[0.32em] px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'MENGHAPUS...' : 'YA, HAPUS'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
