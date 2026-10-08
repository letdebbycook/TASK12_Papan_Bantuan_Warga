import { MetadataRoute } from 'next';
import { getHelpRequests } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://warga-bantu.vercel.app';
  const requests = await getHelpRequests();

  const dynamicHelpRoutes: MetadataRoute.Sitemap = requests.map((req) => ({
    url: `${baseUrl}/bantuan/${req.id}`,
    lastModified: new Date(req.updated_at || req.created_at),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/bantuan`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  return [...staticRoutes, ...dynamicHelpRoutes];
}
