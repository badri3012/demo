// Types for Flexispace Furniture Configurator & Manufacturing Platform

export type BedSize = 'queen' | 'king';

export interface SizeOption {
  id: BedSize;
  name: string;
  subtitle: string;
  mattressSize: string; // e.g. "60\" x 78\" (1520 x 1980 mm)"
  frameDimensions: {
    width: number;  // mm
    length: number; // mm
    height: number; // mm
  };
  basePrice: number;
}

export type CoreMaterial = 'plywood' | 'hdhmr' | 'engineered_wood';

export interface MaterialOption {
  id: CoreMaterial;
  name: string;
  tagline: string;
  description: string;
  density: string;
  moistureResistance: string;
  durabilityRating: string;
  priceDelta: number;
  badge?: string;
}

export type FinishType = 'pu_coating' | 'acrylic' | 'matte_laminate';

export interface FinishOption {
  id: FinishType;
  name: string;
  series: 'Cinzel' | 'Aqua' | 'Ecomodular'; // Matching Flexispace series
  description: string;
  sheen: string;
  scratchResistance: string;
  priceDelta: number;
  badge?: string;
}

export type ColorTone = 'american_walnut' | 'natural_oak' | 'warm_ivory' | 'stone_grey';

export interface ColorOption {
  id: ColorTone;
  name: string;
  hex: string;
  woodGrain: boolean;
  roughness: number;
  metalness: number;
  textureType: 'wood_dark' | 'wood_light' | 'lacquer_ivory' | 'satin_grey';
  description: string;
}

export type HardwarePackage = 'hettich_premium' | 'hafele_silent';

export interface HardwareOption {
  id: HardwarePackage;
  name: string;
  brand: string;
  description: string;
  specs: string[];
  priceDelta: number;
}

export type HeadboardStyle = 'architectural_slats' | 'upholstered_panel' | 'floating_shelf';

export interface HeadboardOption {
  id: HeadboardStyle;
  name: string;
  description: string;
  priceDelta: number;
}

export interface ConfigurationState {
  productFamily: string;
  modelName: string;
  size: BedSize;
  coreMaterial: CoreMaterial;
  finishType: FinishType;
  colorTone: ColorTone;
  headboardStyle: HeadboardStyle;
  hasStorageDrawers: boolean;
  hardwarePackage: HardwarePackage;
  drawersOpen: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  sizeAdjustment: number;
  materialAdjustment: number;
  finishAdjustment: number;
  headboardAdjustment: number;
  storageAdjustment: number;
  hardwareAdjustment: number;
  packagingAndLogistics: number;
  subtotal: number;
  gstAmount: number; // 18% standard GST for illustrative calculations
  totalMRP: number;
  dealerDiscountRate: number; // ~30% standard dealer margin
  dealerLandingPrice: number;
  dealerGrossMargin: number;
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  title: string;
  description: string;
  suggestedAction?: {
    label: string;
    applyFix: () => void;
  };
}

export interface BOMItem {
  id: string;
  partName: string;
  quantity: number;
  dimensions: string; // e.g., "1980 x 250 x 25 mm"
  material: string;
  finish: string;
  edgeband: string;
  routingCode: string;
}

export interface ManufacturingSpec {
  configId: string;
  timestamp: string;
  productSKU: string;
  dimensionsMM: {
    width: number;
    length: number;
    height: number;
  };
  coreSubstrate: string;
  exteriorFinish: string;
  colorway: string;
  hardwarePackage: string;
  storageModules: string;
  estimatedWeightKg: number;
  flatPackBoxes: number;
  packagingVolumeM3: number;
  bomItems: BOMItem[];
  ruleVersion: string;
  pricingRuleVersion: string;
}

export type ERPStageId =
  | 'received'
  | 'cad_validation'
  | 'manufacturing_approval'
  | 'production_queue'
  | 'cnc_machining'
  | 'quality_inspection'
  | 'flatpack_dispatch'
  | 'dealer_installation'
  | 'completed';

export interface ERPStage {
  id: ERPStageId;
  title: string;
  facility: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending';
  operatorNotes: string;
}
