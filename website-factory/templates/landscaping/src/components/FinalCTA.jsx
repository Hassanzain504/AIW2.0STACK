import { useState } from 'react';
import brandDNA from '../config/brand-dna.js';

/**
 * FinalCTA.jsx
 * Full-width green background, inline lead form.
 * Wireframe: Section 10.
 */
export default function FinalCTA() {
  const { copy, contact, company } = brandDNA;
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Stage 10.1 wires the actual form submission endpoint.
    setSubmitted(true);
  }

  return (
    <section
      id="lead-form"
      className="bg-[rgb(var(--primary))] py-16 sm:py-20"
      aria-label="Get a free estimate"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-white mb-4">
          Ready to See What Your Yard Could Look Like?
        </h2>
        <p className="text-white/80 mb-8">
          Free estimates, no pressure, and a real response within{' '}
          {company?.responseTime || '24 hours'}.
        </p>

        {submitted ? (
          <div className="bg-white/10 rounded-xl p-8 text-white">
            <p className="text-xl font-semibold mb-2">Got it. Thank you.</p>
            <p className="text-white/80">
              {copy?.thankYouMessage ||
                `We will reach out within ${company?.responseTime || '24 hours'} to schedule your free estimate.`}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 sm:p-8 text-left space-y-4"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lead-name" className="block text-xs font-semibold text-[rgb(var(--ink))/70] mb-1 uppercase tracking-wide">
                  Your name
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-md border border-[rgb(var(--silver))] text-sm text-[rgb(var(--ink))] bg-[rgb(var(--neutral))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))/40] min-h-[48px]"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label htmlFor="lead-phone" className="block text-xs font-semibold text-[rgb(var(--ink))/70] mb-1 uppercase tracking-wide">
                  Phone number
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="w-full px-4 py-3 rounded-md border border-[rgb(var(--silver))] text-sm text-[rgb(var(--ink))] bg-[rgb(var(--neutral))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))/40] min-h-[48px]"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead-email" className="block text-xs font-semibold text-[rgb(var(--ink))/70] mb-1 uppercase tracking-wide">
                Email address
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-md border border-[rgb(var(--silver))] text-sm text-[rgb(var(--ink))] bg-[rgb(var(--neutral))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))/40] min-h-[48px]"
                placeholder="jane@email.com"
              />
            </div>

            <div>
              <label htmlFor="lead-project" className="block text-xs font-semibold text-[rgb(var(--ink))/70] mb-1 uppercase tracking-wide">
                Describe your project (optional)
              </label>
              <textarea
                id="lead-project"
                name="project"
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-[rgb(var(--silver))] text-sm text-[rgb(var(--ink))] bg-[rgb(var(--neutral))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))/40] resize-none"
                placeholder="Tell us what you are thinking. No detail is too small."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 rounded-md bg-[rgb(var(--primary))] text-white font-semibold text-base hover:bg-[rgb(var(--primary-dark))] transition-colors duration-200 min-h-[52px]"
            >
              {copy?.ctaPrimary || 'Get My Free Estimate'}
            </button>

            <p className="text-xs text-center text-[rgb(var(--ink))/50]">
              {copy?.formPrivacy ||
                'We respond within 24 hours. No spam. Your information is never sold or shared.'}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
