/**
 * @nymrel/headless-quote - Attribution & Analytics Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  extractAttribution,
  emitAnalyticsEvent,
  getReferringDomain,
  trackQuoteCalculated,
  trackLeadSubmitted
} from '../src/core/attribution';

describe('Attribution: Domain and Parameter Extraction', () => {
  it('extracts referring domain accurately', () => {
    expect(getReferringDomain('https://www.google.com/search?q=roofing')).toBe('www.google.com');
    expect(getReferringDomain('https://news.ycombinator.com/item?id=123')).toBe('news.ycombinator.com');
    expect(getReferringDomain('')).toBe('');
    expect(getReferringDomain('invalid-url')).toBe('');
  });

  it('extracts attribution data structure with session ID and timestamp', () => {
    const attr = extractAttribution({ sourceLabel: 'hero-banner' });
    expect(attr).toBeDefined();
    expect(attr.source_label).toBe('hero-banner');
    expect(attr.session_id).toMatch(/^sess_/);
    expect(attr.timestamp).toBeDefined();
    expect(['mobile', 'tablet', 'desktop']).toContain(attr.device_type);
  });
});

describe('Analytics: Event Dispatching', () => {
  beforeEach(() => {
    (window as any).dataLayer = [];
  });

  it('pushes events to window.dataLayer', () => {
    emitAnalyticsEvent('test_event', { key: 'value', number: 42 });
    const dl = (window as any).dataLayer;
    expect(dl.length).toBeGreaterThan(0);
    const last = dl[dl.length - 1];
    expect(last.event).toBe('nymrel_quote_test_event');
    expect(last.key).toBe('value');
    expect(last.number).toBe(42);
  });

  it('emits high-level quote calculation and lead submission events', () => {
    trackQuoteCalculated('roofing-v1', 5000, 4500, 5500, 'NYM-12345');
    const dl = (window as any).dataLayer;
    const calcEvent = dl.find((e: any) => e.event === 'nymrel_quote_calculated');
    expect(calcEvent).toBeDefined();
    expect(calcEvent.target).toBe(5000);
    expect(calcEvent.min).toBe(4500);

    trackLeadSubmitted('roofing-v1', 'NYM-12345', 5000, 'lead@example.com');
    const leadEvent = dl.find((e: any) => e.event === 'nymrel_quote_lead_submitted');
    expect(leadEvent).toBeDefined();
    expect(leadEvent.hasEmail).toBe(true);
  });
});
