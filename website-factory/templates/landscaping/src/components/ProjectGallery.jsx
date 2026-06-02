import { useState } from 'react';
import brandDNA from '../config/brand-dna.js';

/**
 * ProjectGallery.jsx
 * Filterable project photo grid with tabs.
 * Wireframe: Section 4.
 */
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'lawn-care', label: 'Lawn Care' },
  { key: 'patios', label: 'Patios + Hardscape' },
  { key: 'planting', label: 'Planting + Beds' },
  { key: 'transformations', label: 'Full Transformations' },
  { key: 'before-after', label: 'Before + After' },
];

export default function ProjectGallery() {
  const { gallery } = brandDNA;
  const items = gallery?.items || [];
  const [active, setActive] = useState('all');

  const visible = active === 'all'
    ? items
    : items.filter((item) => item.category === active);

  return (
    <section
      id="gallery"
      className="bg-[rgb(var(--neutral-dim))] py-16 sm:py-20"
      aria-label="Project gallery"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-[rgb(var(--primary))] mb-3">
            Our Work
          </h2>
          <p className="text-[rgb(var(--ink))/70]">
            Real projects for real homeowners in {brandDNA.company?.serviceRegion || 'your area'}.
          </p>
        </div>

        {/* Filter tabs */}
        <div
          className="flex flex-wrap gap-2 justify-center mb-8"
          role="tablist"
          aria-label="Filter projects by type"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={active === f.key}
              onClick={() => setActive(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                active === f.key
                  ? 'bg-[rgb(var(--primary))] text-white'
                  : 'bg-white text-[rgb(var(--ink))] hover:bg-[rgb(var(--neutral))] border border-[rgb(var(--silver))]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((item, i) => (
              <article
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-sm group"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[rgb(var(--neutral))]">
                  <img
                    src={item.src}
                    alt={item.alt || item.label || 'Landscaping project'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width="480"
                    height="360"
                  />
                </div>
                <div className="p-4">
                  {item.label && (
                    <p className="text-xs font-semibold text-[rgb(var(--accent-dark))] uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                  )}
                  {item.area && (
                    <p className="text-sm text-[rgb(var(--ink))]">{item.area}</p>
                  )}
                  {item.investmentRange && (
                    <p className="text-xs text-[rgb(var(--ink))/60] mt-1">{item.investmentRange}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-[rgb(var(--ink))/60] py-12">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
