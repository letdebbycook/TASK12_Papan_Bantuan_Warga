'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import { helpRequestSchema, helpCategories } from '@/lib/validators/help-request';
import getSupabaseBrowserClient from '@/lib/supabase';
import { Footer } from '@/components/layout/Footer';
import { track } from '@/lib/analytics';

export default function MintaBantuPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Medis & Darurat' as (typeof helpCategories)[number],
    location: '',
    contact: '',
    website_honeypot: '', // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toastError('Akses Terbatas', 'Silakan masuk terlebih dahulu untuk membuat permohonan.');
      router.push('/login?redirect=/minta-bantu');
      return;
    }

    // 1. Zod Validation (Client Layer)
    const result = helpRequestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toastError('Validasi Gagal', 'Mohon lengkapi seluruh formulir dengan benar.');
      return;
    }

    // 2. Honeypot check (anti-bot)
    if (formData.website_honeypot && formData.website_honeypot.trim().length > 0) {
      // Bot terdeteksi: diamkan tanpa error teknis
      return;
    }

    setIsSubmitting(true);
    track('help_request_submit', { category: formData.category });

    try {
      const supabase = getSupabaseBrowserClient();

      const { error: insertError } = await supabase
        .from('help_requests')
        .insert({
          title: result.data.title,
          description: result.data.description,
          category: result.data.category,
          location: result.data.location,
          contact: result.data.contact,
          status: 'menunggu',
          user_id: user.id,
        });


      if (insertError) {
        throw insertError;
      }

      success(
        'Permintaan Terkirim!',
        'Permohonan bantuan Anda telah berhasil dipublikasikan ke jaringan relawan.'
      );

      // Redirect ke Beranda setelah sukses sesuai spesifikasi
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kendala saat mengirim permohonan.';
      toastError('Gagal Menyimpan', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-400 animate-pulse">
          MEMERIKSA SESI PENGGUNA...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16 flex flex-col justify-between">
      <div className="w-full max-w-3xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-400 flex items-center gap-2 mb-8">
          <Link href="/" className="hover:text-neutral-800 transition-colors">
            BERANDA
          </Link>
          <span>/</span>
          <span className="text-neutral-800">MINTA BANTUAN</span>
        </nav>

        {/* Header Form */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.38em] text-indigo-700 block mb-3">
            [ FORMULIR DARURAT ]
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 leading-tight">
            Unggah Permintaan <span className="italic font-bold text-indigo-900">Bantuan Warga</span>
          </h1>
          <p className="mt-3 text-neutral-600 font-sans text-sm md:text-base leading-relaxed">
            Sampaikan kebutuhan Anda dengan jelas dan jujur. Jaringan relawan warga akan segera melihat dan mengonfirmasi kesiapan mereka.
          </p>
        </div>

        {/* Card Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#e5e5e5] rounded-3xl bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-8"
          noValidate
        >
          {/* Honeypot field (hidden dari manusia, menangkap bot) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_honeypot">Website (Biarkan Kosong)</label>
            <input
              type="text"
              id="website_honeypot"
              name="website_honeypot"
              value={formData.website_honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* 1. Judul Permintaan */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block font-mono text-xs uppercase tracking-[0.35em] text-neutral-700 font-medium"
            >
              JUDUL PERMINTAAN *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={120}
              placeholder="Contoh: Butuh tabung oksigen di Padang untuk lansia sesak"
              value={formData.title}
              onChange={handleChange}
              className={`w-full bg-[#fcfbf9] border rounded-xl px-4 py-3.5 text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-indigo-700 transition-colors ${
                errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-[#e5e5e5]'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 font-sans">{errors.title}</p>
            )}
            <p className="text-[11px] text-neutral-400 font-mono tracking-[0.2em] text-right">
              {formData.title.length}/120
            </p>
          </div>

          {/* 2. Kategori Permintaan (Dropdown) */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block font-mono text-xs uppercase tracking-[0.35em] text-neutral-700 font-medium"
            >
              KATEGORI BANTUAN *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-indigo-700 transition-colors cursor-pointer"
            >
              {helpCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-rose-600 font-sans">{errors.category}</p>
            )}
          </div>

          {/* 3. Lokasi (Kota / Wilayah) */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="block font-mono text-xs uppercase tracking-[0.35em] text-neutral-700 font-medium"
            >
              LOKASI (KOTA / WILAYAH) *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              placeholder="Contoh: Padang, Sumatera Barat (Kec. Kuranji)"
              value={formData.location}
              onChange={handleChange}
              className={`w-full bg-[#fcfbf9] border rounded-xl px-4 py-3.5 text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-indigo-700 transition-colors ${
                errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-[#e5e5e5]'
              }`}
            />
            {errors.location && (
              <p className="text-xs text-rose-600 font-sans">{errors.location}</p>
            )}
          </div>

          {/* 4. Deskripsi Lengkap */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block font-mono text-xs uppercase tracking-[0.35em] text-neutral-700 font-medium"
            >
              DESKRIPSI LENGKAP KEBUTUHAN *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              maxLength={2000}
              placeholder="Jelaskan kondisi pasien/keluarga, spesifikasi barang atau bantuan yang dibutuhkan, durasi peminjaman, serta tingkat urgensinya."
              value={formData.description}
              onChange={handleChange}
              className={`w-full bg-[#fcfbf9] border rounded-xl p-4 text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-indigo-700 transition-colors leading-relaxed ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-[#e5e5e5]'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 font-sans">{errors.description}</p>
            )}
            <p className="text-[11px] text-neutral-400 font-mono tracking-[0.2em] text-right">
              {formData.description.length}/2000
            </p>
          </div>

          {/* 5. Kontak Peminta Bantuan (Privasi terjaga, hanya terlihat oleh user login) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="contact"
                className="block font-mono text-xs uppercase tracking-[0.35em] text-neutral-700 font-medium"
              >
                KONTAK PEMINTA BANTUAN *
              </label>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                TERLINDUNGI
              </span>
            </div>
            <input
              type="text"
              id="contact"
              name="contact"
              required
              placeholder="WhatsApp: 0812-xxxx-xxxx / Telepon keluarga"
              value={formData.contact}
              onChange={handleChange}
              className={`w-full bg-[#fcfbf9] border rounded-xl px-4 py-3.5 text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-indigo-700 transition-colors ${
                errors.contact ? 'border-rose-400 bg-rose-50/20' : 'border-[#e5e5e5]'
              }`}
            />
            <p className="text-xs text-neutral-500 font-sans">
              ℹ️ Kontak Anda hanya akan ditampilkan kepada relawan terdaftar yang terotentikasi.
            </p>
            {errors.contact && (
              <p className="text-xs text-rose-600 font-sans">{errors.contact}</p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#e5e5e5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-[0.32em] text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              BATALKAN
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white font-mono text-xs uppercase tracking-[0.35em] font-semibold transition-all duration-300 ease-premium shadow-[0_4px_20px_rgba(67,56,202,0.2)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'MENYIMPAN PERMOHONAN...' : 'PUBLIKASIKAN PERMOHONAN →'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
