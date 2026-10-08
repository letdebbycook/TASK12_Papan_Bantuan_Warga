'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { HelpRequest } from '@/types/database';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import getSupabaseBrowserClient from '@/lib/supabase';
import { track } from '@/lib/analytics';

interface HelpDetailViewProps {
  initialRequest: HelpRequest;
}

export function HelpDetailView({ initialRequest }: HelpDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [request, setRequest] = useState<HelpRequest>(initialRequest);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [volunteerCompleted, setVolunteerCompleted] = useState(
    initialRequest.status === 'selesai'
  );
  const [revealedContact, setRevealedContact] = useState<string | null>(
    initialRequest.status === 'selesai' || user ? initialRequest.contact : null
  );

  const isOwner = user && user.id === request.user_id;
  const isSelesai = request.status === 'selesai';

  const handleOpenVolunteerModal = () => {
    if (!user) {
      router.push(`/login?redirect=/bantuan/${request.id}`);
      return;
    }

    if (isOwner) {
      error('Peringatan', 'Anda tidak dapat menjadi relawan pada postingan Anda sendiri.');
      return;
    }

    if (isSelesai) {
      error('Sudah Selesai', 'Permohonan bantuan ini sudah ditangani oleh relawan lain.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmVolunteer = async () => {
    setIsSubmitting(true);
    track('volunteer_click', { request_id: request.id, category: request.category });

    try {
      const supabase = getSupabaseBrowserClient();

      // Coba panggil RPC keamanan volunteer_help
      const { data, error: rpcError } = await supabase.rpc('volunteer_help', {
        p_request_id: request.id,
      });

      if (rpcError) {
        // Fallback update langsung jika RPC belum dieksekusi di database dev
        const { error: updateError } = await supabase
          .from('help_requests')
          .update({
            status: 'selesai',
            helper_id: user?.id,
          })
          .eq('id', request.id);

        if (updateError) {
          throw updateError;
        }
      }

      const returnedContact =
        (data as unknown as { contact?: string } | null)?.contact || request.contact;

      setRequest((prev) => ({
        ...prev,
        status: 'selesai',
        helper_id: user?.id ?? null,
      }));
      setRevealedContact(returnedContact);
      setVolunteerCompleted(true);
      setShowConfirmModal(false);

      success(
        'Terima Kasih, Relawan Hebat!',
        'Anda telah tercatat membantu permohonan ini. Silakan hubungi pemohon bantuan.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses bantuan. Silakan coba lagi.';
      error('Terjadi Kesalahan', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyContact = async () => {
    const textToCopy = revealedContact || request.contact;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      success('Tersalin!', 'Nomor kontak berhasil disalin ke papan klip.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  // Format link WhatsApp jika kontak berisi nomor telepon
  const getWhatsAppLink = (contactStr: string) => {
    const digits = contactStr.replace(/\D/g, '');
    if (digits.length >= 9) {
      let phone = digits;
      if (phone.startsWith('0')) {
        phone = '62' + phone.slice(1);
      }
      return `https://wa.me/${phone}?text=${encodeURIComponent(
        `Halo, saya relawan dari Papan Bantuan Warga ingin membantu terkait permohonan: "${request.title}"`
      )}`;
    }
    return null;
  };

  const waLink = revealedContact ? getWhatsAppLink(revealedContact) : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-400 flex items-center gap-2 mb-8">
        <Link href="/" className="hover:text-neutral-800 transition-colors">
          BERANDA
        </Link>
        <span>/</span>
        <Link href="/bantuan" className="hover:text-neutral-800 transition-colors">
          BANTUAN
        </Link>
        <span>/</span>
        <span className="text-neutral-800 truncate max-w-[200px] sm:max-w-xs">
          {request.category}
        </span>
      </nav>

      {/* Main Detail Container */}
      <article className="border border-[#e5e5e5] rounded-3xl bg-white p-8 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.35em] px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
              [{request.category}]
            </span>
            <span
              className={`font-mono text-xs uppercase tracking-[0.35em] px-4 py-1.5 rounded-full border ${
                isSelesai
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {isSelesai ? '● TELAH TERBANTU' : '○ MEMBUTUHKAN RELAWAN'}
            </span>
          </div>

          <div className="font-mono text-[11px] tracking-[0.32em] text-neutral-400 uppercase">
            DIPOSTING: {new Date(request.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Title & Location */}
        <div className="py-8 space-y-4">
          <div className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500 flex items-center gap-2">
            <span>📍 LOKASI KEBUTUHAN:</span>
            <span className="text-neutral-800 font-semibold">{request.location}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-900 leading-tight">
            {request.title}
          </h1>
        </div>

        {/* Description Body */}
        <div className="py-6 border-t border-b border-[#e5e5e5] space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-400 block">
            DETAIL PERMOHONAN
          </span>
          <p className="font-sans text-neutral-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
            {request.description}
          </p>
        </div>

        {/* Action & Volunteer Section */}
        <div className="pt-10">
          {volunteerCompleted || isSelesai ? (
            /* State: Sudah Selesai / Terbantu */
            <div className="rounded-2xl p-6 md:p-8 bg-indigo-50/70 border border-indigo-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-serif text-2xl text-indigo-950 font-normal">
                  Permohonan Telah Ditanggapi Relawan
                </h3>
              </div>
              <p className="text-sm text-neutral-700 font-sans leading-relaxed">
                Terima kasih atas kepedulian yang luar biasa. Berikut adalah kontak peminta bantuan untuk koordinasi teknis penyerahan atau bantuan:
              </p>

              {/* Reveal Contact Box */}
              <div className="mt-4 p-5 rounded-2xl bg-white border border-indigo-200/80 space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500 block">
                  KONTAK PEMOHON BANTUAN:
                </span>
                <p className="font-mono text-base font-bold text-neutral-900 tracking-[0.2em]">
                  {revealedContact || request.contact}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-mono text-xs uppercase tracking-[0.25em] hover:bg-emerald-700 transition-colors shadow-sm"
                      onClick={() => track('whatsapp_click', { request_id: request.id })}
                    >
                      <span>💬 BUKA WHATSAPP LANGSUNG</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyContact}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-300 hover:border-neutral-800 bg-neutral-50 text-neutral-800 font-mono text-xs uppercase tracking-[0.25em] transition-colors cursor-pointer"
                  >
                    <span>{copied ? '✓ TERSALIN!' : '📋 SALIN KONTAK'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : isOwner ? (
            /* State: Pemilik Postingan */
            <div className="rounded-2xl p-6 bg-neutral-100 border border-neutral-300 space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500 block">
                [ POSTINGAN ANDA ]
              </span>
              <p className="font-serif text-xl text-neutral-800">
                Ini adalah permintaan bantuan yang Anda buat.
              </p>
              <p className="text-sm text-neutral-600 font-sans">
                Anda dapat memantau status atau mengelola postingan ini melalui halaman{' '}
                <Link href="/bantuan-saya" className="text-indigo-700 underline font-medium">
                  Bantuan Saya
                </Link>.
              </p>
            </div>
          ) : (
            /* State: Menunggu Bantuan - Tombol "Saya Ingin Membantu" */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="space-y-1">
                  <p className="font-serif text-xl text-neutral-900">
                    Bisa membantu warga ini?
                  </p>
                  <p className="text-xs text-neutral-500 font-sans">
                    {user
                      ? 'Konfirmasi kesiapan Anda. Kontak pemohon akan langsung terbuka untuk Anda hubungi.'
                      : 'Masuk dengan akun warga/relawan untuk mengakses kontak dan konfirmasi bantuan.'}
                  </p>
                </div>

                <button
                  onClick={handleOpenVolunteerModal}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white font-mono text-xs uppercase tracking-[0.35em] font-semibold transition-all duration-300 ease-premium shadow-[0_4px_20px_rgba(67,56,202,0.25)] hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>MEMPROSES...</span>
                  ) : (
                    <>
                      <span>🤝 SAYA INGIN MEMBANTU</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Kontak bagi non-login */}
              {!user && (
                <div className="p-4 rounded-xl border border-dashed border-neutral-300 text-center font-mono text-xs tracking-[0.3em] uppercase text-neutral-500">
                  🔒 Kontak disembunyikan demi keamanan privasi. <Link href={`/login?redirect=/bantuan/${request.id}`} className="text-indigo-700 underline">Masuk untuk melihat kontak</Link>.
                </div>
              )}
            </div>
          )}
        </div>
      </article>

      {/* Modal Dialog Konfirmasi Relawan */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                [KONFIRMASI RELAWAN]
              </span>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-mono p-1 focus:outline-none cursor-pointer"
                aria-label="Tutup dialog"
              >
                ✕
              </button>
            </div>

            {/* Title & Info */}
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 leading-snug">
                Siap Menjadi Relawan untuk Warga Ini?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                Tindakan ini akan menandai status permohonan menjadi <strong>&quot;Selesai / Terbantu&quot;</strong> agar tidak terjadi tumpang tindih dengan relawan lain. Nomor kontak pemohon akan langsung dibuka untuk Anda hubungi via WhatsApp.
              </p>
            </div>

            {/* Ringkasan Permohonan */}
            <div className="p-4 rounded-2xl bg-[#faf9f5] border border-neutral-200 space-y-2 text-left font-sans text-xs">
              <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                <span>📍 {request.location}</span>
                <span>•</span>
                <span>🏷️ {request.category}</span>
              </div>
              <p className="font-medium text-neutral-800 text-sm line-clamp-2">
                &ldquo;{request.title}&rdquo;
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-neutral-300 font-mono text-xs uppercase tracking-[0.25em] text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={handleConfirmVolunteer}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white font-mono text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-md hover:scale-[1.02] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>MEMPROSES...</span>
                ) : (
                  <span>🤝 YA, SAYA SIAP MEMBANTU</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="mt-8 text-center">
        <Link
          href="/bantuan"
          className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ← KEMBALI KE SEMUA PERMINTAAN
        </Link>
      </div>
    </div>
  );
}
