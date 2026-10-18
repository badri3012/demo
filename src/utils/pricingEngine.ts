import type { ConfigurationState, PriceBreakdown } from '../types/configurator';
import {
  SIZES,
  CORE_MATERIALS,
  FINISHES,
  HEADBOARD_STYLES,
  HARDWARE_PACKAGES,
} from '../data/productData';

export function calculatePrice(config: ConfigurationState): PriceBreakdown {
  const sizeObj = SIZES.find((s) => s.id === config.size) || SIZES[0];
  const matObj = CORE_MATERIALS.find((m) => m.id === config.coreMaterial) || CORE_MATERIALS[0];
  const finObj = FINISHES.find((f) => f.id === config.finishType) || FINISHES[0];
  const hbObj = HEADBOARD_STYLES.find((h) => h.id === config.headboardStyle) || HEADBOARD_STYLES[0];
  const hwObj = HARDWARE_PACKAGES.find((hw) => hw.id === config.hardwarePackage) || HARDWARE_PACKAGES[0];

  const basePrice = sizeObj.basePrice;
  const sizeAdjustment = config.size === 'king' ? 7500 : 0;
  const materialAdjustment = matObj.priceDelta;
  const finishAdjustment = finObj.priceDelta;
  const headboardAdjustment = hbObj.priceDelta;
  const storageAdjustment = config.hasStorageDrawers ? 8500 : 0;
  const hardwareAdjustment = config.hasStorageDrawers ? hwObj.priceDelta : 0;
  const packagingAndLogistics = 2400;

  const subtotal =
    basePrice +
    materialAdjustment +
    finishAdjustment +
    headboardAdjustment +
    storageAdjustment +
    hardwareAdjustment +
    packagingAndLogistics;

  // Illustrative 18% GST standard in India
  const gstAmount = Math.round(subtotal * 0.18);
  const totalMRP = subtotal + gstAmount;

  // Illustrative Dealer Economics (30% dealer spread matching client discussion)
  const dealerDiscountRate = 0.30;
  const dealerLandingPrice = Math.round(totalMRP * (1 - dealerDiscountRate));
  const dealerGrossMargin = totalMRP - dealerLandingPrice;

  return {
    basePrice,
    sizeAdjustment,
    materialAdjustment,
    finishAdjustment,
    headboardAdjustment,
    storageAdjustment,
    hardwareAdjustment,
    packagingAndLogistics,
    subtotal,
    gstAmount,
    totalMRP,
    dealerDiscountRate,
    dealerLandingPrice,
    dealerGrossMargin,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
