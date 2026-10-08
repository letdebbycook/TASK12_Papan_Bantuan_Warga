import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://warga-bantu.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/bantuan', '/bantuan/*'],
      disallow: ['/login', '/minta-bantu', '/bantuan-saya', '/api/*', '/auth/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
