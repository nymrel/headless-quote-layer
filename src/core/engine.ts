/**
 * @nymrel/headless-quote - Core Calculation Engine
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import {
  FieldCondition,
  QuoteBreakdownItem,
  QuoteField,
  QuoteResult,
  QuoteSchema,
  PricingRule
} from './types';

function finiteNumber(value: unknown, setting: string): number {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    throw new RangeError(`${setting} must be a finite number.`);
  }
  let numeric: number;
  try {
    numeric = Number(value);
  } catch {
    throw new RangeError(`${setting} must be a finite number.`);
  }
  if (!Number.isFinite(numeric)) {
    throw new RangeError(`${setting} must be a finite number.`);
  }
  return numeric;
}

function nonNegativeNumber(value: unknown, setting: string): number {
  const numeric = finiteNumber(value, setting);
  if (numeric < 0) {
    throw new RangeError(`${setting} must be greater than or equal to zero.`);
  }
  return numeric;
}

function positiveNumber(value: unknown, setting: string): number {
  const numeric = finiteNumber(value, setting);
  if (numeric <= 0) {
    throw new RangeError(`${setting} must be greater than zero.`);
  }
  return numeric;
}

function assertOrderedRange(min: number, target: number, max: number, setting: string): void {
  nonNegativeNumber(min, `${setting}.min`);
  nonNegativeNumber(target, `${setting}.target`);
  nonNegativeNumber(max, `${setting}.max`);
  if (min > target || target > max) {
    throw new RangeError(`${setting} must satisfy 0 <= min <= target <= max.`);
  }
}

function assertFiniteBreakdown(breakdown: QuoteBreakdownItem[], setting: string): void {
  for (const item of breakdown) {
    finiteNumber(item.amount, `${setting} breakdown item "${item.id}" amount`);
  }
}

function assertValidFieldPricing(fields: QuoteField[]): void {
  for (const field of fields) {
    const prefix = `Field "${field.id}"`;
    if (field.min !== undefined) finiteNumber(field.min, `${prefix} min`);
    if (field.max !== undefined) finiteNumber(field.max, `${prefix} max`);
    if (field.step !== undefined) positiveNumber(field.step, `${prefix} step`);
    if (field.min !== undefined && field.max !== undefined && field.min > field.max) {
      throw new RangeError(`${prefix} must satisfy min <= max.`);
    }
    if (field.unitPrice !== undefined) {
      nonNegativeNumber(field.unitPrice, `${prefix} unitPrice`);
    }
    if (field.multiplier !== undefined) {
      positiveNumber(field.multiplier, `${prefix} multiplier`);
    }
    for (const option of field.options || []) {
      const optionPrefix = `Option "${field.id}.${option.id}"`;
      if (option.adder !== undefined) finiteNumber(option.adder, `${optionPrefix} adder`);
      if (option.multiplier !== undefined) {
        positiveNumber(option.multiplier, `${optionPrefix} multiplier`);
      }
    }
  }
}

/**
 * Generate a unique quote reference ID
 */
export function generateQuoteId(prefix = 'NYM'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(6)),
    byte => (byte % 36).toString(36)).join('').toUpperCase();
  return `${prefix}-${year}${month}${day}-${random}`;
}

/**
 * Format a numeric amount into currency display
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  symbol = '$',
  decimals = 0
): string {
  const numericAmount = finiteNumber(amount, 'Currency amount');
  
  const rounded = decimals > 0 
    ? numericAmount.toFixed(decimals)
    : Math.round(numericAmount).toString();
    
  const parts = rounded.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${symbol}${parts.join('.')}`;
}

/**
 * Sanitize and typecast input values safely
 */
