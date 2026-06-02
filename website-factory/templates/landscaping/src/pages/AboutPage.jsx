import Navbar from '../components/Navbar.jsx';
import TeamSection from '../components/TeamSection.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import Footer from '../components/Footer.jsx';
import StickyMobileBar from '../components/StickyMobileBar.jsx';
import brandDNA from '../config/brand-dna.js';

/**
 * AboutPage.jsx
 * About the company and team.
 * Route: /about
 */
export default function AboutPage() {
  const { company } = brandDNA;

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[rgb(var(--neutral))] py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-[rgb(var(--primary))] mb-4">
              About {company?.name || 'Us'}
            </h1>
            <p className="text-[rgb(var(--ink))/70] text-lg">
              {company?.description || 'A local landscaping company built on honest work, written agreements, and a yard you are proud to come home to.'}
            </p>
          </div>
        </section>
        <TeamSection />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}
