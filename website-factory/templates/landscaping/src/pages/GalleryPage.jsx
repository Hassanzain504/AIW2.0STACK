import Navbar from '../components/Navbar.jsx';
import ProjectGallery from '../components/ProjectGallery.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import Footer from '../components/Footer.jsx';
import StickyMobileBar from '../components/StickyMobileBar.jsx';

/**
 * GalleryPage.jsx
 * Project gallery page showing full project portfolio.
 * Route: /gallery
 */
export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[rgb(var(--neutral))] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-[rgb(var(--primary))] mb-4">
              Our Work
            </h1>
            <p className="text-[rgb(var(--ink))/70] text-lg max-w-2xl mx-auto">
              Real projects, real homeowners. Every photo is from an actual job we completed.
            </p>
          </div>
        </section>
        <ProjectGallery />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}
