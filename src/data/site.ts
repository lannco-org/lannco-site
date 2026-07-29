/** Shared page data. All copy verbatim from docs/COPY.md. */

/** Sectors — Board C lays these out 2x4 (Board B used a single row of 8). */
export const sectors = [
  { label: 'Private Capital', asset: '#10 stone' },
  { label: 'Family Offices', asset: '#10 red lacquer sphere' },
  { label: 'Venture Capital', asset: '#10 wire ring sculpture' },
  { label: 'Commodities', asset: '#10 gold bar' },
  { label: 'Real Estate', asset: '#10 stone arch/interior' },
  { label: 'Digital Assets', asset: '#10 black vessel' },
  { label: 'Luxury & Lifestyle', asset: '#10 designer chair' },
  { label: 'Art & Collectibles', asset: '#10 classical torso' },
];

/** Our Process — step 05 uses Board C's "Long-Term Relationships" (Board B: "Build"). */
export const processSteps = [
  {
    num: '01',
    title: 'Discover',
    blurb: 'Understanding your objectives and opportunities.',
    icon: 'discover',
  },
  {
    num: '02',
    title: 'Evaluate',
    blurb: 'Deep dive and independent strategic analysis.',
    icon: 'evaluate',
  },
  {
    num: '03',
    title: 'Connect',
    blurb: 'Introduce you to the right people and opportunities.',
    icon: 'connect',
  },
  {
    num: '04',
    title: 'Execute',
    blurb: 'Managing execution with precision and confidentiality.',
    icon: 'execute',
  },
  {
    num: '05',
    title: 'Long-Term Relationships',
    blurb: 'Building partnerships that last for generations.',
    icon: 'build',
  },
] as const;

/**
 * Journal articles. Bodies are still awaited from the client, so these are
 * index entries only and do not link anywhere yet — Phase 3 converts this to an
 * Astro content collection with real article routes.
 */
export const articles = [
  {
    title: 'The Rise of Private Capital in the GCC',
    category: 'Insights',
    date: 'June 2024',
    featured: true,
    asset: '#11 abstract architecture',
  },
  {
    title: 'Why Asia is Investing in Europe',
    category: 'Perspectives',
    date: 'May 2024',
    asset: '#11 misty mountain valley',
  },
  {
    title: 'Institutional Commodities Outlook',
    category: 'Outlook',
    date: 'April 2024',
    asset: '#11 dark sea stack',
  },
  {
    title: 'Luxury Golf Estates: A New Asset Class',
    category: 'Insights',
    date: 'March 2024',
    asset: '#11 golf-estate landscape',
  },
  {
    title: 'Tokenization of Real Assets',
    category: 'Outlook',
    date: 'February 2024',
    asset: '#11 brutalist building',
  },
];

/** About timeline, reverse-chronological (Board B). */
export const timeline = [
  { year: '2024', place: 'Singapore', note: 'Founding of LANNCO' },
  { year: '2020', place: 'Commodities', note: 'Institutional trading & advisory' },
  { year: '2016', place: 'Middle East', note: 'Cross-border capital flows' },
  { year: '2012', place: 'Europe', note: 'Strategic partnerships' },
  { year: '2008', place: 'Africa', note: 'Market expansion' },
  { year: '2004', place: 'Private Capital', note: 'Long-term value creation' },
];

/**
 * Global Presence stats. Using COPY.md's v1 set rather than the v2 set from the
 * later board: v2 replaces two of the four numbers with words ("Global network",
 * "Local intelligence"), which kills half the planned Phase 4 count-up. Flagged
 * for Ryan — see docs/COPY.md open question 4.
 */
export const stats = [
  { value: '4', label: 'Continents' },
  { value: '7+', label: 'Key Locations' },
  { value: '50+', label: 'Strategic Partners' },
  { value: '∞', label: 'Opportunities' },
];

export const locations = [
  'Singapore',
  'Dubai',
  'Marbella',
  'Cape Town',
  'Hong Kong',
  'London',
  'Shanghai',
];
