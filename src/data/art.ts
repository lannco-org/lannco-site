import type { ImageMetadata } from 'astro';
import aboutBonsai from '../assets/about-bonsai.jpg';
import capInstitutionalMarkets from '../assets/cap-institutional-markets.jpg';
import capOpportunities from '../assets/cap-opportunities.jpg';
import capPrivateIntroductions from '../assets/cap-private-introductions.jpg';
import capStrategicAdvisory from '../assets/cap-strategic-advisory.jpg';
import contactMaple from '../assets/contact-maple.jpg';
import journalAsiaEurope from '../assets/journal-asia-europe.jpg';
import journalCommodities from '../assets/journal-commodities.jpg';
import journalGcc from '../assets/journal-gcc.jpg';
import journalGolf from '../assets/journal-golf.jpg';
import journalTokenization from '../assets/journal-tokenization.jpg';
import privateCircleDoorway from '../assets/private-circle-doorway.jpg';
import processRidges from '../assets/process-ridges.jpg';
import sectorArtCollectibles from '../assets/sector-art-collectibles.jpg';
import sectorCommodities from '../assets/sector-commodities.jpg';
import sectorDigitalAssets from '../assets/sector-digital-assets.jpg';
import sectorFamilyOffices from '../assets/sector-family-offices.jpg';
import sectorLuxuryLifestyle from '../assets/sector-luxury-lifestyle.jpg';
import sectorPrivateCapital from '../assets/sector-private-capital.jpg';
import sectorRealEstate from '../assets/sector-real-estate.jpg';
import sectorVentureCapital from '../assets/sector-venture-capital.jpg';

export interface ArtAsset {
  image: ImageMetadata;
  alt: string;
}

/**
 * Generated images are registered by the legacy asset keys used in the data
 * layer. Keep this map keyed by the row, not by the prose description: several
 * sector descriptions pre-date the final board-approved art direction.
 */
export const art: Record<string, ArtAsset> = {
  '#2 bonsai/red-maple tree on rock in still water': {
    image: aboutBonsai,
    alt: 'A sculptural bonsai growing from a dark rock in still water',
  },
  '#3 stepping stones through misty water': {
    image: processRidges,
    alt: 'Layered mountain ridges receding through pale mist',
  },
  '#4 dark cave/stone interior opening onto red maple': {
    image: contactMaple,
    alt: 'A red maple arrangement in a dark stone interior',
  },
  '#5 red maple branch against dark interior wall + shoji light': {
    image: privateCircleDoorway,
    alt: 'A slatted doorway opening onto warm light and maple branches',
  },
  '#6 rough grey stone monolith on ivory': {
    image: capStrategicAdvisory,
    alt: 'A rough grey stone monolith on an ivory ground',
  },
  '#7 red silk/velvet fabric folds, macro': {
    image: capPrivateIntroductions,
    alt: 'Deep red silk folds in close detail',
  },
  '#8 black liquid-marble/ink swirl': {
    image: capInstitutionalMarkets,
    alt: 'A black liquid and marble swirl',
  },
  '#9 white marble geometric block': {
    image: capOpportunities,
    alt: 'A white marble geometric form',
  },
  '#10 stone': {
    image: sectorPrivateCapital,
    alt: 'An angular dark stone',
  },
  '#10 red lacquer sphere': {
    image: sectorFamilyOffices,
    alt: 'A glossy red lacquer sphere',
  },
  '#10 wire ring sculpture': {
    image: sectorVentureCapital,
    alt: 'A pale architectural portal',
  },
  '#10 gold bar': {
    image: sectorCommodities,
    alt: 'A brushed gold bar',
  },
  '#10 stone arch/interior': {
    image: sectorRealEstate,
    alt: 'A pale arched niche',
  },
  '#10 black vessel': {
    image: sectorDigitalAssets,
    alt: 'A chrome twisted torus',
  },
  '#10 designer chair': {
    image: sectorLuxuryLifestyle,
    alt: 'A charcoal upholstered armchair',
  },
  '#10 classical torso': {
    image: sectorArtCollectibles,
    alt: 'A rough tan sandstone sculpture',
  },
  '#11 abstract architecture': {
    image: journalGcc,
    alt: 'Abstract modern architecture in pale light',
  },
  '#11 misty mountain valley': {
    image: journalAsiaEurope,
    alt: 'A misty mountain valley',
  },
  '#11 dark sea stack': {
    image: journalCommodities,
    alt: 'A dark sea stack against still water',
  },
  '#11 golf-estate landscape': {
    image: journalGolf,
    alt: 'A golf estate landscape',
  },
  '#11 brutalist building': {
    image: journalTokenization,
    alt: 'A brutalist concrete building',
  },
};
