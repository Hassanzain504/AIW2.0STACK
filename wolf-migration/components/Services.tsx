import React from 'react';
import { Arrow, Dot, SectionLabel } from './ui';

const items = [
  {
    t: 'Custom Trade Sites',
    d: 'Hand-built, fast, and tuned for the phone call. No templates, no page builders, no bloat.',
    items: ['Mobile-first design', 'Service-area landing pages', 'Click-to-call everywhere'],
  },
  {
    t: 'Local SEO That Ranks',
    d: 'Rank in your towns. Google Business Profile, schema, and citation work that actually moves the needle.',
    items: ['GBP optimization', 'Local schema + NAP', 'Review funnels'],
  },
  {
    t: 'Google Ads Management',
    d: 'Dialed-in campaigns that fill the calendar. Weekly reporting. Call tracking included.',
    items: ['Emergency service ads', 'LSA setup', 'Call recording'],
  },
  {
    t: 'Lead Gen Funnels',
    d: 'Purpose-built quote pages that convert 3–5× better than a generic contact form.',
    items: ['Quote builders', 'SMS lead alerts', 'CRM handoff'],
  },
  {
    t: 'Hosting & Speed',
    d: 'Lightning-fast hosting with 99.98% uptime. You own the domain, we keep it online.',
    items: ['<1s load times', 'Daily backups', 'SSL + security'],
  },
  {
    t: 'Content & Photography',
    d: 'Real site visits. Real photos of your crew, your trucks, your jobs — no stock garbage.',
    items: ['On-site shoots', 'Service page copy', 'Video walkthroughs'],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
        <SectionLabel num="01" kicker="What we build" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, marginTop: 24, alignItems: 'end' }}>
          <h2
            className="display"
            style={{ fontSize: 'clamp(44px, 5vw, 80px)', lineHeight: 0.95, margin: 0, letterSpacing: '-0.03em' }}
          >
            Six things. <span style={{ color: 'var(--accent)' }}>Done right.</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0, maxWidth: 520, color: 'var(--steel)' }}>
            We don&apos;t do logos. We don&apos;t do socials. We don&apos;t do &quot;brand strategy workshops.&quot; We
            build the machine that books your next job — and we keep it running.
          </p>
        </div>
        <div
          style={{
            marginTop: 72,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            border: '1px solid var(--line)',
          }}
        >
          {items.map((s, i) => (
            <ServiceCard key={i} num={String(i + 1).padStart(2, '0')} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ num, t, d, items }: { num: string; t: string; d: string; items: string[] }) {
  return (
    <div
      className="service-card"
      style={{
        padding: 32,
        borderRight: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        background: 'transparent',
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.55 }}>
          SVC/{num}
        </span>
        <span className="service-arrow">
          <Arrow size={18} />
        </span>
      </div>
      <h3 className="display" style={{ fontSize: 28, letterSpacing: '-0.02em', margin: '28px 0 12px' }}>
        {t}
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{d}</p>
      <div style={{ flex: 1 }} />
      <ul className="service-list" style={{ margin: '24px 0 0', padding: 0, listStyle: 'none' }}>
        {items.map((i) => (
          <li key={i} style={{ fontSize: 13, padding: '8px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Dot c="var(--accent)" s={5} /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
