/**
 * @nymrel/headless-quote - Presets Verification Tests
 */

import { describe, it, expect } from 'vitest';
import { calculateQuote } from '../src/core/engine';
import { getPreset, PRESET_REGISTRY } from '../src/presets';
import { roofingPreset } from '../src/presets/roofing';
import { hvacPreset } from '../src/presets/hvac';
import { plumbingPreset } from '../src/presets/plumbing';
import { softwarePreset } from '../src/presets/software';

describe('Presets Registry', () => {
  it('retrieves all built-in presets by name', () => {
    expect(getPreset('roofing')).toBe(roofingPreset);
    expect(getPreset('ROOFING')).toBe(roofingPreset);
    expect(getPreset('hvac')).toBe(hvacPreset);
    expect(getPreset('plumbing')).toBe(plumbingPreset);
    expect(getPreset('software')).toBe(softwarePreset);
    expect(getPreset('nonexistent')).toBeUndefined();
  });

  it('returns finite ordered ranges for every preset default state', () => {
    for (const preset of Object.values(PRESET_REGISTRY)) {
      const result = calculateQuote(preset, {});
      expect(Number.isFinite(result.min), preset.id).toBe(true);
      expect(Number.isFinite(result.target), preset.id).toBe(true);
      expect(Number.isFinite(result.max), preset.id).toBe(true);
      expect(result.min, preset.id).toBeGreaterThanOrEqual(0);
      expect(result.target, preset.id).toBeGreaterThanOrEqual(result.min);
      expect(result.max, preset.id).toBeGreaterThanOrEqual(result.target);
      expect(result.breakdown.every(item => Number.isFinite(item.amount)), preset.id).toBe(true);
    }
  });
});

describe('Preset: Roofing & Siding Calculator', () => {
  it('calculates realistic ranges for standard 2,200 sq ft roof', () => {
    const res = calculateQuote(roofingPreset, {
      roof_sqft: 2200,
      roof_pitch: 'medium',
      stories: '1',
      material: 'arch_shingle',
      addons: ['tear_off']
    });

    expect(res.min).toBeGreaterThan(5000);
    expect(res.max).toBeGreaterThan(res.min);
    expect(res.formattedMin).toMatch(/^\$\d+,\d{3}$/);
    expect(res.breakdown.length).toBeGreaterThanOrEqual(3);
  });

  it('increases cost with steep pitch and hand-split cedar shake', () => {
    const standard = calculateQuote(roofingPreset, {
      roof_sqft: 2500,
      roof_pitch: 'medium',
      material: 'arch_shingle',
      addons: []
    });

    const steepCedar = calculateQuote(roofingPreset, {
      roof_sqft: 2500,
      roof_pitch: 'steep',
      material: 'cedar_shake',
      addons: ['tear_off', 'ice_water_barrier']
    });

    expect(steepCedar.target).toBeGreaterThan(standard.target * 2);
  });
});

describe('Preset: HVAC System Calculator', () => {
  it('calculates heat pump with tax credit qualification recommendation', () => {
    const res = calculateQuote(hvacPreset, {
      home_sqft: 2000,
      system_type: 'heat_pump',
      efficiency_tier: 'seer16',
      hvac_addons: ['smart_thermostat']
    });

    expect(res.target).toBeGreaterThan(4000);
    expect(res.recommendations.length).toBeGreaterThan(0);
  });
});

describe('Preset: Plumbing & Repipe Calculator', () => {
  it('calculates whole house PEX repiping with fixture count', () => {
    const res = calculateQuote(plumbingPreset, {
      bathrooms: '2',
      job_type: 'repipe',
      pipe_material: 'pex_a',
      plumbing_upgrades: ['tankless_gas']
    });

    expect(res.target).toBeGreaterThan(5000);
    expect(res.breakdown.some(b => b.id.includes('tankless_gas'))).toBe(true);
  });
});

describe('Preset: Custom B2B Software Scoping', () => {
  it('calculates sprint costs for 12 screens with AI workflows', () => {
    const res = calculateQuote(softwarePreset, {
      core_screens: 12,
      app_platform: 'web_responsive',
      auth_security: 'rbac_social',
      features: ['stripe_billing', 'ai_agent_workflows'],
      timeline_urgency: 'standard'
    });

    expect(res.target).toBeGreaterThan(15000);
    expect(res.min).toBeLessThan(res.target);
    expect(res.max).toBeGreaterThan(res.target);
  });
});
