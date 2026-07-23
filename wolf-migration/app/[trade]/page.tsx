import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TradePage from '@/components/TradePage';
import { TRADES, getTrade } from '@/content/trades';

export const dynamicParams = false;

export function generateStaticParams() {
  return TRADES.map((t) => ({ trade: t.slug }));
}

export function generateMetadata({ params }: { params: { trade: string } }): Metadata {
  const trade = getTrade(params.trade);
  if (!trade) return {};
  const url = `https://wolfcontractor.com/${trade.slug}/`;
  return {
    title: trade.title,
    description: trade.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Wolf Contractor',
      title: trade.title,
      description: trade.metaDescription,
      url,
      locale: 'en_US',
      images: [{ url: 'https://wolfcontractor.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: trade.title,
      description: trade.metaDescription,
      images: ['https://wolfcontractor.com/og-image.png'],
    },
  };
}

export default function Page({ params }: { params: { trade: string } }) {
  const trade = getTrade(params.trade);
  if (!trade) notFound();
  return <TradePage trade={trade} />;
}
