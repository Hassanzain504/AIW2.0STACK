import brandDNA from '../config/brand-dna.js';

/**
 * ServiceSplit.jsx
 * Two-card buyer journey split: Weekly Lawn Care vs Landscape Design + Install.
 * Wireframe: Section 3.
 */
export default function ServiceSplit() {
  const { services } = brandDNA;
  const lawnCare = services?.lawnCare || {};
  const designInstall = services?.designInstall || {};

  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-label="Our services"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-[rgb(var(--primary))] mb-3">
            What We Do
          </h2>
          <p className="text-[rgb(var(--ink))/70] max-w-xl mx-auto">
            Choose the service that fits your yard and your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Lawn Care */}
          <div className="rounded-xl border-2 border-[rgb(var(--primary))/15] bg-[rgb(var(--neutral))] p-8 flex flex-col">
            <div
              className="w-12 h-12 rounded-full bg-[rgb(var(--accent))/15] flex items-center justify-center mb-5"
              aria-hidden="true"
            >
              <svg className="w-6 h-6 text-[rgb(var(--accent-dark))]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.36 18.36l.708.707M3 12H2m20 0h-1M4.929 19.07l.707-.707M18.36 5.64l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>

            <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[rgb(var(--primary))] mb-2">
              Weekly Lawn Care
            </h3>

            {lawnCare.priceAnchor && (
              <p className="text-sm font-semibold text-[rgb(var(--accent-dark))] mb-4">
                {lawnCare.priceAnchor}
              </p>
            )}

            <ul className="space-y-2 mb-8 flex-1">
              {(lawnCare.bullets || [
                'Mowing and edging',
                'Fertilization and weed control',
                'Seasonal cleanup (spring and fall)',
                'Consistent crew, consistent results'
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[rgb(var(--ink))]">
                  <span className="mt-1 w-4 h-4 rounded-full bg-[rgb(var(--accent))/20] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-dark))]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#lead-form"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-md bg-[rgb(var(--primary))] text-white font-semibold text-sm hover:bg-[rgb(var(--primary-dark))] transition-colors duration-200 min-h-[48px]"
            >
              Get a Maintenance Quote
            </a>
          </div>

          {/* Card 2: Design + Install */}
          <div className="rounded-xl border-2 border-[rgb(var(--accent))/30] bg-white p-8 flex flex-col">
            <div
              className="w-12 h-12 rounded-full bg-[rgb(var(--primary))/10] flex items-center justify-center mb-5"
              aria-hidden="true"
            >
              <svg className="w-6 h-6 text-[rgb(var(--primary))]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>

            <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[rgb(var(--primary))] mb-2">
              Landscape Design + Install
            </h3>

            <p className="text-sm text-[rgb(var(--ink))/70] mb-4">
              From a single planting bed to a full backyard transformation.
            </p>

            <ul className="space-y-2 mb-8 flex-1">
              {(designInstall.projectTypes || [
                'Patios and natural stone pathways',
                'Planting beds and garden design',
                'Outdoor lighting installation',
                'Full backyard transformations',
                'Retaining walls and grading'
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[rgb(var(--ink))]">
                  <span className="mt-1 w-4 h-4 rounded-full bg-[rgb(var(--primary))/10] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--primary))]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#lead-form"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-md bg-[rgb(var(--accent))] text-white font-semibold text-sm hover:bg-[rgb(var(--accent-dark))] transition-colors duration-200 min-h-[48px]"
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
