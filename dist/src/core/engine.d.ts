/**
 * @nymrel/headless-quote - Core Calculation Engine
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */
import { FieldCondition, QuoteField, QuoteResult, QuoteSchema, PricingRule } from './types';
/**
 * Generate a unique quote reference ID
 */
export declare function generateQuoteId(prefix?: string): string;
/**
 * Format a numeric amount into currency display
 */
export declare function formatCurrency(amount: number, currency?: string, symbol?: string, decimals?: number): string;
/**
 * Sanitize and typecast input values safely
 */
export declare function sanitizeInput(val: any): any;
/**
 * Evaluate if a conditional field should be rendered/evaluated
 */
export declare function evaluateCondition(condition: FieldCondition | undefined, state: Record<string, any>): boolean;
/**
 * Validate a field value according to field constraints
 */
export declare function validateField(field: QuoteField, value: any): {
    valid: boolean;
    error?: string;
};
/**
 * Apply rounding policy to an amount
 */
export declare function applyRounding(amount: number, rounding?: PricingRule['rounding']): number;
/**
 * Calculate instant dynamic range quote and itemized breakdown
 */
export declare function calculateQuote(schema: QuoteSchema, formState: Record<string, any>): QuoteResult;
