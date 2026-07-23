import React from 'react';
import Nav from './Nav';
import Process from './Process';
import Pricing from './Pricing';
import CTA from './CTA';
import Footer from './Footer';
import { Arrow, Dot, SectionLabel } from './ui';
import { Service } from '@/content/services';

const BASE = 'https://wolfcontractor.com';

export default function ServicePage({ service }: { service: Service }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${BASE}/services/${service.slug}/#service`,
        name: service.navLabel,
        provider: { '@id': `${BASE}/#org` },
        areaServed: [
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Canada' },
        ],
        description: service.answerCapsule,
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE}/services/${service.slug}/#faq`,
        mainEntity: service.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE}/#services` },
          { '@type': 'ListItem', position: 3, name: service.navLabel, item: `${BASE}/services/${service.slug}/` },
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
            [ {service.kicker} ]
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(44px, 6.5vw, 104px)', lineHeight: 0.92, margin: 0, letterSpacing: '-0.04em', maxWidth: 1100 }}>
            {service.h1}
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.5, maxWidth: 720, marginTop: 32, color: 'rgba(245,242,236,0.85)' }}>
            {service.answerCapsule}
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

      {/* What's included */}
      <section style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <SectionLabel num="01" kicker="What's included" />
          <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.95, margin: '24px 0 56px', letterSpacing: '-0.03em', maxWidth: 900 }}>
            {service.includesHeading}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--line)' }}>
            {service.includes.map((inc, i) => (
              <div
                key={i}
                className="service-card"
                style={{
                  padding: 32, borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
                  background: 'transparent', minHeight: 200, display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.55 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="service-arrow">
                    <Dot c="var(--accent)" s={6} />
                  </span>
                </div>
                <h3 className="display" style={{ fontSize: 22, letterSpacing: '-0.02em', margin: '24px 0 10px' }}>
                  {inc.t}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>{inc.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Process />

      <Pricing />

      {/* FAQ */}
      <section id="faq" style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <SectionLabel num="02" kicker="FAQ" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, marginTop: 24 }}>
            <div>
              <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.95, margin: 0, letterSpacing: '-0.03em' }}>
                Straight
                <br />
                answers.
              </h2>
            </div>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {service.faq.map((f, i) => (
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
