import React from 'react';
import { Dot, Logo } from './ui';

export default function Footer() {
  return (
    <footer
      style={{ background: 'var(--ink)', color: 'var(--bone)', padding: '80px 0 40px', position: 'relative', overflow: 'hidden' }}
    >
      <div className="noise" />
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <Logo />
            <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.65, marginTop: 20, maxWidth: 340 }}>
              Websites, SEO and ads for contractors who&apos;d rather be on the job than at a computer.
            </p>
          </div>
          <FooterCol
            title="Services"
            items={[
              { label: 'Custom websites', href: '/services/website-design/' },
              { label: 'Local SEO', href: '/services/local-seo/' },
              { label: 'Google Ads', href: '/services/google-ads/' },
              { label: 'Lead funnels', href: '/#services' },
              { label: 'Hosting', href: '/#services' },
              { label: 'Photography', href: '/#services' },
            ]}
          />
          <FooterCol
            title="Trades"
            items={[
              { label: 'Window cleaning', href: '/window-cleaning-marketing/' },
              { label: 'Pressure washing', href: '/pressure-washing-marketing/' },
              { label: 'Roofing', href: '/roofing-marketing/' },
              { label: 'HVAC', href: '/hvac-marketing/' },
              { label: 'Plumbing', href: '/plumbing-marketing/' },
              { label: 'See all →', href: '/window-cleaning-marketing/' },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { label: 'Work', href: '/#work' },
              { label: 'Process', href: '/#process' },
              { label: 'Pricing', href: '/pricing/' },
              { label: 'FAQ', href: '/#faq' },
              { label: 'Contact', href: '#cta' },
            ]}
          />
        </div>
        <div
          style={{
            marginTop: 80,
            paddingTop: 24,
            borderTop: '1px solid rgba(245,242,236,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase' }}
          >
            © 2026 Wolf Contractor Co. · Built by contractors, for contractors.
          </div>
          <div
            className="mono"
            style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase' }}
          >
            WEBSITES &amp; LOCAL SEO FOR THE TRADES <Dot c="var(--accent)" s={6} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.55, textTransform: 'uppercase' }}>
        {title}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
        {items.map((i) => (
          <li key={i.label} style={{ fontSize: 14, padding: '6px 0', opacity: 0.85 }}>
            <a href={i.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
