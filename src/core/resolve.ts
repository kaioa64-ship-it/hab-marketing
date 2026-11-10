// src/core/resolve.ts
import {
  OfferItemState,
  TenantBrandKit,
  VisualThemePreset,
} from './types';
import {
  computeOfferMetrics,
  ComputedOfferMetrics,
  generateForensicFingerprint,
  parseWhatsAppSmartPaste,
  SmartPasteResult,
} from './businessRules';

export { parseWhatsAppSmartPaste, generateForensicFingerprint };
export type { SmartPasteResult };

export interface RenderSpec {
  fingerprint: string;
  timestampISO: string;
  canExport: boolean;
  typography: {
    titleScaleClass: string;
    integerPriceFontSizeCqw: string;
    installmentIntegerFontSizeCqw: string;
    conditionBannerScaleClass: string;
  };
  tokens: {
    titleScaleClass: string;
    integerPriceFontSizeCqw: string;
    installmentIntegerFontSizeCqw: string;
    conditionBannerScaleClass: string;
  };
  metrics: ComputedOfferMetrics;
}

export function resolveRenderSpec(
  offer: OfferItemState,
  brandKit: TenantBrandKit,
  _theme: VisualThemePreset,
  costPriceOptional?: number,
  isA5Half?: boolean,
  isGondola?: boolean
): RenderSpec {
  const offerWithCost: OfferItemState =
    costPriceOptional !== undefined ? { ...offer, costPrice: costPriceOptional } : offer;

  const metrics = computeOfferMetrics(
    offerWithCost,
    brandKit.mapaRegistrationCode,
    brandKit
  );

  const charLen = metrics.condensedTitle.length;
  const titleScaleClass = isA5Half
    ? charLen > 40
      ? 'text-[3.8cqw] leading-[1.05]'
      : charLen > 26
        ? 'text-[4.6cqw] leading-[1.06]'
        : 'text-[5.4cqw] leading-[1.08]'
    : isGondola
      ? charLen > 40
        ? 'text-[4.8cqw] leading-[1.05]'
        : charLen > 26
          ? 'text-[5.6cqw] leading-[1.06]'
          : 'text-[6.5cqw] leading-[1.08]'
      : charLen > 40
        ? 'text-[5.2cqw] leading-[1.05]'
        : charLen > 26
          ? 'text-[6.2cqw] leading-[1.06]'
          : 'text-[7.2cqw] leading-[1.08]';

  const intDigits = metrics.integerPart.length;
  const integerPriceFontSizeCqw = isA5Half
    ? intDigits >= 5
      ? '17cqw'
      : intDigits === 4
        ? '13cqw'
        : intDigits === 3
          ? '16cqw'
          : '19cqw'
    : isGondola
      ? intDigits >= 5
        ? '15cqw'
        : intDigits === 4
          ? '18.5cqw'
          : intDigits === 3
            ? '23cqw'
            : '27.5cqw'
      : intDigits >= 5
        ? '17cqw'
        : intDigits === 4
          ? '21cqw'
          : intDigits === 3
            ? '26cqw'
            : '31cqw';

  const instDigits = metrics.installmentIntegerPart.length;
  const installmentIntegerFontSizeCqw = isA5Half
    ? instDigits >= 4
      ? '11.5cqw'
      : instDigits === 3
        ? '14cqw'
        : '16.5cqw'
    : isGondola
      ? instDigits >= 4
        ? '15.5cqw'
        : instDigits === 3
          ? '19.5cqw'
          : '23cqw'
      : instDigits >= 4
        ? '18.5cqw'
        : instDigits === 3
          ? '23cqw'
          : '27cqw';

  const condLen = metrics.conditionHeadlineText.length;
  const conditionBannerScaleClass = isA5Half
    ? condLen > 28
      ? 'text-[3.4cqw] leading-[1.06]'
      : 'text-[4.4cqw] leading-[1.06]'
    : isGondola
      ? condLen > 28
        ? 'text-[4.4cqw] leading-[1.06]'
        : 'text-[5.6cqw] leading-[1.06]'
      : condLen > 28
        ? 'text-[5.2cqw] leading-[1.06]'
        : 'text-[6.6cqw] leading-[1.06]';

  const typographyTokens = {
    titleScaleClass,
    integerPriceFontSizeCqw,
    installmentIntegerFontSizeCqw,
    conditionBannerScaleClass,
  };

  return {
    fingerprint: metrics.forensicId,
    timestampISO: new Date().toISOString(),
    canExport: metrics.canExport,
    typography: typographyTokens,
    tokens: typographyTokens,
    metrics,
  };
}
