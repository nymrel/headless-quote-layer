/**
 * @nymrel/headless-quote - Residential Roofing & Siding Calculator Preset
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import { QuoteSchema } from '../core/types';

export const roofingPreset: QuoteSchema = {
  id: 'roofing-estimator-v1',
  name: 'Residential Roofing & Siding Estimator',
  description: 'Calculate instant replacement estimates based on roof footprint, pitch difficulty, and premium material options.',
  badge: 'Instant Estimate',
  pricing: {
    baseCalloutFee: 450,
    marginPercent: 10,
    minRangeSpreadPercent: 8,
    maxRangeSpreadPercent: 14,
    currency: 'USD',
    currencySymbol: '$',
    rounding: 'nearest50'
  },
  steps: [
    {
      id: 'step-dimensions',
      title: 'Roof Dimensions & Slope',
      subtitle: 'Specify your home roof area and pitch characteristics.',
      fields: [
        {
          id: 'roof_sqft',
          label: 'Estimated Roof Surface Area',
          type: 'slider',
          min: 800,
          max: 6000,
          step: 50,
          defaultValue: 2200,
          unit: 'sq ft',
          unitPrice: 3.50, // Base labor + underlayment per sq ft
          category: 'dimension',
          required: true,
          helperText: 'A typical 2,000 sq ft home usually has approx. 2,200 - 2,400 sq ft of roof area.'
        },
        {
          id: 'roof_pitch',
          label: 'Roof Pitch / Steepness',
          type: 'radio',
          defaultValue: 'medium',
          category: 'condition',
          options: [
            {
              id: 'flat',
              label: 'Flat / Low Slope (0:12 - 3:12)',
              description: 'Requires specialized membrane or self-adhering roll roofing',
              value: 'flat',
              multiplier: 1.15
            },
            {
              id: 'medium',
              label: 'Standard Pitch (4:12 - 7:12)',
              description: 'Walkable standard residential pitch',
              value: 'medium',
              multiplier: 1.0,
              badge: 'Most Common'
            },
            {
              id: 'steep',
              label: 'Steep Pitch (8:12 - 12:12)',
              description: 'Requires full safety rigging, specialized scaffolding, and harness anchors',
              value: 'steep',
              multiplier: 1.30,
              badge: 'Specialized'
            }
          ]
        },
        {
          id: 'stories',
          label: 'Number of Stories',
          type: 'select',
          defaultValue: '1',
          options: [
            { id: '1', label: '1 Story (Standard Access)', value: '1', multiplier: 1.0 },
            { id: '2', label: '2 Stories (High Reach)', value: '2', multiplier: 1.12 },
            { id: '3', label: '3+ Stories (Crane / Scaffolding Required)', value: '3', multiplier: 1.25 }
          ]
        }
      ]
    },
    {
      id: 'step-materials',
      title: 'Material Tier & Underlayment',
      subtitle: 'Select your preferred roofing material and architectural style.',
      fields: [
        {
          id: 'material',
          label: 'Roofing Material',
          type: 'radio',
          defaultValue: 'arch_shingle',
          category: 'material',
          required: true,
          options: [
            {
              id: '3tab_shingle',
              label: 'Standard 3-Tab Asphalt',
              description: '20-year rated economical protection',
              value: '3tab_shingle',
              multiplier: 1.0,
              adder: 0
            },
            {
              id: 'arch_shingle',
              label: 'Architectural Shingles (Timberline HDZ)',
              description: '30-50 year architectural dimensional shingles with 130 MPH wind warranty',
              value: 'arch_shingle',
              multiplier: 1.22,
              adder: 600,
              badge: 'Top Pick'
            },
            {
              id: 'standing_seam',
              label: 'Standing Seam Metal (24-Gauge)',
              description: 'Lifetime 50+ year energy-star rated metal roof with concealed fasteners',
              value: 'standing_seam',
              multiplier: 2.10,
              adder: 3500,
              badge: 'Lifetime'
            },
            {
              id: 'cedar_shake',
              label: 'Hand-Split Cedar Shake',
              description: 'Natural rustic wood shake treated with Class A fire retardant',
              value: 'cedar_shake',
              multiplier: 2.65,
              adder: 5200
            }
          ]
        }
      ]
    },
    {
      id: 'step-addons',
      title: 'Tear-Off, Ventilation & Add-Ons',
      subtitle: 'Select optional upgrades, disposal services, and protective warranties.',
      fields: [
        {
          id: 'addons',
          label: 'Project Options & Upgrades',
          type: 'checkbox',
          defaultValue: ['tear_off'],
          category: 'addon',
          options: [
            {
              id: 'tear_off',
              label: 'Complete Old Roof Tear-Off & Haul Away Disposal',
              description: 'Stripping existing layers down to bare decking and inspecting plywood',
              value: 'tear_off',
              adder: 1250,
              badge: 'Recommended'
            },
            {
              id: 'ice_water_barrier',
              label: 'Full Eave & Valley Ice & Water Shield Membrane',
              description: 'Prevents ice-dam backup and heavy rain infiltration',
              value: 'ice_water_barrier',
              adder: 650
            },
            {
              id: 'ridge_vent',
              label: 'Continuous High-Flow Ridge Ventilation System',
              description: 'Improves attic airflow and lowers summer cooling costs',
              value: 'ridge_vent',
              adder: 480
            },
            {
              id: 'gutter_replacement',
              label: 'Seamless Aluminum 6" Gutters & Downspouts',
              description: 'Replaces perimeter gutters with seamless custom-extruded aluminum',
              value: 'gutter_replacement',
              adder: 1800
            }
          ]
        }
      ]
    }
  ],
  leadForm: {
    enabled: true,
    title: 'Lock In Your Free Roof Inspection & Exact Quote',
    subtitle: 'Enter your address to receive an official PDF report, satellite roof measurement verification, and schedule your on-site consultation.',
    requirePhone: true,
    requireAddress: true,
    requireDate: true,
    submitButtonText: 'Confirm Quote & Book Inspection',
    successTitle: 'Roofing Estimate Captured',
    successMessage: 'Review your estimate and delivery status below. Print or save a copy for your records.'
  }
};
