import React from 'react';
import { Arrow, SectionLabel } from './ui';

const plans = [
  {
    name: 'Launchpad',
    kicker: 'Get online, fast',
    price: '2,900',
    unit: 'one-time',
    monthly: '149/mo hosting',
    features: [
      '5-page custom site',
      '48h free mockup',
      'Mobile-first build',
      'Click-to-call + forms',
      'Basic on-page SEO',
      '14-day launch',
    ],
    cta: 'Start Launchpad',
    featured: false,
  },
  {
    name: 'Workhorse',
    kicker: 'Most popular',
    price: '4,900',
    unit: 'one-time',
    monthly: '349/mo SEO + hosting',
    features: [
      'Everything in Launchpad',
      'Up to 12 pages',
      'On-site photo + video shoot',
      'Local SEO (3 towns)',
      'Monthly reports + calls',
      'Google Business optimization',
    ],
    cta: 'Pick Workhorse',
    featured: true,
  },
  {
    name: 'Overdrive',
    kicker: 'Lead machine',
    price: '7,900',
    unit: 'one-time',
    monthly: 'from 899/mo growth',
    features: [
      'Everything in Workhorse',
      'Unlimited service pages',
      'Google Ads + LSA mgmt',
      'Custom quote funnels',
      'Call tracking + recording',
      'Dedicated growth lead',
    ],
    cta: 'Go Overdrive',
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      style={{ background: 'var(--bone)', color: 'var(--ink)', padding: '120px 0', borderBottom: '1px solid var(--line)' }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
        <SectionLabel num="05" kicker="Pricing" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'end', marginTop: 24 }}>
          <h2
            className="display"
            style={{ fontSize: 'clamp(44px, 5vw, 80px)', lineHeight: 0.95, margin: 0, letterSpacing: '-0.03em' }}
          >
            Flat price.
            <br />
            <span style={{ color: 'var(--accent)' }}>No surprises.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0, color: 'var(--steel)', maxWidth: 460 }}>
            You see every line item. Cancel monthly anytime. We&apos;ll never tell you &quot;SEO takes 6 months&quot;
            and then ghost you.
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
          {plans.map((p, i) => (
            <PricingCard key={i} {...p} />
          ))}
        </div>
        <div
          className="mono"
          style={{ fontSize: 12, letterSpacing: '0.1em', marginTop: 24, color: 'var(--steel)', textAlign: 'center' }}
        >
          * ALL PLANS INCLUDE 100% OWNERSHIP OF YOUR SITE + DOMAIN. NO LOCK-IN.
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  kicker,
  price,
  unit,
  monthly,
  features,
  cta,
  featured,
}: {
  name: string;
  kicker: string;
  price: string;
  unit: string;
  monthly: string;
  features: string[];
  cta: string;
  featured: boolean;
}) {
  return (
    <div
      style={{
        padding: 36,
        background: featured ? 'var(--ink)' : 'transparent',
        color: featured ? 'var(--bone)' : 'inherit',
        borderRight: '1px solid var(--line)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {featured && (
        <div
          className="mono"
          style={{
            position: 'absolute',
            top: -1,
            right: -1,
            background: 'var(--accent)',
            color: '#0E0E0E',
            padding: '6px 12px',
            fontSize: 11,
            letterSpacing: '0.15em',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          MOST PICKED
        </div>
      )}
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55 }}>
        {kicker}
      </div>
      <div className="display" style={{ fontSize: 44, letterSpacing: '-0.03em', marginTop: 12 }}>
        {name}
      </div>
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="display" style={{ fontSize: 56, letterSpacing: '-0.03em' }}>
          <span style={{ color: 'var(--accent)' }}>$</span>
          {price}
        </span>
        <span style={{ fontSize: 14, opacity: 0.6 }}>{unit}</span>
      </div>
      <div
        className="mono"
        style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.55, marginTop: 4, textTransform: 'uppercase' }}
      >
        + ${monthly}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '32px 0 0' }}>
        {features.map((f) => (
          <li
            key={f}
            style={{
              fontSize: 14,
              padding: '10px 0',
              borderTop: `1px solid ${featured ? 'rgba(245,242,236,0.12)' : 'var(--line)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <div style={{ flex: 1, minHeight: 24 }} />
      <a
        href="#cta"
        style={{
          marginTop: 32,
          padding: '16px 20px',
          background: featured ? 'var(--accent)' : 'var(--ink)',
          color: featured ? '#0E0E0E' : 'var(--bone)',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        {cta} <Arrow size={16} />
      </a>
    </div>
  );
}
