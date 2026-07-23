import React from 'react';
import { Arrow, Dot, Tape } from './ui';

function Marquee() {
  const items = [
    'ELECTRICIANS',
    'PLUMBERS',
    'ROOFERS',
    'HVAC',
    'LANDSCAPERS',
    'GENERAL CONTRACTORS',
    'CLEANING',
    'PEST CONTROL',
    'CONCRETE',
    'PAINTERS',
    'EXCAVATION',
    'FENCING',
  ];
  const row = [...items, ...items];
  return (
    <div
      style={{
        background: 'var(--ink-2)',
        color: 'var(--bone)',
        padding: '22px 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(245,242,236,0.06)',
        borderBottom: '1px solid rgba(245,242,236,0.06)',
      }}
    >
      <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'marquee 40s linear infinite' }}>
        {row.map((t, i) => (
          <span
            key={i}
            className="display"
            style={{ fontSize: 28, letterSpacing: '-0.01em', display: 'inline-flex', alignItems: 'center', gap: 48 }}
          >
            {t} <Dot c="var(--accent)" s={10} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        background: 'var(--ink)',
        color: 'var(--bone)',
        overflow: 'hidden',
        marginTop: -78,
        paddingTop: 78,
      }}
    >
      <div className="noise" />
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 32px 0', position: 'relative' }}>
        <div className="mono" style={{ fontSize: 12, letterSpacing: '0.2em', opacity: 0.55, marginBottom: 40 }}>
          [ WEB DESIGN FOR THE TRADES · 700+ CONTRACTOR SITES ANALYZED · BUILT FOR BOOKED JOBS ]
        </div>

        <h1
          className="display"
          style={{ fontSize: 'clamp(64px, 10vw, 168px)', lineHeight: 0.88, margin: 0, letterSpacing: '-0.045em' }}
        >
          WEBSITES
          <br />
          THAT <span style={{ color: 'var(--accent)' }}>BOOK</span>
          <br />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 24 }}>
            JOBS.
            <span
              className="mono"
              style={{
                fontSize: 14,
                letterSpacing: '0.1em',
                opacity: 0.6,
                textTransform: 'uppercase',
                alignSelf: 'flex-end',
                marginBottom: '1.2em',
                maxWidth: 320,
                lineHeight: 1.4,
              }}
            >
              not portfolios.
              <br />
              not awards.
              <br />
              not pretty pictures.
            </span>
          </span>
        </h1>

        <div
          style={{
            marginTop: 64,
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 64,
            alignItems: 'end',
            paddingBottom: 56,
          }}
        >
          <p style={{ fontSize: 22, lineHeight: 1.35, maxWidth: 620, margin: 0, color: 'rgba(245,242,236,0.85)' }}>
            We build high-converting websites for electricians, plumbers, roofers, HVAC, and every trade in between.
            Visitors in, paying clients out. No fluff.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <a
              href="#cta"
              style={{
                background: 'var(--accent)',
                color: '#0E0E0E',
                padding: '20px 26px',
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Get my free mockup <Arrow size={16} />
            </a>
            <a
              href="#work"
              style={{
                padding: '20px 26px',
                border: '1px solid rgba(245,242,236,0.25)',
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: 'var(--bone)',
              }}
            >
              See the work
            </a>
          </div>
        </div>
      </div>
      <Tape h={14} />
      <Marquee />
    </section>
  );
}
