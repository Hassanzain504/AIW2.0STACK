import Navbar from '../components/Navbar.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import ServiceAreaSection from '../components/ServiceAreaSection.jsx';
import Footer from '../components/Footer.jsx';
import StickyMobileBar from '../components/StickyMobileBar.jsx';
import brandDNA from '../config/brand-dna.js';

/**
 * ContactPage.jsx
 * Contact and service area page.
 * Route: /contact
 */
export default function ContactPage() {
  const { company, contact } = brandDNA;

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[rgb(var(--neutral))] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-[rgb(var(--primary))] mb-4">
              Get in Touch
            </h1>
            <p className="text-[rgb(var(--ink))/70] text-lg mb-4">
              Free estimates. No pressure. We respond within {company?.responseTime || '24 hours'}.
            </p>
            {contact?.phone && (
              <a
                href={contact.phoneTelLink}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[rgb(var(--primary))] text-white font-semibold text-base hover:bg-[rgb(var(--primary-dark))] transition-colors duration-200 min-h-[48px]"
                aria-label={`Call us at ${contact.phone}`}
              >
                Call {contact.phone}
              </a>
            )}
          </div>
        </section>
        <FinalCTA />
        <ServiceAreaSection />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}
