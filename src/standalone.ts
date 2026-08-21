/**
 * @nymrel/headless-quote - Standalone Browser Embed Bundle
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import { NymrelQuoteLayerElement, registerWebComponent } from './web-component/NymrelQuoteLayer';
import { createQuoteWidget, NymrelQuoteWidget } from './components/QuoteWidget';
import { calculateQuote, formatCurrency, generateQuoteId } from './core/engine';
import { extractAttribution, emitAnalyticsEvent } from './core/attribution';
import { getPreset, PRESET_REGISTRY } from './presets';
import { DEFAULT_WARM_THEME, LIGHT_THEME, DARK_THEME, getShadowStyles } from './components/WarmTheme';

// Auto-register the custom element immediately
registerWebComponent('nymrel-quote-layer');

// Expose browser global
const NymrelQuote = {
  version: '1.0.0',
  createQuoteWidget,
  NymrelQuoteWidget,
  NymrelQuoteLayerElement,
  calculateQuote,
  formatCurrency,
  generateQuoteId,
  extractAttribution,
  emitAnalyticsEvent,
  getPreset,
  presets: PRESET_REGISTRY,
  themes: {
    warm: DEFAULT_WARM_THEME,
    light: LIGHT_THEME,
    dark: DARK_THEME,
    getShadowStyles
  }
};

if (typeof window !== 'undefined') {
  (window as any).NymrelQuote = NymrelQuote;
}

export default NymrelQuote;
export {
  NymrelQuoteLayerElement,
  NymrelQuoteWidget,
  createQuoteWidget,
  calculateQuote,
  formatCurrency,
  extractAttribution,
  getPreset,
  PRESET_REGISTRY
};
