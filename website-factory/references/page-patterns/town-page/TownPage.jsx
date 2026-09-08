/**
 * Town page pattern.
 *
 * One instance per town. Module 2D copies this into
 * `templates/{niche-slug}/src/components/TownPage.jsx` when the niche
 * wireframe selects it.
 *
 * Data contract: `town-page.schema.json` in this folder. Stage 6 writes one
 * JSON file per town into `Pipeline Data/copy/pages/towns/{slug}.json`.
 *
 * THE RULE THIS COMPONENT ENFORCES: a town page needs one completed job in
 * that town, with a photograph from it. Without that it is filler, Google
 * treats it as filler, and it will not rank. The component throws rather
 * than rendering a page that cannot work.
 *
 * Props:
 *   brand  the resolved brand-dna object
 *   page   one town-page.schema.json document
 */

import {
  PageBanner, Section, ReviewGrid, Faq, LinkPills, ClosingCta,
} from '../blocks.jsx';

function townJsonLd(brand, page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: brand.company.name,
    telephone: brand.contact.phone,
    url: `${brand.company.url}/${page.slug}/`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      addressRegion: brand.address.state,
      postalCode: brand.address.zip,
    },
    areaServed: { '@type': 'City', name: `${page.town}, ${page.state}` },
    ...(brand.reviews.totalReviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: brand.reviews.rating,
        reviewCount: brand.reviews.totalReviewCount,
      },
    }),
  };
}

export default function TownPage({ brand, page }) {
  if (!page.proof?.job?.filename) {
    throw new Error(
      `Town page "${page.slug}" has no proof job photograph. A town page without a ` +
      `completed local job and a photograph from it is filler and must not be built. ` +
      `Either supply the job in Pipeline Data/copy/pages/towns/${page.slug}.json, ` +
      `or remove this town from the sitemap until a job exists.`
    );
  }

  const reviews = page.reviews?.filterTag
    ? brand.reviews.items.filter((r) => r.tags?.includes(page.reviews.filterTag))
    : brand.reviews.items;

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(townJsonLd(brand, page)) }} />

      <PageBanner
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Service areas', href: '/service-areas/' }, { label: `${page.town} ${page.state}` }]}
        h1={page.h1}
        subhead={page.banner?.subhead}
        pills={page.banner?.pills}
        primary={{ label: page.cta.primary ?? brand.copy.buttonText, href: '#quote' }}
        secondary={{ label: `Call ${brand.contact.phone}`, href: brand.contact.phoneTelLink }}
      />

      <Section heading={page.proof.heading} note={page.proof.note}>
        <article className="grid overflow-hidden rounded-lg border border-line bg-card shadow-card-lg md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          <img src={`/work/${page.proof.job.filename}`} alt={page.proof.job.alt}
            loading="eager" decoding="async"
            className="h-full min-h-[210px] w-full border-b border-line object-cover md:border-b-0 md:border-r" />
          <div className="p-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-accent">
              {page.proof.job.label}
            </span>
            <h3 className="mt-1.5 font-heading text-[1.4rem] font-bold uppercase leading-tight tracking-[0.014em]">
              {page.proof.job.title}
            </h3>
            <p className="mt-2 text-[0.92rem] text-ink-2">{page.proof.job.body}</p>
          </div>
        </article>
      </Section>

      <Section heading={page.services.heading} note={page.services.note}>
        <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(268px,1fr))] gap-px overflow-hidden rounded-lg border border-line bg-line p-0">
          {page.services.items.map((s) => (
            <li key={s.href} className="bg-card p-5">
              <h3 className="font-heading text-lg font-bold uppercase leading-tight tracking-[0.014em]">
                <a href={s.href} className="text-ink no-underline hover:text-accent hover:underline">{s.name}</a>
              </h3>
              <p className="mt-1.5 text-[0.92rem] text-ink-2">{s.blurb}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={page.localContext.heading} note={page.localContext.note}>
        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-px overflow-hidden rounded-lg border border-line bg-line">
          {page.localContext.items.map((item) => (
            <div key={item.key} className="bg-card p-4">
              <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.11em] text-ink-3">{item.key}</dt>
              <dd className="m-0 mt-1.5 text-[0.92rem] leading-normal text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {reviews.length > 0 && (
        <Section heading={page.reviews?.heading ?? `${page.town} customers`}>
          <ReviewGrid items={reviews} />
        </Section>
      )}

      <Section heading={page.faq.heading}>
        <Faq items={page.faq.items} />
      </Section>

      <Section heading={page.nearby.heading}>
        <LinkPills items={page.nearby.items} />
      </Section>

      <ClosingCta
        heading={page.cta.heading}
        body={page.cta.body}
        primary={{ label: page.cta.primary ?? brand.copy.buttonText, href: '#quote' }}
        secondary={{ label: page.cta.secondary ?? `Call ${brand.contact.phone}`, href: brand.contact.phoneTelLink }}
      />
    </>
  );
}
