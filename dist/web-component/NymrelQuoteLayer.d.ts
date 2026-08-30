/**
 * @nymrel/headless-quote - Autonomous Custom Element Web Component
 * Copyright 2026 Nymrel / JalenBuilds LLC
 * Tag: <nymrel-quote-layer>
 */
import { QuoteResult } from '../core/types';
import { NymrelQuoteWidget } from '../components/QuoteWidget';
declare const HTMLElementBase: typeof HTMLElement;
export declare class NymrelQuoteLayerElement extends HTMLElementBase {
    private widgetInstance;
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    initWidget(): Promise<void>;
    /**
     * Public Programmatic Methods on the DOM Element
     */
    getWidget(): NymrelQuoteWidget | null;
    nextStep(): boolean;
    prevStep(): void;
    reset(): void;
    recalculate(): QuoteResult | undefined;
}
/**
 * Auto-register custom element if in browser
 */
export declare function registerWebComponent(tagName?: string): void;
export {};
