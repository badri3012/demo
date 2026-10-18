import type {
  SizeOption,
  MaterialOption,
  FinishOption,
  ColorOption,
  HardwareOption,
  HeadboardOption,
  ConfigurationState,
} from '../types/configurator';

export const FLAGSHIP_PRODUCT = {
  id: 'FLX-COT-AURA',
  name: 'Aura Platform Bed',
  collection: 'Master Bedroom Series',
  tagline: 'Precision-crafted architectural platform bed with optional concealed storage',
  description:
    'A minimalist centerpiece engineered for modern living. Features tapered solid wood-style legs with brushed brass accents, precision mitred corners, and an optional whisper-quiet dual under-bed drawer module. Every component is cut to 0.1mm tolerance on automated CNC machining centers.',
  origin: 'Designed in Bengaluru • Manufactured in Karnataka',
};

export const SIZES: SizeOption[] = [
  {
    id: 'queen',
    name: 'Queen Size',
    subtitle: 'Standard Indian Queen',
    mattressSize: '60" × 78" (1524 × 1980 mm)',
    frameDimensions: {
      width: 1620,
      length: 2100,
      height: 1050,
    },
    basePrice: 48500,
  },
  {
    id: 'king',
    name: 'King Size',
    subtitle: 'Grand Indian King',
    mattressSize: '72" × 78" (1828 × 1980 mm)',
    frameDimensions: {
      width: 1920,
      length: 2100,
      height: 1050,
    },
    basePrice: 56000,
  },
];

export const CORE_MATERIALS: MaterialOption[] = [
  {
    id: 'hdhmr',
    name: 'Action TESA HDHMR®',
    tagline: 'High Density High Moisture Resistance (850 kg/m³)',
    description:
      'Engineered specifically for high-durability residential furniture. Highly resistant to termite and moisture swelling. Smooth homogeneous core provides the superior substrate for Italian PU coating.',
    density: '850 kg/m³',
    moistureResistance: 'Grade 1 Certified (IS 5509)',
    durabilityRating: '15+ Years Commercial',
    priceDelta: 0, // Baseline standard
    badge: 'Recommended',
  },
  {
    id: 'plywood',
    name: 'Calibrated BWP Marine Ply',
    tagline: 'IS:710 Grade Hardwood Core Marine Plywood',
    description:
      'Boiling Water Proof multi-ply hardwood veneer core calibrated to uniform thickness on four-head sanding machinery. Extreme screw-holding capacity for heavy structural loads.',
    density: '760 kg/m³',
    moistureResistance: '72-Hour Boiling Water Proof (IS 710)',
    durabilityRating: '20+ Years Structural',
    priceDelta: 5500,
    badge: 'Heavy Duty',
  },
  {
    id: 'engineered_wood',
    name: 'EcoModular Engineered Core',
    tagline: 'FSC-Certified Calibrated High-Yield Composite',
    description:
      'Sustainably sourced plantation timber core treated with non-toxic binding resins. Lightweight flat-pack transport footprint with excellent thermal stability.',
    density: '680 kg/m³',
    moistureResistance: 'Standard Moisture Resistant (MR)',
    durabilityRating: '10+ Years Residential',
    priceDelta: -3500,
    badge: 'Eco Efficient',
  },
];

export const FINISHES: FinishOption[] = [
  {
    id: 'pu_coating',
    name: 'Cinzel Italian PU Coating',
    series: 'Cinzel',
    description:
      'Hand-sprayed 7-step polyurethane formulation in temperature-controlled paint booths. Delivers a tactile soft-matte velvet finish with seamless edge wrapping.',
    sheen: 'Soft Satin (15 GU)',
    scratchResistance: '4H Pencil Hardness',
    priceDelta: 6500,
    badge: 'Cinzel Signature',
  },
  {
    id: 'acrylic',
    name: 'Aqua High-Gloss Acrylic',
    series: 'Aqua',
    description:
      '2mm Senosan® scratch-resistant optical polymer acrylic sheet fused with zero-joint hot air laser edgebanding. Provides luminous depth and reflection.',
    sheen: 'High Mirror Gloss (90+ GU)',
    scratchResistance: '6H Scratch Resistant',
    priceDelta: 4800,
    badge: 'Aqua Series',
  },
  {
    id: 'matte_laminate',
    name: 'Synchronized Matte Laminate',
    series: 'Ecomodular',
    description:
      '1mm high-pressure decorative laminate featuring synchronized tactile wood pores and anti-fingerprint nanotech surface.',
    sheen: 'Deep Matte (5 GU)',
    scratchResistance: 'Commercial Abrasion Class AC4',
    priceDelta: 0, // Baseline
    badge: 'Ecomodular',
  },
];

