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
 * Generate a random UUID-like session identifier
 */
function generateSessionId(): string {
  return 'sess_' + Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)),
    byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Categorize device type based on user agent and screen width
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth || 1024;
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || (width >= 768 && width <= 1024)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || width < 768) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Extract referring domain safely
 */
export function getReferringDomain(referrerStr: string): string {
  if (!referrerStr) return '';
  try {
    const url = new URL(referrerStr);
    return url.hostname;
  } catch {
    return '';
  }
}

/**
 * Extract comprehensive marketing attribution from current browser session
 */
export function extractAttribution(options: AttributionOptions = {}): AttributionData {
  const isBrowser = typeof window !== 'undefined';
  const searchParams = isBrowser ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const referrer = isBrowser ? (document.referrer || '') : '';
  const landingPage = isBrowser ? (window.location.href || '') : '';
  const pageTitle = isBrowser ? (document.title || '') : '';
  const userAgent = isBrowser ? (navigator.userAgent || '') : '';

  // Get or persist session ID
  let sessionId = options.customSessionId || '';
  if (!sessionId && isBrowser) {
    const storageKey = options.storageKey || 'nymrel_quote_session_id';
    try {
      sessionId = window.sessionStorage.getItem(storageKey) || '';
      if (!sessionId) {
        sessionId = generateSessionId();
        window.sessionStorage.setItem(storageKey, sessionId);
      }
    } catch {
      sessionId = generateSessionId();
    }
  } else if (!sessionId) {
    sessionId = generateSessionId();
  }

  // Extract UTM parameters
  const utm_source = searchParams.get('utm_source') || undefined;
  const utm_medium = searchParams.get('utm_medium') || undefined;
  const utm_campaign = searchParams.get('utm_campaign') || undefined;
  const utm_term = searchParams.get('utm_term') || undefined;
  const utm_content = searchParams.get('utm_content') || undefined;

  // Extract Advertising Click IDs
  const gclid = searchParams.get('gclid') || undefined; // Google Ads
  const fbclid = searchParams.get('fbclid') || undefined; // Meta/Facebook Ads
  const msclkid = searchParams.get('msclkid') || undefined; // Microsoft/Bing Ads
  const ttclid = searchParams.get('ttclid') || undefined; // TikTok Ads
  const li_fat_id = searchParams.get('li_fat_id') || undefined; // LinkedIn Ads

  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    fbclid,
    msclkid,
    ttclid,
    li_fat_id,
    referrer,
    referring_domain: getReferringDomain(referrer),
    landing_page: landingPage,
    page_title: pageTitle,
    timestamp: new Date().toISOString(),
    source_label: options.sourceLabel,
    session_id: sessionId,
    device_type: getDeviceType(),
    userAgent
  };
}

/**
 * Emit analytics event to dataLayer, gtag, and DOM CustomEvents
 */
export function emitAnalyticsEvent(
  eventName: string,
  payload: Record<string, any> = {},
  options: AnalyticsOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const pushToDataLayer = options.pushToDataLayer !== false;
  const useGtag = options.useGtag !== false;
  const dispatchDom = options.dispatchDomEvent !== false;
  const prefix = options.prefix || 'nymrel_quote';

  const fullEventName = `${prefix}_${eventName}`;
  const eventData = {
    event: fullEventName,
    ...payload,
    timestamp: new Date().toISOString()
  };

  // 1. Google Tag Manager / GA4 dataLayer
  if (pushToDataLayer) {
    const win = window as any;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push(eventData);
  }

  // 2. Direct gtag
  if (useGtag) {
    const win = window as any;
    if (typeof win.gtag === 'function') {
      win.gtag('event', fullEventName, payload);
    }
  }

  // 3. Native DOM CustomEvent
  if (dispatchDom) {
    try {
      const customEvent = new CustomEvent(fullEventName, {
        bubbles: true,
        cancelable: true,
        detail: eventData
      });
      window.dispatchEvent(customEvent);
    } catch {
      // Fallback for older environments
    }
  }
}

/**
 * Standard Analytics Event Helpers
 */
export function trackQuoteViewed(schemaId: string, metadata?: Record<string, any>): void {
  emitAnalyticsEvent('viewed', { schemaId, ...metadata });
}

export function trackStepCompleted(schemaId: string, stepIndex: number, stepTitle: string, timeSpentMs?: number): void {
  emitAnalyticsEvent('step_completed', { schemaId, stepIndex, stepTitle, timeSpentMs });
}

export function trackQuoteCalculated(schemaId: string, target: number, min: number, max: number, quoteId: string): void {
  emitAnalyticsEvent('calculated', { schemaId, target, min, max, quoteId });
}

export function trackLeadSubmitted(schemaId: string, quoteId: string, target: number, leadEmail: string): void {
  emitAnalyticsEvent('lead_submitted', { 
    schemaId, 
    quoteId, 
    value: target, 
    currency: 'USD',
    hasEmail: Boolean(leadEmail) 
  });
}

export function trackCtaClicked(schemaId: string, ctaName: string, quoteId?: string): void {
  emitAnalyticsEvent('cta_clicked', { schemaId, ctaName, quoteId });
}
