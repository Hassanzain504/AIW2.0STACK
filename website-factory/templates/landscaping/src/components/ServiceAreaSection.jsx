import brandDNA from '../config/brand-dna.js';

/**
 * ServiceAreaSection.jsx
 * City/neighborhood tag list with optional map embed.
 * Wireframe: Section 8.
 */
export default function ServiceAreaSection() {
  const { serviceArea, contact } = brandDNA;
  const cities = serviceArea?.cities || [];
  const embedUrl = contact?.mapsEmbedUrl;

  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-label="Service area"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* City list */}
          <div>
            <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-[rgb(var(--primary))] mb-4">
              Where We Work
            </h2>
            <p className="text-[rgb(var(--ink))/70] mb-6">
              We serve homeowners in these areas. Not sure if we cover your neighborhood? Call us.
            </p>
            {cities.length > 0 ? (
              <ul className="flex flex-wrap gap-2" aria-label="Service cities and neighborhoods">
                {cities.map((city, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 bg-[rgb(var(--neutral))] rounded-full text-sm font-medium text-[rgb(var(--ink))] border border-[rgb(var(--silver))/50]"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[rgb(var(--ink))/60]">Service area cities to be added.</p>
            )}
          </div>

          {/* Map embed */}
          {embedUrl ? (
            <div className="rounded-xl overflow-hidden shadow-sm border border-[rgb(var(--silver))/30] h-64 md:h-80">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Service area map"
              />
            </div>
          ) : (
            <div
              className="rounded-xl bg-[rgb(var(--neutral))] h-64 md:h-80 flex items-center justify-center"
              aria-hidden="true"
            >
              <p className="text-sm text-[rgb(var(--ink))/40]">Map embed</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