export const COLOR_TONES: ColorOption[] = [
  {
    id: 'american_walnut',
    name: 'American Walnut',
    hex: '#5A3D28',
    woodGrain: true,
    roughness: 0.45,
    metalness: 0.05,
    textureType: 'wood_dark',
    description: 'Deep espresso timber tone with warm caramel sapwood accents and organic flow.',
  },
  {
    id: 'natural_oak',
    name: 'Scandinavian Natural Oak',
    hex: '#B89B72',
    woodGrain: true,
    roughness: 0.55,
    metalness: 0.02,
    textureType: 'wood_light',
    description: 'Sun-bleached blonde Nordic oak with subtle grey undertones and authentic grain pores.',
  },
  {
    id: 'warm_ivory',
    name: 'Warm Ivory Lacquer',
    hex: '#EFECE4',
    woodGrain: false,
    roughness: 0.25,
    metalness: 0.08,
    textureType: 'lacquer_ivory',
    description: 'Architectural warm off-white inspired by natural travertine and limestone interiors.',
  },
  {
    id: 'stone_grey',
    name: 'Stone Grey Satin',
    hex: '#7A7A78',
    woodGrain: false,
    roughness: 0.35,
    metalness: 0.04,
    textureType: 'satin_grey',
    description: 'Subdued contemporary mid-grey offering timeless contrast against warm timber accents.',
  },
];

export const HEADBOARD_STYLES: HeadboardOption[] = [
  {
    id: 'architectural_slats',
    name: 'Architectural Linear Slats',
    description: 'Precision-grooved vertical acoustic timber fluting with concealed ambient shadow gap.',
    priceDelta: 0,
  },
  {
    id: 'upholstered_panel',
    name: 'Monolithic Inset Cushion',
    description: 'Subtly padded premium Belgian linen weave insert framed by solid hardwood perimeter mitres.',
    priceDelta: 4200,
  },
  {
    id: 'floating_shelf',
    name: 'Floating Horizon Ledge',
    description: 'Integrated solid-wood top display shelf with recessed wireless phone charging indentation.',
    priceDelta: 2800,
  },
];

export const HARDWARE_PACKAGES: HardwareOption[] = [
  {
    id: 'hettich_premium',
    name: 'Hettich Quadro V6 Silent',
    brand: 'Hettich (Germany)',
    description:
      'German concealed undermount drawer slide with integrated Silent System soft-close damping and 30kg load capacity.',
    specs: ['Concealed undermount', 'Integrated liquid damping', 'Tool-free height adjustment', '100,000 cycle guarantee'],
    priceDelta: 0,
  },
  {
    id: 'hafele_silent',
    name: 'Häfele Matrix Box Heavy Duty',
    brand: 'Häfele (Germany)',
    description:
      'Double-wall metal drawer side system with synchronized rack-and-pinion runner motion and 50kg load capacity.',
    specs: ['Double-wall steel sides', 'Synchronized full extension', 'Integrated Smuso soft-closing', 'Heavy duty rating'],
    priceDelta: 3200,
  },
];

export const DEFAULT_CONFIGURATION: ConfigurationState = {
  productFamily: 'Beds & Cots',
  modelName: 'Aura Platform Bed',
  size: 'queen',
  coreMaterial: 'hdhmr',
  finishType: 'pu_coating',
  colorTone: 'american_walnut',
  headboardStyle: 'architectural_slats',
  hasStorageDrawers: false,
  hardwarePackage: 'hettich_premium',
  drawersOpen: false,
};
