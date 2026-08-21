/**
 * @nymrel/headless-quote - Standalone Browser Embed Bundle
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */
import { NymrelQuoteLayerElement } from './web-component/NymrelQuoteLayer';
import { createQuoteWidget, NymrelQuoteWidget } from './components/QuoteWidget';
import { calculateQuote, formatCurrency, generateQuoteId } from './core/engine';
import { extractAttribution, emitAnalyticsEvent } from './core/attribution';
import { getPreset, PRESET_REGISTRY } from './presets';
import { getShadowStyles } from './components/WarmTheme';
declare const NymrelQuote: {
    version: string;
    createQuoteWidget: typeof createQuoteWidget;
    NymrelQuoteWidget: typeof NymrelQuoteWidget;
    NymrelQuoteLayerElement: typeof NymrelQuoteLayerElement;
    calculateQuote: typeof calculateQuote;
    formatCurrency: typeof formatCurrency;
    generateQuoteId: typeof generateQuoteId;
    extractAttribution: typeof extractAttribution;
    emitAnalyticsEvent: typeof emitAnalyticsEvent;
    getPreset: typeof getPreset;
    presets: Record<string, import(".").QuoteSchema>;
    themes: {
        warm: Required<import(".").ThemeConfig>;
        light: Required<import(".").ThemeConfig>;
        dark: Required<import(".").ThemeConfig>;
        getShadowStyles: typeof getShadowStyles;
    };
};
export default NymrelQuote;
export { NymrelQuoteLayerElement, NymrelQuoteWidget, createQuoteWidget, calculateQuote, formatCurrency, extractAttribution, getPreset, PRESET_REGISTRY };
