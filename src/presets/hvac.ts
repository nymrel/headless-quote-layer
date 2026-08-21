/**
 * @nymrel/headless-quote - HVAC Heat Pump & AC Sizing Estimator Preset
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import { QuoteSchema } from '../core/types';

export const hvacPreset: QuoteSchema = {
  id: 'hvac-estimator-v1',
  name: 'HVAC & Heat Pump System Replacement Calculator',
  description: 'Size your home HVAC requirements, calculate SEER2 efficiency tiers, and evaluate full installation costs.',
  badge: 'Energy Star Ready',
  pricing: {
    baseCalloutFee: 650,
    marginPercent: 8,
    minRangeSpreadPercent: 6,
    maxRangeSpreadPercent: 12,
    currency: 'USD',
    currencySymbol: '$',
    rounding: 'nearest50'
  },
  steps: [
    {
      id: 'step-sizing',
      title: 'Home Square Footage & Climate',
      subtitle: 'Determine thermal load and ton sizing.',
      fields: [
        {
          id: 'home_sqft',
          label: 'Conditioned Living Space',
          type: 'slider',
          min: 600,
          max: 5000,
          step: 100,
          defaultValue: 1800,
          unit: 'sq ft',
          unitPrice: 1.80, // Base installation labor per sq ft conditioned
          category: 'dimension',
          required: true
        },
        {
          id: 'system_type',
          label: 'System Configuration',
          type: 'radio',
          defaultValue: 'heat_pump',
          options: [
            {
              id: 'heat_pump',
              label: 'Inverter Heat Pump (All-Electric Heating & Cooling)',
              description: 'Year-round high efficiency heating down to -15°F with Federal Tax Credit eligibility',
              value: 'heat_pump',
              adder: 1800,
              multiplier: 1.15,
              badge: '$2,000 Tax Credit'
            },
            {
              id: 'split_system',
              label: 'Standard AC + High-Efficiency Gas Furnace',
              description: 'Dual fuel conventional system with 96% AFUE gas heating',
              value: 'split_system',
              adder: 1200,
              multiplier: 1.05
            },
            {
              id: 'ductless_mini',
              label: 'Multi-Zone Ductless Mini-Split (3 Zones)',
              description: 'Zoned climate control without requiring existing central ductwork',
              value: 'ductless_mini',
              adder: 2600,
              multiplier: 1.25,
              badge: 'No Ducts Needed'
            }
          ]
        }
      ]
    },
    {
      id: 'step-efficiency',
      title: 'SEER2 Efficiency & Equipment Tier',
      subtitle: 'Select energy rating and compressor technology.',
      fields: [
        {
          id: 'efficiency_tier',
          label: 'Efficiency Tier',
          type: 'radio',
          defaultValue: 'seer16',
          category: 'material',
          options: [
            {
              id: 'seer14',
              label: 'Standard 14.3 SEER2 (Single-Stage)',
              description: 'Baseline reliable code-compliant cooling',
              value: 'seer14',
              multiplier: 1.0,
              adder: 0
            },
            {
              id: 'seer16',
              label: 'High Efficiency 16.2 SEER2 (Two-Stage)',
              description: 'Quieter operation, superior humidity removal, and lower utility bills',
              value: 'seer16',
              multiplier: 1.20,
              adder: 950,
              badge: 'Most Popular'
            },
            {
              id: 'seer20',
              label: 'Ultra Inverter 20+ SEER2 (Variable Speed)',
              description: 'Whisper-quiet modulation with up to 45% electricity savings',
              value: 'seer20',
              multiplier: 1.55,
              adder: 2400,
              badge: 'Maximum Rebates'
            }
          ]
        }
      ]
    },
    {
      id: 'step-addons',
      title: 'Ductwork & Air Quality Add-Ons',
      subtitle: 'Select optional filtration, smart thermostats, and extended warranties.',
      fields: [
        {
          id: 'hvac_addons',
          label: 'Air Quality & Installation Upgrades',
          type: 'checkbox',
          defaultValue: ['smart_thermostat'],
          category: 'addon',
          options: [
            {
              id: 'smart_thermostat',
              label: 'Ecobee / Nest Smart Thermostat with Room Sensors',
              description: 'Wi-Fi learning thermostat with multi-room temperature balancing',
              value: 'smart_thermostat',
              adder: 350
            },
            {
              id: 'air_purifier',
              label: 'Whole-Home MERV 16 & UV-C Air Scrubber System',
              description: 'Destroys 99% of airborne allergens, mold spores, and viruses',
              value: 'air_purifier',
              adder: 1100
            },
            {
              id: 'duct_mod',
              label: 'Ductwork Sealing, Return Plenum Rework & Insulation',
              description: 'AeroSeal duct leakage sealing to recover up to 30% lost conditioned air',
              value: 'duct_mod',
              adder: 1450
            },
            {
              id: 'warranty_10yr',
              label: '10-Year Full Parts & Labor Extended Master Warranty',
              description: 'Zero deductible 10-year total coverage including annual tune-up',
              value: 'warranty_10yr',
              adder: 850,
              badge: 'Peace of Mind'
            }
          ]
        }
      ]
    }
  ],
  leadForm: {
    enabled: true,
    title: 'Schedule Your In-Home Load Calculation',
    subtitle: 'Lock in manufacturer instant rebates and federal tax credit guidance with an on-site EPA-certified technician.',
    requirePhone: true,
    requireAddress: true,
    requireDate: true,
    submitButtonText: 'Reserve HVAC Installation Window'
  }
};
