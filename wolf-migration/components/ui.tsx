import React from 'react';

// ----- ICONOGRAPHY (minimal geometric only) -----
export const Dot = ({ c = 'currentColor', s = 8 }: { c?: string; s?: number }) => (
  <span
    style={{
      display: 'inline-block',
      width: s,
      height: s,
      borderRadius: 99,
      background: c,
      verticalAlign: 'middle',
    }}
  />
);

export const Arrow = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ verticalAlign: 'middle' }}>
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
);

// Tape (construction hazard) stripe block
export const Tape = ({
  h = 10,
  dark = false,
  style = {},
}: {
  h?: number;
  dark?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      height: h,
      backgroundImage: `repeating-linear-gradient(135deg, var(--accent) 0 18px, ${
        dark ? '#0E0E0E' : '#141414'
      } 18px 32px)`,
      ...style,
    }}
  />
);

// Striped placeholder for imagery
export const Placeholder = ({
  label,
  ratio = '4/3',
  dark = false,
  style = {},
}: {
  label: string;
  ratio?: string;
  dark?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      position: 'relative',
      aspectRatio: ratio,
      background: dark ? '#1A1A1A' : '#E0DBCF',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg, transparent 0 14px, ${
          dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'
        } 14px 15px)`,
      }}
    />
    <div
      className="mono"
      style={{
        position: 'absolute',
        left: 10,
        bottom: 8,
        fontSize: 10,
        letterSpacing: '0.08em',
        color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
    <div
      className="mono"
      style={{
        position: 'absolute',
        right: 10,
        top: 8,
        fontSize: 10,
        letterSpacing: '0.08em',
        color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
      }}
    >
      [ img ]
    </div>
  </div>
);

// ----- NAV ICONS (match Trades We Serve page) -----
type IconName =
  | 'general'
  | 'remodel'
  | 'roofing'
  | 'builders'
  | 'commercial'
  | 'plumbing'
  | 'electrician'
  | 'hvac'
  | 'window';

export const NavIcon = ({
  name,
  size = 22,
  stroke = 1.6,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
}) => {
  const pr = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
  };
  const paths: Record<IconName, React.ReactNode> = {
    general: (
      <g {...pr}>
        <path d="M3 21h18" />
        <path d="M5 21V9l7-5 7 5v12" />
        <path d="M10 21v-5h4v5" />
      </g>
    ),
    remodel: (
      <g {...pr}>
        <path d="M3 21h18" />
        <path d="M14 4l6 6-9 9H5v-6z" />
        <path d="M12 6l6 6" />
      </g>
    ),
    roofing: (
      <g {...pr}>
        <path d="M2 12L12 4l10 8" />
        <path d="M5 11v9h14v-9" />
        <path d="M9 20v-5h6v5" />
      </g>
    ),
    builders: (
      <g {...pr}>
        <path d="M4 21V8l8-5 8 5v13" />
        <path d="M4 12h16M9 3v18M15 3v18" />
      </g>
    ),
    commercial: (
      <g {...pr}>
        <path d="M4 21V4h10v17" />
        <path d="M14 9h6v12" />
        <path d="M7 8h3M7 12h3M7 16h3M17 13h1M17 17h1" />
      </g>
    ),
    plumbing: (
      <g {...pr}>
        <path d="M7 3v6a4 4 0 0 0 4 4h2a4 4 0 0 1 4 4v4" />
        <path d="M4 3h6M14 21h6" />
      </g>
    ),
    electrician: (
      <g {...pr}>
        <path d="M13 2L4 14h7l-2 8 9-12h-7z" />
      </g>
    ),
    hvac: (
      <g {...pr}>
        <rect x="3" y="4" width="18" height="11" rx="1" />
        <path d="M6 19h4M14 19h4M7 8l3 3 3-3" />
      </g>
    ),
    window: (
      <g {...pr}>
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M12 3v18M4 12h16" />
        <path d="M15.5 7.5l2.5 2" />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      {paths[name] || paths.general}
    </svg>
  );
};

type AboutIconName = 'about' | 'process' | 'careers' | 'blog' | 'faq';

export const AboutIcon = ({ name, size = 20 }: { name: AboutIconName; size?: number }) => {
  const pr = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const paths: Record<AboutIconName, React.ReactNode> = {
    about: (
      <g {...pr}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </g>
    ),
    process: (
      <g {...pr}>
        <path d="M7 17L17 7M9 7h8v8" />
      </g>
    ),
    careers: (
      <g {...pr}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
      </g>
    ),
    blog: (
      <g {...pr}>
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </g>
    ),
    faq: (
      <g {...pr}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4 1.8c0 1.5-2 1.7-2 3M12 16.5h.01" />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      {paths[name]}
    </svg>
  );
};

export function Logo() {
  return (
    <a
      href="#"
      style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28">
        <rect x="0" y="0" width="28" height="28" fill="var(--accent)" />
        <path
          d="M6 8l3 12 3-8 3 8 3-12"
          stroke="#0E0E0E"
          strokeWidth="2.4"
          fill="none"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>
      <span className="display" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>
        WOLF<span style={{ color: 'var(--accent)' }}>/</span>CONTRACTOR
      </span>
    </a>
  );
}

// ----- SECTION HEADER -----
export function SectionLabel({ num, kicker }: { num: string; kicker: string }) {
  return (
    <div
      className="mono"
      style={{
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        opacity: 0.55,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{ color: 'var(--accent)' }}>[{num}]</span>
      <span>{kicker}</span>
      <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.2 }} />
    </div>
  );
}

export function Stat({ big, unit, label }: { big: string; unit: string; label: string }) {
  return (
    <div>
      <div className="display" style={{ fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {big}
        <span style={{ color: 'var(--accent)' }}>{unit && ' ' + unit}</span>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: 0.5,
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Shared nav menu data
export const NAV_TRADES = [
  { icon: 'general' as const, label: 'General Contractors', slug: 'general-contractors' },
  { icon: 'remodel' as const, label: 'Remodeling', slug: 'remodeling' },
  { icon: 'roofing' as const, label: 'Roofing', slug: 'roofing' },
  { icon: 'builders' as const, label: 'Home Builders', slug: 'home-builders' },
  { icon: 'commercial' as const, label: 'Commercial', slug: 'commercial' },
  { icon: 'plumbing' as const, label: 'Plumbing', slug: 'plumbing' },
  { icon: 'electrician' as const, label: 'Electrician', slug: 'electrician' },
  { icon: 'hvac' as const, label: 'HVAC', slug: 'hvac' },
  { icon: 'window' as const, label: 'Window Cleaning', slug: 'window-cleaning' },
];

export const NAV_SERVICES = [
  { icon: 'general' as const, slug: 'custom-trade-sites', t: 'Custom Trade Sites', d: 'Fast, mobile-first sites built to book the call' },
  { icon: 'commercial' as const, slug: 'local-seo', t: 'Local SEO That Ranks', d: 'Own the map pack in every town you serve' },
  { icon: 'electrician' as const, slug: 'google-ads', t: 'Google Ads Management', d: 'Fill the calendar with ready-to-book leads' },
  { icon: 'plumbing' as const, slug: 'lead-funnels', t: 'Lead Gen Funnels', d: 'Quote pages that convert 3–5× better' },
  { icon: 'hvac' as const, slug: 'hosting-speed', t: 'Hosting & Speed', d: 'Sub-1s load times, 99.98% uptime' },
  { icon: 'remodel' as const, slug: 'content-photography', t: 'Content & Photography', d: 'Real shoots of your crew, trucks & jobs' },
];
