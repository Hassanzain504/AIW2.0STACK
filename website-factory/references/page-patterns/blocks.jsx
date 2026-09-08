/**
 * Shared page blocks for the service-page and town-page patterns.
 *
 * Module 2D copies this into `templates/{niche-slug}/src/components/page-blocks.jsx`
 * alongside whichever page patterns the niche wireframe selects.
 *
 * Every block reads from props only. No brand-dna import, no client strings,
 * no literal colours. Colours come from the Tailwind token bindings that
 * `scripts/inject-theme.mjs` stamps into `:root`.
 */

/** Breadcrumb, H1, subhead, proof pills and the two banner CTAs. */
export function PageBanner({ crumbs = [], h1, subhead, pills = [], primary, secondary, phoneTelLink }) {
  return (
    <header className="border-b-4 border-accent bg-primary-dark py-11 text-white">
      <div className="mx-auto max-w-[1080px] px-6">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.11em] text-white/50">
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {i > 0 && ' / '}
                {c.href ? <a href={c.href} className="hover:text-accent-light hover:underline">{c.label}</a> : c.label}
              </span>
            ))}
          </nav>
        )}
        <h1 className="mt-3.5 max-w-[19ch] font-heading text-[clamp(2.06rem,5.2vw,3.375rem)] font-bold uppercase leading-none tracking-[-0.006em] text-balance">
          {h1}
        </h1>
        {subhead && <p className="mt-4 max-w-[60ch] text-lg text-white/75">{subhead}</p>}
        {pills.length > 0 && (
          <ul className="mt-5 flex list-none flex-wrap gap-2.5 p-0">
            {pills.map((p) => (
              <li key={p} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
                {p}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {primary && <a href={primary.href} className="rounded-lg bg-accent px-6 py-3.5 font-bold text-white transition-colors hover:bg-accent-dark">{primary.label}</a>}
          {secondary && <a href={secondary.href ?? phoneTelLink} className="rounded-lg border border-white/40 px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10">{secondary.label}</a>}
        </div>
      </div>
    </header>
  );
}

export function Section({ heading, note, children, id }) {
  return (
    <section id={id} className="border-t border-line py-11 first:border-t-0">
      <div className="mx-auto max-w-[1080px] px-6">
        <h2 className="mb-1.5 font-heading text-[clamp(1.56rem,3.6vw,2.19rem)] font-bold uppercase leading-tight tracking-[-0.004em] text-balance">
          {heading}
        </h2>
        {note && <p className="mb-6 max-w-[66ch] text-[1.03rem] text-ink-2">{note}</p>}
        {children}
      </div>
    </section>
  );
}

/** Ordered sequence with a real timescale on every step. Numbering is earned. */
export function ProcessList({ steps }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-lg border border-line bg-line p-0 shadow-card-lg">
      {steps.map((step, i) => (
        <li key={step.title} className="grid grid-cols-[38px_1fr] items-start gap-4 bg-card p-5 sm:grid-cols-[38px_1fr_auto]">
          <span className="pt-1 font-mono text-xs font-semibold text-accent">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-heading text-lg font-bold uppercase leading-tight tracking-[0.014em]">{step.title}</h3>
            <p className="mt-1.5 text-[0.92rem] text-ink-2">{step.body}</p>
          </div>
          <span className="col-start-2 mt-0.5 w-fit whitespace-nowrap rounded bg-card-2 px-2.5 py-1 font-mono text-[11px] font-semibold text-ink-3 sm:col-start-3">
            {step.timescale}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Client's own work only. A stock photograph here is an audit failure. */
export function WorkGallery({ items }) {
  return (
    <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5 p-0">
      {items.map((item) => (
        <li key={item.filename} className="overflow-hidden rounded-lg border border-line bg-card shadow-card-lg">
          <img src={`/work/${item.filename}`} alt={item.alt} loading="lazy" decoding="async"
            className="aspect-[4/3] w-full border-b border-line object-cover" />
          <div className="p-3.5">
            <b className="block text-sm font-semibold leading-snug">{item.caption}</b>
            <span className="mt-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.09em] text-accent">{item.town}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ReviewGrid({ items }) {
  return (
    <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(258px,1fr))] gap-3.5 p-0">
      {items.map((r, i) => (
        <li key={i} className="rounded-lg border border-line bg-card p-5 shadow-card-lg">
          <span className="tracking-[0.16em] text-sm text-accent" aria-label={`${r.rating} out of 5`}>
            {'★'.repeat(Math.round(r.rating))}
          </span>
          <p className="mt-2 text-[0.92rem] text-ink-2">{r.text}</p>
          <span className="mt-2.5 block text-[0.82rem] text-ink-3">
            <b className="font-semibold text-ink">{r.author ?? r.name}</b>, {r.source}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * FAQ. Native details/summary so it works with no JS and is keyboard
 * accessible by default. The first item opens so the block is not a wall
 * of closed rows in the page's first still frame.
 */
export function Faq({ items }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card shadow-card-lg">
      {items.map((item, i) => (
        <details key={item.q} open={i === 0} className="border-b border-line last:border-b-0 [&[open]>summary]:bg-card-2">
          <summary className="flex cursor-pointer list-none items-start gap-3.5 p-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="shrink-0 font-mono text-lg font-semibold leading-snug text-accent">+</span>
            {item.q}
          </summary>
          <div className="px-5 pb-4 pl-[47px] text-[0.95rem] text-ink-2">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

/** Internal links. Service pages link out to towns, town pages link back. */
export function LinkPills({ items }) {
  return (
    <ul className="flex list-none flex-wrap gap-2 p-0">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href}
            className="inline-block rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-ink-2 no-underline transition-colors hover:border-accent hover:text-accent">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ClosingCta({ heading, body, primary, secondary, phoneTelLink }) {
  return (
    <section className="bg-primary-dark py-11 text-white">
      <div className="mx-auto max-w-[1080px] px-6">
        <h2 className="mb-1.5 font-heading text-[clamp(1.56rem,3.6vw,2.19rem)] font-bold uppercase leading-tight text-balance">{heading}</h2>
        <p className="mb-6 max-w-[66ch] text-[1.03rem] text-white/70">{body}</p>
        <div className="flex flex-wrap items-center gap-3">
          {primary && <a href={primary.href} className="rounded-lg bg-accent px-6 py-3.5 font-bold text-white transition-colors hover:bg-accent-dark">{primary.label}</a>}
          {secondary && <a href={secondary.href ?? phoneTelLink} className="rounded-lg border border-white/40 px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10">{secondary.label}</a>}
        </div>
      </div>
    </section>
  );
}

/** Used where a niche has a common false-authority pattern to distance from. */
export function Disclaimer({ heading, body }) {
  return (
    <aside className="my-5 rounded-lg border border-alert-line border-l-4 border-l-alert bg-alert-bg p-5">
      <b className="block font-heading text-lg font-bold uppercase tracking-[0.014em] text-alert">{heading}</b>
      <p className="mt-1.5 text-[0.95rem] text-ink-2">{body}</p>
    </aside>
  );
}
