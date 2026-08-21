/**
 * @nymrel/headless-quote - Core Types
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */
export type FieldType = 'number' | 'slider' | 'select' | 'radio' | 'checkbox' | 'stepper' | 'toggle' | 'text' | 'email' | 'phone' | 'date' | 'textarea';
export interface OptionChoice {
    id: string;
    label: string;
    description?: string;
    value: number | string;
    multiplier?: number;
    adder?: number;
    badge?: string;
    icon?: string;
}
export interface FieldCondition {
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'in' | 'contains';
    value: any;
}
export interface QuoteField {
    id: string;
    label: string;
    type: FieldType;
    description?: string;
    helperText?: string;
    placeholder?: string;
    defaultValue?: any;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: OptionChoice[];
    condition?: FieldCondition;
    unitPrice?: number;
    multiplier?: number;
    category?: 'dimension' | 'material' | 'condition' | 'addon' | 'service' | 'general';
}
export interface StepConfig {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    fields: QuoteField[];
}
export interface PricingRule {
    baseFee?: number;
    baseCalloutFee?: number;
    marginPercent?: number;
    minRangeSpreadPercent?: number;
    maxRangeSpreadPercent?: number;
    taxRate?: number;
    currency?: string;
    currencySymbol?: string;
    rounding?: 'none' | 'round' | 'ceil' | 'floor' | 'nearest10' | 'nearest50' | 'nearest100';
    formula?: 'standard' | 'multiplicative' | 'tiered' | 'custom';
    customFormula?: (state: Record<string, any>, fields: QuoteField[]) => {
        min: number;
        max: number;
        target: number;
        breakdown?: QuoteBreakdownItem[];
    };
}
export interface QuoteBreakdownItem {
    id: string;
    label: string;
    amount: number;
    formattedAmount: string;
    type: 'base' | 'material' | 'labor' | 'addon' | 'multiplier' | 'tax' | 'discount' | 'contingency';
    description?: string;
}
export interface QuoteResult {
    min: number;
    max: number;
    target: number;
    formattedMin: string;
    formattedMax: string;
    formattedTarget: string;
    currency: string;
    currencySymbol: string;
    breakdown: QuoteBreakdownItem[];
    recommendations: string[];
    calculatedAt: string;
    quoteId: string;
}
export interface AttributionData {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
    msclkid?: string;
    ttclid?: string;
    li_fat_id?: string;
    referrer: string;
    referring_domain: string;
    landing_page: string;
    page_title: string;
    timestamp: string;
    source_label?: string;
    session_id: string;
    device_type: 'mobile' | 'tablet' | 'desktop';
    userAgent?: string;
}
export interface LeadData {
    name: string;
    email: string;
    phone: string;
    address?: string;
    zipCode?: string;
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
    customFields?: Record<string, any>;
}
export interface QuoteSubmission {
    quoteId: string;
    schemaId: string;
    schemaName: string;
    quote: QuoteResult;
    formState: Record<string, any>;
    lead: LeadData;
    attribution: AttributionData;
    submittedAt: string;
    metadata?: Record<string, any>;
}
export interface LeadFormConfig {
    enabled: boolean;
    title?: string;
    subtitle?: string;
    submitButtonText?: string;
    requirePhone?: boolean;
    requireAddress?: boolean;
    requireDate?: boolean;
    collectNotes?: boolean;
    disclaimerText?: string;
    successMessage?: string;
    successTitle?: string;
    allowInstantDownload?: boolean;
}
export interface ThemeConfig {
    mode?: 'warm' | 'light' | 'dark';
    fontFamily?: string;
    primaryColor?: string;
    accentColor?: string;
    accentHoverColor?: string;
    backgroundColor?: string;
    surfaceColor?: string;
    cardColor?: string;
    textColor?: string;
    mutedTextColor?: string;
    borderColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    focusRingColor?: string;
}
export interface QuoteSchema {
    id: string;
    name: string;
    version?: string;
    description?: string;
    badge?: string;
    pricing: PricingRule;
    steps: StepConfig[];
    leadForm?: LeadFormConfig;
    theme?: ThemeConfig;
    webhookUrl?: string;
    sourceLabel?: string;
    metadata?: Record<string, any>;
}
export interface WidgetCallbacks {
    onCalculate?: (result: QuoteResult, formState: Record<string, any>) => void;
    onStepChange?: (stepIndex: number, step: StepConfig) => void;
    onSubmit?: (submission: QuoteSubmission) => void | Promise<any>;
    onError?: (error: Error | string) => void;
}
