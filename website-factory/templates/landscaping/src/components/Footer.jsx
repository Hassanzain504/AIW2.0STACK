import brandDNA from '../config/brand-dna.js';

/**
 * Footer.jsx
 * 3-column desktop footer: brand + nav + contact.
 * Wireframe: Section 11.
 */
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Our Work' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export default function Footer() {
  const { company, contact, social } = brandDNA;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[rgb(var(--primary-dark))] text-white/80 pt-12 pb-20 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand column */}
          <div>
            <p className="font-['Playfair_Display'] font-bold text-white text-lg mb-2">
              {company?.name || 'Your Landscaping Company'}
            </p>
            {company?.tagline && (
              <p className="text-sm text-white/60 mb-4">{company.tagline}</p>
            )}
            {company?.licenseNumber && (
              <p className="text-xs text-white/50">License: {company.licenseNumber}</p>
            )}
            <p className="text-xs text-white/50 mt-1">
              Fully insured. Certificate available on request.
            </p>
          </div>

          {/* Nav column */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Quick Links</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Contact</p>
            <div className="space-y-2">
              {contact?.phone && (
                <a
                  href={contact.phoneTelLink}
                  className="block text-sm text-white/80 hover:text-white transition-colors duration-150"
                  aria-label={`Call us at ${contact.phone}`}
                >
                  {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="block text-sm text-white/80 hover:text-white transition-colors duration-150"
                >
                  {contact.email}
                </a>
              )}
              {contact?.googleMapsUrl && (
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-white/80 hover:text-white transition-colors duration-150"
                >
                  Leave us a Google review
                </a>
              )}
            </div>

            {/* Social links */}
            <div className="flex gap-4 mt-4">
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors duration-150"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors duration-150"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-white/40 text-center">
          &copy; {currentYear} {company?.name || 'Your Landscaping Company'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
