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
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }
  
  const rounded = decimals > 0 
    ? amount.toFixed(decimals) 
    : Math.round(amount).toString();
    
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
    return isNaN(val) ? 0 : val;
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
  const email = String(value || '');
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
      const num = Number(value);
      if (isNaN(num)) {
        return { valid: false, error: `${field.label} must be a valid number.` };
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

  // Check if custom formula is provided
  if (pricing.formula === 'custom' && typeof pricing.customFormula === 'function') {
    const customRes = pricing.customFormula(formState, allFields);
    const target = applyRounding(customRes.target, pricing.rounding);
    const min = applyRounding(customRes.min, pricing.rounding);
    const max = applyRounding(customRes.max, pricing.rounding);
    
    return {
      min,
      max,
      target,
      formattedMin: formatCurrency(min, currency, symbol),
      formattedMax: formatCurrency(max, currency, symbol),
      formattedTarget: formatCurrency(target, currency, symbol),
      currency,
      currencySymbol: symbol,
      breakdown: customRes.breakdown || [],
      recommendations: [],
      calculatedAt: new Date().toISOString(),
      quoteId
    };
  }

  // Standard / Multiplicative / Tiered Calculation Engine
  let baseSum = Number(pricing.baseFee || pricing.baseCalloutFee || 0);
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
      const numVal = Number(val);
      if (!isNaN(numVal) && numVal > 0) {
        if (field.unitPrice && field.unitPrice > 0) {
          const itemCost = numVal * field.unitPrice;
          if (field.category === 'material') {
            materialSum += itemCost;
          } else {
            laborSum += itemCost;
          }
          breakdown.push({
            id: field.id,
            label: `${field.label} (${numVal} ${field.unit || 'units'} @ ${formatCurrency(field.unitPrice, currency, symbol)}/${field.unit || 'unit'})`,
            amount: itemCost,
            formattedAmount: formatCurrency(itemCost, currency, symbol),
            type: field.category === 'material' ? 'material' : 'labor'
          });
        }
        
        if (field.multiplier && field.multiplier !== 1) {
          compositeMultiplier *= field.multiplier;
        }
      }
    }

    // 2. Single Selection fields (select, radio, toggle)
    if (field.type === 'select' || field.type === 'radio' || field.type === 'toggle') {
      if (field.options && field.options.length > 0) {
        const selected = field.options.find(opt => String(opt.id) === String(val) || String(opt.value) === String(val));
        if (selected) {
          if (selected.adder && Number(selected.adder) !== 0) {
            const adder = Number(selected.adder);
            addonSum += adder;
            breakdown.push({
              id: `${field.id}-${selected.id}`,
              label: `${field.label}: ${selected.label}`,
              amount: adder,
              formattedAmount: formatCurrency(adder, currency, symbol),
              type: field.category === 'material' ? 'material' : 'addon',
              description: selected.description
            });
          }

          if (selected.multiplier && Number(selected.multiplier) !== 1) {
            const mult = Number(selected.multiplier);
            compositeMultiplier *= mult;
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
            if (selected.adder && Number(selected.adder) !== 0) {
              const adder = Number(selected.adder);
              addonSum += adder;
              breakdown.push({
                id: `${field.id}-${selected.id}`,
                label: selected.label,
                amount: adder,
                formattedAmount: formatCurrency(adder, currency, symbol),
                type: 'addon',
                description: selected.description
              });
            }
            if (selected.multiplier && Number(selected.multiplier) !== 1) {
              compositeMultiplier *= Number(selected.multiplier);
            }
          }
        }
      } else if (typeof val === 'boolean' && val === true) {
        if (field.unitPrice) {
          addonSum += field.unitPrice;
          breakdown.push({
            id: field.id,
            label: field.label,
            amount: field.unitPrice,
            formattedAmount: formatCurrency(field.unitPrice, currency, symbol),
            type: 'addon'
          });
        }
        if (field.multiplier && field.multiplier !== 1) {
          compositeMultiplier *= field.multiplier;
        }
      }
    }
  }

  // Compute Subtotal and apply Multipliers
  const subtotalBeforeMultiplier = baseSum + materialSum + laborSum + addonSum;
  let multipliedTarget = subtotalBeforeMultiplier * compositeMultiplier;

  // Apply Tax if applicable
  if (pricing.taxRate && pricing.taxRate > 0) {
    const taxAmount = multipliedTarget * pricing.taxRate;
    breakdown.push({
      id: 'tax',
      label: `Estimated Tax (${(pricing.taxRate * 100).toFixed(1)}%)`,
      amount: taxAmount,
      formattedAmount: formatCurrency(taxAmount, currency, symbol),
      type: 'tax'
    });
    multipliedTarget += taxAmount;
  }

  // Calculate dynamic Range Bounds
  const spreadPercent = pricing.marginPercent 
    ? pricing.marginPercent / 100 
    : 0.10; // Default 10% spread
    
  const minSpread = pricing.minRangeSpreadPercent 
    ? pricing.minRangeSpreadPercent / 100 
    : spreadPercent;
  const maxSpread = pricing.maxRangeSpreadPercent 
    ? pricing.maxRangeSpreadPercent / 100 
    : spreadPercent;

  let rawTarget = Math.max(0, multipliedTarget);
  let rawMin = Math.max(0, rawTarget * (1 - minSpread));
  let rawMax = Math.max(rawMin, rawTarget * (1 + maxSpread));

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
