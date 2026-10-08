'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { loginSchema, registerSchema } from '@/lib/validators/auth';
import getSupabaseBrowserClient from '@/lib/supabase';
import { Footer } from '@/components/layout/Footer';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/bantuan';

  const { success, error: toastError } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAuthError = (err: unknown) => {
    const rawMessage = (err as { message?: string })?.message || '';
    if (
      rawMessage.includes('Invalid login credentials') ||
      rawMessage.includes('invalid_grant')
    ) {
      toastError(
        'Gagal Masuk',
        'Kombinasi email atau kata sandi tidak sesuai. Silakan periksa kembali.'
      );
    } else if (rawMessage.includes('User already registered')) {
      toastError(
        'Email Terdaftar',
        'Alamat email ini sudah terdaftar. Silakan pilih tab Masuk.'
      );
    } else if (rawMessage.includes('Password should be at least')) {
      toastError(
        'Kata Sandi Lemah',
        'Kata sandi harus terdiri dari minimal 8 karakter.'
      );
    } else {
      toastError(
        'Kendala Layanan',
        'Terjadi gangguan saat memproses akun. Silakan coba kembali sesaat lagi.'
      );
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const supabase = getSupabaseBrowserClient();

    if (mode === 'login') {
      const result = loginSchema.safeParse({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: result.data.email,
          password: result.data.password,
        });

        if (error) {
          handleAuthError(error);
          return;
        }

        success('Selamat Datang Kembali!', 'Anda telah berhasil masuk ke akun warga.');
        router.push(redirect);
        router.refresh();
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    } else {
      // Register mode
      const result = registerSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.signUp({
          email: result.data.email,
          password: result.data.password,
          options: {
            data: {
              full_name: result.data.fullName,
            },
          },
        });

        if (error) {
          handleAuthError(error);
          return;
        }

        success(
          'Pendaftaran Berhasil!',
          'Akun warga Anda telah dibuat. Selamat bergabung dalam jejaring solidaritas.'
        );
        router.push(redirect);
        router.refresh();
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleOAuth = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });

      if (error) {
        handleAuthError(error);
      }
    } catch (err) {
      handleAuthError(err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block font-serif italic text-3xl font-bold text-neutral-900 mb-2">
          WargaBantu
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-400">
          JARINGAN SOLIDARITAS WARGA
        </p>
      </div>

      {/* Card Container */}
      <div className="border border-[#e5e5e5] rounded-3xl bg-white p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        {/* Toggle Mode: Masuk vs Daftar */}
        <div className="grid grid-cols-2 p-1 bg-[#fcfbf9] border border-[#e5e5e5] rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrors({});
            }}
            className={`py-2.5 font-mono text-xs uppercase tracking-[0.3em] rounded-xl transition-all duration-300 ${
              mode === 'login'
                ? 'bg-neutral-900 text-white font-semibold shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            MASUK
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrors({});
            }}
            className={`py-2.5 font-mono text-xs uppercase tracking-[0.3em] rounded-xl transition-all duration-300 ${
              mode === 'register'
                ? 'bg-neutral-900 text-white font-semibold shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            DAFTAR BARU
          </button>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="font-serif text-2xl md:text-3xl text-neutral-900">
            {mode === 'login' ? (
              <>
                Selamat Datang, <span className="italic font-bold text-indigo-900">Warga</span>
              </>
            ) : (
              <>
                Bergabung <span className="italic font-bold text-indigo-900">Saling Jaga</span>
              </>
            )}
          </h2>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {mode === 'login'
              ? 'Akses kontak pemohon dan pantau aksi solidaritas Anda.'
              : 'Daftarkan diri Anda untuk mulai memposting atau membantu sesama.'}
          </p>
        </div>

        {/* Form Email & Password */}
        <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
          {mode === 'register' && (
            <div className="space-y-1">
              <label
                htmlFor="fullName"
                className="block font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-600"
              >
                NAMA LENGKAP
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                placeholder="Nama Anda / Nama Panggilan"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full bg-[#fcfbf9] border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-700 transition-colors ${
                  errors.fullName ? 'border-rose-400' : 'border-[#e5e5e5]'
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 font-sans">{errors.fullName}</p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-600"
            >
              ALAMAT EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-[#fcfbf9] border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-700 transition-colors ${
                errors.email ? 'border-rose-400' : 'border-[#e5e5e5]'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-600 font-sans">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-600"
            >
              KATA SANDI (MIN. 8 KARAKTER)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-[#fcfbf9] border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-700 transition-colors ${
                errors.password ? 'border-rose-400' : 'border-[#e5e5e5]'
              }`}
            />
            {errors.password && (
              <p className="text-[11px] text-rose-600 font-sans">{errors.password}</p>
            )}
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-600"
              >
                KONFIRMASI KATA SANDI
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-[#fcfbf9] border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-700 transition-colors ${
                  errors.confirmPassword ? 'border-rose-400' : 'border-[#e5e5e5]'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 font-sans">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-mono text-xs uppercase tracking-[0.35em] font-semibold transition-all duration-300 ease-premium shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? 'MEMPROSES...' : mode === 'login' ? 'MASUK SEKARANG →' : 'DAFTARKAN AKUN →'}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e5e5]" />
          </div>
          <span className="relative bg-white px-3 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            ATAU MASUK DENGAN
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleOAuth}
          className="w-full py-3 rounded-xl border border-neutral-300 hover:border-neutral-900 bg-white text-neutral-800 font-mono text-xs uppercase tracking-[0.3em] transition-colors flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>GOOGLE ACCOUNT</span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.32em] text-neutral-400 hover:text-neutral-800 transition-colors"
        >
          ← KEMBALI KE BERANDA
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 flex flex-col justify-between">
      <Suspense
        fallback={
          <div className="py-20 text-center font-mono text-xs uppercase tracking-[0.35em] text-neutral-400">
            MEMUAT HALAMAN MASUK...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
      <Footer />
    </main>
  );
}
