import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHelpRequestById } from '@/lib/data';
import { HelpDetailView } from '@/components/features/HelpDetailView';
import { Footer } from '@/components/layout/Footer';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const request = await getHelpRequestById(id);

  if (!request) {
    return {
      title: 'Permintaan Bantuan Tidak Ditemukan',
    };
  }

  return {
    title: `${request.title} — ${request.location}`,
    description: request.description.slice(0, 160),
    openGraph: {
      title: `${request.title} — Papan Bantuan Warga`,
      description: request.description.slice(0, 160),
      type: 'article',
    },
  };
}

export default async function BantuanDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const request = await getHelpRequestById(id);

  if (!request) {
    notFound();
  }

  const jsonLdDetail = {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    name: request.title,
    text: request.description,
    category: request.category,
    spatialCoverage: {
      '@type': 'Place',
      name: request.location,
    },
    datePosted: request.created_at,
  };

  return (
    <main className="min-h-screen pt-28 pb-16 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDetail) }}
      />
      <HelpDetailView initialRequest={request} />
      <Footer />
    </main>
  );
}
