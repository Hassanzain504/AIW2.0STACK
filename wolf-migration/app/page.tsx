import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Work from '@/components/Work';
import Principles from '@/components/Principles';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <Process />
      <Work />
      <Principles />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
