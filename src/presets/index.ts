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

export const PRESET_REGISTRY: Record<string, QuoteSchema> = {
  roofing: roofingPreset,
  hvac: hvacPreset,
  plumbing: plumbingPreset,
  software: softwarePreset
};

/**
 * Retrieve a preset configuration by name
 */
export function getPreset(name: string): QuoteSchema | undefined {
  const normalized = name.toLowerCase().trim();
  return PRESET_REGISTRY[normalized];
}
