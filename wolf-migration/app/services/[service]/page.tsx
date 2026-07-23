import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicePage from '@/components/ServicePage';
import { SERVICES, getService } from '@/content/services';

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export function generateMetadata({ params }: { params: { service: string } }): Metadata {
  const service = getService(params.service);
  if (!service) return {};
  const url = `https://wolfcontractor.com/services/${service.slug}/`;
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Wolf Contractor',
      title: service.title,
      description: service.metaDescription,
      url,
      locale: 'en_US',
      images: [{ url: 'https://wolfcontractor.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.metaDescription,
      images: ['https://wolfcontractor.com/og-image.png'],
    },
  };
}

export default function Page({ params }: { params: { service: string } }) {
  const service = getService(params.service);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
