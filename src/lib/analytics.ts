/**
 * Analytics wrapper yang aman & fleksibel.
 * Kompatibel dengan GA4 / Plausible. Jika token atau env analytics tidak disediakan,
 * fungsi akan tetap berjalan aman tanpa error (silent fallback atau console debug di dev).
 */

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

type AnalyticsFn = (...args: unknown[]) => void;

export function track(eventName: string, params?: AnalyticsParams): void {
  try {
    if (typeof window === 'undefined') return;

    // Google Analytics (gtag)
    const windowWithGtag = window as unknown as { gtag?: AnalyticsFn };
    if (typeof windowWithGtag.gtag === 'function') {
      windowWithGtag.gtag('event', eventName, params);
    }

    // Plausible
    const windowWithPlausible = window as unknown as { plausible?: AnalyticsFn };
    if (typeof windowWithPlausible.plausible === 'function') {
      windowWithPlausible.plausible(eventName, { props: params });
    }

    if (process.env.NODE_ENV === 'development') {
      // Dev mode logger
    }
  } catch {
    // Fail silently in production
  }
}

