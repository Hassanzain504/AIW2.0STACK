import { useState } from 'react';
import brandDNA from '../config/brand-dna.js';

/**
 * HowItWorks.jsx
 * Two parallel 3-step process tracks: maintenance vs design+install.
 * Wireframe: Section 7.
 */
const TRACKS = [
  {
    key: 'maintenance',
    label: 'Lawn Care',
    steps: [
      { title: 'Free quote', body: 'Tell us about your yard. We give you a firm price with no surprises.' },
      { title: 'Schedule your first visit', body: 'Pick a day that works. We show up on time with the right equipment.' },
      { title: 'Consistent service every week', body: 'Same crew, same standard, every single visit.' },
    ],
  },
  {
    key: 'design',
    label: 'Design + Install',
    steps: [
      { title: 'Free yard assessment', body: 'We walk your property and listen to what you want to achieve.' },
      { title: 'Design proposal with visuals', body: 'You see the plan and approve it before any work begins.' },
      { title: 'Build on your timeline', body: 'We install on the schedule we agreed to and clean up when we are done.' },
    ],
  },
];

export default function HowItWorks() {
  const [activeTrack, setActiveTrack] = useState('maintenance');
  const track = TRACKS.find((t) => t.key === activeTrack) || TRACKS[0];

  return (
    <section
      className="bg-[rgb(var(--neutral))] py-16 sm:py-20"
      aria-label="How we work"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-[rgb(var(--primary))] mb-3">
            How It Works
          </h2>
          <p className="text-[rgb(var(--ink))/70]">
            Simple process, clear expectations, no chasing.
          </p>
        </div>

        {/* Track switcher */}
        <div
          className="flex justify-center gap-2 mb-10"
          role="tablist"
          aria-label="Service track"
        >
          {TRACKS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTrack === t.key}
              onClick={() => setActiveTrack(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 min-h-[44px] ${
                activeTrack === t.key
                  ? 'bg-[rgb(var(--primary))] text-white'
                  : 'bg-white text-[rgb(var(--ink))] border border-[rgb(var(--silver))] hover:bg-[rgb(var(--neutral-dim))]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <ol className="space-y-6">
          {track.steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-5 items-start"
            >
              <div
                className="w-10 h-10 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm"
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-[rgb(var(--ink))] mb-1">{step.title}</h3>
                <p className="text-sm text-[rgb(var(--ink))/70] leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
