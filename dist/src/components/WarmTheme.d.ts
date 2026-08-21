/**
 * @nymrel/headless-quote - Nymrel Warm Paper Theme Tokens & Styles
 * Copyright 2026 Nymrel / JalenBuilds LLC
 * Aesthetics: Warm Cream (#FAF8F2), Soft Linen (#F4F0E6), Cedar Green (#2A332E), Terracotta (#A8541F)
 */
import { ThemeConfig } from '../core/types';
export declare const DEFAULT_WARM_THEME: Required<ThemeConfig>;
export declare const LIGHT_THEME: Required<ThemeConfig>;
export declare const DARK_THEME: Required<ThemeConfig>;
export declare function resolveTheme(userTheme?: ThemeConfig): Required<ThemeConfig>;
/**
 * Generate CSS variables for theme injection
 */
export declare function generateCssVariables(theme: Required<ThemeConfig>): string;
/**
 * Full scoped CSS stylesheet for Nymrel Quote Layer
 */
export declare function getShadowStyles(userTheme?: ThemeConfig): string;
