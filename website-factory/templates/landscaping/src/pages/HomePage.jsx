import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import SocialProofStrip from '../components/SocialProofStrip.jsx';
import ServiceSplit from '../components/ServiceSplit.jsx';
import ProjectGallery from '../components/ProjectGallery.jsx';
import DepositProtection from '../components/DepositProtection.jsx';
import TeamSection from '../components/TeamSection.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import ServiceAreaSection from '../components/ServiceAreaSection.jsx';
import FAQSection from '../components/FAQSection.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import Footer from '../components/Footer.jsx';
import StickyMobileBar from '../components/StickyMobileBar.jsx';

/**
 * HomePage.jsx
 * Assembles all 11 wireframe sections in order.
 * Route: /
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProofStrip />
        <ServiceSplit />
        <ProjectGallery />
        <DepositProtection />
        <TeamSection />
        <HowItWorks />
        <ServiceAreaSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}
