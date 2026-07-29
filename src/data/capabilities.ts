/**
 * The four capabilities. Single source for the home cards, the overview page
 * and the detail pages, so the sub-nav can never drift from the cards.
 *
 * Copy is verbatim from docs/COPY.md.
 *
 * NAMING: card 04 is "Opportunities" here. COPY.md also records "Alternative
 * Assets" from the capability-detail sub-nav in the boards — the two are used
 * interchangeably across boards. Working default is "Opportunities" (it is what
 * Board A and Board C show on the cards); flagged for Ryan in docs/HANDOFF.md.
 */
export interface Pillar {
  num: string;
  title: string;
  blurb: string;
}

export interface Capability {
  slug: string;
  num: string;
  title: string;
  /** Card blurb — overview + home. */
  blurb: string;
  /** Detail-page sub-heading. */
  sub: string;
  texture: 'stone' | 'silk' | 'ink' | 'marble';
  /** ASSETS.md reference for the hero object image on the detail page. */
  asset: string;
  pillars: Pillar[];
  /** True when pillar copy is still awaited from the client. */
  pillarsPending?: boolean;
}

export const capabilities: Capability[] = [
  {
    slug: 'strategic-advisory',
    num: '01',
    title: 'Strategic Advisory',
    blurb:
      'Providing clarity and strategy for cross-border expansion, market entry, and capital strategy.',
    sub: 'Strategic advisory for cross-border expansion, market entry, and capital strategy.',
    texture: 'stone',
    asset: '#6 rough grey stone monolith on ivory',
    pillars: [
      { num: '01', title: 'Market Entry', blurb: 'Go-to-market strategies across key regions.' },
      { num: '02', title: 'Growth Strategy', blurb: 'Build sustainable growth with long-term vision.' },
      { num: '03', title: 'Capital Strategy', blurb: 'Optimize capital structure and financing solutions.' },
    ],
  },
  {
    slug: 'private-introductions',
    num: '02',
    title: 'Private Introductions',
    blurb:
      'Creating trusted introductions between investors, founders, family offices and strategic partners.',
    sub: 'Creating trusted introductions between investors, founders, family offices and strategic partners.',
    texture: 'silk',
    asset: '#7 red silk/velvet fabric folds, macro',
    pillars: [],
    pillarsPending: true,
  },
  {
    slug: 'institutional-markets',
    num: '03',
    title: 'Institutional Markets',
    blurb: 'Access to institutional networks in commodities, energy, and digital assets.',
    sub: 'Access to institutional networks in commodities, energy, and digital assets.',
    texture: 'ink',
    asset: '#8 black liquid-marble/ink swirl',
    pillars: [],
    pillarsPending: true,
  },
  {
    slug: 'opportunities',
    num: '04',
    title: 'Opportunities',
    blurb: 'Curated access to private markets, real estate, and luxury alternative assets.',
    sub: 'Curated access to private markets, real estate, and luxury alternative assets.',
    texture: 'marble',
    asset: '#9 white marble geometric block',
    pillars: [],
    pillarsPending: true,
  },
];
