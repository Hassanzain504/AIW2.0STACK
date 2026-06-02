import brandDNA from '../config/brand-dna.js';

/**
 * StickyMobileBar.jsx
 * Fixed bottom bar on mobile with Call Now + Get a Quote buttons.
 * Hidden on md+ screens.
 * Wireframe: Persistent element.
 */
export default function StickyMobileBar() {
  const { contact, copy } = brandDNA;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[rgb(var(--silver))/50] px-4 py-3 flex gap-3 shadow-lg"
      role="navigation"
      aria-label="Mobile quick actions"
    >
      <a
        href={contact?.phoneTelLink || 'tel:+10000000000'}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-[rgb(var(--primary))] text-white font-semibold text-sm min-h-[48px]"
        aria-label={`Call us at ${contact?.phone}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
        Call Now
      </a>
      <a
        href="#lead-form"
        className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-md bg-[rgb(var(--accent))] text-white font-semibold text-sm min-h-[48px]"
      >
        {copy?.ctaPrimary || 'Get a Quote'}
      </a>
    </div>
  );
}
