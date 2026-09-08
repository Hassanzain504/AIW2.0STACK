/**
 * Service page pattern.
 *
 * One instance per service. Module 2D copies this into
 * `templates/{niche-slug}/src/components/ServicePage.jsx` when the niche
 * wireframe selects it; the niche's route file then renders one page per
 * entry in the sitemap's services list.
 *
 * Data contract: `service-page.schema.json` in this folder. Stage 6 writes
 * one JSON file per service into
 * `Pipeline Data/copy/pages/services/{slug}.json`.
 *
 * Props:
 *   brand  the resolved brand-dna object
 *   page   one service-page.schema.json document
 */

import {
  PageBanner, Section, ProcessList, WorkGallery, ReviewGrid,
  Faq, LinkPills, ClosingCta, Disclaimer,
} from '../blocks.jsx';

function serviceJsonLd(brand, page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: page.name,
    provider: {
      '@type': 'LocalBusiness',
      name: brand.company.name,
      telephone: brand.contact.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: brand.address.street,
        addressLocality: brand.address.city,
        addressRegion: brand.address.state,
        postalCode: brand.address.zip,
      },
    },
    areaServed: page.towns.items.map((t) => ({ '@type': 'City', name: t.label })),
    ...(page.faq && {
      mainEntity: page.faq.items.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
  };
}

export default function ServicePage({ brand, page }) {
  const reviews = page.reviews?.filterTag
    ? brand.reviews.items.filter((r) => r.tags?.includes(page.reviews.filterTag))
    : brand.reviews.items;

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(brand, page)) }} />

      <PageBanner
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services/' }, { label: page.name }]}
        h1={page.h1}
        subhead={page.banner?.subhead}
        pills={page.banner?.pills}
        primary={{ label: `Call ${brand.contact.phone}`, href: brand.contact.phoneTelLink }}
        secondary={{ label: brand.copy.buttonText, href: '#quote' }}
      />

      <Section heading={page.problem.heading}>
        <p className="max-w-[70ch] text-lg text-ink-2">{page.problem.lead}</p>
        {page.problem.voices?.length > 0 && (
          <ul className="mt-5 grid list-none grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3.5 p-0">
            {page.problem.voices.map((v) => (
              <li key={v.quote} className="rounded-lg border border-line border-l-[3px] border-l-accent bg-card p-5 shadow-card-lg">
                <q className="block text-[0.97rem] leading-normal text-ink">{v.quote}</q>
                <cite className="mt-2.5 block font-mono text-[10px] font-semibold not-italic uppercase tracking-[0.1em] text-ink-3">
                  {v.source}
                </cite>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section heading={page.includes.heading} note={page.includes.note}>
        <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(268px,1fr))] gap-px overflow-hidden rounded-lg border border-line bg-line p-0">
          {page.includes.items.map((item) => (
            <li key={item.title} className="bg-card p-5">
              <h3 className="font-heading text-lg font-bold uppercase leading-tight tracking-[0.014em]">{item.title}</h3>
              <p className="mt-1.5 text-[0.92rem] text-ink-2">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={page.process.heading} note={page.process.note}>
        <ProcessList steps={page.process.steps} />
      </Section>

      <Section heading={page.credentials.heading} note={page.credentials.note}>
        <ul className="flex list-none flex-wrap gap-2.5 p-0">
          {page.credentials.items.map((c) => (
            <li key={c.name} className="rounded-lg border border-line bg-card px-4 py-3 shadow-card-lg">
              <b className="block font-heading text-base font-bold uppercase leading-none tracking-[0.02em]">{c.name}</b>
              <span className="mt-1 block text-[0.79rem] text-ink-3">{c.detail}</span>
            </li>
          ))}
        </ul>
        {page.credentials.disclaimer && <Disclaimer {...page.credentials.disclaimer} />}
      </Section>

      {page.pricing && (
        <Section heading={page.pricing.heading} note={page.pricing.note}>
          <div className="overflow-x-auto rounded-lg border border-line bg-card shadow-card-lg">
            <table className="w-full min-w-[520px] border-collapse text-[0.94rem]">
              <thead>
                <tr>
                  <th className="border-b-2 border-line-2 bg-card-2 px-4 py-3 text-left font-mono text-[9.5px] font-semibold uppercase tracking-[0.11em] text-ink-3">Situation</th>
                  <th className="border-b-2 border-line-2 bg-card-2 px-4 py-3 text-right font-mono text-[9.5px] font-semibold uppercase tracking-[0.11em] text-ink-3">Typical range</th>
                  <th className="border-b-2 border-line-2 bg-card-2 px-4 py-3 text-left font-mono text-[9.5px] font-semibold uppercase tracking-[0.11em] text-ink-3">Insurance</th>
                </tr>
              </thead>
              <tbody>
                {page.pricing.rows.map((row) => (
                  <tr key={row.situation}>
                    <td className="border-b border-line px-4 py-3 font-semibold">{row.situation}</td>
                    <td className="whitespace-nowrap border-b border-line px-4 py-3 text-right font-mono tabular-nums">{row.range}</td>
                    <td className="border-b border-line px-4 py-3">{row.insurance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {page.pricing.footnote && <p className="mt-3.5 text-sm text-ink-3">{page.pricing.footnote}</p>}
        </Section>
      )}

      {page.gallery?.items?.length > 0 && (
        <Section heading={page.gallery.heading} note={page.gallery.note}>
          <WorkGallery items={page.gallery.items} />
        </Section>
      )}

      {reviews.length > 0 && (
        <Section heading={page.reviews?.heading ?? brand.copy.reviews.heading}>
          <ReviewGrid items={reviews} />
        </Section>
      )}

      <Section heading={page.faq.heading} note={page.faq.note}>
        <Faq items={page.faq.items} />
      </Section>

      <Section heading={page.towns.heading} note={page.towns.note}>
        <LinkPills items={page.towns.items} />
      </Section>

      <ClosingCta
        heading={page.cta.heading}
        body={page.cta.body}
        primary={{ label: page.cta.primary ?? `Call ${brand.contact.phone}`, href: brand.contact.phoneTelLink }}
        secondary={{ label: page.cta.secondary ?? brand.copy.buttonText, href: '#quote' }}
      />
    </>
  );
}
