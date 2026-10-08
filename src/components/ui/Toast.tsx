'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => toast({ type: 'success', title, message }),
    [toast]
  );

  const error = useCallback(
    (title: string, message?: string) => toast({ type: 'error', title, message }),
    [toast]
  );

  const info = useCallback(
    (title: string, message?: string) => toast({ type: 'info', title, message }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl p-4 border transition-all duration-300 ease-premium transform translate-y-0 opacity-100 backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-[#171717]/95 text-[#fcfbf9] border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.15)]'
                : t.type === 'error'
                ? 'bg-[#171717]/95 text-[#fcfbf9] border-rose-500/30 shadow-[0_10px_30px_rgba(244,63,94,0.15)]'
                : 'bg-[#171717]/95 text-[#fcfbf9] border-indigo-500/30 shadow-[0_10px_30px_rgba(67,56,202,0.15)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-neutral-400 block mb-1">
                  [{t.type === 'success' ? 'BERHASIL' : t.type === 'error' ? 'PERINGATAN' : 'INFORMASI'}]
                </span>
                <p className="font-serif text-base font-semibold text-white leading-snug">
                  {t.title}
                </p>
                {t.message && (
                  <p className="text-xs text-neutral-300 mt-1 font-sans leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-neutral-400 hover:text-white text-sm font-mono transition-colors p-1"
                aria-label="Tutup notifikasi"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
