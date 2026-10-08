'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'BERANDA', href: '/' },
    { label: 'CARI BANTUAN', href: '/bantuan' },
    { label: 'BANTUAN SAYA', href: '/bantuan-saya' },
    { label: 'MINTA BANTUAN', href: '/minta-bantu' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[80px] z-50 mix-blend-difference flex items-center justify-between px-6 md:px-12 pointer-events-auto">
        {/* Kiri: Logo Serif Italic */}
        <Link
          href="/"
          className="group inline-flex items-baseline gap-1.5 focus:outline-none"
        >
          <span className="font-serif italic font-bold text-2xl md:text-3xl tracking-tight text-white transition-opacity group-hover:opacity-80">
            WargaBantu
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 inline-block" />
        </Link>

        {/* Tengah: Monospace Links dengan 1px underline yang tumbuh saat hover */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-2 font-mono text-xs uppercase tracking-[0.35em] text-white transition-colors duration-300"
              >
                <span className={isActive ? 'opacity-100 font-semibold' : 'opacity-80 group-hover:opacity-100'}>
                  {link.label}
                </span>
                {/* 1px underline that grows on hover */}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 ease-premium ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Kanan: Pill CTA dengan blinking green dot + Komunitas Aktif / Login / Logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/60 bg-white/10 backdrop-blur-sm text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-blink-dot" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] font-medium text-white">
              Komunitas Aktif
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.3em] text-white/80 hidden lg:inline-block">
                [{profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}]
              </span>
              <button
                onClick={() => signOut()}
                className="font-mono text-xs uppercase tracking-[0.32em] px-3.5 py-1.5 border border-white/50 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 ease-premium"
              >
                KELUAR
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-mono text-xs uppercase tracking-[0.32em] px-4 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 ease-premium"
            >
              MASUK
            </Link>
          )}
        </div>

        {/* Hamburger Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/40 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-blink-dot" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]">
              AKTIF
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-2 font-mono text-lg focus:outline-none"
            aria-label="Buka menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#171717]/95 backdrop-blur-xl flex flex-col justify-center px-8 py-20 text-white md:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-serif italic text-3xl hover:translate-x-2 transition-transform duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-blink-dot" />
              <span className="font-mono text-xs tracking-[0.32em] text-neutral-300 uppercase">
                Komunitas Aktif
              </span>
            </div>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="w-full text-center py-3 border border-white/30 rounded-xl font-mono text-xs uppercase tracking-[0.32em] hover:bg-white hover:text-black transition-colors"
              >
                KELUAR ({user.email?.split('@')[0]})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 bg-white text-black rounded-xl font-mono text-xs uppercase tracking-[0.32em]"
              >
                MASUK / DAFTAR
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
