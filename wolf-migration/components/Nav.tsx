'use client';

import React, { useState, useEffect } from 'react';
import { Arrow, Logo, NavIcon, AboutIcon, NAV_TRADES, NAV_SERVICES } from './ui';
import { SITE } from '@/lib/site';

type OpenMenu = 'services' | 'trades' | 'about' | null;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<OpenMenu>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    opacity: 0.85,
    whiteSpace: 'nowrap',
    color: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    font: 'inherit',
    padding: '6px 0',
  };

  const caret = (o: boolean) => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      style={{ transform: o ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.7 }}
    >
      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );

  const goScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
  };

  const onGetStarted = () => goScroll('cta');

  return (
    <header
      onMouseLeave={() => setOpen(null)}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled || open ? 'rgba(14,14,14,0.97)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(12px)' : 'none',
        color: '#F5F2EC',
        transition: 'background 0.2s',
        borderBottom: scrolled || open ? '1px solid rgba(245,242,236,0.08)' : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '18px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          position: 'relative',
        }}
      >
        <Logo />
        <nav style={{ display: 'flex', gap: 28, marginLeft: 40, fontSize: 14, fontWeight: 500, alignItems: 'center' }}>
          <a
            href="/#services"
            onMouseEnter={() => setOpen('services')}
            style={{ ...linkStyle, color: open === 'services' ? 'var(--accent)' : 'inherit' }}
          >
            Services {caret(open === 'services')}
          </a>
          <a href="/#work" onMouseEnter={() => setOpen(null)} style={linkStyle}>
            Work
          </a>
          <a
            href="/window-cleaning-marketing/"
            onMouseEnter={() => setOpen('trades')}
            style={{ ...linkStyle, color: open === 'trades' ? 'var(--accent)' : 'inherit' }}
          >
            Trades We Serve {caret(open === 'trades')}
          </a>
          <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={() => setOpen('about')}>
            <button
              onClick={() => {
                setOpen(null);
                goScroll('process');
              }}
              style={{ ...linkStyle, color: open === 'about' ? 'var(--accent)' : 'inherit' }}
            >
              About {caret(open === 'about')}
            </button>
            {open === 'about' && <NavAboutMenu goScroll={goScroll} setOpen={setOpen} />}
          </span>
        </nav>
        <div style={{ flex: 1 }} />
        <a
          href={`mailto:${SITE.email}`}
          className="mono"
          style={{ fontSize: 12, opacity: 0.7, textDecoration: 'none', letterSpacing: '0.05em' }}
        >
          HELLO@WOLFCONTRACTOR.COM
        </a>
        <button
          onClick={onGetStarted}
          style={{
            background: 'var(--accent)',
            color: '#0E0E0E',
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Get a free mockup <Arrow />
        </button>

        {open === 'services' && <NavServicesMenu />}
        {open === 'trades' && <NavTradesMenu />}
      </div>
    </header>
  );
}

function NavMenuShell({
  children,
  width = 560,
  left = 0,
  right = 'auto',
}: {
  children: React.ReactNode;
  width?: number;
  left?: number | string;
  right?: number | string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left,
        right,
        width,
        background: '#111',
        border: '1px solid rgba(245,242,236,0.12)',
        borderTop: '2px solid var(--accent)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        padding: 14,
        zIndex: 60,
      }}
    >
      {children}
    </div>
  );
}

function NavServicesMenu() {
  return (
    <NavMenuShell width={560}>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'rgba(245,242,236,0.45)',
          textTransform: 'uppercase',
          padding: '6px 10px 12px',
        }}
      >
        What we build
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {NAV_SERVICES.map((s) => (
          <a
            key={s.t}
            href={s.href}
            style={{
              display: 'flex',
              gap: 12,
              padding: '12px 12px',
              textAlign: 'left',
              color: '#F5F2EC',
              alignItems: 'flex-start',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,242,236,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>
              <NavIcon name={s.icon} size={22} />
            </span>
            <span>
              <span className="display" style={{ fontSize: 15, display: 'block', letterSpacing: '-0.01em' }}>
                {s.t}
              </span>
              <span style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.35, display: 'block', marginTop: 2 }}>
                {s.d}
              </span>
            </span>
          </a>
        ))}
      </div>
    </NavMenuShell>
  );
}

function NavTradesMenu() {
  return (
    <NavMenuShell width={620}>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'rgba(245,242,236,0.45)',
          textTransform: 'uppercase',
          padding: '6px 10px 12px',
        }}
      >
        Dedicated pages by trade
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {NAV_TRADES.map((n) => (
          <a
            key={n.href}
            href={n.href}
            style={{
              display: 'flex',
              gap: 10,
              padding: '12px 12px',
              textDecoration: 'none',
              color: '#F5F2EC',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,242,236,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
              <NavIcon name={n.icon} size={20} />
            </span>
            <span className="display" style={{ fontSize: 14, letterSpacing: '-0.01em' }}>
              {n.label}
            </span>
          </a>
        ))}
      </div>
      <a
        href="/window-cleaning-marketing/"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          padding: '14px 12px',
          background: 'rgba(242,92,31,0.12)',
          textDecoration: 'none',
          color: 'var(--accent)',
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        <span>View all trades we serve</span>
        <Arrow size={14} />
      </a>
    </NavMenuShell>
  );
}

function NavAboutMenu({
  goScroll,
  setOpen,
}: {
  goScroll: (id: string) => void;
  setOpen: (m: OpenMenu) => void;
}) {
  const items: Array<{
    icon: 'about' | 'process' | 'careers' | 'blog' | 'faq';
    t: string;
    onClick?: () => void;
    href?: string;
  }> = [
    {
      icon: 'about',
      t: 'About',
      onClick: () => {
        setOpen(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      icon: 'process',
      t: 'Our Process',
      onClick: () => {
        setOpen(null);
        goScroll('process');
      },
    },
    { icon: 'careers', t: 'Careers', href: '#careers' },
    { icon: 'blog', t: 'Blog', href: '#blog' },
    {
      icon: 'faq',
      t: 'FAQ',
      onClick: () => {
        setOpen(null);
        goScroll('faq');
      },
    },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        width: 240,
        background: '#111',
        border: '1px solid rgba(245,242,236,0.12)',
        borderTop: '2px solid var(--accent)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        padding: 14,
        zIndex: 60,
      }}
    >
      {items.map((it) =>
        it.onClick ? (
          <button
            key={it.t}
            onClick={it.onClick}
            style={{
              width: '100%',
              display: 'flex',
              gap: 12,
              padding: '13px 12px',
              textAlign: 'left',
              color: '#F5F2EC',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,242,236,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
              <AboutIcon name={it.icon} />
            </span>
            <span className="display" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>
              {it.t}
            </span>
          </button>
        ) : (
          <a
            key={it.t}
            href={it.href}
            style={{
              display: 'flex',
              gap: 12,
              padding: '13px 12px',
              textDecoration: 'none',
              color: '#F5F2EC',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,242,236,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
              <AboutIcon name={it.icon} />
            </span>
            <span className="display" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>
              {it.t}
            </span>
          </a>
        )
      )}
    </div>
  );
}
