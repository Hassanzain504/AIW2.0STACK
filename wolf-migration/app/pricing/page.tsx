import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { Dot, SectionLabel } from '@/components/ui';

const BASE = 'https://wolfcontractor.com';
const URL = `${BASE}/pricing/`;

export const metadata: Metadata = {
  title: 'Contractor Website Pricing, How Much Does It Cost | Wolf Contractor',
  description:
    'How much does a contractor website cost? Wolf Contractor builds custom trade sites from $2,900 one-time, with optional monthly SEO and ads. No contracts, you own it.',
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    siteName: 'Wolf Contractor',
    title: 'Contractor Website Pricing | Wolf Contractor',
    description:
      'Custom contractor websites from $2,900 one-time, with optional monthly SEO and ads. No contracts, you own the site.',
    url: URL,
    locale: 'en_US',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contractor Website Pricing | Wolf Contractor',
    description: 'Custom contractor websites from $2,900 one-time. No contracts, you own the site.',
    images: [`${BASE}/og-image.png`],
  },
};

const faq = [
  {
    q: 'How much does a contractor website cost?',
    a: 'A custom contractor website from Wolf Contractor is a one-time build: $2,900 for Launchpad, $4,900 for Workhorse, and $7,900 for Overdrive, with optional monthly hosting, SEO, or ads. DIY builders run $15 to $50 a month but take your time and rarely rank; full-service agencies often charge $10,000 or more.',
  },
  {
    q: 'Why is your pricing one-time instead of monthly?',
    a: 'You pay once for the build and own the result. Hosting, SEO, and ads are optional monthly add-ons you can start or stop anytime. We never hold your site hostage behind a subscription.',
  },
  {
    q: 'Are there any hidden fees?',
    a: 'No. You see every line item before you start. The build price is fixed, and any monthly service is spelled out and cancellable. No surprise charges, no long contracts.',
  },
  {
    q: 'What is the difference between the three plans?',
    a: 'Launchpad is a fast 5-page site to get online. Workhorse adds more pages, a photo and video shoot, and local SEO for three towns. Overdrive adds unlimited service pages, Google Ads and LSA management, and custom quote funnels.',
  },
  {
    q: 'Do I own the website?',
    a: 'Always. The domain stays in your name, the code is yours, and we hand over every login at launch. If you leave, you take everything with you.',
  },
  {
    q: 'Can I cancel the monthly services?',
    a: 'Yes, anytime. Hosting, SEO, and ads management are month to month. The website itself is yours to keep regardless.',
  },
];

const comparison = [
  { option: 'DIY builder (Wix, Squarespace)', cost: '$15 to $50 / mo', owns: 'Platform locks you in', ranks: 'Rarely ranks', time: 'Your nights and weekends' },
  { option: 'Template agency', cost: '$1,000 to $3,000', owns: 'Often licensed, not owned', ranks: 'Generic, hard to rank', time: 'Weeks of back and forth' },
  { option: 'Full-service agency', cost: '$10,000+', owns: 'Usually yours', ranks: 'Can rank well', time: 'Months, heavy process' },
  { option: 'Wolf Contractor', cost: '$2,900 to $7,900 one-time', owns: 'You own it, 100%', ranks: 'Built to rank', time: 'About 14 days' },
];

export default function PricingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${URL}#faq`,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Pricing', item: URL },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      {/* Header */}
      <section style={{ position: 'relative', background: 'var(--ink)', color: 'var(--bone)', overflow: 'hidden', marginTop: -78, paddingTop: 78 }}>
        <div className="noise" />
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 32px 96px', position: 'relative' }}>
          <div className="mono" style={{ fontSize: 12, letterSpacing: '0.2em', opacity: 0.55, marginBottom: 28, textTransform: 'uppercase' }}>
            [ Contractor website pricing ]
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(44px, 6.5vw, 104px)', lineHeight: 0.92, margin: 0, letterSpacing: '-0.04em', maxWidth: 1100 }}>
            How much does a contractor website cost?
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.5, maxWidth: 760, marginTop: 32, color: 'rgba(245,242,236,0.85)' }}>
            {faq[0].a}
          </p>
        </div>
      </section>

      <Pricing />

      {/* Comparison table */}
      <section style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <SectionLabel num="01" kicker="How the options compare" />
          <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 68px)', lineHeight: 0.95, margin: '24px 0 48px', letterSpacing: '-0.03em', maxWidth: 900 }}>
            What you actually pay for.
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Option', 'Cost', 'Ownership', 'Ranks?', 'Time'].map((h) => (
                    <th
                      key={h}
                      className="mono"
                      style={{ textAlign: 'left', padding: '14px 16px', borderBottom: '2px solid var(--ink)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => {
                  const featured = row.option === 'Wolf Contractor';
                  return (
                    <tr key={row.option} style={{ background: featured ? 'var(--ink)' : 'transparent', color: featured ? 'var(--bone)' : 'inherit' }}>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--line)', fontWeight: featured ? 700 : 500 }}>
                        {featured && <Dot c="var(--accent)" s={7} />} {featured ? ' ' : ''}{row.option}
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--line)' }}>{row.cost}</td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--line)' }}>{row.owns}</td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--line)' }}>{row.ranks}</td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--line)' }}>{row.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mono" style={{ fontSize: 12, letterSpacing: '0.08em', marginTop: 20, color: 'var(--steel)' }}>
            * Ranges are typical US market figures for comparison. Wolf Contractor prices are fixed and shown in full before you start.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <SectionLabel num="02" kicker="Pricing FAQ" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, marginTop: 24 }}>
            <div>
              <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.95, margin: 0, letterSpacing: '-0.03em' }}>
                No games
                <br />
                on price.
              </h2>
            </div>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {faq.map((f, i) => (
                <details key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                  <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '24px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.15em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="display" style={{ fontSize: 20, letterSpacing: '-0.02em', flex: 1 }}>
                      {f.q}
                    </span>
                    <span style={{ color: 'var(--accent)', fontSize: 20, lineHeight: 1 }}>+</span>
                  </summary>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--steel)', margin: 0, padding: '0 0 24px 42px', maxWidth: 720 }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}
