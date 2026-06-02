import { useState } from 'react';
import brandDNA from '../config/brand-dna.js';

/**
 * FAQSection.jsx
 * Accordion FAQ targeting homeowner decision-moment questions.
 * Wireframe: Section 9.
 */
const DEFAULT_FAQS = [
  {
    question: 'How much does a backyard transformation cost?',
    answer: 'Most backyard projects in our area range from $8,000 to $40,000 depending on size, materials, and scope. We give you a firm written quote after the free yard assessment so you know the exact number before any work starts.',
  },
  {
    question: 'Do you offer financing?',
    answer: 'Yes. We work with several financing partners so you can spread the cost over 12 to 60 months. Ask us about current rates when you call for your free estimate.',
  },
  {
    question: 'What if I need to change the design after we start?',
    answer: 'Any change to scope gets a written change order with an updated price before we touch anything. You approve it first. No surprises.',
  },
  {
    question: 'How long does a typical installation take?',
    answer: 'A patio or planting bed project typically takes 2 to 5 days. A full backyard transformation can take 1 to 3 weeks. We give you a timeline in writing as part of your proposal.',
  },
  {
    question: 'What do I need to do before the crew arrives?',
    answer: 'Clear access to the work area and make sure any gates or doors are unlocked. We handle the rest. We will walk you through the pre-visit checklist when we confirm your start date.',
  },
  {
    question: 'What happens if something gets damaged during the project?',
    answer: 'We are fully insured. Any damage caused by our crew is covered and repaired at our expense. We can provide our certificate of insurance before work starts.',
  },
  {
    question: 'Can I see photos of your past work before I decide?',
    answer: 'Yes. Our gallery above shows real projects with investment ranges and locations. We can also share additional photos from specific neighborhoods or project types when you call.',
  },
  {
    question: 'What is included in weekly lawn care?',
    answer: 'Mowing, edging, blowing off hard surfaces, and a quality check at the end of every visit. Fertilization, weed control, and seasonal cleanups are add-on services we can quote separately.',
  },
];

export default function FAQSection() {
  const { faq } = brandDNA;
  const items = faq?.items || DEFAULT_FAQS;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="bg-[rgb(var(--neutral-dim))] py-16 sm:py-20"
      aria-label="Frequently asked questions"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-[rgb(var(--primary))] mb-3">
            Questions Homeowners Ask
          </h2>
          <p className="text-[rgb(var(--ink))/70]">
            The things people Google before they call. Answered here.
          </p>
        </div>

        <dl className="space-y-2">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-lg border border-[rgb(var(--silver))/40] overflow-hidden"
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-[rgb(var(--ink))] text-sm sm:text-base hover:bg-[rgb(var(--neutral))/50] transition-colors duration-150 min-h-[52px]"
                  >
                    <span>{item.question}</span>
                    <span
                      className={`ml-4 flex-shrink-0 w-5 h-5 text-[rgb(var(--primary))] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                </dt>
                {isOpen && (
                  <dd className="px-6 pb-4 text-sm text-[rgb(var(--ink))/80] leading-relaxed border-t border-[rgb(var(--silver))/30]">
                    <p className="pt-4">{item.answer}</p>
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
