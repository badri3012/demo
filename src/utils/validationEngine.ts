import type { ConfigurationState, ValidationIssue } from '../types/configurator';

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
}

export function validateConfiguration(
  config: ConfigurationState,
  applyResolution?: (updates: Partial<ConfigurationState>) => void
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Rule 1: High-gloss Acrylic cannot be bonded to standard Plywood due to surface telegraphing
  if (config.finishType === 'acrylic' && config.coreMaterial === 'plywood') {
    issues.push({
      type: 'error',
      code: 'ERR_ACRYLIC_PLY_TELEGRAPH',
      title: 'Substrate & Finish Incompatibility',
      description:
        'High-Gloss Acrylic (Aqua Series) requires a perfectly uniform, calibrated substrate. Bonding 2mm mirror acrylic to natural plywood causes veneer grain telegraphing (optical waves). Factory standards mandate Action TESA HDHMR® substrate.',
      suggestedAction: applyResolution
        ? {
            label: 'Switch Substrate to HDHMR (Recommended)',
            applyFix: () => applyResolution({ coreMaterial: 'hdhmr' }),
          }
        : undefined,
    });
  }

  // Rule 2: Floating Horizon Shelf with Upholstered panel overlap
  if (config.headboardStyle === 'floating_shelf' && config.finishType === 'acrylic') {
    issues.push({
      type: 'warning',
      code: 'WARN_SHELF_ACRYLIC_JOINT',
      title: 'Machining Advisory: Integrated Shelf Mitres',
      description:
        'The Floating Horizon Ledge features 45° mitred edge joinery. High-gloss acrylic edge-gluing requires specialized PUR laser profiling to prevent micro-chipping during edge preparation.',
    });
  }

  // Rule 3: Storage drawers load rating advisory on EcoModular core
  if (config.hasStorageDrawers && config.coreMaterial === 'engineered_wood') {
    issues.push({
      type: 'info',
      code: 'INFO_ECO_DRAWER_BRACKET',
      title: 'Structural Reinforcement Specification',
      description:
        'When EcoModular core is paired with under-bed storage drawers, production specifications include steel structural corner gussets to support 50kg dynamic pull ratings.',
    });
  }

  const isValid = !issues.some((issue) => issue.type === 'error');

  return {
    isValid,
    issues,
  };
}
