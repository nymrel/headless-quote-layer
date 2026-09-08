/**
 * @nymrel/headless-quote - Vanilla Interactive Quote Widget Renderer
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import {
  LeadDeliveryReceipt,
  QuoteBreakdownItem,
  QuoteField,
  QuoteResult,
  QuoteSchema,
  QuoteSubmission,
  StepConfig,
  WidgetCallbacks
} from '../core/types';
import { calculateQuote, evaluateCondition, sanitizeInput, validateField } from '../core/engine';
import {
  createCallbackOnlyReceipt,
  createNotConfiguredReceipt,
  deliverSubmissionViaWebhook,
  describeLeadDelivery
} from '../core/lead-delivery';
import { extractAttribution, trackLeadSubmitted, trackQuoteCalculated, trackQuoteViewed, trackStepCompleted } from '../core/attribution';
import { getShadowStyles, resolveTheme } from './WarmTheme';

export interface QuoteWidgetOptions {
  schema: QuoteSchema;
  initialState?: Record<string, any>;
  callbacks?: WidgetCallbacks;
  sourceLabel?: string;
  webhookUrl?: string;
  useShadowDom?: boolean;
}

/**
 * HTML Escape Helper
 */
function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class NymrelQuoteWidget {
  private container: HTMLElement | ShadowRoot;
  private schema: QuoteSchema;
  private callbacks: WidgetCallbacks;
  private formState: Record<string, any> = {};
  private currentStepIndex = 0;
  private currentQuote: QuoteResult;
  private showBreakdownModal = false;
  private isSubmitted = false;
  private isSubmitting = false;
  private lastSubmission: QuoteSubmission | null = null;
  private lastDeliveryReceipt: LeadDeliveryReceipt | null = null;
  private sourceLabel?: string;
  private webhookUrl?: string;
  private fieldErrors: Record<string, string> = {};
  private stepStartTime = Date.now();

  constructor(target: HTMLElement, options: QuoteWidgetOptions) {
    this.schema = options.schema;
    this.callbacks = options.callbacks || {};
    this.sourceLabel = options.sourceLabel || this.schema.sourceLabel;
    this.webhookUrl = options.webhookUrl || this.schema.webhookUrl;

    // Initialize defaults from fields
    this.schema.steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          this.formState[field.id] = field.defaultValue;
        }
      });
    });

    if (options.initialState) {
      this.formState = { ...this.formState, ...options.initialState };
    }

    // Set up container (Shadow DOM or Light DOM)
    if (options.useShadowDom !== false && target.attachShadow) {
      if (!target.shadowRoot) {
        this.container = target.attachShadow({ mode: 'open' });
      } else {
        this.container = target.shadowRoot;
      }
    } else {
      this.container = target;
    }

    // Initial calculation
    this.currentQuote = calculateQuote(this.schema, this.formState);
    trackQuoteViewed(this.schema.id, { sourceLabel: this.sourceLabel });

    this.render();
  }

  /**
   * Update Form State and trigger reactive recalculation
   */
  public updateState(fieldId: string, value: any): void {
    this.formState[fieldId] = sanitizeInput(value);
    delete this.fieldErrors[fieldId];
    this.recalculate();
  }

  /**
   * Recalculate quote
   */
  public recalculate(): QuoteResult {
    this.currentQuote = calculateQuote(this.schema, this.formState);
    trackQuoteCalculated(
      this.schema.id,
      this.currentQuote.target,
      this.currentQuote.min,
      this.currentQuote.max,
      this.currentQuote.quoteId
    );

    if (this.callbacks.onCalculate) {
      this.callbacks.onCalculate(this.currentQuote, this.formState);
    }

    this.render();
    return this.currentQuote;
  }

  /**
   * Go to next step
   */
  public nextStep(): boolean {
    const isLeadStep = this.isLeadFormStep();
    if (!isLeadStep) {
      const currentStep = this.schema.steps[this.currentStepIndex];
      // Validate current step fields
      let hasError = false;
      this.fieldErrors = {};

      for (const field of currentStep.fields) {
        if (!evaluateCondition(field.condition, this.formState)) continue;
        const res = validateField(field, this.formState[field.id]);
        if (!res.valid) {
          this.fieldErrors[field.id] = res.error || 'Invalid value';
          hasError = true;
        }
      }

      if (hasError) {
        this.render();
        return false;
      }

      const timeSpent = Date.now() - this.stepStartTime;
      trackStepCompleted(this.schema.id, this.currentStepIndex, currentStep.title, timeSpent);

      if (this.currentStepIndex < this.schema.steps.length - 1) {
        this.currentStepIndex++;
        this.stepStartTime = Date.now();
        if (this.callbacks.onStepChange) {
          this.callbacks.onStepChange(this.currentStepIndex, this.schema.steps[this.currentStepIndex]);
        }
        this.render();
        return true;
      } else if (this.isLeadFormEnabled()) {
        // Advance to Lead Form step
        this.currentStepIndex++;
        this.stepStartTime = Date.now();
        this.render();
        return true;
      }
    }
    return false;
  }

  /**
   * Go to previous step
   */
  public prevStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.stepStartTime = Date.now();
      if (this.callbacks.onStepChange && this.currentStepIndex < this.schema.steps.length) {
        this.callbacks.onStepChange(this.currentStepIndex, this.schema.steps[this.currentStepIndex]);
      }
      this.render();
    }
  }

  public isLeadFormEnabled(): boolean {
    return this.schema.leadForm?.enabled !== false;
  }

  public isLeadFormStep(): boolean {
    return this.isLeadFormEnabled() && this.currentStepIndex === this.schema.steps.length;
  }

  public getTotalStepsCount(): number {
    return this.schema.steps.length + (this.isLeadFormEnabled() ? 1 : 0);
  }

  /**
   * Submit lead capture and finalize quote
   */
  public async submitLead(leadData: Record<string, any>): Promise<QuoteSubmission | null> {
    const leadFormConfig = this.schema.leadForm;
    this.fieldErrors = {};

    // Validate Lead Data
    if (!leadData.name || String(leadData.name).trim() === '') {
      this.fieldErrors['lead_name'] = 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadData.email || String(leadData.email).length > 254 || !emailRegex.test(String(leadData.email))) {
      this.fieldErrors['lead_email'] = 'A valid email address is required.';
    }

    if (leadFormConfig?.requirePhone) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!leadData.phone || !phoneRegex.test(String(leadData.phone))) {
        this.fieldErrors['lead_phone'] = 'Phone number is required.';
      }
    }

    if (leadFormConfig?.requireAddress && !leadData.address) {
      this.fieldErrors['lead_address'] = 'Street address or zip code is required.';
    }

    if (Object.keys(this.fieldErrors).length > 0) {
      this.render();
      return null;
    }

    this.isSubmitting = true;
    this.render();

    const attribution = extractAttribution({ sourceLabel: this.sourceLabel });

    const submission: QuoteSubmission = {
      quoteId: this.currentQuote.quoteId,
      schemaId: this.schema.id,
      schemaName: this.schema.name,
      quote: this.currentQuote,
      formState: { ...this.formState },
      lead: {
        name: sanitizeInput(leadData.name),
        email: sanitizeInput(leadData.email),
        phone: sanitizeInput(leadData.phone || ''),
        address: sanitizeInput(leadData.address || ''),
        zipCode: sanitizeInput(leadData.zipCode || ''),
        preferredDate: sanitizeInput(leadData.preferredDate || ''),
        preferredTime: sanitizeInput(leadData.preferredTime || ''),
        notes: sanitizeInput(leadData.notes || '')
      },
      attribution,
      submittedAt: new Date().toISOString(),
      metadata: this.schema.metadata
    };

    try {
      // 1. Dispatch Webhook POST if configured, recording a truthful receipt.
      //    Only a resolved fetch with response.ok === true counts as acceptance.
      if (this.webhookUrl) {
        const delivery = await deliverSubmissionViaWebhook(this.webhookUrl, submission);
        if (delivery.status === 'rejected' || delivery.status === 'failed') {
          console.warn('[NymrelQuote] Webhook delivery notice:', delivery.message);
        }
        submission.delivery = delivery;
      } else {
        submission.delivery = this.callbacks.onSubmit
          ? createCallbackOnlyReceipt()
          : createNotConfiguredReceipt();
      }

      // 2. Call user callback
      if (this.callbacks.onSubmit) {
        try {
          await this.callbacks.onSubmit(submission);
        } catch (error) {
          submission.localHandlingFailed = true;
          if (submission.delivery?.channel === 'callback') {
            submission.delivery = {
              ...submission.delivery,
              status: 'failed',
              ok: false,
              message: 'The page handler failed. No external delivery was attempted by the widget. Your quote is shown below.'
            };
          }
          try { this.callbacks.onError?.(error as Error); } catch { /* Keep the observed receipt. */ }
        }
      }

      // 3. Track GA4/GTM event
      try { trackLeadSubmitted(
        this.schema.id,
        submission.quoteId,
        this.currentQuote.target,
        submission.lead.email
      ); } catch { /* Analytics cannot discard a captured submission. */ }

      this.isSubmitting = false;
      this.isSubmitted = true;
      this.lastSubmission = submission;
      this.lastDeliveryReceipt = submission.delivery ?? null;
      this.render();
      return submission;
    } catch (err: any) {
      this.isSubmitting = false;
      if (this.callbacks.onError) {
        this.callbacks.onError(err);
      }
      this.fieldErrors['_global'] = 'Submission failed. Please check your connection and try again.';
      this.render();
      return null;
    }
  }

  /**
   * Truthful delivery receipt for the most recent submission.
   * Null before any submission; cleared by reset().
   * Only `status === 'accepted'` reflects a verified (2xx) webhook response.
   */
  public getLastDeliveryReceipt(): LeadDeliveryReceipt | null {
    return this.lastDeliveryReceipt;
  }

  /**
   * Reset Quote to initial state
   */
  public reset(): void {
    this.formState = {};
    this.schema.steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          this.formState[field.id] = field.defaultValue;
        }
      });
    });
    this.currentStepIndex = 0;
    this.isSubmitted = false;
    this.isSubmitting = false;
    this.lastSubmission = null;
    this.lastDeliveryReceipt = null;
    this.fieldErrors = {};
    this.recalculate();
  }

  /**
   * Print or Download summary receipt
   */
  public printReceipt(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  /**
   * Render complete DOM tree into container
   */
  public render(): void {
    const themeStyles = getShadowStyles(this.schema.theme);

    let contentHtml = '';

    if (this.isSubmitted && this.lastSubmission) {
      contentHtml = this.renderSuccessScreen(this.lastSubmission);
    } else if (this.isLeadFormStep()) {
      contentHtml = this.renderLeadFormStep();
    } else {
      contentHtml = this.renderStepForm(this.schema.steps[this.currentStepIndex]);
    }

    const modalHtml = this.showBreakdownModal ? this.renderBreakdownModal() : '';

    const html = `
      <style>${themeStyles}</style>
      <div class="nym-container" role="region" aria-label="${escapeHtml(this.schema.name)}">
        <!-- Header -->
        <header class="nym-header">
          <div class="nym-header-content">
            <h2>${escapeHtml(this.schema.name)}</h2>
            ${this.schema.description ? `<p>${escapeHtml(this.schema.description)}</p>` : ''}
          </div>
          ${this.schema.badge ? `<span class="nym-badge">${escapeHtml(this.schema.badge)}</span>` : ''}
        </header>

        <!-- Live Reactive Range Banner -->
        <div class="nym-range-banner">
          <div class="nym-range-info">
            <span class="nym-range-label">Instant Estimated Range</span>
            <div class="nym-range-values">
              <span class="nym-range-amount">${escapeHtml(this.currentQuote.formattedMin)}</span>
              <span class="nym-range-separator">&ndash;</span>
              <span class="nym-range-amount">${escapeHtml(this.currentQuote.formattedMax)}</span>
            </div>
            <span class="nym-range-target">Baseline Target: <strong>${escapeHtml(this.currentQuote.formattedTarget)}</strong></span>
          </div>
          <button type="button" class="nym-btn-breakdown" id="nym-toggle-breakdown" aria-label="View cost breakdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            Itemized Breakdown
          </button>
        </div>

        <!-- Stepper Progress Dots -->
        <div class="nym-stepper" aria-label="Quote Progress">
          ${Array.from({ length: this.getTotalStepsCount() }).map((_, idx) => {
            let cls = 'nym-step-dot';
            if (idx === this.currentStepIndex) cls += ' active';
            if (idx < this.currentStepIndex) cls += ' completed';
            return `<div class="${cls}"></div>`;
          }).join('')}
        </div>
        <div class="nym-step-legend">
          <span>Step ${this.currentStepIndex + 1} of ${this.getTotalStepsCount()}</span>
          <span>${this.isLeadFormStep() ? 'Lead Contact & Booking' : escapeHtml(this.schema.steps[this.currentStepIndex]?.title || '')}</span>
        </div>

        <!-- Main Step Form Content -->
        ${contentHtml}

        <!-- Recommendations Box if available -->
        ${this.currentQuote.recommendations.length > 0 && !this.isSubmitted ? `
          <div class="nym-recommendations">
            ${this.currentQuote.recommendations.map(r => `
              <div class="nym-recommendation-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${escapeHtml(r)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Trust Footer -->
        <footer class="nym-trust-footer">
          <span>🔒 Instant Guaranteed Price Range &bull; Zero Spam Guarantee</span>
          <a class="nym-trust-link" href="https://github.com/nymrel/headless-quote-layer" target="_blank" rel="noopener noreferrer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Built with Nymrel Quote Layer
          </a>
        </footer>

        <!-- Itemized Breakdown Modal / Drawer -->
        ${modalHtml}
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * Render Standard Calculation Step
   */
  private renderStepForm(step: StepConfig): string {
    const isFirstStep = this.currentStepIndex === 0;

    return `
      <div class="nym-step-view">
        <h3 class="nym-step-title">${escapeHtml(step.title)}</h3>
        ${step.subtitle ? `<p class="nym-step-subtitle">${escapeHtml(step.subtitle)}</p>` : ''}

        <div class="nym-fields-list">
          ${step.fields.map(field => this.renderField(field)).join('')}
        </div>

        <div class="nym-footer">
          ${!isFirstStep ? `
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Back
            </button>
          ` : '<div></div>'}
          <button type="button" class="nym-btn nym-btn-primary" id="nym-btn-next">
            ${this.currentStepIndex === this.schema.steps.length - 1 && !this.isLeadFormEnabled() ? 'Finish Quote' : 'Continue &rarr;'}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render Individual Field Controls
   */
  private renderField(field: QuoteField): string {
    if (!evaluateCondition(field.condition, this.formState)) {
      return '';
    }

    const val = this.formState[field.id] !== undefined ? this.formState[field.id] : (field.defaultValue ?? '');
    const error = this.fieldErrors[field.id];

    let controlHtml = '';

    switch (field.type) {
      case 'slider': {
        const min = field.min ?? 100;
        const max = field.max ?? 5000;
        const step = field.step ?? 50;
        const currentVal = Number(val) || min;

        controlHtml = `
          <div class="nym-slider-container">
            <div class="nym-slider-header">
              <span class="nym-slider-ticks">${min} ${field.unit || ''}</span>
              <span class="nym-slider-val" id="val-${field.id}">${currentVal} ${field.unit || ''}</span>
              <span class="nym-slider-ticks">${max} ${field.unit || ''}</span>
            </div>
            <input 
              type="range" 
              class="nym-slider nym-reactive-input" 
              data-field-id="${field.id}" 
              min="${min}" 
              max="${max}" 
              step="${step}" 
              value="${currentVal}"
              aria-label="${escapeHtml(field.label)}"
            />
          </div>
        `;
        break;
      }

      case 'select': {
        controlHtml = `
          <select class="nym-select nym-reactive-input" data-field-id="${field.id}" aria-label="${escapeHtml(field.label)}">
            ${field.options?.map(opt => `
              <option value="${escapeHtml(opt.id)}" ${String(val) === String(opt.id) ? 'selected' : ''}>
                ${escapeHtml(opt.label)} ${opt.adder ? `(+${this.currentQuote.currencySymbol}${opt.adder})` : ''} ${opt.multiplier ? `(${opt.multiplier}x)` : ''}
              </option>
            `).join('')}
          </select>
        `;
        break;
      }

      case 'radio': {
        controlHtml = `
          <div class="nym-options-grid" role="radiogroup" aria-label="${escapeHtml(field.label)}">
            ${field.options?.map(opt => {
              const isSelected = String(val) === String(opt.id);
              return `
                <div 
                  class="nym-option-card ${isSelected ? 'selected' : ''}" 
                  data-field-id="${field.id}" 
                  data-option-id="${escapeHtml(opt.id)}"
                  role="radio"
                  aria-checked="${isSelected}"
                  tabindex="0"
                >
                  <div class="nym-option-header">
                    <span class="nym-option-title">${escapeHtml(opt.label)}</span>
                    ${opt.badge ? `<span class="nym-option-badge">${escapeHtml(opt.badge)}</span>` : ''}
                  </div>
                  ${opt.description ? `<p class="nym-option-desc">${escapeHtml(opt.description)}</p>` : ''}
                  ${(opt.adder || opt.multiplier) ? `
                    <div class="nym-option-price">
                      ${opt.adder ? `+${this.currentQuote.currencySymbol}${opt.adder}` : ''}
                      ${opt.multiplier ? `${opt.multiplier}x multiplier` : ''}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `;
        break;
      }

      case 'checkbox': {
        const checkedList = Array.isArray(val) ? val : [];
        controlHtml = `
          <div class="nym-checkbox-list">
            ${field.options?.map(opt => {
              const isChecked = checkedList.includes(opt.id);
              return `
                <div 
                  class="nym-checkbox-item ${isChecked ? 'checked' : ''}" 
                  data-field-id="${field.id}" 
                  data-checkbox-id="${escapeHtml(opt.id)}"
                  role="checkbox"
                  aria-checked="${isChecked}"
                  tabindex="0"
                >
                  <div class="nym-checkbox-box">
                    ${isChecked ? '✓' : ''}
                  </div>
                  <div class="nym-checkbox-info">
                    <div class="nym-checkbox-title">
                      <span>${escapeHtml(opt.label)}</span>
                      ${opt.adder ? `<span>+${this.currentQuote.currencySymbol}${opt.adder}</span>` : ''}
                    </div>
                    ${opt.description ? `<div class="nym-checkbox-desc">${escapeHtml(opt.description)}</div>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
        break;
      }

      case 'number':
      case 'stepper': {
        controlHtml = `
          <input 
            type="number" 
            class="nym-input nym-reactive-input" 
            data-field-id="${field.id}" 
            min="${field.min ?? 0}" 
            max="${field.max ?? 999999}" 
            step="${field.step ?? 1}" 
            value="${escapeHtml(val)}"
            placeholder="${field.placeholder ? escapeHtml(field.placeholder) : ''}"
            aria-label="${escapeHtml(field.label)}"
          />
        `;
        break;
      }

      default: {
        controlHtml = `
          <input 
            type="text" 
            class="nym-input nym-reactive-input" 
            data-field-id="${field.id}" 
            value="${escapeHtml(val)}"
            placeholder="${field.placeholder ? escapeHtml(field.placeholder) : ''}"
            aria-label="${escapeHtml(field.label)}"
          />
        `;
      }
    }

    return `
      <div class="nym-field-group">
        <label class="nym-label">
          <span>${escapeHtml(field.label)}${field.required ? ' *' : ''}</span>
          ${field.unit && field.type !== 'slider' ? `<span class="nym-helper-text">${escapeHtml(field.unit)}</span>` : ''}
        </label>
        ${controlHtml}
        ${field.helperText ? `<div class="nym-helper-text">${escapeHtml(field.helperText)}</div>` : ''}
        ${error ? `<div class="nym-error-text">${escapeHtml(error)}</div>` : ''}
      </div>
    `;
  }

  /**
   * Render Lead Contact & Scheduling Capture Step
   */
  private renderLeadFormStep(): string {
    const config = this.schema.leadForm;
    const globalErr = this.fieldErrors['_global'];

    return `
      <div class="nym-lead-step">
        <h3 class="nym-step-title">${escapeHtml(config?.title || 'Lock in Your Official Quote')}</h3>
        <p class="nym-step-subtitle">${escapeHtml(config?.subtitle || 'Enter your contact details to save your estimate, receive your official PDF breakdown, and schedule an on-site inspection.')}</p>

        ${globalErr ? `<div class="nym-error-text" style="margin-bottom: 16px;">${escapeHtml(globalErr)}</div>` : ''}

        <form id="nym-lead-form">
          <div class="nym-field-group">
            <label class="nym-label">Full Name *</label>
            <input type="text" name="name" class="nym-input" required placeholder="e.g. Alex Morgan" value="${escapeHtml(this.formState._lead_name || '')}" />
            ${this.fieldErrors['lead_name'] ? `<div class="nym-error-text">${escapeHtml(this.fieldErrors['lead_name'])}</div>` : ''}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Email Address *</label>
            <input type="email" name="email" class="nym-input" required placeholder="alex@example.com" value="${escapeHtml(this.formState._lead_email || '')}" />
            ${this.fieldErrors['lead_email'] ? `<div class="nym-error-text">${escapeHtml(this.fieldErrors['lead_email'])}</div>` : ''}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Phone Number ${config?.requirePhone ? '*' : '(Optional)'}</label>
            <input type="tel" name="phone" class="nym-input" ${config?.requirePhone ? 'required' : ''} placeholder="(555) 019-2834" value="${escapeHtml(this.formState._lead_phone || '')}" />
            ${this.fieldErrors['lead_phone'] ? `<div class="nym-error-text">${escapeHtml(this.fieldErrors['lead_phone'])}</div>` : ''}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="nym-field-group">
              <label class="nym-label">Street Address ${config?.requireAddress ? '*' : ''}</label>
              <input type="text" name="address" class="nym-input" placeholder="123 Maple Way" value="${escapeHtml(this.formState._lead_address || '')}" />
              ${this.fieldErrors['lead_address'] ? `<div class="nym-error-text">${escapeHtml(this.fieldErrors['lead_address'])}</div>` : ''}
            </div>
            <div class="nym-field-group">
              <label class="nym-label">Zip Code</label>
              <input type="text" name="zipCode" class="nym-input" placeholder="90210" value="${escapeHtml(this.formState._lead_zip || '')}" />
            </div>
          </div>

          ${config?.requireDate ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nym-field-group">
                <label class="nym-label">Preferred Date</label>
                <input type="date" name="preferredDate" class="nym-input" value="${escapeHtml(this.formState._lead_date || '')}" />
              </div>
              <div class="nym-field-group">
                <label class="nym-label">Preferred Window</label>
                <select name="preferredTime" class="nym-select">
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 4pm)</option>
                  <option value="evening">Evening (4pm - 7pm)</option>
                </select>
              </div>
            </div>
          ` : ''}

          ${config?.collectNotes !== false ? `
            <div class="nym-field-group">
              <label class="nym-label">Project Notes or Questions</label>
              <textarea name="notes" class="nym-textarea" placeholder="Tell us about specific property access, timeline goals, or special requirements...">${escapeHtml(this.formState._lead_notes || '')}</textarea>
            </div>
          ` : ''}

          <div class="nym-helper-text" style="margin-bottom: 20px;">
            ${escapeHtml(config?.disclaimerText || 'By submitting, you agree to receive project updates and quote confirmation. We respect your privacy and never sell data.')}
          </div>

          <div class="nym-footer">
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Edit Parameters
            </button>
            <button type="submit" class="nym-btn nym-btn-primary" ${this.isSubmitting ? 'disabled' : ''}>
              ${this.isSubmitting ? 'Processing...' : (config?.submitButtonText || 'Lock In My Estimate &rarr;')}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * Render Success / Receipt Confirmation Screen
   */
  private renderSuccessScreen(submission: QuoteSubmission): string {
    const config = this.schema.leadForm;
    const allowCustomCopy = submission.delivery?.status === 'accepted' && !submission.localHandlingFailed;

    return `
      <div class="nym-success-screen">
        <div class="nym-success-icon">✓</div>
        <h3 class="nym-step-title">${escapeHtml((allowCustomCopy && config?.successTitle) || 'Estimate Captured Successfully!')}</h3>
        <p class="nym-step-subtitle">${escapeHtml((allowCustomCopy && config?.successMessage) || 'Your quote summary is below. Print or save a copy for your records.')}</p>
        ${submission.localHandlingFailed ? '<p role="alert">The page handler failed after capture. The delivery status below records the observed outcome.</p>' : ''}

        <div class="nym-receipt-card">
          <div class="nym-delivery-status nym-receipt-row" role="status">
            <span class="nym-receipt-key">Delivery Status:</span>
            <span class="nym-receipt-val">${escapeHtml(describeLeadDelivery(this.lastDeliveryReceipt))}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Quote Reference ID:</span>
            <span class="nym-receipt-val" style="font-family: monospace;">${escapeHtml(submission.quoteId)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Estimated Price Range:</span>
            <span class="nym-receipt-val" style="color: var(--nym-accent); font-size: 1.05rem;">
              ${escapeHtml(submission.quote.formattedMin)} &ndash; ${escapeHtml(submission.quote.formattedMax)}
            </span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Baseline Target:</span>
            <span class="nym-receipt-val">${escapeHtml(submission.quote.formattedTarget)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Recipient:</span>
            <span class="nym-receipt-val">${escapeHtml(submission.lead.name)} (${escapeHtml(submission.lead.email)})</span>
          </div>
          ${submission.lead.preferredDate ? `
            <div class="nym-receipt-row">
              <span class="nym-receipt-key">Requested Consultation:</span>
              <span class="nym-receipt-val">${escapeHtml(submission.lead.preferredDate)} (${escapeHtml(submission.lead.preferredTime || 'Anytime')})</span>
            </div>
          ` : ''}
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
          <button type="button" class="nym-btn nym-btn-primary" id="nym-btn-print">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print / Save Receipt
          </button>
          <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-restart">
            Start New Quote
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render Itemized Breakdown Drawer / Modal
   */
  private renderBreakdownModal(): string {
    return `
      <div class="nym-modal-backdrop" id="nym-modal-backdrop">
        <div class="nym-modal" role="dialog" aria-modal="true" aria-labelledby="nym-modal-heading">
          <div class="nym-modal-header">
            <h3 id="nym-modal-heading">Cost Calculation Breakdown</h3>
            <button type="button" class="nym-btn-close" id="nym-modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="nym-modal-body">
            <table class="nym-breakdown-table">
              <tbody>
                ${this.currentQuote.breakdown.map(item => `
                  <tr>
                    <td>
                      <div class="nym-breakdown-label">${escapeHtml(item.label)}</div>
                      ${item.description ? `<div class="nym-breakdown-subtext">${escapeHtml(item.description)}</div>` : ''}
                    </td>
                    <td class="nym-breakdown-val">${escapeHtml(item.formattedAmount)}</td>
                  </tr>
                `).join('')}
                <tr class="nym-breakdown-total">
                  <td><strong>Estimated Baseline Target</strong></td>
                  <td class="nym-breakdown-val">${escapeHtml(this.currentQuote.formattedTarget)}</td>
                </tr>
                <tr>
                  <td><strong>Dynamic Estimated Range</strong></td>
                  <td class="nym-breakdown-val">${escapeHtml(this.currentQuote.formattedMin)} &ndash; ${escapeHtml(this.currentQuote.formattedMax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach Interactive Event Listeners
   */
  private attachEventListeners(): void {
    // 1. Reactive Input / Select / Slider change listeners
    const inputs = this.container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.nym-reactive-input');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const fieldId = target.getAttribute('data-field-id');
        if (fieldId) {
          this.updateState(fieldId, target.value);
          // If slider, update label text live
          const valLabel = this.container.querySelector(`#val-${fieldId}`);
          if (valLabel) {
            valLabel.textContent = `${target.value} ${target.getAttribute('data-unit') || ''}`.trim();
          }
        }
      });
    });

    // 2. Radio Card Option Click Listeners
    const optionCards = this.container.querySelectorAll<HTMLElement>('.nym-option-card');
    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        const fieldId = card.getAttribute('data-field-id');
        const optionId = card.getAttribute('data-option-id');
        if (fieldId && optionId) {
          this.updateState(fieldId, optionId);
        }
      });
    });

    // 3. Checkbox Addon Click Listeners
    const checkboxItems = this.container.querySelectorAll<HTMLElement>('.nym-checkbox-item');
    checkboxItems.forEach(item => {
      item.addEventListener('click', () => {
        const fieldId = item.getAttribute('data-field-id');
        const checkboxId = item.getAttribute('data-checkbox-id');
        if (fieldId && checkboxId) {
          const currentList = Array.isArray(this.formState[fieldId]) ? [...this.formState[fieldId]] : [];
          const idx = currentList.indexOf(checkboxId);
          if (idx >= 0) {
            currentList.splice(idx, 1);
          } else {
            currentList.push(checkboxId);
          }
          this.updateState(fieldId, currentList);
        }
      });
    });

    // 4. Stepper Navigation Buttons
    const btnNext = this.container.querySelector('#nym-btn-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => this.nextStep());
    }

    const btnPrev = this.container.querySelector('#nym-btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => this.prevStep());
    }

    // 5. Lead Form Submission
    const leadForm = this.container.querySelector<HTMLFormElement>('#nym-lead-form');
    if (leadForm) {
      leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(leadForm);
        const data: Record<string, any> = {};
        formData.forEach((val, key) => {
          data[key] = val;
        });
        this.submitLead(data);
      });
    }

    // 6. Breakdown Modal Toggle
    const btnBreakdown = this.container.querySelector('#nym-toggle-breakdown');
    if (btnBreakdown) {
      btnBreakdown.addEventListener('click', () => {
        this.showBreakdownModal = true;
        this.render();
      });
    }

    const btnCloseModal = this.container.querySelector('#nym-modal-close');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        this.showBreakdownModal = false;
        this.render();
      });
    }

    const modalBackdrop = this.container.querySelector('#nym-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.showBreakdownModal = false;
          this.render();
        }
      });
    }

    // 7. Success Actions (Print & Restart)
    const btnPrint = this.container.querySelector('#nym-btn-print');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => this.printReceipt());
    }

    const btnRestart = this.container.querySelector('#nym-btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => this.reset());
    }
  }
}

/**
 * Convenience mount helper
 */
export function createQuoteWidget(
  target: HTMLElement | string,
  options: QuoteWidgetOptions
): NymrelQuoteWidget {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) {
    throw new Error(`[NymrelQuote] Container element not found: ${target}`);
  }
  return new NymrelQuoteWidget(el, options);
}
