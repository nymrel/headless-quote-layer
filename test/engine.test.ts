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

  it('fails closed for non-finite currency amounts', () => {
    expect(() => formatCurrency(NaN)).toThrow(/finite number/);
    expect(() => formatCurrency(Infinity)).toThrow(/finite number/);
    expect(() => formatCurrency(-Infinity)).toThrow(/finite number/);
    expect(() => formatCurrency(null as any)).toThrow(/finite number/);
  });
});

describe('Engine: Input Sanitization & Validation', () => {
  it('strips dangerous HTML and script tags', () => {
    const dirty = '<script>alert("xss")</script><b>Hello</b> World!';
    expect(sanitizeInput(dirty)).toBe('Hello World!');
  });

  it('normalizes malformed and spaced script tags to plain text', () => {
    expect(sanitizeInput('<script>alert(1)</script ><b>Hello</b>')).toBe('Hello');
    expect(sanitizeInput('İ<script>alert(1)</script> safe')).toBe('İ safe');
    expect(sanitizeInput('<<script>alert(1)</script>')).not.toMatch(/[<>]/);
    expect(sanitizeInput('<script>unterminated')).toBe('');
  });

  it('rejects adversarial schema-field email input', () => {
    const field: QuoteField = { id: 'email', label: 'Email', type: 'email' };
    expect(validateField(field, '!@!.' + '!.'.repeat(10000)).valid).toBe(false);
    expect(validateField(field, 'alex@example.com').valid).toBe(true);
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
    expect(validateField(numField, Infinity).valid).toBe(false);
    expect(validateField(numField, -Infinity).valid).toBe(false);
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

  it('fails closed when sanitizing non-finite numeric input', () => {
    expect(() => sanitizeInput(NaN)).toThrow(/finite number/);
    expect(() => sanitizeInput(Infinity)).toThrow(/finite number/);
    expect(sanitizeInput(0)).toBe(0);
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

  it('preserves explicit zero spreads and defaults omitted spreads to ten percent', () => {
    const exactSchema: QuoteSchema = {
      id: 'exact',
      name: 'Exact',
      pricing: {
        baseFee: 100,
        marginPercent: 0,
        minRangeSpreadPercent: 0,
        maxRangeSpreadPercent: 0
      },
      steps: []
    };
    const exact = calculateQuote(exactSchema, {});
    expect([exact.min, exact.target, exact.max]).toEqual([100, 100, 100]);

    const defaultSpread = calculateQuote({
      ...exactSchema,
      id: 'default-spread',
      pricing: { baseFee: 100 }
    }, {});
    expect(defaultSpread.min).toBeCloseTo(90);
    expect(defaultSpread.target).toBe(100);
    expect(defaultSpread.max).toBeCloseTo(110);
  });

  it.each([
    ['marginPercent', { marginPercent: -1 }],
    ['minRangeSpreadPercent', { minRangeSpreadPercent: -1 }],
    ['maxRangeSpreadPercent', { maxRangeSpreadPercent: -1 }],
    ['taxRate', { taxRate: -0.1 }]
  ])('rejects negative pricing.%s', (_setting, pricing) => {
    expect(() => calculateQuote({
      id: 'negative-setting',
      name: 'Negative setting',
      pricing: { baseFee: 100, ...pricing },
      steps: []
    }, {})).toThrow(/greater than or equal to zero/);
  });

  it.each([NaN, Infinity, -Infinity])('rejects a non-finite base fee (%s)', (baseFee) => {
    expect(() => calculateQuote({
      id: 'non-finite-base',
      name: 'Non-finite base',
      pricing: { baseFee },
      steps: []
    }, {})).toThrow(/pricing\.baseFee must be a finite number/);
  });

  it('rejects non-finite field values, unit prices, adders, and arithmetic overflow', () => {
    const numericSchema: QuoteSchema = {
      id: 'numeric-boundary',
      name: 'Numeric boundary',
      pricing: {},
      steps: [{
        id: 'values',
        title: 'Values',
        fields: [{ id: 'quantity', label: 'Quantity', type: 'number', unitPrice: 2 }]
      }]
    };
    expect(() => calculateQuote(numericSchema, { quantity: Infinity })).toThrow(/Field "quantity" value/);

    numericSchema.steps[0].fields[0].unitPrice = Infinity;
    expect(() => calculateQuote(numericSchema, { quantity: 1 })).toThrow(/unitPrice/);

    numericSchema.steps[0].fields[0].unitPrice = 2;
    expect(() => calculateQuote(numericSchema, { quantity: Number.MAX_VALUE })).toThrow(/item cost/);

    const optionSchema: QuoteSchema = {
      id: 'option-boundary',
      name: 'Option boundary',
      pricing: {},
      steps: [{
        id: 'options',
        title: 'Options',
        fields: [{
          id: 'tier',
          label: 'Tier',
          type: 'select',
          options: [{ id: 'bad', label: 'Bad', value: 'bad', adder: Infinity }]
        }]
      }]
    };
    expect(() => calculateQuote(optionSchema, { tier: 'bad' })).toThrow(/adder/);
  });

  it.each([0, -1, Infinity])('rejects invalid selected multipliers (%s)', (multiplier) => {
    const schema: QuoteSchema = {
      id: 'multiplier-boundary',
      name: 'Multiplier boundary',
      pricing: { baseFee: 100 },
      steps: [{
        id: 'options',
        title: 'Options',
        fields: [{
          id: 'tier',
          label: 'Tier',
          type: 'select',
          options: [{ id: 'bad', label: 'Bad', value: 'bad', multiplier }]
        }]
      }]
    };
    expect(() => calculateQuote(schema, { tier: 'bad' })).toThrow(/multiplier/);
  });

  it('rejects invalid pricing configuration even when its field is inactive', () => {
    const schema: QuoteSchema = {
      id: 'inactive-invalid-field',
      name: 'Inactive invalid field',
      pricing: {},
      steps: [{
        id: 'fields',
        title: 'Fields',
        fields: [{
          id: 'quantity',
          label: 'Quantity',
          type: 'number',
          unitPrice: Infinity
        }]
      }]
    };
    expect(() => calculateQuote(schema, {})).toThrow(/Field "quantity" unitPrice/);
  });

  it('allows finite negative adders as explicit discounts without returning a negative quote', () => {
    const result = calculateQuote({
      id: 'discount',
      name: 'Discount',
      pricing: { baseFee: 100, marginPercent: 0 },
      steps: [{
        id: 'discounts',
        title: 'Discounts',
        fields: [{
          id: 'discount',
          label: 'Discount',
          type: 'select',
          options: [{ id: 'credit', label: 'Credit', value: 'credit', adder: -150 }]
        }]
      }]
    }, { discount: 'credit' });
    expect([result.min, result.target, result.max]).toEqual([0, 0, 0]);
  });

  it.each([
    { min: 0, target: Infinity, max: Infinity },
    { min: -1, target: 0, max: 1 },
    { min: 10, target: 5, max: 20 },
    { min: 0, target: 5, max: 4 }
  ])('rejects invalid custom formula ranges (%o)', (customResult) => {
    expect(() => calculateQuote({
      id: 'custom-invalid',
      name: 'Custom invalid',
      pricing: {
        formula: 'custom',
        customFormula: () => customResult
      },
      steps: []
    }, {})).toThrow(/Custom quote result/);
  });

  it('rejects non-finite custom breakdown amounts', () => {
    expect(() => calculateQuote({
      id: 'custom-breakdown-invalid',
      name: 'Custom breakdown invalid',
      pricing: {
        formula: 'custom',
        customFormula: () => ({
          min: 1,
          target: 1,
          max: 1,
          breakdown: [{
            id: 'bad',
            label: 'Bad',
            amount: Infinity,
            formattedAmount: '$Infinity',
            type: 'base'
          }]
        })
      },
      steps: []
    }, {})).toThrow(/breakdown item "bad" amount/);
  });
});
