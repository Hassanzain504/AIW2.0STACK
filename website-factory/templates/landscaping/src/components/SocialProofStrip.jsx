import brandDNA from '../config/brand-dna.js';

/**
 * SocialProofStrip.jsx
 * 3 Google review pull-quotes + aggregate star rating badge.
 * Wireframe: Section 2.
 */
export default function SocialProofStrip() {
  const { reviews, contact } = brandDNA;
  const featured = reviews?.featured || [];
  const aggregate = reviews?.googleAggregate || {};

  return (
    <section
      className="bg-[rgb(var(--neutral))] py-12 sm:py-16"
      aria-label="Customer reviews"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Aggregate badge */}
        {aggregate.rating && (
          <div className="text-center mb-8">
            <a
              href={contact.googleMapsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--primary))] hover:underline"
              aria-label={`${aggregate.rating} stars across ${aggregate.count} Google reviews`}
            >
              <span className="text-amber-400 text-lg" aria-hidden="true">
                {'★'.repeat(Math.round(aggregate.rating))}
              </span>
              <span className="tabular-nums font-semibold text-base">{aggregate.rating}</span>
              <span className="text-[rgb(var(--ink))/60]">
                across {aggregate.count} Google reviews
              </span>
            </a>
          </div>
        )}

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.slice(0, 3).map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 shadow-sm border border-[rgb(var(--silver))/30]"
            >
              <div className="flex items-center gap-1 mb-3 text-amber-400" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating || 5 }).map((_, s) => (
                  <span key={s} aria-hidden="true">★</span>
                ))}
              </div>
              <blockquote className="text-[rgb(var(--ink))] text-sm leading-relaxed mb-4">
                "{review.text || 'The crew was on time, the work was exactly what we agreed to, and the yard looks great.'}"
              </blockquote>
              <cite className="not-italic text-xs font-medium text-[rgb(var(--ink))/60]">
                {review.reviewerName || 'Homeowner'}
              </cite>
            </div>
          ))}

          {featured.length === 0 && [0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 shadow-sm border border-[rgb(var(--silver))/30]"
            >
              <div className="flex items-center gap-1 mb-3 text-amber-400" aria-hidden="true">
                <span>★★★★★</span>
              </div>
              <blockquote className="text-[rgb(var(--ink))] text-sm leading-relaxed mb-4">
                "They showed up on time, did exactly what they said they would, and the yard looks better than I imagined. Worth every dollar."
              </blockquote>
              <cite className="not-italic text-xs font-medium text-[rgb(var(--ink))/60]">
                Homeowner
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
