/**
 * Split-form hero.
 *
 * A section PATTERN, not a niche decision. Module 2D copies this file into
 * `templates/{niche-slug}/src/components/Hero.jsx` only when the niche
 * wireframe (`09-wireframe.md`) selects the `hero-split-form` composition.
 * A niche whose research says otherwise gets a different hero.
 *
 * Reads ONLY from the canonical brand-dna shape
 * (`references/brand-dna.shape.js`). No literal client strings, no literal
 * colours. Every colour comes from the Tailwind token bindings that
 * `scripts/inject-theme.mjs` stamps into `:root`.
 *
 * Fields consumed:
 *   company.name, company.shortName, company.serviceRegion
 *   contact.phone, contact.phoneTelLink
 *   hours.emergencyBadge, businessHours.{tz,open,close}
 *   team.founder.{displayName,title}
 *   reviews.{rating,totalReviewCount}
 *   trust_badges[]            -> /badges/{filename}
 *   copy.hero.{headline,subheadline,imageAlt}
 *   copy.heroTrustChips[]     -> array of strings
 *   copy.{formHeader,formSubtext,submitButton,privacyLine,mobileCallLabel,
 *         availableNow,buttonText}
 *   copy.topBar.cta
 *
 * Props:
 *   brand        the resolved brand-dna object
 *   heroImage    public path to the Stage 9 hero render, e.g. '/hero-final.webp'
 *   ownerImage   public path to the founder cutout, or null to omit
 *   formFields   niche field set from the playbook's cro-rules.md.
 *                MAX 4. Shape: { name, label, type, options?, placeholder?,
 *                autoComplete?, inputMode? }
 *   onSubmit     (values) => Promise<void>
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 4v5c0 4.4-3 8.3-7 9-4-.7-7-4.6-7-9V7z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="inline-block h-3 w-3 -translate-y-px">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Hero({
  brand,
  heroImage,
  ownerImage = null,
  formFields = [],
  onSubmit,
}) {
  const reduced = useReducedMotion();
  const [values, setValues] = useState({});
  const [state, setState] = useState('idle');

  // Universal CRO floor: 4 fields or fewer on the first ask.
  const fields = formFields.slice(0, 4);

  const set = (name) => (event) =>
    setValues((prev) => ({ ...prev, [name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      await onSubmit?.(values);
      setState('sent');
    } catch {
      setState('error');
    }
  }

  const rise = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="relative isolate overflow-hidden bg-primary-dark">
      {/* Photo stage. Stage 9 writes heroImage; Stage 4 writes ownerImage. */}
      <img
        src={heroImage}
        alt={brand.copy.hero.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(97deg,rgb(var(--primary-dark)/0.96)_0%,rgb(var(--primary-dark)/0.90)_34%,rgb(var(--primary-dark)/0.60)_58%,rgb(var(--primary-dark)/0.18)_78%,rgb(var(--primary-dark)/0.42)_100%)]"
      />

      {/* Utility bar */}
      <div className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-2 text-sm text-white/70">
          <span>{brand.copy.topBar.cta}</span>
          <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2 font-semibold text-white">
              <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 ring-4 ring-emerald-400/25" />
              {brand.copy.availableNow}
            </span>
            <span>{brand.company.serviceRegion}</span>
            <a
              href={brand.contact.phoneTelLink}
              className="font-bold text-white transition-colors hover:text-accent"
            >
              {brand.contact.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-12">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.72fr)]">
          <motion.div {...rise}>
            <h1 className="max-w-[15ch] font-heading text-[clamp(2.4rem,5.4vw,4.125rem)] font-bold uppercase leading-[0.98] tracking-[-0.005em] text-white text-balance">
              {brand.copy.hero.headline}
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg text-white/80">
              {brand.copy.hero.subheadline}
            </p>

            {/* Proof chips. heroTrustChips is an array of plain strings; the
                first line before a comma reads as the claim, the rest as
                the qualifier, so copy stays a single locked string. */}
            <ul className="mt-7 grid max-w-[620px] list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {brand.copy.heroTrustChips.slice(0, 3).map((chip) => {
                const [claim, ...rest] = chip.split(', ');
                return (
                  <li
                    key={chip}
                    className="flex items-center gap-3 rounded-[10px] border border-white/20 bg-white/10 p-3 backdrop-blur-sm"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-accent text-white">
                      <ShieldIcon />
                    </span>
                    <span>
                      <b className="block text-[0.9rem] font-bold leading-tight text-white">
                        {claim}
                      </b>
                      {rest.length > 0 && (
                        <span className="mt-0.5 block text-xs leading-snug text-white/65">
                          {rest.join(', ')}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Owner cutout. Optional: the niche playbook's hero-composition.md
              decides whether this niche puts a person in frame. */}
          {ownerImage && (
            <motion.div
              {...rise}
              transition={{ ...rise.transition, delay: reduced ? 0 : 0.12 }}
              className="relative hidden w-full max-w-[300px] justify-self-end lg:block"
            >
              <div
                aria-hidden="true"
                className="absolute bottom-2 left-1/2 h-[74%] w-[104%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(var(--accent)/0.34)_0%,rgb(var(--accent)/0)_68%)]"
              />
              <img
                src={ownerImage}
                alt={`${brand.team.founder.displayName}, ${brand.team.founder.title}`}
                className="relative block w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.42)]"
                loading="eager"
                decoding="async"
              />
              <div className="absolute bottom-6 left-[-26px] max-w-[196px] rounded-[10px] bg-white p-3 shadow-card-lg">
                <b className="block text-sm font-bold leading-tight text-ink">
                  {brand.team.founder.displayName}
                </b>
                <span className="mt-0.5 block text-xs leading-snug text-neutral-dim">
                  {brand.team.founder.title}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quote form. Primary CTA above the fold. */}
        <div id="quote" className="relative mt-9">
          <div className="mb-3 flex flex-wrap items-baseline gap-3">
            <h2 className="m-0 font-heading text-2xl font-bold uppercase text-white">
              {brand.copy.formHeader}
            </h2>
            <p className="m-0 text-sm text-white/70">{brand.copy.formSubtext}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-end gap-2.5 rounded-2xl bg-white p-3.5 shadow-floating md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
          >
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={`hero-${field.name}`}
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-dim"
                >
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={`hero-${field.name}`}
                    name={field.name}
                    value={values[field.name] ?? ''}
                    onChange={set(field.name)}
                    className="w-full appearance-none rounded-lg border border-silver bg-silver/25 px-3 py-3 text-base text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-accent/25"
                  >
                    <option value="">{field.placeholder ?? 'Select one'}</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`hero-${field.name}`}
                    name={field.name}
                    type={field.type ?? 'text'}
                    inputMode={field.inputMode}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ''}
                    onChange={set(field.name)}
                    className="w-full rounded-lg border border-silver bg-silver/25 px-3 py-3 text-base text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-accent/25"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={state === 'sending'}
              className="h-[46px] rounded-[10px] bg-accent px-6 font-bold text-white shadow-[0_2px_0_rgb(var(--accent-dark))] transition-colors hover:bg-accent-dark focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70 md:col-span-2 lg:col-span-1"
            >
              {state === 'sent' ? brand.copy.buttonText : brand.copy.submitButton}
            </button>

            <p aria-live="polite" className="sr-only">
              {state === 'sent' ? 'Request sent' : ''}
            </p>
          </form>

          <p className="mt-2.5 px-0.5 text-xs text-white/60">
            <LockIcon /> {brand.copy.privacyLine}
          </p>
        </div>

        {/* Trust badge strip. Stage 4 harvests the files into public/badges/. */}
        {brand.trust_badges.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3.5 border-t border-white/15 pb-7 pt-5">
            {brand.trust_badges.map((badge) => (
              <img
                key={badge.filename}
                src={`/badges/${badge.filename}`}
                alt={badge.alt}
                className="h-11 w-auto rounded-lg bg-white/90 px-3 py-1.5"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        )}
      </div>

      {/* Persistent mobile CTA path. Universal CRO requirement. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-white/15 bg-primary-dark/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <a
          href={brand.contact.phoneTelLink}
          className="flex-1 rounded-[9px] bg-white py-3 text-center font-bold text-primary"
        >
          {brand.copy.mobileCallLabel}
        </a>
        <a
          href="#quote"
          className="flex-1 rounded-[9px] bg-accent py-3 text-center font-bold text-white"
        >
          {brand.copy.buttonText}
        </a>
      </div>
    </section>
  );
}
