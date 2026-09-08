/**
 * @nymrel/headless-quote - Truthful Lead Delivery Receipt Tests
 *
 * Deterministic coverage: no live URLs, no provider calls. All HTTP behavior
 * is simulated with stubbed fetch responses.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  createCallbackOnlyReceipt,
  createNotConfiguredReceipt,
  deliverSubmissionViaWebhook,
  describeLeadDelivery,
  isDeliveryAccepted
} from '../src/core/lead-delivery';
import { createQuoteWidget, QuoteWidgetOptions } from '../src/components/QuoteWidget';
import {
  LeadDeliveryReceipt,
  QuoteSchema,
  QuoteSubmission,
  WidgetCallbacks
} from '../src/core/types';

const ATTEMPTED_AT = '2026-08-21T12:00:00.000Z';

function makeSchema(overrides: Partial<QuoteSchema> = {}): QuoteSchema {
  return {
    id: 'test-schema',
    name: 'Test Quote',
    pricing: { baseFee: 100, currency: 'USD', currencySymbol: '$' },
    steps: [
      {
        id: 'step-1',
        title: 'Project Details',
        fields: [{ id: 'sqft', label: 'Square Feet', type: 'number', unitPrice: 2 }]
      }
    ],
    leadForm: { enabled: true },
    ...overrides
  };
}

interface WidgetHost {
  widget: ReturnType<typeof createQuoteWidget>;
  host: HTMLElement;
}

function mountWidget(options: Partial<QuoteWidgetOptions> = {}): WidgetHost {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const widget = createQuoteWidget(host, {
    schema: makeSchema(),
    useShadowDom: false,
    ...options
  });
  return { widget, host };
}

const VALID_LEAD = { name: 'Alex Morgan', email: 'alex@example.com' };

describe('Lead delivery receipt helpers', () => {
  it('creates a not-configured receipt with no channel attempt', () => {
    const receipt = createNotConfiguredReceipt(ATTEMPTED_AT);
    expect(receipt.status).toBe('not_configured');
    expect(receipt.channel).toBe('none');
    expect(receipt.attemptedAt).toBe(ATTEMPTED_AT);
    expect(receipt.httpStatus).toBeUndefined();
    expect(receipt.ok).toBeUndefined();
  });

  it('creates a callback-only receipt for local handling without HTTP', () => {
    const receipt = createCallbackOnlyReceipt(ATTEMPTED_AT);
    expect(receipt.status).toBe('callback_only');
    expect(receipt.channel).toBe('callback');
    expect(receipt.httpStatus).toBeUndefined();
  });

  it('receipts survive a JSON round-trip unchanged (serializable contract)', () => {
    const receipt: LeadDeliveryReceipt = {
      status: 'accepted',
      channel: 'webhook',
      attemptedAt: ATTEMPTED_AT,
      httpStatus: 200,
      ok: true,
      message: 'Delivery confirmed.'
    };
    expect(JSON.parse(JSON.stringify(receipt))).toEqual(receipt);
  });

  it('treats only the accepted status as verified delivery', () => {
    expect(isDeliveryAccepted({ status: 'accepted', channel: 'webhook', attemptedAt: ATTEMPTED_AT, ok: true, message: '' })).toBe(true);
    expect(isDeliveryAccepted({ status: 'rejected', channel: 'webhook', attemptedAt: ATTEMPTED_AT, ok: false, message: '' })).toBe(false);
    expect(isDeliveryAccepted({ status: 'failed', channel: 'webhook', attemptedAt: ATTEMPTED_AT, ok: false, message: '' })).toBe(false);
    expect(isDeliveryAccepted(createNotConfiguredReceipt())).toBe(false);
    expect(isDeliveryAccepted(createCallbackOnlyReceipt())).toBe(false);
    expect(isDeliveryAccepted(null)).toBe(false);
    expect(isDeliveryAccepted(undefined)).toBe(false);
  });

  it('display copy never implies verified dispatch unless delivery was accepted', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200 } as Response)
      .mockResolvedValueOnce({ ok: false, status: 500 } as Response)
      .mockRejectedValueOnce(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    const submission = { quoteId: 'q_test' } as unknown as QuoteSubmission;

    const accepted = await deliverSubmissionViaWebhook('https://example.invalid/hook', submission);
    const rejected = await deliverSubmissionViaWebhook('https://example.invalid/hook', submission);
    const failed = await deliverSubmissionViaWebhook('https://example.invalid/hook', submission);
    vi.unstubAllGlobals();

    const nonAccepted = [rejected, failed, createNotConfiguredReceipt(), createCallbackOnlyReceipt()];
    for (const receipt of nonAccepted) {
      expect(/confirm|dispatch|email|crm/i.test(describeLeadDelivery(receipt))).toBe(false);
    }

    expect(describeLeadDelivery(accepted)).toMatch(/accepted/i);
    expect(describeLeadDelivery(rejected)).toMatch(/declined/i);
    expect(describeLeadDelivery(failed)).toMatch(/could not reach/i);
    expect(describeLeadDelivery(null)).toBe(createNotConfiguredReceipt().message);
  });
});

describe('deliverSubmissionViaWebhook', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an accepted receipt only for response.ok === true', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const submission = { quoteId: 'q_abc' } as unknown as QuoteSubmission;
    const receipt = await deliverSubmissionViaWebhook('https://example.invalid/hook', submission);

    expect(receipt).toMatchObject({
      status: 'accepted',
      channel: 'webhook',
      httpStatus: 201,
      ok: true
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.invalid/hook');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(submission);
  });

  it('returns a rejected receipt with the HTTP status on non-2xx responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const receipt = await deliverSubmissionViaWebhook(
      'https://example.invalid/hook',
      { quoteId: 'q_abc' } as unknown as QuoteSubmission
    );

    expect(receipt.status).toBe('rejected');
    expect(receipt.httpStatus).toBe(503);
    expect(receipt.ok).toBe(false);
  });

  it('returns a failed receipt without an HTTP status when fetch throws', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const receipt = await deliverSubmissionViaWebhook(
      'https://example.invalid/hook',
      { quoteId: 'q_abc' } as unknown as QuoteSubmission
    );

    expect(receipt.status).toBe('failed');
    expect(receipt.ok).toBe(false);
    expect(receipt.httpStatus).toBeUndefined();
  });
});

describe('NymrelQuoteWidget.submitLead delivery receipts', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('records acceptance and surfaces the confirmed status when the endpoint responds 2xx', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const { widget, host } = mountWidget({ webhookUrl: 'https://example.invalid/hook' });
    const submission = await widget.submitLead({ ...VALID_LEAD });

    expect(host.innerHTML).toContain('nym-success-screen');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const receipt = widget.getLastDeliveryReceipt();
    expect(receipt?.status).toBe('accepted');
    expect(receipt?.httpStatus).toBe(200);
    expect(receipt?.ok).toBe(true);
    expect(submission?.delivery).toEqual(receipt ?? {});

    expect(host.innerHTML).toContain('Delivery Status:');
    expect(host.innerHTML).toContain('Your quote was accepted by the destination.');
    expect(host.innerHTML).toContain('Estimate Captured Successfully!');
  });

  it('keeps the local submission and records rejection on a non-2xx response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const { widget, host } = mountWidget({ webhookUrl: 'https://example.invalid/hook' });
    const submission = await widget.submitLead({ ...VALID_LEAD });

    // Local capture survives even though external delivery was declined.
    expect(submission).not.toBeNull();
    expect(submission?.lead.email).toBe(VALID_LEAD.email);
    expect(widget.getLastDeliveryReceipt()).toMatchObject({
      status: 'rejected',
      httpStatus: 500,
      ok: false
    });

    // Success screen must not claim provider/email delivery.
    expect(host.innerHTML).not.toContain('dispatched to your email');
    expect(host.innerHTML).toContain('declined this quote (HTTP 500)');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('keeps the local submission and records failure when fetch throws', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const { widget, host } = mountWidget({ webhookUrl: 'https://example.invalid/hook' });
    const submission = await widget.submitLead({ ...VALID_LEAD });

    expect(submission).not.toBeNull();
    expect(submission?.quoteId).toBeTruthy();
    const receipt = widget.getLastDeliveryReceipt();
    expect(receipt?.status).toBe('failed');
    expect(receipt?.ok).toBe(false);
    expect(receipt?.httpStatus).toBeUndefined();

    expect(host.innerHTML).toContain('could not reach the destination');
    expect(host.innerHTML).not.toContain('dispatched to your email');
  });

  it('records not_configured when no webhook and no callback exist, without calling fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { widget } = mountWidget();
    const submission = await widget.submitLead({ ...VALID_LEAD });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(widget.getLastDeliveryReceipt()).toMatchObject({
      status: 'not_configured',
      channel: 'none'
    });
    expect(submission?.delivery?.status).toBe('not_configured');
  });

  it('records callback_only and hands the receipt-bearing submission to onSubmit', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const received: QuoteSubmission[] = [];
    const callbacks: WidgetCallbacks = {
      onSubmit: (submission) => {
        received.push(submission);
      }
    };

    const { widget } = mountWidget({ callbacks });
    await widget.submitLead({ ...VALID_LEAD });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(received).toHaveLength(1);
    expect(received[0].delivery).toMatchObject({
      status: 'callback_only',
      channel: 'callback'
    });
    expect(widget.getLastDeliveryReceipt()?.status).toBe('callback_only');
  });

  it('does not let customized success copy alter the machine-readable receipt', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const { widget, host } = mountWidget({
      webhookUrl: 'https://example.invalid/hook',
      schema: makeSchema({
        leadForm: {
          enabled: true,
          successTitle: 'All Set!',
          successMessage: 'Our team will follow up shortly.'
        }
      })
    });

    const submission = await widget.submitLead({ ...VALID_LEAD });

    // Unverified delivery cannot activate custom success promises.
    expect(host.innerHTML).not.toContain('All Set!');
    expect(host.innerHTML).not.toContain('Our team will follow up shortly.');
    // ...but the machine-readable receipt still reports the true outcome.
    expect(submission?.delivery?.status).toBe('failed');
    expect(widget.getLastDeliveryReceipt()?.status).toBe('failed');
    expect(host.innerHTML).toContain('could not reach the destination');
  });

  it('preserves accepted delivery when a page callback throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }));
    const onError = vi.fn();
    const { widget, host } = mountWidget({ webhookUrl: 'https://example.invalid/hook',
      callbacks: { onSubmit: async () => { throw new Error('page failure'); }, onError } });
    const submission = await widget.submitLead({ ...VALID_LEAD });
    expect(submission?.delivery).toMatchObject({ status: 'accepted', httpStatus: 204 });
    expect(submission?.localHandlingFailed).toBe(true);
    expect(widget.getLastDeliveryReceipt()).toEqual(submission?.delivery);
    expect(onError).toHaveBeenCalledOnce();
    expect(host.textContent).toContain('page handler failed after capture');
    expect(host.textContent).not.toContain('Submission failed');
  });

  it('retains local capture when both page callbacks throw', async () => {
    const { widget } = mountWidget({ callbacks: {
      onSubmit: async () => { throw new Error('page failure'); },
      onError: () => { throw new Error('reporter failure'); }
    } });
    const submission = await widget.submitLead({ ...VALID_LEAD });
    expect(submission?.lead.email).toBe(VALID_LEAD.email);
    expect(submission?.delivery).toMatchObject({ status: 'failed', channel: 'callback' });
  });

  it('clears the receipt on reset', async () => {
    const { widget } = mountWidget();
    await widget.submitLead({ ...VALID_LEAD });
    expect(widget.getLastDeliveryReceipt()).not.toBeNull();

    widget.reset();
    expect(widget.getLastDeliveryReceipt()).toBeNull();
  });
});
