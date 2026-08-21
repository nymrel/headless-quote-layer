/**
 * @nymrel/headless-quote - Core Engine Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateQuote,
  formatCurrency,
  generateQuoteId,
  evaluateCondition,
  validateField,
  sanitizeInput,
  applyRounding
} from '../src/core/engine';
import { QuoteSchema, QuoteField } from '../src/core/types';

describe('Engine: Quote ID & Currency Formatting', () => {
  it('generates a valid formatted quote ID', () => {
    const id = generateQuoteId('NYM');
    expect(id).toMatch(/^NYM-\d{8}-[A-Z0-9]{6}$/);
  });

  it('formats currency correctly with comma separators', () => {
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(450)).toBe('$450');
    expect(formatCurrency(12500)).toBe('$12,500');
    expect(formatCurrency(1250000)).toBe('$1,250,000');
    expect(formatCurrency(49.99, 'EUR', '€', 2)).toBe('€49.99');
  });

  it('handles invalid numbers safely in formatCurrency', () => {
    expect(formatCurrency(NaN)).toBe('$0');
    expect(formatCurrency(null as any)).toBe('$0');
  });
});

describe('Engine: Input Sanitization & Validation', () => {
  it('strips dangerous HTML and script tags', () => {
    const dirty = '<script>alert("xss")</script><b>Hello</b> World!';
    expect(sanitizeInput(dirty)).toBe('Hello World!');
  });

  it('validates required fields', () => {
    const field: QuoteField = {
      id: 'test_field',
      label: 'Test Field',
      type: 'text',
      required: true
    };

    expect(validateField(field, '').valid).toBe(false);
    expect(validateField(field, null).valid).toBe(false);
    expect(validateField(field, 'valid input').valid).toBe(true);
  });

  it('validates number bounds', () => {
    const numField: QuoteField = {
      id: 'num',
      label: 'Number',
      type: 'number',
      min: 10,
      max: 100
    };

    expect(validateField(numField, 5).valid).toBe(false);
    expect(validateField(numField, 150).valid).toBe(false);
    expect(validateField(numField, 50).valid).toBe(true);
  });

  it('validates email addresses', () => {
    const emailField: QuoteField = {
      id: 'email',
      label: 'Email',
      type: 'email'
    };

    expect(validateField(emailField, 'notanemail').valid).toBe(false);
    expect(validateField(emailField, 'user@domain').valid).toBe(false);
    expect(validateField(emailField, 'user@domain.com').valid).toBe(true);
  });

  it('validates phone numbers', () => {
    const phoneField: QuoteField = {
      id: 'phone',
      label: 'Phone',
      type: 'phone'
    };

    expect(validateField(phoneField, '123').valid).toBe(false);
    expect(validateField(phoneField, '(555) 123-4567').valid).toBe(true);
    expect(validateField(phoneField, '+1-555-123-4567').valid).toBe(true);
  });
});

describe('Engine: Conditional Logic Evaluation', () => {
  it('evaluates equals and notEquals conditions', () => {
    expect(evaluateCondition({ fieldId: 'status', operator: 'equals', value: 'active' }, { status: 'active' })).toBe(true);
    expect(evaluateCondition({ fieldId: 'status', operator: 'equals', value: 'active' }, { status: 'paused' })).toBe(false);
    expect(evaluateCondition({ fieldId: 'status', operator: 'notEquals', value: 'active' }, { status: 'paused' })).toBe(true);
  });

  it('evaluates numeric comparisons and array membership', () => {
    expect(evaluateCondition({ fieldId: 'sqft', operator: 'greaterThan', value: 1000 }, { sqft: 1500 })).toBe(true);
    expect(evaluateCondition({ fieldId: 'sqft', operator: 'lessThan', value: 1000 }, { sqft: 1500 })).toBe(false);
    expect(evaluateCondition({ fieldId: 'tier', operator: 'in', value: ['gold', 'platinum'] }, { tier: 'gold' })).toBe(true);
    expect(evaluateCondition({ fieldId: 'tier', operator: 'in', value: ['gold', 'platinum'] }, { tier: 'bronze' })).toBe(false);
  });
});

describe('Engine: Rounding Policies', () => {
  it('applies rounding rules accurately', () => {
    expect(applyRounding(143.7, 'round')).toBe(144);
    expect(applyRounding(143.2, 'ceil')).toBe(144);
    expect(applyRounding(143.8, 'floor')).toBe(143);
    expect(applyRounding(143, 'nearest10')).toBe(140);
    expect(applyRounding(147, 'nearest10')).toBe(150);
    expect(applyRounding(1320, 'nearest50')).toBe(1300);
    expect(applyRounding(1335, 'nearest50')).toBe(1350);
    expect(applyRounding(1449, 'nearest100')).toBe(1400);
    expect(applyRounding(1450, 'nearest100')).toBe(1500);
  });
});

describe('Engine: Quote Calculation & Dynamic Range', () => {
  const testSchema: QuoteSchema = {
    id: 'test-schema',
    name: 'Test Calculator',
    pricing: {
      baseCalloutFee: 500,
      marginPercent: 10,
      minRangeSpreadPercent: 10,
      maxRangeSpreadPercent: 10,
      rounding: 'nearest10',
      currency: 'USD',
      currencySymbol: '$'
    },
    steps: [
      {
        id: 'step-1',
        title: 'Step 1',
        fields: [
          {
            id: 'units',
            label: 'Units',
            type: 'number',
            unitPrice: 100,
            defaultValue: 10
          },
          {
            id: 'material_tier',
            label: 'Material',
            type: 'radio',
            defaultValue: 'standard',
            options: [
              { id: 'standard', label: 'Standard', value: 'standard', multiplier: 1.0 },
              { id: 'premium', label: 'Premium', value: 'premium', multiplier: 1.5, adder: 200 }
            ]
          },
          {
            id: 'rush_delivery',
            label: 'Rush Delivery',
            type: 'checkbox',
            unitPrice: 300,
            defaultValue: false
          }
        ]
      }
    ]
  };

  it('calculates standard base + units correctly', () => {
    // Base 500 + (10 * 100 = 1000) = 1500 target
    // 10% spread => min = 1350, max = 1650
    const res = calculateQuote(testSchema, { units: 10, material_tier: 'standard', rush_delivery: false });
    expect(res.target).toBe(1500);
    expect(res.min).toBe(1350);
    expect(res.max).toBe(1650);
    expect(res.formattedTarget).toBe('$1,500');
    expect(res.formattedMin).toBe('$1,350');
    expect(res.formattedMax).toBe('$1,650');
    expect(res.breakdown.length).toBeGreaterThanOrEqual(2);
  });

  it('applies option adders and multipliers correctly', () => {
    // Units = 10 ($1000)
    // Material = premium (+200 adder, 1.5x multiplier)
    // Base = 500
    // Subtotal before multiplier = 500 + 1000 + 200 = 1700
    // Multiplied = 1700 * 1.5 = 2550
    // 10% spread => min = 2295 (rounds to 2300), max = 2805 (rounds to 2810)
    const res = calculateQuote(testSchema, { units: 10, material_tier: 'premium', rush_delivery: false });
    expect(res.target).toBe(2550);
    expect(res.min).toBe(2300);
    expect(res.max).toBe(2810);
  });

  it('handles custom formula functions', () => {
    const customSchema: QuoteSchema = {
      id: 'custom-calc',
      name: 'Custom',
      pricing: {
        formula: 'custom',
        customFormula: (state) => {
          const area = state.area || 100;
          return {
            target: area * 50,
            min: area * 45,
            max: area * 55,
            breakdown: []
          };
        }
      },
      steps: []
    };

    const res = calculateQuote(customSchema, { area: 200 });
    expect(res.target).toBe(10000);
    expect(res.min).toBe(9000);
    expect(res.max).toBe(11000);
  });
});
