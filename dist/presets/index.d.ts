/**
 * @nymrel/headless-quote - Presets Registry
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */
import { QuoteSchema } from '../core/types';
import { roofingPreset } from './roofing';
import { hvacPreset } from './hvac';
import { plumbingPreset } from './plumbing';
import { softwarePreset } from './software';
export { roofingPreset, hvacPreset, plumbingPreset, softwarePreset };
export declare const PRESET_REGISTRY: Record<string, QuoteSchema>;
/**
 * Retrieve a preset configuration by name
 */
export declare function getPreset(name: string): QuoteSchema | undefined;
