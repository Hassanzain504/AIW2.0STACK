import { useState } from 'react';
import brandDNA from '../config/brand-dna.js';

/**
 * Navbar.jsx
 * Sticky top nav. Logo left, links center, phone + CTA right.
 * Hamburger on mobile.
 * Wireframe: Persistent element.
 */
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Our Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { company, contact, copy } = brandDNA;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[rgb(var(--silver))/40] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / brand name */}
          <a
            href="/"
            className="flex-shrink-0 flex items-center gap-2"
            aria-label={`${company?.name || 'Home'} homepage`}
          >
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-8 w-auto"
                loading="eager"
              />
            ) : (
              <span className="font-['Playfair_Display'] font-bold text-lg text-[rgb(var(--primary))]">
                {company?.shortName || company?.name || 'Landscaping Co.'}
              </span>
            )}
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[rgb(var(--ink))/70] hover:text-[rgb(var(--primary))] transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={contact?.phoneTelLink || 'tel:+10000000000'}
              className="text-sm font-semibold text-[rgb(var(--primary))] hover:underline"
              aria-label={`Call ${contact?.phone}`}
            >
              {contact?.phone || '(555) 000-0000'}
            </a>
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-[rgb(var(--primary))] text-white text-sm font-semibold hover:bg-[rgb(var(--primary-dark))] transition-colors duration-200 min-h-[40px]"
            >
              {copy?.ctaPrimary || 'Free Estimate'}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-[rgb(var(--ink))/60] hover:text-[rgb(var(--primary))] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-white border-t border-[rgb(var(--silver))/30] px-4 py-4 space-y-1"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2.5 text-sm font-medium text-[rgb(var(--ink))] hover:text-[rgb(var(--primary))] min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[rgb(var(--silver))/30] space-y-2">
            <a
              href={contact?.phoneTelLink || 'tel:+10000000000'}
              className="block px-2 py-2.5 text-sm font-semibold text-[rgb(var(--primary))] min-h-[44px] flex items-center"
            >
              {contact?.phone || '(555) 000-0000'}
            </a>
            <a
              href="#lead-form"
              onClick={() => setMenuOpen(false)}
              className="block text-center px-4 py-3 rounded-md bg-[rgb(var(--primary))] text-white text-sm font-semibold min-h-[48px] flex items-center justify-center"
            >
              {copy?.ctaPrimary || 'Free Estimate'}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
