import Navbar from '../components/Navbar.jsx';
import ProjectGallery from '../components/ProjectGallery.jsx';
import DepositProtection from '../components/DepositProtection.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import Footer from '../components/Footer.jsx';
import StickyMobileBar from '../components/StickyMobileBar.jsx';
import brandDNA from '../config/brand-dna.js';

/**
 * DesignInstallPage.jsx
 * Full service page for landscape design and installation.
 * Targets "landscape design [city]" queries.
 * Route: /landscape-design
 */
export default function DesignInstallPage() {
  const { company, services } = brandDNA;
  const designInstall = services?.designInstall || {};

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[rgb(var(--neutral))] py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-[rgb(var(--primary))] mb-4">
              Landscape Design and Installation in {company?.serviceRegion || 'Your Area'}
            </h1>
            <p className="text-[rgb(var(--ink))/70] text-lg mb-6">
              From a new patio to a complete backyard transformation. We design it, you approve it, we build it on your timeline.
            </p>
            <ul className="space-y-3 text-[rgb(var(--ink))] text-base">
              {(designInstall.projectTypes || [
                'Natural stone patios and pathways',
                'Custom planting beds and garden design',
                'Outdoor lighting systems',
                'Retaining walls and grading',
                'Full backyard transformations',
                'Water features and drainage solutions',
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[rgb(var(--primary))] flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <ProjectGallery />
        <DepositProtection />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}
