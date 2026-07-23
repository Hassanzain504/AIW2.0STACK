import React from 'react';
import Nav from './Nav';
import Process from './Process';
import Pricing from './Pricing';
import CTA from './CTA';
import Footer from './Footer';
import ServiceGrid from './ServiceGrid';
import { Arrow, Dot, SectionLabel } from './ui';
import { Trade, getTrade } from '@/content/trades';

const BASE = 'https://wolfcontractor.com';

export default function TradePage({ trade }: { trade: Trade }) {
  const related = trade.related.map((s) => getTrade(s)).filter(Boolean) as Trade[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${BASE}/${trade.slug}/#service`,
        name: `${trade.tradeTitle} Marketing`,
        serviceType: `${trade.trade} marketing`,
        provider: { '@id': `${BASE}/#org` },
        areaServed: [
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Canada' },
        ],
        description: trade.answerCapsule,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: '2900',
          url: `${BASE}/${trade.slug}/`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE}/${trade.slug}/#faq`,
        mainEntity: trade.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: `${trade.tradeTitle} Marketing`, item: `${BASE}/${trade.slug}/` },
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
            [ {trade.kicker} · 700+ contractor sites analyzed ]
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(44px, 6.5vw, 104px)', lineHeight: 0.92, margin: 0, letterSpacing: '-0.04em', maxWidth: 1100 }}>
            {trade.h1}
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.5, maxWidth: 720, marginTop: 32, color: 'rgba(245,242,236,0.85)' }}>
            {trade.answerCapsule}
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="#cta"
              style={{
                background: 'var(--accent)', color: '#0E0E0E', padding: '18px 24px', fontWeight: 700, fontSize: 14,
                letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              Get my free mockup <Arrow size={16} />
            </a>
            <a
              href="/pricing/"
              style={{
                padding: '18px 24px', border: '1px solid rgba(245,242,236,0.25)', fontWeight: 600, fontSize: 14,
                letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--bone)',
              }}
            >
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <SectionLabel num="01" kicker="The problem" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 24, alignItems: 'start' }}>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 60px)', lineHeight: 1, margin: 0, letterSpacing: '-0.03em' }}>
              {trade.painHeading}
            </h2>
            <div>
              {trade.painParas.map((p, i) => (
                <p key={i} style={{ fontSize: 17, lineHeight: 1.6, margin: i === 0 ? 0 : '18px 0 0', color: 'var(--steel)' }}>
                  {p}
                </p>
              ))}
              <ul style={{ listStyle: 'none', padding: 0, margin: '28px 0 0' }}>
                {trade.painPoints.map((pt) => (
                  <li key={pt} style={{ fontSize: 15, padding: '10px 0', borderTop: '1px solid var(--line)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Dot c="var(--accent)" s={6} /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services for this trade */}
      <section style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <SectionLabel num="02" kicker={`What we do for ${trade.trade}`} />
          <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.95, margin: '24px 0 0', letterSpacing: '-0.03em', maxWidth: 900 }}>
            Six things. <span style={{ color: 'var(--accent)' }}>Done right.</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.5, margin: '20px 0 0', maxWidth: 620, color: 'var(--steel)' }}>
            {trade.servicesIntro}
          </p>
          <div style={{ marginTop: 56 }}>
            <ServiceGrid />
          </div>
        </div>
      </section>

      <Process />

      <Pricing />

      {/* Trade FAQ (server-rendered, schema-backed) */}
      <section id="faq" style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <SectionLabel num="03" kicker="FAQ" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, marginTop: 24 }}>
            <div>
              <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.95, margin: 0, letterSpacing: '-0.03em' }}>
                {trade.tradeTitle}
                <br />
                questions.
              </h2>
            </div>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {trade.faq.map((f, i) => (
                <details key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                  <summary
                    style={{
                      listStyle: 'none',
                      cursor: 'pointer',
                      padding: '24px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
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

      {/* Internal links */}
      <section style={{ background: 'var(--bone-2)', color: 'var(--ink)', padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55 }}>
            Keep exploring
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
            {related.map((r) => (
              <a
                key={r.slug}
                href={`/${r.slug}/`}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                  padding: '20px 22px', border: '1px solid var(--line)', textDecoration: 'none', color: 'inherit', background: 'var(--bone)',
                }}
              >
                <span className="display" style={{ fontSize: 18, letterSpacing: '-0.01em' }}>{r.tradeTitle} marketing</span>
                <Arrow size={16} />
              </a>
            ))}
            {[
              { t: 'Contractor website design', href: '/services/website-design/' },
              { t: 'Local SEO for contractors', href: '/services/local-seo/' },
              { t: 'Google Ads management', href: '/services/google-ads/' },
            ].map((s) => (
              <a
                key={s.href}
                href={s.href}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                  padding: '20px 22px', border: '1px solid var(--line)', textDecoration: 'none', color: 'inherit', background: 'var(--bone)',
                }}
              >
                <span className="display" style={{ fontSize: 18, letterSpacing: '-0.01em' }}>{s.t}</span>
                <Arrow size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}
