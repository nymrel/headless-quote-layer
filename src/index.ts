/**
 * @nymrel/headless-quote
 * Zero-dependency embeddable visual quote calculator, dynamic range estimator, and lead capture engine with Nymrel Warm Paper aesthetics.
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

// Core Engine & Types
export * from './core/types';
export * from './core/engine';
export * from './core/attribution';

// Design Tokens & Aesthetics
export * from './components/WarmTheme';

// Vanilla & Web Component
export * from './components/QuoteWidget';
export * from './web-component/NymrelQuoteLayer';
export * from './web-component';

// Presets
export * from './presets';

// React Integration
export { QuoteWidget, useQuoteEngine, type QuoteWidgetProps } from './components/ReactQuoteWidget';
