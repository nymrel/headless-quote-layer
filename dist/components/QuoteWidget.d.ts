/**
 * @nymrel/headless-quote - Vanilla Interactive Quote Widget Renderer
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */
import { LeadDeliveryReceipt, QuoteResult, QuoteSchema, QuoteSubmission, WidgetCallbacks } from '../core/types';
export interface QuoteWidgetOptions {
    schema: QuoteSchema;
    initialState?: Record<string, any>;
    callbacks?: WidgetCallbacks;
    sourceLabel?: string;
    webhookUrl?: string;
    useShadowDom?: boolean;
}
export declare class NymrelQuoteWidget {
    private container;
    private schema;
    private callbacks;
    private formState;
    private currentStepIndex;
    private currentQuote;
    private showBreakdownModal;
    private isSubmitted;
    private isSubmitting;
    private lastSubmission;
    private lastDeliveryReceipt;
    private sourceLabel?;
    private webhookUrl?;
    private fieldErrors;
    private stepStartTime;
    constructor(target: HTMLElement, options: QuoteWidgetOptions);
    /**
     * Update Form State and trigger reactive recalculation
     */
    updateState(fieldId: string, value: any): void;
    /**
     * Recalculate quote
     */
    recalculate(): QuoteResult;
    /**
     * Go to next step
     */
    nextStep(): boolean;
    /**
     * Go to previous step
     */
    prevStep(): void;
    isLeadFormEnabled(): boolean;
    isLeadFormStep(): boolean;
    getTotalStepsCount(): number;
    /**
     * Submit lead capture and finalize quote
     */
    submitLead(leadData: Record<string, any>): Promise<QuoteSubmission | null>;
    /**
     * Truthful delivery receipt for the most recent submission.
     * Null before any submission; cleared by reset().
     * Only `status === 'accepted'` reflects a verified (2xx) webhook response.
     */
    getLastDeliveryReceipt(): LeadDeliveryReceipt | null;
    /**
     * Reset Quote to initial state
     */
    reset(): void;
    /**
     * Print or Download summary receipt
     */
    printReceipt(): void;
    /**
     * Render complete DOM tree into container
     */
    render(): void;
    /**
     * Render Standard Calculation Step
     */
    private renderStepForm;
    /**
     * Render Individual Field Controls
     */
    private renderField;
    /**
     * Render Lead Contact & Scheduling Capture Step
     */
    private renderLeadFormStep;
    /**
     * Render Success / Receipt Confirmation Screen
     */
    private renderSuccessScreen;
    /**
     * Render Itemized Breakdown Drawer / Modal
     */
    private renderBreakdownModal;
    /**
     * Attach Interactive Event Listeners
     */
    private attachEventListeners;
}
/**
 * Convenience mount helper
 */
export declare function createQuoteWidget(target: HTMLElement | string, options: QuoteWidgetOptions): NymrelQuoteWidget;
