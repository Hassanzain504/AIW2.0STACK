import brandDNA from '../config/brand-dna.js';

/**
 * Hero.jsx
 * Full-bleed background image hero with dark overlay, H1, subhead with
 * phone tap-to-call, dual CTAs, and trust bar.
 * Wireframe: Section 1.
 */
export default function Hero() {
  const { company, contact, hero, trustBar } = brandDNA;

  return (
    <section
      className="relative min-h-[600px] flex flex-col justify-center bg-[rgb(var(--primary))]"
      aria-label="Hero"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero?.backgroundImage || '/work/hero.jpg'})` }}
        role="img"
        aria-label={hero?.backgroundAlt || `Landscaped yard by ${company.name}`}
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">
          {hero?.heading || (company.serviceRegion
            ? `Your Vision. Our Work. ${company.serviceRegion} Landscaping Specialists.`
            : 'Your Vision. Our Work. Local Landscaping Specialists.')}
        </h1>

        <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          {hero?.subheading || 'From weekly lawn care to full backyard transformations.'}{' '}
          Call us:{' '}
          <a
            href={contact.phoneTelLink}
            className="font-semibold underline decoration-white/60 hover:decoration-white transition-all duration-200"
            aria-label={`Call ${company.name} at ${contact.phone}`}
          >
            {contact.phone}
          </a>
        </p>

        {/* Dual CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="#gallery"
            className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-[rgb(var(--accent))] text-white font-semibold text-base hover:bg-[rgb(var(--accent-dark))] transition-colors duration-200 min-h-[48px]"
          >
            See Our Work
          </a>
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center px-8 py-4 rounded-md border-2 border-white text-white font-semibold text-base hover:bg-white hover:text-[rgb(var(--primary))] transition-colors duration-200 min-h-[48px]"
          >
            Get a Free Estimate
          </a>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/80">
          {trustBar?.yearsInBusiness && (
            <span>{trustBar.yearsInBusiness} Years in Business</span>
          )}
          {trustBar?.projectsCompleted && (
            <span>{trustBar.projectsCompleted}+ Projects Completed</span>
          )}
          <span>{company.serviceRegion}-Based</span>
          <span>Licensed and Insured</span>
        </div>
      </div>
    </section>
  );
}
