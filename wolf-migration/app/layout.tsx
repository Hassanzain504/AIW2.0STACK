import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = 'https://wolfcontractor.com/';
const TITLE = 'Contractor Website Design & Local SEO | Wolf Contractor';
const OG_DESC =
  'Fast, mobile-first websites and local SEO for home service businesses. Built to book jobs.';

export const metadata: Metadata = {
  metadataBase: new URL('https://wolfcontractor.com'),
  title: TITLE,
  description:
    'Wolf Contractor builds fast, mobile-first websites and local SEO for window cleaning, pressure washing, roofing, HVAC, plumbing and other home service businesses. Sites that book jobs.',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    siteName: 'Wolf Contractor',
    title: TITLE,
    description: OG_DESC,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: 'https://wolfcontractor.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: OG_DESC,
    images: ['https://wolfcontractor.com/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0E0E0E',
};

// JSON-LD @graph copied verbatim from the current site's <head>.
// Already correct and validated — do not rewrite.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': 'https://wolfcontractor.com/#org',
      name: 'Wolf Contractor',
      url: 'https://wolfcontractor.com/',
      description:
        'Website design and local SEO for home service and trades businesses, including window cleaning, pressure washing, roofing, HVAC, plumbing and electrical contractors.',
      email: 'hello@wolfcontractor.com',
      foundingDate: '2021',
      priceRange: '$$',
      areaServed: [
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'Canada' },
      ],
      knowsAbout: [
        'Contractor website design',
        'Local SEO',
        'Google Business Profile optimization',
        'Google Ads for contractors',
        'Lead generation for home services',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Trade Websites' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Local SEO' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Google Ads Management' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Lead Generation Funnels' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hosting and Site Speed' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Content and Photography' } },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://wolfcontractor.com/#website',
      url: 'https://wolfcontractor.com/',
      name: 'Wolf Contractor',
      publisher: { '@id': 'https://wolfcontractor.com/#org' },
      inLanguage: 'en-US',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