export function sanitizeInput(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    // Normalize to plain text in one linear pass. This is not an HTML sanitizer:
    // renderers must still escape text before placing it in an HTML context.
    let output = '';
    let inTag = false;
    let inScript = false;
    for (let index = 0; index < val.length; index += 1) {
      const char = val[index];
      if (char === '<') {
        const opening = val.slice(index, index + 7).toLowerCase() === '<script';
        const closing = val.slice(index, index + 8).toLowerCase() === '</script';
        const afterName = val[index + (closing ? 8 : 7)];
        if ((opening || closing) && (afterName === '>' || /\s/u.test(afterName || ''))) {
          inScript = opening;
        }
        inTag = true;
      } else if (char === '>') {
        inTag = false;
      } else if (!inTag && !inScript) {
        output += char;
      }
    }
    return output.trim();
  }
  if (typeof val === 'number') {
    return finiteNumber(val, 'Numeric input');
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeInput);
  }
  return val;
}

/**
 * Evaluate if a conditional field should be rendered/evaluated
 */
export function evaluateCondition(
  condition: FieldCondition | undefined,
  state: Record<string, any>
): boolean {
  if (!condition || !condition.fieldId) return true;
  
  const val = state[condition.fieldId];
  
  switch (condition.operator) {
    case 'equals':
      return val === condition.value || String(val) === String(condition.value);
    case 'notEquals':
      return val !== condition.value && String(val) !== String(condition.value);
    case 'greaterThan':
      return Number(val) > Number(condition.value);
    case 'lessThan':
      return Number(val) < Number(condition.value);
    case 'in':
      if (Array.isArray(condition.value)) {
        return condition.value.includes(val);
      }
      return false;
    case 'contains':
      if (Array.isArray(val)) {
        return val.includes(condition.value);
      }
      if (typeof val === 'string') {
        return val.includes(String(condition.value));
      }
      return false;
    default:
      return true;
  }
}

/**
 * Validate a field value according to field constraints
 */
export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const email = value;
  if (!email || email.length > 254 || /\s/u.test(email)) return false;
  const at = email.indexOf('@');
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf('.');
  return at > 0 && at === email.lastIndexOf('@') && dot > 0 && dot < domain.length - 1;
}

export function validateField(
  field: QuoteField,
  value: any
): { valid: boolean; error?: string } {
  if (field.required) {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return { valid: false, error: `${field.label} is required.` };
    }
  }

  if (value !== undefined && value !== null && value !== '') {
    if (field.type === 'number' || field.type === 'slider' || field.type === 'stepper') {
      let num: number;
      try {
        num = Number(value);
      } catch {
        return { valid: false, error: `${field.label} must be a valid finite number.` };
      }
      if (!Number.isFinite(num)) {
        return { valid: false, error: `${field.label} must be a valid finite number.` };
      }
      if (field.min !== undefined && num < field.min) {
        return { valid: false, error: `Minimum value is ${field.min} ${field.unit || ''}`.trim() };
      }
      if (field.max !== undefined && num > field.max) {
        return { valid: false, error: `Maximum value is ${field.max} ${field.unit || ''}`.trim() };
      }
    }

    if (field.type === 'email') {
      if (!isValidEmail(value)) {
        return { valid: false, error: 'Please enter a valid email address.' };
      }
    }

    if (field.type === 'phone') {
      const cleanPhone = String(value).replace(/[\s()\-\.]/g, '');
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      if (cleanPhone.length < 7 || !phoneRegex.test(cleanPhone)) {
        return { valid: false, error: 'Please enter a valid phone number.' };
      }
    }
  }

  return { valid: true };
}

/**
 * Apply rounding policy to an amount
 */
export function applyRounding(amount: number, rounding?: PricingRule['rounding']): number {
  finiteNumber(amount, 'Rounding amount');
  if (!rounding || rounding === 'none') return amount;
  
  switch (rounding) {
    case 'round':
      return Math.round(amount);
    case 'ceil':
      return Math.ceil(amount);
    case 'floor':
      return Math.floor(amount);
    case 'nearest10':
      return Math.round(amount / 10) * 10;
    case 'nearest50':
      return Math.round(amount / 50) * 50;
    case 'nearest100':
      return Math.round(amount / 100) * 100;
    default:
      return amount;
  }
}

