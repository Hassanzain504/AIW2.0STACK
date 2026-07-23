'use client';

import React, { useState } from 'react';
import { Arrow, SectionLabel } from './ui';

const quotes = [
  {
    q: 'We analyzed 700+ contractor websites before building a single one. The same problems came up again and again — and they are all fixable.',
    n: 'Our approach',
    r: 'Research first',
    m: 'Wolf Contractor',
  },
  {
    q: 'You own everything. The domain stays in your name, the code is yours, and we hand over every login on day one.',
    n: 'No lock-in',
    r: 'You own it',
    m: 'Wolf Contractor',
  },
  {
    q: 'We measure the work against booked jobs — not page views, not impressions. You get the numbers monthly, straight.',
    n: 'Honest metrics',
    r: 'Booked jobs only',
    m: 'Wolf Contractor',
  },
];

export default function Principles() {
  const [active, setActive] = useState(0);
  return (
    <section
      style={{ background: 'var(--ink)', color: 'var(--bone)', padding: '140px 0', position: 'relative', overflow: 'hidden' }}
    >
      <div className="noise" />
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        <SectionLabel num="04" kicker="What we stand for" />
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <div
              className="display"
              style={{
                fontSize: 'clamp(44px, 4.5vw, 68px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--bone)',
              }}
            >
              <span
                style={{
                  color: 'var(--accent)',
                  fontSize: '1.4em',
                  lineHeight: 0,
                  display: 'inline-block',
                  verticalAlign: '-0.15em',
                  marginRight: 8,
                }}
              >
                &quot;
              </span>
              {quotes[active].q}
            </div>
            <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                className="display"
                style={{ width: 56, height: 56, background: 'var(--accent)', color: '#0E0E0E', display: 'grid', placeItems: 'center' }}
              >
                {quotes[active].n
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="display" style={{ fontSize: 18 }}>
                  {quotes[active].n}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase', marginTop: 2 }}
                >
                  {quotes[active].r} · {quotes[active].m}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {quotes.map((q, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  textAlign: 'left',
                  padding: '16px 0',
                  borderTop: '1px solid rgba(245,242,236,0.15)',
                  color: active === i ? 'var(--bone)' : 'rgba(245,242,236,0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span className="mono" style={{ fontSize: 11, color: active === i ? 'var(--accent)' : 'inherit' }}>
                  0{i + 1}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{q.n}</span>
                {active === i && (
                  <span style={{ marginLeft: 'auto' }}>
                    <Arrow />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
