import brandDNA from '../config/brand-dna.js';

/**
 * TeamSection.jsx
 * Owner card + crew member cards. Real photos required.
 * Wireframe: Section 6.
 */
export default function TeamSection() {
  const { team } = brandDNA;
  const founder = team?.founder || {};
  const crew = team?.crew || [];

  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-label="Meet our team"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-[rgb(var(--primary))] mb-3">
            The People Behind the Work
          </h2>
          <p className="text-[rgb(var(--ink))/70] max-w-lg mx-auto">
            You hire a company, but you work with a person. Here is who that is.
          </p>
        </div>

        {/* Owner card */}
        <div className="bg-[rgb(var(--neutral))] rounded-xl p-8 mb-8 flex flex-col sm:flex-row gap-6 items-start">
          {founder.photo && (
            <img
              src={founder.photo}
              alt={`${founder.displayName || founder.name}, ${founder.title}`}
              className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-2 border-[rgb(var(--accent))/30]"
              loading="lazy"
              width="96"
              height="96"
            />
          )}
          {!founder.photo && (
            <div
              className="w-24 h-24 rounded-full bg-[rgb(var(--primary))/10] flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <span className="text-2xl font-bold text-[rgb(var(--primary))]">
                {(founder.displayName || founder.name || 'O').charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-['Playfair_Display'] font-bold text-xl text-[rgb(var(--primary))] mb-1">
              {founder.displayName || founder.name || 'Owner'}
            </h3>
            <p className="text-sm font-medium text-[rgb(var(--accent-dark))] mb-3">
              {founder.title || 'Founder'}
              {founder.yearsExp && ` - ${founder.yearsExp} years in landscaping`}
            </p>
            <p className="text-[rgb(var(--ink))] text-sm leading-relaxed">
              {founder.bio || 'Started this company because I believed homeowners deserved a landscaper who shows up when they say they will and does what they agreed to. Every project gets my personal attention.'}
            </p>
          </div>
        </div>

        {/* Crew cards */}
        {crew.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crew.slice(0, 3).map((member, i) => (
              <div
                key={i}
                className="bg-[rgb(var(--neutral))] rounded-lg p-5 flex items-center gap-4"
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={`${member.firstName}, ${member.role}`}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                    width="56"
                    height="56"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full bg-[rgb(var(--accent))/15] flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <span className="text-lg font-bold text-[rgb(var(--accent-dark))]">
                      {(member.firstName || 'C').charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[rgb(var(--primary))] text-sm">{member.firstName}</p>
                  <p className="text-xs text-[rgb(var(--ink))/60]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
