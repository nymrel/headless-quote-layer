/**
 * @nymrel/headless-quote - Autonomous Custom Element Web Component
 * Copyright 2026 Nymrel / JalenBuilds LLC
 * Tag: <nymrel-quote-layer>
 */

import { QuoteResult, QuoteSchema, QuoteSubmission, StepConfig } from '../core/types';
import { NymrelQuoteWidget } from '../components/QuoteWidget';
import { getPreset } from '../presets';
import { roofingPreset } from '../presets/roofing';

export class NymrelQuoteLayerElement extends HTMLElement {
  private widgetInstance: NymrelQuoteWidget | null = null;

  static get observedAttributes(): string[] {
    return ['config', 'src', 'webhook-url', 'source-label', 'theme-mode', 'mode'];
  }

  connectedCallback(): void {
    this.initWidget();
  }

  disconnectedCallback(): void {
    this.widgetInstance = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this.isConnected) {
      this.initWidget();
    }
  }

  public async initWidget(): Promise<void> {
    const configAttr = this.getAttribute('config');
    const srcAttr = this.getAttribute('src');
    const webhookUrl = this.getAttribute('webhook-url') || undefined;
    const sourceLabel = this.getAttribute('source-label') || undefined;
    const themeMode = (this.getAttribute('theme-mode') || 'warm') as 'warm' | 'light' | 'dark';
    const renderMode = this.getAttribute('mode') || 'shadow';

    let schema: QuoteSchema = roofingPreset;

    // 1. Check if src is provided to fetch external schema
    if (srcAttr) {
      try {
        const response = await fetch(srcAttr);
        if (!response.ok) {
          throw new Error(`Failed to load quote config from ${srcAttr}: HTTP ${response.status}`);
        }
        schema = await response.json();
      } catch (err: any) {
        console.error('[NymrelQuoteLayer] Schema fetch error:', err);
        this.dispatchEvent(new CustomEvent('nymrel:error', { bubbles: true, composed: true, detail: { error: err.message } }));
      }
    } 
    // 2. Check if inline config is provided (JSON or Preset Name)
    else if (configAttr) {
      const preset = getPreset(configAttr);
      if (preset) {
        schema = preset;
      } else {
        try {
          schema = JSON.parse(configAttr);
        } catch (e) {
          console.warn(`[NymrelQuoteLayer] Could not parse config attribute as JSON or preset name: "${configAttr}". Using default roofing preset.`);
        }
      }
    }

    // Apply theme mode override if specified
    if (themeMode && schema) {
      schema = {
        ...schema,
        theme: {
          ...schema.theme,
          mode: themeMode
        }
      };
    }

    // Initialize or re-render widget
    this.widgetInstance = new NymrelQuoteWidget(this, {
      schema,
      sourceLabel,
      webhookUrl,
      useShadowDom: renderMode !== 'light',
      callbacks: {
        onCalculate: (quote: QuoteResult, formState: Record<string, any>) => {
          this.dispatchEvent(new CustomEvent('nymrel:quote-calculated', {
            bubbles: true,
            composed: true,
            detail: { quote, formState }
          }));
        },
        onStepChange: (stepIndex: number, step: StepConfig) => {
          this.dispatchEvent(new CustomEvent('nymrel:step-change', {
            bubbles: true,
            composed: true,
            detail: { stepIndex, step }
          }));
        },
        onSubmit: (submission: QuoteSubmission) => {
          this.dispatchEvent(new CustomEvent('nymrel:lead-submitted', {
            bubbles: true,
            composed: true,
            detail: { submission }
          }));
        },
        onError: (error: Error | string) => {
          this.dispatchEvent(new CustomEvent('nymrel:error', {
            bubbles: true,
            composed: true,
            detail: { error: typeof error === 'string' ? error : error.message }
          }));
        }
      }
    });

    // Fire initial calculate event on element for initial render
    const initialQuote = this.widgetInstance.recalculate();
    this.dispatchEvent(new CustomEvent('nymrel:quote-calculated', {
      bubbles: true,
      composed: true,
      detail: { quote: initialQuote, formState: {} }
    }));
  }

  /**
   * Public Programmatic Methods on the DOM Element
   */
  public getWidget(): NymrelQuoteWidget | null {
    return this.widgetInstance;
  }

  public nextStep(): boolean {
    return this.widgetInstance?.nextStep() ?? false;
  }

  public prevStep(): void {
    this.widgetInstance?.prevStep();
  }

  public reset(): void {
    this.widgetInstance?.reset();
  }

  public recalculate(): QuoteResult | undefined {
    return this.widgetInstance?.recalculate();
  }
}

/**
 * Auto-register custom element if in browser
 */
export function registerWebComponent(tagName = 'nymrel-quote-layer'): void {
  if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, NymrelQuoteLayerElement);
    }
  }
}
