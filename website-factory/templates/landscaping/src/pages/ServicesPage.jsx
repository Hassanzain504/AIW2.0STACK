import Navbar from '../components/Navbar.jsx';
import ServiceSplit from '../components/ServiceSplit.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import Footer from '../components/Footer.jsx';
import StickyMobileBar from '../components/StickyMobileBar.jsx';
import brandDNA from '../config/brand-dna.js';

/**
 * ServicesPage.jsx
 * Full services listing page.
 * Route: /services
 */
export default function ServicesPage() {
  const { company } = brandDNA;

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[rgb(var(--neutral))] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-[rgb(var(--primary))] mb-4">
              Landscaping Services
            </h1>
            <p className="text-[rgb(var(--ink))/70] text-lg max-w-2xl mx-auto">
              Everything your yard needs, from weekly lawn care to a complete outdoor transformation.
              Serving {company?.serviceRegion || 'your area'}.
            </p>
          </div>
        </section>
        <ServiceSplit />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}
