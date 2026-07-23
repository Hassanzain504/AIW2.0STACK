import React from 'react';
import { Dot, SectionLabel } from './ui';

const projects = [
  { name: 'Custom Trade Sites', trade: 'Websites', loc: 'Built in 14 days', lift: 'Mobile-first', color: '#8A4A22' },
  { name: 'Local SEO', trade: 'Search', loc: 'Map pack focus', lift: 'Own your towns', color: '#1F4E79' },
  { name: 'Google Ads', trade: 'Paid', loc: 'Ready-to-book leads', lift: 'Calendar filler', color: '#2F5D3A' },
  { name: 'Lead Funnels', trade: 'Conversion', loc: 'Quote pages', lift: 'Built to convert', color: '#5B3A6E' },
];

export default function Work() {
  return (
    <section
      id="work"
      style={{ background: 'var(--bone-2)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
        <SectionLabel num="03" kicker="Recent launches" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 24, gap: 40, flexWrap: 'wrap' }}>
          <h2
            className="display"
            style={{ fontSize: 'clamp(44px, 5vw, 80px)', lineHeight: 0.95, margin: 0, letterSpacing: '-0.03em', maxWidth: 720 }}
          >
            Built to book jobs.
            <br />
            <span style={{ color: 'var(--accent)' }}>Zero</span> template jobs.
          </h2>
          <a href="#" className="mono" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            VIEW FULL PORTFOLIO →
          </a>
        </div>
        <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24 }}>
          {projects.map((p, i) => (
            <div key={i} style={{ gridColumn: i === 0 || i === 3 ? 'span 4' : 'span 2' }}>
              <ProjectCard {...p} big={i === 0 || i === 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  name,
  trade,
  loc,
  lift,
  color,
  big,
}: {
  name: string;
  trade: string;
  loc: string;
  lift: string;
  color: string;
  big: boolean;
}) {
  return (
    <div className="project-card" style={{ cursor: 'pointer' }}>
      <div
        style={{
          aspectRatio: big ? '16/9' : '4/5',
          background: color,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(135deg, transparent 0 40px, rgba(255,255,255,0.04) 40px 41px)`,
          }}
        />
        {/* Faux browser bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 28,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 6,
          }}
        >
          <Dot c="#ff5f56" s={8} />
          <Dot c="#ffbd2e" s={8} />
          <Dot c="#27c93f" s={8} />
          <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginLeft: 16 }}>
            https://{name.toLowerCase().replace(/[^a-z]/g, '')}.com
          </div>
        </div>
        {/* Fake site content */}
        <div style={{ position: 'absolute', top: 60, left: 24, right: 24 }}>
          <div
            className="display"
            style={{ color: '#fff', fontSize: big ? 44 : 22, letterSpacing: '-0.02em', lineHeight: 1 }}
          >
            {name.toUpperCase()}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.3)', margin: '12px 0' }} />
          <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em' }}>
            {trade.toUpperCase()} · {loc.toUpperCase()}
          </div>
        </div>
        {/* Lift callout */}
        <div
          className="project-lift"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'var(--accent)',
            color: '#0E0E0E',
            padding: '10px 16px',
          }}
        >
          <div className="display" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>
            {lift}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div className="display" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>
            {name}
          </div>
          <div
            className="mono"
            style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.55, marginTop: 4, textTransform: 'uppercase' }}
          >
            {trade} — {loc}
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{lift}</div>
      </div>
    </div>
  );
}
