/**
 * @nymrel/headless-quote - Marketing Attribution & Analytics Engine
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */
import { AttributionData } from './types';
export interface AttributionOptions {
    sourceLabel?: string;
    customSessionId?: string;
    storageKey?: string;
}
export interface AnalyticsOptions {
    pushToDataLayer?: boolean;
    useGtag?: boolean;
    dispatchDomEvent?: boolean;
    prefix?: string;
}
/**
 * Categorize device type based on user agent and screen width
 */
export declare function getDeviceType(): 'mobile' | 'tablet' | 'desktop';
/**
 * Extract referring domain safely
 */
export declare function getReferringDomain(referrerStr: string): string;
/**
 * Extract comprehensive marketing attribution from current browser session
 */
export declare function extractAttribution(options?: AttributionOptions): AttributionData;
/**
 * Emit analytics event to dataLayer, gtag, and DOM CustomEvents
 */
export declare function emitAnalyticsEvent(eventName: string, payload?: Record<string, any>, options?: AnalyticsOptions): void;
/**
 * Standard Analytics Event Helpers
 */
export declare function trackQuoteViewed(schemaId: string, metadata?: Record<string, any>): void;
export declare function trackStepCompleted(schemaId: string, stepIndex: number, stepTitle: string, timeSpentMs?: number): void;
export declare function trackQuoteCalculated(schemaId: string, target: number, min: number, max: number, quoteId: string): void;
export declare function trackLeadSubmitted(schemaId: string, quoteId: string, target: number, leadEmail: string): void;
export declare function trackCtaClicked(schemaId: string, ctaName: string, quoteId?: string): void;
