import type { ConfigurationState, ManufacturingSpec, BOMItem } from '../types/configurator';
import { SIZES, CORE_MATERIALS, FINISHES, COLOR_TONES, HARDWARE_PACKAGES } from '../data/productData';

export function generateManufacturingSpec(config: ConfigurationState): ManufacturingSpec {
  const sizeObj = SIZES.find((s) => s.id === config.size) || SIZES[0];
  const matObj = CORE_MATERIALS.find((m) => m.id === config.coreMaterial) || CORE_MATERIALS[0];
  const finObj = FINISHES.find((f) => f.id === config.finishType) || FINISHES[0];
  const colObj = COLOR_TONES.find((c) => c.id === config.colorTone) || COLOR_TONES[0];
  const hwObj = HARDWARE_PACKAGES.find((h) => h.id === config.hardwarePackage) || HARDWARE_PACKAGES[0];

  const sizeCode = config.size === 'king' ? 'KG' : 'QN';
  const matCode = config.coreMaterial === 'hdhmr' ? 'HD' : config.coreMaterial === 'plywood' ? 'PLY' : 'ECO';
  const finCode = config.finishType === 'pu_coating' ? 'PU' : config.finishType === 'acrylic' ? 'ACR' : 'LAM';
  const colCode = config.colorTone.substring(0, 3).toUpperCase();
  const strgCode = config.hasStorageDrawers ? 'DRW' : 'STD';

  const configId = `FLX-AURA-${sizeCode}-${matCode}-${finCode}-${colCode}-${strgCode}`;

  const width = sizeObj.frameDimensions.width;
  const length = sizeObj.frameDimensions.length;
  const height = sizeObj.frameDimensions.height;

  // Generate detailed Bill of Materials
  const bomItems: BOMItem[] = [
    {
      id: 'BOM-001',
      partName: 'Headboard Facia Panel (CNC Grooved / Inset)',
      quantity: 1,
      dimensions: `${width} × 850 × 25 mm`,
      material: matObj.name,
      finish: `${finObj.name} (${colObj.name})`,
      edgeband: '2mm Impact PVC / PUR Glue',
      routingCode: 'CNC-NEST-ROUTER-01',
    },
    {
      id: 'BOM-002',
      partName: 'Headboard Structural Stiffener Rail',
      quantity: 2,
      dimensions: `${width - 80} × 120 × 25 mm`,
      material: 'Kiln-Dried Hardwood Support',
      finish: 'Clear Seal Primer',
      edgeband: 'Raw Sanded',
      routingCode: 'SAW-CROSSCUT-04',
    },
    {
      id: 'BOM-003',
      partName: 'Side Rails / Aprons (Left & Right)',
      quantity: 2,
      dimensions: `${length - 100} × 220 × 25 mm`,
      material: matObj.name,
      finish: `${finObj.name} (${colObj.name})`,
      edgeband: '2mm Impact PVC / Zero-Joint Hot-Air',
      routingCode: 'EDGE-PUR-02',
    },
    {
      id: 'BOM-004',
      partName: 'Footboard Rail with Mitred Corners',
      quantity: 1,
      dimensions: `${width} × 220 × 25 mm`,
      material: matObj.name,
      finish: `${finObj.name} (${colObj.name})`,
      edgeband: '2mm Matching Edgeband',
      routingCode: 'CNC-MITRE-45',
    },
    {
      id: 'BOM-005',
      partName: 'Solid Teak-Style Tapered Legs (Turned)',
      quantity: 4,
      dimensions: '80 × 80 × 200 mm (Tapered to 45mm)',
      material: 'Grade-A Plantation Timber',
      finish: 'Deep Walnut Tint + Satin Lacquer',
      edgeband: 'Brushed Brass Metal Ferrule Sleeve',
      routingCode: 'LATHE-TURNING-03',
    },
    {
      id: 'BOM-006',
      partName: 'Heavy-Duty Centre Spine Beam',
      quantity: 1,
      dimensions: `${length - 120} × 75 × 50 mm`,
      material: 'Powder-Coated Structural Steel Tubing',
      finish: 'Matte Charcoal Electrostatic Coat',
      edgeband: 'N/A',
      routingCode: 'STEEL-FAB-01',
    },
    {
      id: 'BOM-007',
      partName: 'Flexible Birch Wood Mattress Slats',
      quantity: 28,
      dimensions: `${Math.round((width - 60) / 2)} × 53 × 12 mm`,
      material: 'Laminated Birch Plywood Sprung Slats',
      finish: 'Natural Resin Polish',
      edgeband: 'Tumble Beveled',
      routingCode: 'SLAT-BEND-02',
    },
  ];

  if (config.hasStorageDrawers) {
    bomItems.push(
      {
        id: 'BOM-008',
        partName: 'Under-Bed Drawer Facia Panels',
        quantity: 2,
        dimensions: `${Math.round((length - 200) / 2)} × 180 × 19 mm`,
        material: matObj.name,
        finish: `${finObj.name} (${colObj.name})`,
        edgeband: '2mm Matching PUR Edgeband',
        routingCode: 'CNC-NEST-ROUTER-01',
      },
      {
        id: 'BOM-009',
        partName: 'Under-Bed Internal Drawer Chassis Boxes',
        quantity: 2,
        dimensions: `${Math.round((length - 260) / 2)} × 650 × 140 mm`,
        material: '16mm Pre-Laminated Antibacterial Birch White',
        finish: 'Textured Melamine Inner Face',
        edgeband: '1mm Moisture Proof PVC',
        routingCode: 'BOR-5AX-DOWEL',
      },
      {
        id: 'BOM-010',
        partName: `Drawer Runners: ${hwObj.brand}`,
        quantity: 2,
        dimensions: '550mm Full Extension Synchronized Slide Pairs',
        material: 'Cold-Rolled Galvanized Spring Steel',
        finish: 'Zinc Plated / Soft-Close Piston',
        edgeband: 'Integrated Silent Buffer',
        routingCode: 'HW-PACK-KITTING',
      }
    );
  }

  // Weight & packaging calculations
  const baseWeight = config.size === 'king' ? 78 : 68;
  const storageWeight = config.hasStorageDrawers ? 22 : 0;
  const matFactor = config.coreMaterial === 'hdhmr' ? 1.1 : config.coreMaterial === 'plywood' ? 1.05 : 0.95;
  const estimatedWeightKg = Math.round((baseWeight + storageWeight) * matFactor);
  const flatPackBoxes = config.hasStorageDrawers ? 4 : 3;
  const packagingVolumeM3 = config.size === 'king' ? 0.46 : 0.39;

  return {
    configId,
    timestamp: new Date().toISOString(),
    productSKU: 'FLX-BED-AURA-2026',
    dimensionsMM: { width, length, height },
    coreSubstrate: matObj.name,
    exteriorFinish: finObj.name,
    colorway: colObj.name,
    hardwarePackage: hwObj.name,
    storageModules: config.hasStorageDrawers
      ? 'Dual Under-bed Soft-Close Pull-Out Chassis'
      : 'Floating Platform (No Drawers)',
    estimatedWeightKg,
    flatPackBoxes,
    packagingVolumeM3,
    bomItems,
    ruleVersion: 'v2.4.1 (Flexispace Engineering Studio)',
    pricingRuleVersion: 'PR-2026-Q4-BENGALURU',
  };
}
