/**
 * @nymrel/headless-quote - Web Component Lifecycle Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '../src/web-component';
import { NymrelQuoteLayerElement } from '../src/web-component/NymrelQuoteLayer';
import { QuoteSchema } from '../src/core/types';

const MINIMAL_SCHEMA: QuoteSchema = {
  id: 'wc-test-schema',
  name: 'Web Component Test Quote',
  pricing: { baseFee: 100, currency: 'USD', currencySymbol: '$' },
  steps: [
    {
      id: 'step-1',
      title: 'Project Details',
      fields: [{ id: 'sqft', label: 'Square Feet', type: 'number', unitPrice: 2 }]
    }
  ],
  leadForm: { enabled: true }
};

describe('Web Component: <nymrel-quote-layer>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers custom element in customElements registry', () => {
    expect(customElements.get('nymrel-quote-layer')).toBeDefined();
  });

  it('renders into shadow root on connectedCallback', () => {
    const el = document.createElement('nymrel-quote-layer') as NymrelQuoteLayerElement;
    el.setAttribute('config', 'roofing');
    document.body.appendChild(el);

    expect(el.shadowRoot).toBeDefined();
    expect(el.shadowRoot?.innerHTML).toContain('nym-container');
    expect(el.shadowRoot?.innerHTML).toContain('Residential Roofing &amp; Siding Estimator');
  });

  it('re-renders when config attribute changes', () => {
    const el = document.createElement('nymrel-quote-layer') as NymrelQuoteLayerElement;
    el.setAttribute('config', 'roofing');
    document.body.appendChild(el);

    expect(el.shadowRoot?.innerHTML).toContain('Roof Dimensions &amp; Slope');

    el.setAttribute('config', 'hvac');
    expect(el.shadowRoot?.innerHTML).toContain('HVAC &amp; Heat Pump System Replacement Calculator');
  });

  it('dispatches nymrel:quote-calculated event', async () => {
    let capturedEvent: any = null;

    const el = document.createElement('nymrel-quote-layer') as NymrelQuoteLayerElement;
    el.addEventListener('nymrel:quote-calculated', (e: any) => {
      capturedEvent = e.detail;
    });

    el.setAttribute('config', 'roofing');
    document.body.appendChild(el);

    expect(capturedEvent).toBeDefined();
    expect(capturedEvent.quote).toBeDefined();
    expect(capturedEvent.quote.min).toBeGreaterThan(0);
  });
});

describe('Web Component: truthful lead delivery receipts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mountElement(attributes: Record<string, string> = {}): NymrelQuoteLayerElement {
    const el = document.createElement('nymrel-quote-layer') as NymrelQuoteLayerElement;
    for (const [name, value] of Object.entries(attributes)) {
      el.setAttribute(name, value);
    }
    document.body.appendChild(el);
    return el;
  }

  it('never claims email dispatch in the default success screen', async () => {
    const el = mountElement({ config: JSON.stringify(MINIMAL_SCHEMA) });
    const widget = el.getWidget();
    expect(widget).toBeTruthy();

    await widget!.submitLead({ name: 'Alex Morgan', email: 'alex@example.com' });

    const html = el.shadowRoot?.innerHTML ?? '';
    expect(html).toContain('Estimate Captured Successfully!');
    expect(html).not.toContain('dispatched to your email');
    expect(html).toContain('Delivery Status:');
    // No webhook-url configured and the element registers an onSubmit dispatcher,
    // so the truthful outcome is callback-only local handling.
    expect(widget!.getLastDeliveryReceipt()?.status).toBe('callback_only');
    expect(html).toContain('No external delivery was attempted');
  });

  it('reports a failed webhook delivery without fabricating success', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    let submittedDetail: any = null;
    const el = mountElement({
      config: JSON.stringify(MINIMAL_SCHEMA),
      'webhook-url': 'https://example.invalid/hook'
    });
    el.addEventListener('nymrel:lead-submitted', (e: any) => {
      submittedDetail = e.detail;
    });

    const widget = el.getWidget();
    expect(widget).toBeTruthy();
    const submission = await widget!.submitLead({ name: 'Alex Morgan', email: 'alex@example.com' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(submission?.delivery?.status).toBe('failed');
    expect(submittedDetail?.submission?.delivery?.status).toBe('failed');
    expect(widget!.getLastDeliveryReceipt()?.status).toBe('failed');

    const html = el.shadowRoot?.innerHTML ?? '';
    expect(html).toContain('could not reach the destination');
    expect(html).not.toContain('dispatched to your email');
  });
});
