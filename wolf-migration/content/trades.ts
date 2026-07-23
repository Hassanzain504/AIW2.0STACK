// Per-trade landing page content. One entry = one /{slug}/ page.
// Copy is deliberately trade-specific: swap the trade name out and it should
// stop reading true. No fabricated stats, clients, or testimonials anywhere.

export type FAQ = { q: string; a: string };

export type Trade = {
  slug: string; // full URL slug, e.g. "window-cleaning-marketing"
  navLabel: string; // short label for the nav menu
  icon: string; // NavIcon name
  trade: string; // "window cleaning" — used mid-sentence, lowercase
  tradeTitle: string; // "Window Cleaning" — used in headings
  title: string; // <title>
  metaDescription: string;
  kicker: string;
  h1: string;
  answerCapsule: string; // 40-60 words, the block AI engines quote
  painHeading: string;
  painParas: string[];
  painPoints: string[];
  servicesIntro: string;
  faq: FAQ[];
  related: string[]; // sibling slugs for internal links
  tier: 1 | 2 | 3;
};

export const TRADES: Trade[] = [
  {
    slug: 'window-cleaning-marketing',
    navLabel: 'Window Cleaning',
    icon: 'window',
    trade: 'window cleaning',
    tradeTitle: 'Window Cleaning',
    title: 'Window Cleaning Marketing Agency, Websites, SEO & Ads | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads built for window cleaning companies. Mobile-first sites that book jobs, map pack rankings, and lead funnels. From $2,900.',
    kicker: 'Window cleaning marketing',
    h1: 'Marketing That Books Window Cleaning Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for window cleaning companies. Sites launch in 14 days, you see a free mockup in 48 hours, and everything is measured on booked jobs, not page views. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most window cleaning sites leak work',
    painParas: [
      'We analyzed 700+ window cleaning websites before we built a single one. The same gaps came up again and again, and they are all fixable. Slow sites, hidden phone numbers, no quote path, and no separation between residential and commercial work.',
      'A window cleaner lives on route density and repeat customers. Your site has to make it obvious which towns you cover, split residential from storefront and commercial, and turn a one-off gutter or screen job into a recurring schedule. Most sites do none of that.',
    ],
    painPoints: [
      'No click-to-call, so mobile visitors bounce before they book',
      'Residential and commercial mixed on one page, so neither converts',
      'No service-area pages, so you never rank in the towns you actually cover',
      'Quote forms that ask for ten fields when three would do',
    ],
    servicesIntro:
      'The same six services, tuned for how window cleaning companies actually get booked.',
    faq: [
      {
        q: 'How do window cleaners get commercial contracts online?',
        a: 'A dedicated commercial page separate from residential, targeting storefront, office, and property-manager searches in your service area, plus a simple quote path built for a property manager, not a homeowner. We build the page and the funnel; you close the walk-through.',
      },
      {
        q: 'How much should a window cleaning business spend on marketing?',
        a: 'For a new or growing route, a fast website plus Google Business Profile and a small local ads budget is usually enough to start. Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. We never lock you into a contract.',
      },
      {
        q: 'How long until my window cleaning site brings in calls?',
        a: 'The site launches in about 14 business days. Google Ads can produce calls in the first week once approved. Local SEO for your towns typically takes two to four months to move, which is why we start it on day one.',
      },
      {
        q: 'Do I need Google Ads or is SEO enough for window cleaning?',
        a: 'Ads fill the calendar now; SEO fills it for free later. Most window cleaners start with ads for immediate jobs while local SEO and Google Business Profile build in the background, then taper ad spend as rankings take over.',
      },
      {
        q: 'Will the site work for both residential and commercial cleaning?',
        a: 'Yes. We build separate paths so a homeowner booking a spring clean and a property manager pricing twelve storefronts each see a page written for them. One generic page loses both.',
      },
      {
        q: 'Do I own the website and domain?',
        a: 'Always. The domain stays in your name, the code is yours, and we hand over every login at launch. No lock-in and no ransom if you ever leave.',
      },
    ],
    related: ['pressure-washing-marketing', 'landscaping-marketing'],
    tier: 1,
  },
  {
    slug: 'pressure-washing-marketing',
    navLabel: 'Pressure Washing',
    icon: 'pressurewash',
    trade: 'pressure washing',
    tradeTitle: 'Pressure Washing',
    title: 'Pressure Washing Marketing & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for pressure washing and soft washing companies. Mobile-first sites that book jobs and rank in your towns. From $2,900.',
    kicker: 'Pressure washing marketing',
    h1: 'Marketing That Books Pressure Washing Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for pressure washing and soft washing companies. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked jobs. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most pressure washing sites underbook',
    painParas: [
      'Pressure washing is a visual, seasonal, upsell-heavy trade, and most sites waste all three. Before-and-after work is the strongest proof you have, yet it is usually buried or missing. House washing, driveways, decks, and commercial flatwork all get crammed onto one page.',
      'The buyer is often price-checking three companies from their phone in the spring rush. If your site is slow, hides the quote button, or does not make soft washing versus pressure washing clear, you lose the job to whoever answers first.',
    ],
    painPoints: [
      'Before-and-after galleries missing or hidden below the fold',
      'Soft washing and pressure washing not explained, so buyers hesitate',
      'One page for driveways, houses, decks, and commercial, so none rank',
      'No fast quote path during the spring and summer rush',
    ],
    servicesIntro:
      'The same six services, tuned for how pressure washing companies win the spring and summer rush.',
    faq: [
      {
        q: 'How do pressure washing companies get more customers online?',
        a: 'A fast site with strong before-and-after proof, separate pages for house washing, flatwork, and commercial, click-to-call on every screen, and Google Ads plus local SEO for the towns on your route. We build the site and funnel; you run the wand.',
      },
      {
        q: 'Should a pressure washing site separate soft washing from pressure washing?',
        a: 'Yes. Homeowners search for both and worry about damage to siding and roofs. A clear soft washing page wins the nervous buyer and lets you rank for both terms instead of neither.',
      },
      {
        q: 'How much does pressure washing marketing cost?',
        a: 'Our websites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. A small local ads budget on top usually covers the spring ramp. No contracts, cancel monthly.',
      },
      {
        q: 'When should I start marketing for pressure washing season?',
        a: 'Six to eight weeks before your season opens. The site takes about 14 days to launch, and local SEO needs a head start, so building in late winter puts you first when demand hits.',
      },
      {
        q: 'Can you help me land recurring commercial washing?',
        a: 'We build a commercial page and quote path aimed at property managers and facility contacts, separate from the homeowner flow. The page and follow-up are ours; the relationship is yours to close.',
      },
      {
        q: 'Do I own the site and keep the leads?',
        a: 'Yes to both. The domain and code are yours, every login is handed over at launch, and all leads go straight to you by call, form, or WhatsApp.',
      },
    ],
    related: ['window-cleaning-marketing', 'landscaping-marketing'],
    tier: 1,
  },
  {
    slug: 'landscaping-marketing',
    navLabel: 'Landscaping',
    icon: 'landscaping',
    trade: 'landscaping',
    tradeTitle: 'Landscaping & Lawn Care',
    title: 'Landscaping & Lawn Care Marketing | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for landscaping and lawn care companies. Sites that book maintenance contracts and design jobs. From $2,900.',
    kicker: 'Landscaping marketing',
    h1: 'Marketing That Books Landscaping Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for landscaping and lawn care companies. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked jobs and signed contracts. Pricing starts at $2,900 one-time.',
    painHeading: 'Why most landscaping sites miss the recurring money',
    painParas: [
      'Landscaping runs on two very different jobs: high-ticket design and install, and recurring maintenance that pays every month. Most sites sell neither well. The portfolio is thin, the maintenance plans are invisible, and the seasonal services are not spelled out.',
      'The real prize is the recurring contract. Your site should make weekly and monthly maintenance the obvious next step, show real project photos, and rank in every town on your route so you are not fighting on price alone.',
    ],
    painPoints: [
      'Maintenance plans buried, so one-off jobs never turn recurring',
      'No project gallery, so high-ticket design work looks unproven',
      'Seasonal services (cleanups, irrigation, snow) not laid out',
      'No town-level pages, so map pack rankings never happen',
    ],
    servicesIntro:
      'The same six services, tuned for landscapers who want recurring contracts, not just one-off cuts.',
    faq: [
      {
        q: 'How do landscapers get recurring maintenance clients?',
        a: 'Make the maintenance plan the headline offer, not an afterthought. We build a clear recurring-service page, a simple sign-up path, and local SEO for your towns so the steady-money jobs come inbound instead of chased.',
      },
      {
        q: 'Should landscaping and lawn care be on the same site?',
        a: 'Usually yes, but on separate pages. Design and install buyers and weekly-mow buyers search differently and decide differently. Separate pages let you rank for both and speak to each without watering down either.',
      },
      {
        q: 'How much should a landscaping company spend on marketing?',
        a: 'Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. A modest local ads budget in spring usually covers the seasonal ramp. No contracts.',
      },
      {
        q: 'How do I market landscaping through the off-season?',
        a: 'Shift the message to what sells in that season: fall cleanups, irrigation blowouts, snow removal, or early-bird design bookings. We can update seasonal offers so the site keeps producing year round.',
      },
      {
        q: 'How long until a landscaping site ranks locally?',
        a: 'The site launches in about 14 days. Google Ads can produce calls immediately; local SEO for your towns usually takes two to four months, which is why we start it at launch.',
      },
      {
        q: 'Do I own everything?',
        a: 'Yes. Domain, code, and logins are yours at launch, and every lead goes straight to you. No lock-in.',
      },
    ],
    related: ['painting-contractor-marketing', 'pressure-washing-marketing'],
    tier: 2,
  },
  {
    slug: 'painting-contractor-marketing',
    navLabel: 'Painting',
    icon: 'painting',
    trade: 'painting',
    tradeTitle: 'Painting',
    title: 'Painting Contractor Marketing & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for painting contractors. Interior and exterior pages that book estimates and rank in your towns. From $2,900.',
    kicker: 'Painting contractor marketing',
    h1: 'Marketing That Books Painting Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for painting contractors. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked estimates. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most painting sites lose the estimate',
    painParas: [
      'Painting is estimate-driven and seasonal, and most sites make the estimate hard to request. Interior and exterior are different buyers with different timing, yet they share one vague services page. The portfolio, which is your whole pitch, is usually a handful of low-light phone photos.',
      'The homeowner is comparing three painters and judging on trust and clean work. Your site has to show real projects, make the estimate one tap away, and rank when someone searches for a painter in their town during the season they are ready to buy.',
    ],
    painPoints: [
      'Interior and exterior crammed together, so neither ranks or converts',
      'Weak or tiny project gallery, so quality is unproven',
      'Estimate request buried instead of one tap from every page',
      'No town-level pages for the areas you actually paint',
    ],
    servicesIntro:
      'The same six services, tuned for painters who live and die by the booked estimate.',
    faq: [
      {
        q: 'How do painting contractors get more estimates booked?',
        a: 'Put a one-tap estimate request on every screen, show real before-and-after projects, and split interior from exterior so each ranks. Add Google Ads for immediate estimates and local SEO for the long game. We build all of it.',
      },
      {
        q: 'Should interior and exterior painting be separate pages?',
        a: 'Yes. They are different searches, different seasons, and different decisions. Separate pages let you rank for both and speak to each buyer directly instead of blurring them into one generic services page.',
      },
      {
        q: 'How much does painting contractor marketing cost?',
        a: 'Our websites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. A small local ads budget covers the busy-season ramp. Cancel monthly, no contracts.',
      },
      {
        q: 'When should painters ramp up marketing?',
        a: 'Exterior demand peaks in warm months, so build in late winter to be ranking when it hits. Interior work fills the shoulder seasons, so a good site keeps producing when the exterior slows.',
      },
      {
        q: 'How important is a project gallery for painters?',
        a: 'It is the whole pitch. Real, well-lit before-and-after photos of your crew and finished rooms do more to close an estimate than any slogan. We build the gallery to load fast and read as proof, not decoration.',
      },
      {
        q: 'Do I own the site and the leads?',
        a: 'Yes. Domain, code, and logins are yours at launch, and every estimate request comes straight to you. No lock-in.',
      },
    ],
    related: ['remodeling-marketing', 'landscaping-marketing'],
    tier: 2,
  },
  {
    slug: 'remodeling-marketing',
    navLabel: 'Remodeling',
    icon: 'remodel',
    trade: 'remodeling',
    tradeTitle: 'Remodeling',
    title: 'Remodeling Marketing & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for remodelers. Portfolio-driven sites that book consultations for kitchen, bath, and whole-home projects. From $2,900.',
    kicker: 'Remodeling marketing',
    h1: 'Marketing That Books Remodeling Projects',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for remodeling companies. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked consultations. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most remodeling sites stall high-ticket leads',
    painParas: [
      'Remodeling is a high-ticket, long-consideration purchase, and the site has to carry more trust than any other trade. The homeowner is inviting you into their house for weeks and spending tens of thousands of dollars. A thin portfolio and a generic contact form do not earn that.',
      'Kitchen, bath, additions, and whole-home are separate searches with separate budgets. Most sites lump them together, hide the project photos, and make the only call to action a bare form. The result is tire-kickers instead of qualified consultations.',
    ],
    painPoints: [
      'Portfolio too thin to justify a five-figure decision',
      'Kitchen, bath, and additions blended into one weak page',
      'No consultation path that pre-qualifies serious buyers',
      'Slow, image-heavy pages that lose the mobile visitor',
    ],
    servicesIntro:
      'The same six services, tuned for remodelers selling high-ticket projects that take weeks to close.',
    faq: [
      {
        q: 'How do remodelers get more qualified leads?',
        a: 'Lead with a deep project portfolio organized by room and project type, make the call to action a consultation rather than a bare form, and rank for the specific work you want. We build the portfolio structure, the funnel, and the SEO.',
      },
      {
        q: 'Should each remodeling service have its own page?',
        a: 'Yes. Kitchen, bathroom, additions, and whole-home are different searches and different budgets. Dedicated pages rank for each and let you show the right projects to the right buyer instead of one blended page.',
      },
      {
        q: 'How much should a remodeling company spend on marketing?',
        a: 'Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. Because each job is high value, even a few consultations a month pays back fast. No contracts.',
      },
      {
        q: 'How do I pre-qualify remodeling leads on my site?',
        a: 'A short consultation form that asks for project type, rough scope, and timeline filters serious buyers from browsers before the call. We build it so you spend time on real projects, not tire-kickers.',
      },
      {
        q: 'How long until a remodeling site produces leads?',
        a: 'The site launches in about 14 days. Ads can produce consultations quickly; SEO for competitive remodeling terms is a longer game, usually a few months, so we start it on day one.',
      },
      {
        q: 'Do I own the site and portfolio?',
        a: 'Yes. Domain, code, project photos, and logins are all yours at launch. No lock-in, and every lead comes straight to you.',
      },
    ],
    related: ['general-contractor-marketing', 'painting-contractor-marketing'],
    tier: 2,
  },
  {
    slug: 'general-contractor-marketing',
    navLabel: 'General Contractor',
    icon: 'general',
    trade: 'general contracting',
    tradeTitle: 'General Contractor',
    title: 'General Contractor Marketing & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for general contractors. Trust-first sites that book bigger projects and rank in your service area. From $2,900.',
    kicker: 'General contractor marketing',
    h1: 'Marketing That Books Bigger Construction Projects',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for general contractors. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked projects. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most general contractor sites undersell the firm',
    painParas: [
      'A general contractor is asking clients to trust them with big, disruptive, expensive projects, and most sites do nothing to build that trust. Licensing, insurance, and the range of work you actually take on are hidden or vague, and the portfolio does not match the size of the ask.',
      'GCs also serve very different buyers: homeowners, commercial clients, and other trades. A single generic site speaks to none of them clearly. The site needs to prove credibility fast, show the scope of work, and make it easy for a serious project to reach you.',
    ],
    painPoints: [
      'License, insurance, and credentials not shown, so trust never builds',
      'Portfolio too small to match the size of projects you want',
      'Residential and commercial work blurred into one message',
      'No clear path for a serious project inquiry',
    ],
    servicesIntro:
      'The same six services, tuned for general contractors who need to win trust before they win the bid.',
    faq: [
      {
        q: 'How do general contractors get bigger projects online?',
        a: 'Lead with proof: credentials, a strong project portfolio, and clear scope of work, then rank for the project types and towns you want. We build the trust-first structure and the SEO so larger inquiries come inbound.',
      },
      {
        q: 'Should a GC site separate residential from commercial?',
        a: 'Yes, when you do both. They are different buyers with different decision processes. Separate paths let each see relevant projects and a relevant call to action instead of one message that fits neither.',
      },
      {
        q: 'How much should a general contractor spend on marketing?',
        a: 'Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. Given project sizes, a single won bid usually covers the build many times over. No contracts.',
      },
      {
        q: 'What builds trust on a contractor website?',
        a: 'Visible licensing and insurance, real project photos with scope and location, a clear service area, and a fast, professional site. Together they tell a serious buyer you can handle the job.',
      },
      {
        q: 'How long until the site produces leads?',
        a: 'It launches in about 14 days. Ads can produce inquiries quickly; SEO for competitive contractor terms takes a few months, so we begin it at launch.',
      },
      {
        q: 'Do I own the website and domain?',
        a: 'Yes. Domain, code, and logins are yours at launch, and every inquiry comes straight to you. No lock-in.',
      },
    ],
    related: ['remodeling-marketing', 'roofing-marketing'],
    tier: 2,
  },
  {
    slug: 'roofing-marketing',
    navLabel: 'Roofing',
    icon: 'roofing',
    trade: 'roofing',
    tradeTitle: 'Roofing',
    title: 'Roofing Marketing Agency & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for roofing companies. Fast sites built for storm response, insurance work, and booked inspections. From $2,900.',
    kicker: 'Roofing marketing',
    h1: 'Marketing That Books Roofing Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for roofing companies. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked inspections and jobs. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most roofing sites lose the urgent job',
    painParas: [
      'Roofing splits into two very different jobs: urgent storm and leak response, and planned replacements and insurance work. Most sites are built for neither. When a homeowner has water coming in, they call whoever answers first, and a slow site with a buried phone number loses that call instantly.',
      'Roofing is also one of the most competitive trades in paid search, so wasted ad spend is common. The site has to load fast, put the phone and inspection request front and center, and support tight, well-targeted campaigns instead of burning budget on generic clicks.',
    ],
    painPoints: [
      'Phone number buried, so urgent storm and leak calls go elsewhere',
      'No fast inspection or estimate request for the panicked homeowner',
      'Insurance and storm work not explained, so high-value jobs slip',
      'Generic ads burning budget in an expensive, competitive market',
    ],
    servicesIntro:
      'The same six services, tuned for roofers who need to catch the urgent call and the planned replacement.',
    faq: [
      {
        q: 'How do roofing companies get more leads online?',
        a: 'Make the phone and inspection request impossible to miss, load fast on mobile, and run tight local ads plus Google Business Profile so you catch both the storm-panic call and the planned-replacement search. We build the site and funnel; you send the crew.',
      },
      {
        q: 'Should a roofing site cover storm and insurance work separately?',
        a: 'Yes. Storm and insurance jobs are high value and searched differently from routine repairs and replacements. A dedicated page ranks for those terms and reassures the homeowner you handle the claim process.',
      },
      {
        q: 'How much should a roofing company spend on marketing?',
        a: 'Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. Roofing ads are competitive, so tight targeting matters more than a big budget. No contracts, cancel monthly.',
      },
      {
        q: 'Can you compete with the big roofing marketing agencies?',
        a: 'On head terms the incumbents are entrenched, so we start with the long-tail and local searches they neglect and your specific towns. That wins real jobs now while authority builds toward the bigger terms.',
      },
      {
        q: 'How fast can a roofing site go live?',
        a: 'About 14 business days, with a free mockup in 48 hours. Ads can be producing inspection requests within the first week once approved.',
      },
      {
        q: 'Do I own the site and leads?',
        a: 'Yes. Domain, code, and logins are yours at launch, and every call and form comes straight to you. No lock-in.',
      },
    ],
    related: ['hvac-marketing', 'general-contractor-marketing'],
    tier: 3,
  },
  {
    slug: 'plumbing-marketing',
    navLabel: 'Plumbing',
    icon: 'plumbing',
    trade: 'plumbing',
    tradeTitle: 'Plumbing',
    title: 'Plumbing Marketing Agency & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for plumbing companies. Fast sites built for emergency calls, service work, and Local Services Ads. From $2,900.',
    kicker: 'Plumbing marketing',
    h1: 'Marketing That Books Plumbing Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for plumbing companies. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked calls. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most plumbing sites miss the emergency call',
    painParas: [
      'A huge share of plumbing revenue is urgent: burst pipes, no hot water, backed-up drains. That buyer is on their phone, panicked, and calling the first company that makes it easy. A slow site or a phone number they have to hunt for hands the job to a competitor.',
      'Plumbing also has planned service and installs, and Local Services Ads that need a real, trusted site behind them. The site has to be fast, put click-to-call everywhere, separate emergency from scheduled work, and back your Google presence so you show up when it counts.',
    ],
    painPoints: [
      'Click-to-call missing, so panicked emergency buyers bounce',
      'Emergency and scheduled service mixed into one page',
      'No support for Local Services Ads and the Google Guarantee',
      'Slow mobile load right when the buyer has no patience',
    ],
    servicesIntro:
      'The same six services, tuned for plumbers who need to catch the 2am emergency and the planned install.',
    faq: [
      {
        q: 'How do plumbers get more emergency calls?',
        a: 'Click-to-call on every screen, a fast mobile site, a clear emergency page, and Local Services Ads with the Google Guarantee. Together they put you in front of the panicked buyer first. We build the site and set the foundation for the ads.',
      },
      {
        q: 'Are Local Services Ads worth it for plumbing?',
        a: 'For most plumbers, yes. They put you at the top with a Google Guarantee badge and charge per lead, not per click. They work best with a fast, trustworthy site behind them, which is exactly what we build.',
      },
      {
        q: 'How much should a plumbing company spend on marketing?',
        a: 'Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. Emergency demand converts fast, so even a modest ads budget can fill the schedule. No contracts.',
      },
      {
        q: 'Should emergency and routine plumbing be separate pages?',
        a: 'Yes. The emergency buyer wants a phone number now; the planned-service buyer wants details and pricing. Separate pages serve each and rank for both instead of one blurred message.',
      },
      {
        q: 'How fast can a plumbing site launch?',
        a: 'About 14 business days, with a free mockup in 48 hours. Ads can produce calls within the first week once approved.',
      },
      {
        q: 'Do I own the website and leads?',
        a: 'Yes. Domain, code, and logins are yours at launch, and every call and form comes straight to you. No lock-in.',
      },
    ],
    related: ['hvac-marketing', 'electrician-marketing'],
    tier: 3,
  },
  {
    slug: 'hvac-marketing',
    navLabel: 'HVAC',
    icon: 'hvac',
    trade: 'HVAC',
    tradeTitle: 'HVAC',
    title: 'HVAC Marketing Agency & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for HVAC companies. Seasonal sites built for emergency calls, installs, and maintenance plans. From $2,900.',
    kicker: 'HVAC marketing',
    h1: 'Marketing That Books HVAC Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for HVAC companies. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked calls and installs. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most HVAC sites waste the season',
    painParas: [
      'HVAC demand spikes with the weather, and most sites are not built to catch it. The first heat wave or cold snap sends a flood of urgent no-cooling and no-heat searches, and a slow site with a hidden phone number loses those jobs to whoever is easier to reach.',
      'The bigger money is in installs and recurring maintenance plans, and those are almost always undersold. The site has to catch the emergency, push the install quote, and make the maintenance plan an easy yes, all while ranking for your towns and backing your ad spend.',
    ],
    painPoints: [
      'No click-to-call for the urgent no-heat or no-cooling search',
      'Maintenance plans buried, so recurring revenue is left on the table',
      'Install quotes hard to request, so high-ticket jobs slip',
      'No seasonal offers, so the site sits flat between spikes',
    ],
    servicesIntro:
      'The same six services, tuned for HVAC companies balancing emergencies, installs, and maintenance plans.',
    faq: [
      {
        q: 'How do HVAC companies get more calls in season?',
        a: 'A fast site with click-to-call everywhere, a clear emergency page, tight seasonal ads, and Google Business Profile so you catch the no-heat and no-cooling searches first. We build the site and funnel; you dispatch the tech.',
      },
      {
        q: 'How do I sell more HVAC maintenance plans online?',
        a: 'Make the plan a headline offer with clear value and a simple sign-up, not a footnote. We build a dedicated maintenance page and path so recurring revenue becomes an easy yes at and after the first visit.',
      },
      {
        q: 'How much should an HVAC company spend on marketing?',
        a: 'Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. Seasonal demand converts fast, so a focused ads budget during spikes usually pays for itself quickly. No contracts.',
      },
      {
        q: 'Should HVAC ads run year round?',
        a: 'Heavier during heat and cold spikes, lighter in the shoulder seasons, with the message shifting to installs and maintenance plans when emergencies slow. We help you set the seasonal rhythm.',
      },
      {
        q: 'How fast can an HVAC site go live?',
        a: 'About 14 business days, with a free mockup in 48 hours. Ads can produce calls within the first week once approved, which matters when a heat wave hits.',
      },
      {
        q: 'Do I own the site and leads?',
        a: 'Yes. Domain, code, and logins are yours at launch, and every call and form comes straight to you. No lock-in.',
      },
    ],
    related: ['plumbing-marketing', 'electrician-marketing'],
    tier: 3,
  },
  {
    slug: 'electrician-marketing',
    navLabel: 'Electrician',
    icon: 'electrician',
    trade: 'electrical',
    tradeTitle: 'Electrician',
    title: 'Electrician Marketing & Website Design | Wolf Contractor',
    metaDescription:
      'Websites, local SEO and Google Ads for electrical contractors. Sites built for service calls, panel and EV work, and booked estimates. From $2,900.',
    kicker: 'Electrician marketing',
    h1: 'Marketing That Books Electrical Jobs',
    answerCapsule:
      'Wolf Contractor builds websites, local SEO and Google Ads for electrical contractors. Sites launch in 14 days, you see a free mockup in 48 hours, and results are measured on booked calls and estimates. Pricing starts at $2,900 one-time with no lock-in.',
    painHeading: 'Why most electrician sites underperform',
    painParas: [
      'Electrical work runs from urgent safety calls to planned upgrades like panels, EV chargers, and generators, and most sites sell only the vague middle. The panic buyer with sparking outlets and the homeowner pricing an EV charger install both land on the same generic services page and neither is served.',
      'Trust and licensing matter more here because the work is safety-critical. The site has to prove credentials, make the urgent call one tap away, and rank for the specific high-value upgrades people search by name, instead of a flat list of everything you do.',
    ],
    painPoints: [
      'Urgent service calls lost to a buried phone number',
      'High-value work (panels, EV chargers, generators) not called out',
      'License and insurance not shown, so safety-critical trust is missing',
      'Residential and commercial work blurred into one message',
    ],
    servicesIntro:
      'The same six services, tuned for electricians balancing urgent service calls and high-value upgrades.',
    faq: [
      {
        q: 'How do electricians get more service calls online?',
        a: 'Click-to-call on every screen, a fast mobile site, visible credentials, and local ads plus Google Business Profile so you catch the urgent search first. We build the site and set the foundation; you run the calls.',
      },
      {
        q: 'Should high-value electrical work have its own pages?',
        a: 'Yes. Panel upgrades, EV charger installs, and generators are searched by name and worth serious money. Dedicated pages rank for each and let you show a homeowner you specialize, not just dabble.',
      },
      {
        q: 'How much should an electrician spend on marketing?',
        a: 'Our sites are a one-time $2,900 to $7,900 build with optional monthly SEO and ads. High-value upgrade jobs mean a few booked estimates a month pays back fast. No contracts.',
      },
      {
        q: 'How important is showing my license on the site?',
        a: 'Very. Electrical work is safety-critical, so visible license and insurance details reassure buyers and separate you from handymen. We make sure your credentials are clear and prominent.',
      },
      {
        q: 'How fast can an electrician site launch?',
        a: 'About 14 business days, with a free mockup in 48 hours. Ads can produce calls within the first week once approved.',
      },
      {
        q: 'Do I own the website and leads?',
        a: 'Yes. Domain, code, and logins are yours at launch, and every call and form comes straight to you. No lock-in.',
      },
    ],
    related: ['plumbing-marketing', 'hvac-marketing'],
    tier: 3,
  },
];

export function getTrade(slug: string): Trade | undefined {
  return TRADES.find((t) => t.slug === slug);
}
