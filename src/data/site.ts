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

/* Journal articles moved to the `journal` content collection in Phase 3 —
   src/content/journal/*.md, read through src/data/journal.ts. */

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
