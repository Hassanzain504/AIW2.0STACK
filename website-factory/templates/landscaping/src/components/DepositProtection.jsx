import brandDNA from '../config/brand-dna.js';

/**
 * DepositProtection.jsx
 * Standalone section addressing the homeowner's #1 fear: losing their deposit.
 * Wireframe: Section 5.
 */
export default function DepositProtection() {
  const { depositProtection } = brandDNA;

  return (
    <section
      className="bg-[rgb(var(--primary))/5] py-16 sm:py-20 border-y border-[rgb(var(--primary))/10]"
      aria-label="Deposit protection guarantee"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Shield icon */}
        <div
          className="w-16 h-16 rounded-full bg-[rgb(var(--primary))/10] flex items-center justify-center mx-auto mb-6"
          aria-hidden="true"
        >
          <svg className="w-8 h-8 text-[rgb(var(--primary))]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-[rgb(var(--primary))] mb-4">
          Your Deposit Is Protected
        </h2>

        <p className="text-[rgb(var(--ink))] text-base sm:text-lg leading-relaxed">
          {depositProtection?.body ||
            'Every project starts with a written contract that specifies scope, timeline, payment schedule, and what happens if anything changes. You know exactly what you are paying for before any work begins. No surprises, no hidden charges, no chasing anyone for a refund.'}
        </p>

        {depositProtection?.badgeUrl && (
          <img
            src={depositProtection.badgeUrl}
            alt="Guarantee badge"
            className="mt-8 mx-auto h-16 w-auto"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
}
