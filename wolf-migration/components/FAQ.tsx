'use client';

import React, { useState } from 'react';
import { SectionLabel } from './ui';
import { SITE } from '@/lib/site';

const items = [
  {
    q: 'How long does a website take to build?',
    a: 'Most sites launch in 14 business days from kickoff. Larger builds (50+ service pages) take 3–5 weeks. You see a real mockup in 48 hours before any invoice.',
  },
  {
    q: 'Do I own my website?',
    a: 'Always. The domain stays in your name, the code is yours, and we hand over every login. No ransom, no lock-in — if you fire us, you walk away with everything.',
  },
  {
    q: 'What trades do you work with?',
    a: 'Electricians, plumbers, roofers, HVAC, landscapers, general contractors, concrete crews, painters, cleaning companies, and pest control. If you send a truck to a job site, we can help.',
  },
  {
    q: 'Will my site actually bring in calls?',
    a: 'That’s the whole point. Every site we build is measured against lead volume — not page views or "brand impressions." We track calls and form fills from day one, and you get the numbers monthly — no vanity metrics.',
  },
  {
    q: 'Do you work with contractors outside the US?',
    a: 'Yes — we have clients in Canada, the UK, and Australia. Our SEO and ads playbooks translate cleanly to any English-speaking market.',
  },
  {
    q: 'What if I already have a website?',
    a: 'We audit it for free. Sometimes we recommend a rebuild, sometimes we recommend we stay away. We’ll tell you straight either way.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section
      id="faq"
      style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
        <SectionLabel num="06" kicker="FAQ" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, marginTop: 24 }}>
          <div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(44px, 5vw, 72px)', lineHeight: 0.95, margin: 0, letterSpacing: '-0.03em' }}
            >
              Straight
              <br />
              answers.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--steel)', marginTop: 24, maxWidth: 320 }}>
              Didn&apos;t see yours? Email{' '}
              <a href={`mailto:${SITE.email}`} style={{ color: 'var(--accent)' }}>
                {SITE.email}
              </a>{' '}
              — we answer within a day.
            </p>
          </div>
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {items.map((it, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    color: 'inherit',
                  }}
                >
                  <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.15em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="display" style={{ fontSize: 22, letterSpacing: '-0.02em', flex: 1 }}>
                    {it.q}
                  </span>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      border: '1px solid var(--line)',
                      display: 'grid',
                      placeItems: 'center',
                      transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    +
                  </span>
                </button>
                <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: 'var(--steel)',
                      margin: 0,
                      padding: '0 0 24px 42px',
                      maxWidth: 640,
                    }}
                  >
                    {it.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
