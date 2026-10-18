export interface CatalogueItem {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'concept_ready' | 'future_roadmap';
  tagline: string;
  description: string;
  materialsPreview: string[];
  dimensionsRange: string;
  estimatedLeadTime: string;
  imagePlaceholder: string;
}

export const CATALOGUE_PRODUCTS: CatalogueItem[] = [
  {
    id: 'CAT-BED-AURA',
    title: 'Aura Platform Bed',
    category: 'Beds & Cots',
    status: 'active',
    tagline: 'Precision engineered platform cot with concealed storage chassis',
    description: 'Active Flagship 3D Configurator. Customizable in King/Queen, PU Italian lacquer, Action TESA HDHMR, and German soft-close undermount drawer slides.',
    materialsPreview: ['HDHMR Core', 'Italian PU Coat', 'American Walnut', 'Hettich Quadro'],
    dimensionsRange: '1620 - 1920 mm (W) × 2100 mm (L)',
    estimatedLeadTime: '14 - 18 Days',
    imagePlaceholder: 'cot',
  },
  {
    id: 'CAT-DESK-SOLO',
    title: 'Kanso Minimalist Study Desk',
    category: 'Study & Workstations',
    status: 'concept_ready',
    tagline: 'Cable-managed architectural study table with wireless power channel',
    description: 'Designed for contemporary home offices. Configurable desktop length (1200mm to 1800mm), solid fluted privacy baffle, and magnetic power grommet.',
    materialsPreview: ['Calibrated Birch Ply', 'Matte Laminate', 'Natural Oak'],
    dimensionsRange: '1200 - 1800 mm (W) × 650 mm (D)',
    estimatedLeadTime: '12 - 16 Days (Pilot Q1)',
    imagePlaceholder: 'study',
  },
  {
    id: 'CAT-TABLE-PRISM',
    title: 'Verve Sintered Stone Dining Table',
    category: 'Dining Tables',
    status: 'concept_ready',
    tagline: 'Thermal-shockproof sintered porcelain top over sculptural chamfered base',
    description: 'Customizable 6-seater and 8-seater configurations with Laurent Gold or Calacatta marble slab insets and powder-coated steel spaceframe.',
    materialsPreview: ['12mm Sintered Stone', 'Cast Aluminum Base', 'Walnut Apron'],
    dimensionsRange: '1800 - 2400 mm (L) × 950 mm (W)',
    estimatedLeadTime: '18 - 22 Days (Pilot Q2)',
    imagePlaceholder: 'dining',
  },
  {
    id: 'CAT-SHELF-MODU',
    title: 'Grid Modular Architectural Bookshelf',
    category: 'Bookshelves & Storage',
    status: 'concept_ready',
    tagline: 'Asymmetric open & closed modular shelving with integrated ambient backlight',
    description: 'Parametric box matrix that scales to room ceiling heights from 2400mm to 3000mm. Features touch-latch acoustic felt door accents.',
    materialsPreview: ['Action TESA HDHMR', 'Aqua Mirror Acrylic', 'Stone Grey'],
    dimensionsRange: '900 - 2700 mm (W) × 2400 mm (H)',
    estimatedLeadTime: '16 - 20 Days (Pilot Q2)',
    imagePlaceholder: 'bookshelf',
  },
  {
    id: 'CAT-CROCK-VUE',
    title: 'Linea Fluted Glass Crockery Unit',
    category: 'Crockery Units',
    status: 'concept_ready',
    tagline: 'Slimline anodized aluminum profile vitrine with warm 3000K internal wash',
    description: 'Showcase fine tableware with fluted moru glass doors, velvet-lined cutlery organizers, and wine stemware hanging racks.',
    materialsPreview: ['Moru Fluted Glass', 'Anodized Champagne Gold', 'BWP Ply'],
    dimensionsRange: '1200 - 1800 mm (W) × 2100 mm (H)',
    estimatedLeadTime: '18 - 24 Days (Pilot Q2)',
    imagePlaceholder: 'crockery',
  },
  {
    id: 'CAT-PUJA-DIVINE',
    title: 'Sannidhi Contoured Mandir / Puja Unit',
    category: 'Puja Units',
    status: 'concept_ready',
    tagline: 'Sacred architectural geometry with CNC backlit Corian jaali lattice',
    description: 'Reverent home sanctum featuring brass bell hanging insets, seamless drawer compartments for puja essentials, and warm perimeter illumination.',
    materialsPreview: ['Dupont Corian Jaali', 'Burma Teak Veneer', 'Brushed Brass Inlay'],
    dimensionsRange: '900 - 1500 mm (W) × 1800 mm (H)',
    estimatedLeadTime: '21 - 25 Days (Pilot Q3)',
    imagePlaceholder: 'puja',
  },
  {
    id: 'CAT-VANITY-AQUA',
    title: 'Luxe Floating Bathroom Vanity',
    category: 'Bathroom Vanities',
    status: 'concept_ready',
    tagline: '100% waterproof BWP core vanity with integrated seamless quartz basin',
    description: 'Engineered for humid wet environments. Features Häfele waterproof soft-close drawers with U-shaped plumbing cutouts and anti-fog LED mirror.',
    materialsPreview: ['IS:710 Marine Ply', 'Corian Solid Surface', 'Aqua Acrylic'],
    dimensionsRange: '800 - 1400 mm (W) × 520 mm (D)',
    estimatedLeadTime: '14 - 18 Days (Pilot Q3)',
    imagePlaceholder: 'vanity',
  },
  {
    id: 'CAT-SOFA-NEXUS',
    title: 'Nexus Modular Sectional Seating',
    category: 'Sofas & Living (Roadmap)',
    status: 'future_roadmap',
    tagline: 'High-resilience multi-density foam seating with stain-repellent performance weave',
    description: 'Upcoming upholstery product line under preliminary development for Phase 4 expansion. High-density 40D foam with pocket spring support core.',
    materialsPreview: ['Belgian Performance Linen', 'Kiln-Dried Sal Wood Frame'],
    dimensionsRange: 'Configurable Modular Chaises',
    estimatedLeadTime: 'Future Roadmap Phase 4',
    imagePlaceholder: 'sofa',
  },
];
