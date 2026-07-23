// Per-service landing pages under /services/{slug}/.
import type { FAQ } from './trades';

export type Service = {
  slug: string;
  navLabel: string;
  title: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  answerCapsule: string;
  includesHeading: string;
  includes: { t: string; d: string }[];
  faq: FAQ[];
};

export const SERVICES: Service[] = [
  {
    slug: 'website-design',
    navLabel: 'Website Design',
    title: 'Contractor Website Design | Wolf Contractor',
    metaDescription:
      'Custom, mobile-first website design for contractors and home service businesses. Fast sites built to book jobs, not win awards. From $2,900, you own it.',
    kicker: 'Contractor website design',
    h1: 'Contractor Websites Built to Book Jobs',
    answerCapsule:
      'Wolf Contractor designs custom, mobile-first websites for contractors and home service businesses. Each site is hand-built for speed and the phone call, launches in about 14 days, and comes with a free mockup in 48 hours. Pricing starts at $2,900 one-time, and you own the domain and code.',
    includesHeading: 'What a Wolf Contractor site includes',
    includes: [
      { t: 'Mobile-first build', d: 'Most contractor traffic is on a phone. We design for that screen first, so the call button is always in reach.' },
      { t: 'Service-area pages', d: 'A dedicated page for each town you serve, so you can actually rank in the places you work.' },
      { t: 'Click-to-call everywhere', d: 'No hunting for a phone number. Every screen has a one-tap way to reach you.' },
      { t: 'Fast, hand-coded pages', d: 'No page builders or bloat. Sub-second loads that hold the visitor and please Google.' },
      { t: 'On-page SEO baked in', d: 'Clean structure, schema, titles, and headings so the site is ready to rank on day one.' },
      { t: 'You own it', d: 'Domain in your name, code handed over, every login yours. No lock-in, ever.' },
    ],
    faq: [
      {
        q: 'How much does a contractor website cost?',
        a: 'Our sites are a one-time build: Launchpad at $2,900, Workhorse at $4,900, and Overdrive at $7,900, with optional monthly hosting or SEO. You own the site outright, with no contract.',
      },
      {
        q: 'How long does a contractor website take to build?',
        a: 'Most sites launch in about 14 business days from kickoff. You see a real mockup of your homepage within 48 hours, before you pay anything.',
      },
      {
        q: 'Do I own my website and domain?',
        a: 'Always. The domain stays in your name, the code is yours, and we hand over every login at launch. If you leave, you take everything.',
      },
      {
        q: 'Can you rebuild my existing contractor website?',
        a: 'Yes. We audit your current site for free and tell you straight whether a rebuild is worth it. Sometimes it is, sometimes it is not, and we say so either way.',
      },
      {
        q: 'Will the website help me rank on Google?',
        a: 'A fast, well-structured site is the foundation of ranking. We bake in on-page SEO, service-area pages, and schema, then optional monthly local SEO builds your rankings town by town.',
      },
    ],
  },
  {
    slug: 'local-seo',
    navLabel: 'Local SEO',
    title: 'Local SEO for Contractors | Wolf Contractor',
    metaDescription:
      'Local SEO and Google Business Profile optimization for contractors and home service businesses. Rank in the map pack in every town you serve.',
    kicker: 'Local SEO for contractors',
    h1: 'Local SEO That Ranks You in Your Towns',
    answerCapsule:
      'Wolf Contractor provides local SEO and Google Business Profile optimization for contractors and home service businesses. We build service-area pages, local schema, consistent citations, and a review system so you rank in the map pack and organic results across every town you serve.',
    includesHeading: 'What local SEO covers',
    includes: [
      { t: 'Google Business Profile', d: 'Full optimization: categories, services, photos, and posts tuned for the searches that book jobs.' },
      { t: 'Service-area pages', d: 'A real page per town, each written to rank locally instead of one thin catch-all.' },
      { t: 'Local schema + NAP', d: 'Structured data and consistent name, address, and phone across the web so Google trusts your business.' },
      { t: 'Citations & directories', d: 'Clean, consistent listings in the directories that build local authority.' },
      { t: 'Review funnels', d: 'A simple system that turns happy customers into a steady flow of reviews, which drive rankings.' },
      { t: 'Monthly reporting', d: 'Plain reports on rankings and calls, measured against booked jobs, not vanity metrics.' },
    ],
    faq: [
      {
        q: 'How much does local SEO cost for a contractor?',
        a: 'Local SEO is an optional monthly add-on to your site, typically bundled into our Workhorse and Overdrive plans. There is no long contract; you can cancel monthly.',
      },
      {
        q: 'How long does local SEO take to work?',
        a: 'Local SEO usually takes two to four months to move rankings for your towns, and compounds from there. That is why we start it at launch rather than waiting.',
      },
      {
        q: 'What is a Google Business Profile and do I need one?',
        a: 'It is your free listing that can appear in Google Maps and the local map pack. For any contractor with a service area, it is one of the highest-value local ranking assets, and we optimize it fully.',
      },
      {
        q: 'How do you get more reviews without breaking Google rules?',
        a: 'We set up a simple, honest ask after each job with a direct review link. We never buy reviews or gate them. Steady, genuine reviews beat a suspicious burst every time.',
      },
      {
        q: 'Can you rank me in more than one town?',
        a: 'Yes. We build a dedicated page for each town you serve and optimize your profile for those areas, so you can rank across your whole service area rather than just your home base.',
      },
    ],
  },
  {
    slug: 'google-ads',
    navLabel: 'Google Ads',
    title: 'Google Ads for Contractors | Wolf Contractor',
    metaDescription:
      'Google Ads and Local Services Ads management for contractors and home service businesses. Tight campaigns that fill the calendar with booked jobs.',
    kicker: 'Google Ads for contractors',
    h1: 'Google Ads That Fill the Calendar',
    answerCapsule:
      'Wolf Contractor manages Google Ads and Local Services Ads for contractors and home service businesses. We build tight, well-targeted campaigns with call tracking and weekly reporting, so you pay for ready-to-book leads instead of wasted clicks. Ads can produce calls within the first week.',
    includesHeading: 'What ads management covers',
    includes: [
      { t: 'Search campaigns', d: 'Tightly targeted keywords and negative lists so budget goes to buyers, not tire-kickers.' },
      { t: 'Local Services Ads', d: 'Setup and management of LSAs with the Google Guarantee, where you pay per lead, not per click.' },
      { t: 'Call tracking', d: 'Every lead tracked and recorded, so you know exactly which jobs the ads produced.' },
      { t: 'Landing pages', d: 'Ads point to fast, focused pages built to convert, not your busy homepage.' },
      { t: 'Weekly reporting', d: 'Clear numbers each week on spend, leads, and cost per booked job.' },
      { t: 'Seasonal tuning', d: 'Budgets and messaging that shift with your season so you are loudest when demand peaks.' },
    ],
    faq: [
      {
        q: 'How much should a contractor spend on Google Ads?',
        a: 'It depends on your trade, market, and season, but many contractors start with a modest local budget and scale as the numbers prove out. We help you set a budget matched to the jobs you want.',
      },
      {
        q: 'Are Local Services Ads worth it?',
        a: 'For many home service trades, yes. LSAs put you at the top with a Google Guarantee badge and charge per lead rather than per click. They work best with a fast, trustworthy site behind them.',
      },
      {
        q: 'How fast can Google Ads produce calls?',
        a: 'Once campaigns are approved, ads can generate calls within the first week. That immediate flow is why many contractors run ads while their local SEO builds.',
      },
      {
        q: 'Do you track which jobs came from ads?',
        a: 'Yes. We set up call tracking and recording so every lead is attributed, and you see cost per booked job in plain weekly reports.',
      },
      {
        q: 'Is there a long-term contract for ads management?',
        a: 'No. Ads management is a monthly service you can cancel anytime. We would rather keep you on results than lock you into a contract.',
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
