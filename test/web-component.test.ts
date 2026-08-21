/**
 * @nymrel/headless-quote - Web Component Lifecycle Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import '../src/web-component';
import { NymrelQuoteLayerElement } from '../src/web-component/NymrelQuoteLayer';

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
