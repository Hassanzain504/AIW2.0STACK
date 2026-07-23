import React from 'react';
import { SectionLabel } from './ui';

const steps = [
  { n: '01', t: 'Free strategy call', d: '30 minutes. We learn your trade, service area, and biggest choke points in the pipeline.' },
  { n: '02', t: 'Free mockup in 48h', d: 'You see your new homepage before you pay a dollar. No contracts to kick tires.' },
  { n: '03', t: 'Build & content', d: 'We fly out, shoot your crew at work, and build the site in 10 business days.' },
  { n: '04', t: 'Launch', d: 'We flip the switch, transfer the domain, and turn on tracking. You own everything.' },
  { n: '05', t: 'Grow', d: 'Monthly SEO, ads, and reporting. You get calls. We prove it.' },
];

export default function Process() {
  return (
    <section
      id="process"
      style={{ background: 'var(--ink)', color: 'var(--bone)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}
    >
      <div className="noise" />
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        <SectionLabel num="02" kicker="How it works" />
        <h2
          className="display"
          style={{ fontSize: 'clamp(44px, 5vw, 80px)', lineHeight: 0.95, margin: '24px 0 0', letterSpacing: '-0.03em' }}
        >
          From handshake to
          <br />
          first lead in <span style={{ color: 'var(--accent)' }}>14 days.</span>
        </h2>
        <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 30, left: 0, right: 0, height: 1, background: 'rgba(245,242,236,0.15)' }} />
          {steps.map((s) => (
            <div key={s.n} style={{ padding: '0 16px 0 0', position: 'relative' }}>
              <div
                className="display"
                style={{
                  width: 60,
                  height: 60,
                  background: 'var(--accent)',
                  color: '#0E0E0E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 20,
                  letterSpacing: '-0.02em',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {s.n}
              </div>
              <div className="display" style={{ fontSize: 22, letterSpacing: '-0.02em', marginTop: 24 }}>
                {s.t}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(245,242,236,0.65)', marginTop: 10 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
