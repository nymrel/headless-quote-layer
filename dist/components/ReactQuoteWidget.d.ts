/**
 * @nymrel/headless-quote - React Component & Headless Hook
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */
import React from 'react';
import { QuoteResult, QuoteSchema, QuoteSubmission, StepConfig, ThemeConfig } from '../core/types';
export interface QuoteWidgetProps {
    schema: QuoteSchema;
    initialState?: Record<string, any>;
    theme?: ThemeConfig;
    sourceLabel?: string;
    webhookUrl?: string;
    useShadowDom?: boolean;
    onCalculate?: (quote: QuoteResult, formState: Record<string, any>) => void;
    onStepChange?: (stepIndex: number, step: StepConfig) => void;
    onSubmit?: (submission: QuoteSubmission) => void | Promise<any>;
    onError?: (error: Error | string) => void;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * High-performance embeddable React Quote Widget
 */
export declare const QuoteWidget: React.FC<QuoteWidgetProps>;
/**
 * Headless React Hook for custom UI implementations
 */
export declare function useQuoteEngine(schema: QuoteSchema, initialState?: Record<string, any>): {
    quote: QuoteResult;
    formState: Record<string, any>;
    currentStepIndex: number;
    fieldErrors: Record<string, string>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    lastSubmission: QuoteSubmission | null;
    updateField: (fieldId: string, value: any) => void;
    nextStep: () => boolean;
    prevStep: () => void;
    submitLead: (leadData: Record<string, any>, options?: {
        webhookUrl?: string;
        sourceLabel?: string;
    }) => Promise<QuoteSubmission>;
    reset: () => void;
};