/**
 * Calculate instant dynamic range quote and itemized breakdown
 */
export function calculateQuote(
  schema: QuoteSchema,
  formState: Record<string, any>
): QuoteResult {
  const currency = schema.pricing?.currency || 'USD';
  const symbol = schema.pricing?.currencySymbol || '$';
  const pricing = schema.pricing || {};
  const quoteId = formState._quoteId || generateQuoteId();
  
  // Flatten all fields from all steps
  const allFields: QuoteField[] = [];
  schema.steps.forEach(step => {
    step.fields.forEach(field => {
      allFields.push(field);
    });
  });
  assertValidFieldPricing(allFields);

  // Check if custom formula is provided
  if (pricing.formula === 'custom' && typeof pricing.customFormula === 'function') {
    const customRes = pricing.customFormula(formState, allFields);
    assertOrderedRange(customRes.min, customRes.target, customRes.max, 'Custom quote result');
    const breakdown = customRes.breakdown || [];
    assertFiniteBreakdown(breakdown, 'Custom quote result');
    const target = applyRounding(customRes.target, pricing.rounding);
    const min = applyRounding(customRes.min, pricing.rounding);
    const max = applyRounding(customRes.max, pricing.rounding);
    assertOrderedRange(min, target, max, 'Custom quote result');
    
    return {
      min,
      max,
      target,
      formattedMin: formatCurrency(min, currency, symbol),
      formattedMax: formatCurrency(max, currency, symbol),
      formattedTarget: formatCurrency(target, currency, symbol),
      currency,
      currencySymbol: symbol,
      breakdown,
      recommendations: [],
      calculatedAt: new Date().toISOString(),
      quoteId
    };
  }

  // Standard / Multiplicative / Tiered Calculation Engine
  const baseSetting = pricing.baseFee !== undefined ? 'pricing.baseFee' : 'pricing.baseCalloutFee';
  const baseSum = nonNegativeNumber(
    pricing.baseFee ?? pricing.baseCalloutFee ?? 0,
    baseSetting
  );
  const taxRate = nonNegativeNumber(pricing.taxRate ?? 0, 'pricing.taxRate');
  const spreadPercent = nonNegativeNumber(
    pricing.marginPercent ?? 10,
    'pricing.marginPercent'
  ) / 100;
  const minSpread = nonNegativeNumber(
    pricing.minRangeSpreadPercent ?? spreadPercent * 100,
    'pricing.minRangeSpreadPercent'
  ) / 100;
  const maxSpread = nonNegativeNumber(
    pricing.maxRangeSpreadPercent ?? spreadPercent * 100,
    'pricing.maxRangeSpreadPercent'
  ) / 100;
  let materialSum = 0;
  let laborSum = 0;
  let addonSum = 0;
  let compositeMultiplier = 1.0;
  
  const breakdown: QuoteBreakdownItem[] = [];
  const recommendations: string[] = [];

  if (baseSum > 0) {
    breakdown.push({
      id: 'base-fee',
      label: 'Base Callout / Setup Fee',
      amount: baseSum,
      formattedAmount: formatCurrency(baseSum, currency, symbol),
      type: 'base',
      description: 'Standard initial mobilization and inspection base'
    });
  }

  // Evaluate each active field
  for (const field of allFields) {
    if (!evaluateCondition(field.condition, formState)) {
      continue;
    }

    const val = formState[field.id] !== undefined ? formState[field.id] : field.defaultValue;
    if (val === undefined || val === null || val === '') continue;

    // 1. Numeric / Dimension fields (e.g. sq ft, linear ft, quantity)
    if (field.type === 'number' || field.type === 'slider' || field.type === 'stepper') {
      const numVal = nonNegativeNumber(val, `Field "${field.id}" value`);
      const validation = validateField(field, numVal);
      if (!validation.valid) {
        throw new RangeError(`Field "${field.id}" is invalid: ${validation.error}`);
      }
      const unitPrice = field.unitPrice === undefined
        ? undefined
        : nonNegativeNumber(field.unitPrice, `Field "${field.id}" unitPrice`);
      const fieldMultiplier = field.multiplier === undefined
        ? undefined
        : positiveNumber(field.multiplier, `Field "${field.id}" multiplier`);
      if (numVal > 0) {
        if (unitPrice !== undefined && unitPrice > 0) {
          const itemCost = finiteNumber(numVal * unitPrice, `Field "${field.id}" item cost`);
          if (field.category === 'material') {
            materialSum = finiteNumber(materialSum + itemCost, 'Material subtotal');
          } else {
            laborSum = finiteNumber(laborSum + itemCost, 'Labor subtotal');
          }
          breakdown.push({
            id: field.id,
            label: `${field.label} (${numVal} ${field.unit || 'units'} @ ${formatCurrency(unitPrice, currency, symbol)}/${field.unit || 'unit'})`,
            amount: itemCost,
            formattedAmount: formatCurrency(itemCost, currency, symbol),
            type: field.category === 'material' ? 'material' : 'labor'
          });
        }
        
        if (fieldMultiplier !== undefined && fieldMultiplier !== 1) {
          compositeMultiplier = positiveNumber(
            compositeMultiplier * fieldMultiplier,
            'Composite multiplier'
          );
        }
      }
    }

    // 2. Single Selection fields (select, radio, toggle)
    if (field.type === 'select' || field.type === 'radio' || field.type === 'toggle') {
      if (field.options && field.options.length > 0) {
        const selected = field.options.find(opt => String(opt.id) === String(val) || String(opt.value) === String(val));
        if (selected) {
          const adder = selected.adder === undefined
            ? undefined
            : finiteNumber(selected.adder, `Option "${field.id}.${selected.id}" adder`);
          if (adder !== undefined && adder !== 0) {
            addonSum = finiteNumber(addonSum + adder, 'Add-on subtotal');
            breakdown.push({
              id: `${field.id}-${selected.id}`,
              label: `${field.label}: ${selected.label}`,
              amount: adder,
              formattedAmount: formatCurrency(adder, currency, symbol),
              type: field.category === 'material' ? 'material' : 'addon',
              description: selected.description
            });
          }

          const mult = selected.multiplier === undefined
            ? undefined
            : positiveNumber(selected.multiplier, `Option "${field.id}.${selected.id}" multiplier`);
          if (mult !== undefined && mult !== 1) {
            compositeMultiplier = positiveNumber(
              compositeMultiplier * mult,
              'Composite multiplier'
            );
            breakdown.push({
              id: `${field.id}-${selected.id}-mult`,
              label: `${selected.label} Factor (${mult}x)`,
              amount: 0,
              formattedAmount: `${mult}x`,
              type: 'multiplier',
              description: selected.description
            });
          }
        }
      }
    }

    // 3. Multi-Select / Checkbox fields (add-ons, feature bundles)
    if (field.type === 'checkbox') {
      if (Array.isArray(val) && field.options) {
        for (const itemVal of val) {
          const selected = field.options.find(opt => String(opt.id) === String(itemVal) || String(opt.value) === String(itemVal));
          if (selected) {
            const adder = selected.adder === undefined
              ? undefined
              : finiteNumber(selected.adder, `Option "${field.id}.${selected.id}" adder`);
            if (adder !== undefined && adder !== 0) {
              addonSum = finiteNumber(addonSum + adder, 'Add-on subtotal');
              breakdown.push({
                id: `${field.id}-${selected.id}`,
                label: selected.label,
                amount: adder,
                formattedAmount: formatCurrency(adder, currency, symbol),
                type: 'addon',
                description: selected.description
              });
            }
            const mult = selected.multiplier === undefined
              ? undefined
              : positiveNumber(selected.multiplier, `Option "${field.id}.${selected.id}" multiplier`);
            if (mult !== undefined && mult !== 1) {
              compositeMultiplier = positiveNumber(
                compositeMultiplier * mult,
                'Composite multiplier'
              );
            }
          }
        }
      } else if (typeof val === 'boolean' && val === true) {
        const unitPrice = field.unitPrice === undefined
          ? undefined
          : nonNegativeNumber(field.unitPrice, `Field "${field.id}" unitPrice`);
        if (unitPrice !== undefined && unitPrice !== 0) {
          addonSum = finiteNumber(addonSum + unitPrice, 'Add-on subtotal');
          breakdown.push({
            id: field.id,
            label: field.label,
            amount: unitPrice,
            formattedAmount: formatCurrency(unitPrice, currency, symbol),
            type: 'addon'
          });
        }
        const fieldMultiplier = field.multiplier === undefined
          ? undefined
          : positiveNumber(field.multiplier, `Field "${field.id}" multiplier`);
        if (fieldMultiplier !== undefined && fieldMultiplier !== 1) {
          compositeMultiplier = positiveNumber(
            compositeMultiplier * fieldMultiplier,
            'Composite multiplier'
          );
        }
      }
    }
  }

  // Compute Subtotal and apply Multipliers
  const subtotalBeforeMultiplier = finiteNumber(
    baseSum + materialSum + laborSum + addonSum,
    'Quote subtotal'
  );
  let multipliedTarget = finiteNumber(
    subtotalBeforeMultiplier * compositeMultiplier,
    'Multiplied quote target'
  );

  // Apply Tax if applicable
  if (taxRate > 0) {
    const taxAmount = finiteNumber(multipliedTarget * taxRate, 'Tax amount');
    breakdown.push({
      id: 'tax',
      label: `Estimated Tax (${(taxRate * 100).toFixed(1)}%)`,
      amount: taxAmount,
      formattedAmount: formatCurrency(taxAmount, currency, symbol),
      type: 'tax'
    });
    multipliedTarget = finiteNumber(multipliedTarget + taxAmount, 'Taxed quote target');
  }

  // Calculate dynamic Range Bounds
  let rawTarget = Math.max(0, multipliedTarget);
  let rawMin = Math.max(0, finiteNumber(rawTarget * (1 - minSpread), 'Minimum quote bound'));
  let rawMax = Math.max(rawTarget, finiteNumber(rawTarget * (1 + maxSpread), 'Maximum quote bound'));

  // If subtotal is zero, keep range zero
  if (subtotalBeforeMultiplier === 0 && baseSum === 0) {
    rawTarget = 0;
    rawMin = 0;
    rawMax = 0;
  }

  // Apply Rounding
  const target = applyRounding(rawTarget, pricing.rounding);
  const min = applyRounding(rawMin, pricing.rounding);
  const max = applyRounding(rawMax, pricing.rounding);
  assertOrderedRange(min, target, max, 'Quote result');
  assertFiniteBreakdown(breakdown, 'Quote result');

  // Derive dynamic smart recommendations based on form state
  if (formState.pitch === 'steep' || formState.difficulty === 'extreme' || formState.urgency === 'emergency') {
    recommendations.push('Priority Crew Dispatch: Includes safety rigging and on-site supervisor.');
  }
  if (target > 5000) {
    recommendations.push('Flexible Financing Available: 0% APR for 12 months on qualifying projects.');
  }
  if (formState.material === 'metal' || formState.efficiency === 'ultra') {
    recommendations.push('Qualifies for Energy Efficiency Tax Credits & Lifetime Manufacturer Warranty.');
  }

  return {
    min,
    max,
    target,
    formattedMin: formatCurrency(min, currency, symbol),
    formattedMax: formatCurrency(max, currency, symbol),
    formattedTarget: formatCurrency(target, currency, symbol),
    currency,
    currencySymbol: symbol,
    breakdown,
    recommendations,
    calculatedAt: new Date().toISOString(),
    quoteId
  };
}
