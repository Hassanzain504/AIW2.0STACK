'use client';

import React, { useState } from 'react';
import { Arrow, Tape } from './ui';
import { whatsappLink } from '@/lib/site';

const trades = [
  'Electrical',
  'Plumbing',
  'Roofing',
  'HVAC',
  'Landscaping',
  'General',
  'Concrete',
  'Painting',
  'Cleaning',
  'Pest control',
  'Other',
];

export default function CTA() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ trade: '', name: '', business: '', phone: '', site: '' });

  // Send the collected lead to the business WhatsApp with a pre-filled message.
  const sendToWhatsApp = () => {
    const message =
      `New free-mockup request from wolfcontractor.com\n\n` +
      `Trade: ${data.trade || '—'}\n` +
      `Name: ${data.name || '—'}\n` +
      `Business: ${data.business || '—'}\n` +
      `Existing site: ${data.site || '—'}\n` +
      `Best phone: ${data.phone || '—'}`;
    // Opens WhatsApp (app or web) with the message ready to send.
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    setStep(3);
  };

  return (
    <section id="cta" style={{ background: 'var(--accent)', color: '#0E0E0E', padding: 0, position: 'relative', overflow: 'hidden' }}>
      <Tape h={16} />
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '100px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.2em' }}>
              [ NO CONTRACTS · NO AGENCY FEES · NO FLUFF ]
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(56px, 7vw, 120px)', lineHeight: 0.88, letterSpacing: '-0.04em', margin: '24px 0 0' }}
            >
              Get a free
              <br />
              mockup in
              <br />
              <span style={{ fontStyle: 'italic' }}>48 hours.</span>
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.4, maxWidth: 440, marginTop: 32 }}>
              Tell us your trade. We&apos;ll design your new homepage and show it to you before you pay anything. If you
              hate it, you owe us nothing.
            </p>
          </div>
          <div style={{ background: 'var(--ink)', color: 'var(--bone)', padding: 40 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.6 }}>
              STEP {step + 1} OF 3
            </div>
            <div style={{ height: 3, background: 'rgba(245,242,236,0.15)', marginTop: 10 }}>
              <div style={{ height: '100%', width: `${((step + 1) / 3) * 100}%`, background: 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
            {step === 0 && (
              <div style={{ marginTop: 32 }}>
                <div className="display" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
                  What trade are you in?
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                  {trades.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setData({ ...data, trade: t });
                        setStep(1);
                      }}
                      style={{
                        padding: '10px 16px',
                        border: `1px solid ${data.trade === t ? 'var(--accent)' : 'rgba(245,242,236,0.2)'}`,
                        color: data.trade === t ? 'var(--accent)' : 'var(--bone)',
                        fontSize: 14,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div style={{ marginTop: 32 }}>
                <div className="display" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
                  Tell us about your business.
                </div>
                <Field label="Your name" value={data.name} onChange={(v) => setData({ ...data, name: v })} placeholder="Your name" />
                <Field
                  label="Business name"
                  value={data.business}
                  onChange={(v) => setData({ ...data, business: v })}
                  placeholder="Your business name"
                />
                <Field
                  label="Existing website (if any)"
                  value={data.site}
                  onChange={(v) => setData({ ...data, site: v })}
                  placeholder="yoursite.com"
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                  <button
                    onClick={() => setStep(0)}
                    style={{
                      padding: '14px 18px',
                      border: '1px solid rgba(245,242,236,0.2)',
                      color: 'var(--bone)',
                      fontSize: 13,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!data.name || !data.business}
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      background: 'var(--accent)',
                      color: '#0E0E0E',
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      opacity: !data.name || !data.business ? 0.4 : 1,
                    }}
                  >
                    Continue <Arrow />
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div style={{ marginTop: 32 }}>
                <div className="display" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
                  Where do we send it?
                </div>
                <Field
                  label="Best phone number"
                  value={data.phone}
                  onChange={(v) => setData({ ...data, phone: v })}
                  placeholder="(555) 555-5555"
                />
                <button
                  onClick={sendToWhatsApp}
                  disabled={!data.phone}
                  style={{
                    marginTop: 24,
                    width: '100%',
                    padding: 18,
                    background: 'var(--accent)',
                    color: '#0E0E0E',
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    opacity: !data.phone ? 0.4 : 1,
                  }}
                >
                  Send me the mockup <Arrow />
                </button>
              </div>
            )}
            {step === 3 && (
              <div style={{ marginTop: 32, textAlign: 'center', padding: '24px 0' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: 'var(--accent)',
                    color: '#0E0E0E',
                    display: 'inline-grid',
                    placeItems: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div className="display" style={{ fontSize: 28, letterSpacing: '-0.02em', marginTop: 20 }}>
                  We&apos;re on it, {data.name.split(' ')[0]}.
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.7, marginTop: 12 }}>
                  Your details are ready in WhatsApp — hit send and we&apos;ll get your mockup back within 48 hours. If
                  the chat didn&apos;t open,{' '}
                  <a
                    href={whatsappLink(
                      `New free-mockup request from wolfcontractor.com\n\nTrade: ${data.trade || '—'}\nName: ${
                        data.name || '—'
                      }\nBusiness: ${data.business || '—'}\nExisting site: ${data.site || '—'}\nBest phone: ${
                        data.phone || '—'
                      }`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)' }}
                  >
                    tap here to message us
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Tape h={16} />
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ marginTop: 20 }}>
      <label className="mono" style={{ fontSize: 10, letterSpacing: '0.15em', opacity: 0.55, textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          marginTop: 6,
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(245,242,236,0.2)',
          padding: '10px 0',
          color: 'var(--bone)',
          fontSize: 16,
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
    </div>
  );
}
