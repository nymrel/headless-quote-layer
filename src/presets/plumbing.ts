/**
 * @nymrel/headless-quote - Residential Plumbing & Repipe Calculator Preset
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import { QuoteSchema } from '../core/types';

export const plumbingPreset: QuoteSchema = {
  id: 'plumbing-estimator-v1',
  name: 'Residential Plumbing & Whole-House Repipe Estimator',
  description: 'Calculate instant costs for bathroom fixture installations, tankless water heater retrofits, and whole-home copper-to-PEX repiping.',
  badge: 'Same-Day Dispatch',
  pricing: {
    baseCalloutFee: 195,
    marginPercent: 12,
    minRangeSpreadPercent: 10,
    maxRangeSpreadPercent: 16,
    currency: 'USD',
    currencySymbol: '$',
    rounding: 'nearest10'
  },
  steps: [
    {
      id: 'step-scope',
      title: 'Project Scope & Fixture Count',
      subtitle: 'Specify the bathrooms, kitchens, and plumbing fixtures involved.',
      fields: [
        {
          id: 'bathrooms',
          label: 'Total Number of Bathrooms in Home',
          type: 'select',
          defaultValue: '2',
          options: [
            { id: '1', label: '1 Full Bathroom', value: '1', multiplier: 1.0 },
            { id: '2', label: '2 Bathrooms', value: '2', multiplier: 1.35 },
            { id: '3', label: '3 Bathrooms', value: '3', multiplier: 1.70 },
            { id: '4', label: '4+ Bathrooms', value: '4', multiplier: 2.10 }
          ]
        },
        {
          id: 'job_type',
          label: 'Primary Plumbing Service Needed',
          type: 'radio',
          defaultValue: 'repipe',
          required: true,
          options: [
            {
              id: 'water_heater',
              label: 'Water Heater Replacement / Upgrade',
              description: 'Replace aging tank with high-efficiency standard or tankless model',
              value: 'water_heater',
              adder: 1600
            },
            {
              id: 'repipe',
              label: 'Whole-House Water Supply Line Repiping',
              description: 'Replacing old galvanized or leaking polybutylene with Uponor PEX-A expansion piping',
              value: 'repipe',
              adder: 4200,
              badge: 'Flagship Service'
            },
            {
              id: 'main_sewer',
              label: 'Trenchless Sewer Line Repair / Hydro-Jetting',
              description: 'CIPP epoxy pipelining or directional drilling without digging trenches',
              value: 'main_sewer',
              adder: 3800
            },
            {
              id: 'fixtures',
              label: 'Fixture Installation & Drain Relocation',
              description: 'New vanity, toilet, tub/shower valves, and garbage disposal',
              value: 'fixtures',
              adder: 850
            }
          ]
        },
        {
          id: 'pipe_material',
          label: 'Supply Piping Material Preference',
          type: 'radio',
          defaultValue: 'pex_a',
          condition: {
            fieldId: 'job_type',
            operator: 'equals',
            value: 'repipe'
          },
          options: [
            {
              id: 'pex_a',
              label: 'Uponor PEX-A ProPEX Expansion',
              description: 'Freeze-resistant flexible cross-linked polyethylene with 25-year manufacturer warranty',
              value: 'pex_a',
              multiplier: 1.0,
              badge: 'Recommended'
            },
            {
              id: 'copper_type_l',
              label: 'Type L Rigid Copper Tubing (Lead-Free Solder)',
              description: 'Traditional solid American-made hard drawn copper piping',
              value: 'copper_type_l',
              multiplier: 1.55,
              adder: 1200
            }
          ]
        }
      ]
    },
    {
      id: 'step-addons',
      title: 'Water Heater & Filtration Upgrades',
      subtitle: 'Optional whole-home filtration, recirculation loops, and emergency rush dispatch.',
      fields: [
        {
          id: 'plumbing_upgrades',
          label: 'System Upgrades & Add-Ons',
          type: 'checkbox',
          defaultValue: [],
          category: 'addon',
          options: [
            {
              id: 'tankless_gas',
              label: 'Navien Premium Condensing Tankless Water Heater (NPE-240A2)',
              description: 'Endless continuous on-demand hot water with built-in recirculation pump',
              value: 'tankless_gas',
              adder: 2850,
              badge: 'Endless Hot Water'
            },
            {
              id: 'water_softener',
              label: 'Whole-Home Water Softener & Carbon Filtration System',
              description: 'Protects pipes and appliances against hard water scale buildup and removes chlorine',
              value: 'water_softener',
              adder: 1650
            },
            {
              id: 'smart_shutoff',
              label: 'Flo by Moen Smart Water Shutoff & Ultrasonic Leak Detector',
              description: '24/7 automated monitoring that shuts off water main in seconds during a pipe burst',
              value: 'smart_shutoff',
              adder: 750,
              badge: 'Insurance Discount'
            },
            {
              id: 'emergency_rush',
              label: '24/7 Emergency Priority Dispatch (Same-Day / Weekend)',
              description: 'Dispatches emergency master plumber within 2 hours',
              value: 'emergency_rush',
              adder: 350,
              multiplier: 1.15
            }
          ]
        }
      ]
    }
  ],
  leadForm: {
    enabled: true,
    title: 'Book Your Licensed Master Plumber Inspection',
    subtitle: 'Lock in pricing with zero surprise charges. All work backed by our 100% Satisfaction Guarantee.',
    requirePhone: true,
    requireAddress: true,
    requireDate: true,
    submitButtonText: 'Book Plumbing Service'
  }
};
