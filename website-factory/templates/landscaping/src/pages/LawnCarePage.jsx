import Navbar from '../components/Navbar.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import FAQSection from '../components/FAQSection.jsx';
import Footer from '../components/Footer.jsx';
import StickyMobileBar from '../components/StickyMobileBar.jsx';
import brandDNA from '../config/brand-dna.js';

/**
 * LawnCarePage.jsx
 * Full service page for weekly lawn care. Targets "lawn care [city]" queries.
 * Route: /lawn-care
 */
export default function LawnCarePage() {
  const { company, services } = brandDNA;
  const lawnCare = services?.lawnCare || {};

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[rgb(var(--neutral))] py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-[rgb(var(--primary))] mb-4">
              Lawn Care Services in {company?.serviceRegion || 'Your Area'}
            </h1>
            <p className="text-[rgb(var(--ink))/70] text-lg mb-6">
              Consistent weekly service from a crew that shows up on time and does what they say they will do.
              {lawnCare.priceAnchor && ` ${lawnCare.priceAnchor}.`}
            </p>
            <ul className="space-y-3 text-[rgb(var(--ink))] text-base">
              {(lawnCare.bullets || [
                'Mowing and edging to a clean finish',
                'Fertilization and weed control programs',
                'Spring and fall cleanups',
                'Aerating and overseeding',
                'Same crew every week so we know your yard',
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[rgb(var(--accent))] flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <FinalCTA />
        <FAQSection />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}
