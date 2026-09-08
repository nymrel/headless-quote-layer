import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NymrelQuoteWidget } from '../src/components/QuoteWidget';
import type { LeadFormConfig, QuoteSchema, QuoteSubmission, WidgetCallbacks } from '../src/core/types';

const SOURCE_LABEL = 'lead-contract-test';
const COMPLETE_LEAD = {
  name: 'Alex Example',
  email: 'alex@example.com',
  phone: '(555) 123-4567',
  address: '123 Example Lane',
  zipCode: '98101',
  preferredDate: '2026-09-10',
  preferredTime: 'morning',
  notes: 'Please send the estimate.',
};

function schema(overrides: Partial<LeadFormConfig> = {}): QuoteSchema {
  return {
    id: 'lead-contract',
    name: 'Lead delivery contract',
    pricing: { baseFee: 100, currency: 'USD', currencySymbol: '$' },
    steps: [],
    leadForm: {
      enabled: true,
      requirePhone: false,
      requireAddress: false,
      ...overrides,
    },
  };
}

function createWidget(
  leadForm: Partial<LeadFormConfig> = {},
  options: { webhookUrl?: string; callbacks?: WidgetCallbacks } = {},
): { target: HTMLDivElement; widget: NymrelQuoteWidget } {
  const target = document.createElement('div');
  document.body.appendChild(target);
  const widget = new NymrelQuoteWidget(target, {
    schema: schema(leadForm),
    callbacks: options.callbacks,
    sourceLabel: SOURCE_LABEL,
    webhookUrl: options.webhookUrl,
    useShadowDom: false,
  });
  return { target, widget };
}

function expectSubmissionIdentity(submission: QuoteSubmission | null): asserts submission is QuoteSubmission {
  expect(submission).not.toBeNull();
  if (!submission) throw new Error('Expected a locally available submission');

  expect(submission.quoteId).toMatch(/^NYM-/);
  expect(submission.quote.quoteId).toBe(submission.quoteId);
  expect(submission.schemaId).toBe('lead-contract');
  expect(submission.submittedAt).toEqual(expect.any(String));
  expect(Number.isNaN(Date.parse(submission.submittedAt))).toBe(false);
  expect(submission.attribution).toMatchObject({ source_label: SOURCE_LABEL });
  expect(submission.attribution.session_id).toEqual(expect.any(String));
  expect(submission.lead).toEqual(expect.objectContaining(COMPLETE_LEAD));
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('lead validation contract', () => {
  it('accepts an ordinary email address', async () => {
    const { widget } = createWidget();
    const submission = await widget.submitLead({
      name: COMPLETE_LEAD.name,
      email: COMPLETE_LEAD.email,
    });

    expect(submission).not.toBeNull();
    expect(submission?.lead.email).toBe(COMPLETE_LEAD.email);
  });

  it('accepts the supported 10-digit phone format when required', async () => {
    const { widget } = createWidget({ requirePhone: true });
    const submission = await widget.submitLead({
      name: COMPLETE_LEAD.name,
      email: COMPLETE_LEAD.email,
      phone: COMPLETE_LEAD.phone,
    });

    expect(submission).not.toBeNull();
    expect(submission?.lead.phone).toBe(COMPLETE_LEAD.phone);
  });

  it('rejects an invalid email before attempting delivery', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { widget } = createWidget({}, { webhookUrl: 'https://example.test/lead' });

    expect(await widget.submitLead({ name: COMPLETE_LEAD.name, email: 'invalid-email' })).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('lead delivery contract', () => {
  it.each([400, 404, 500])('keeps the local submission and records rejection on webhook HTTP %s', async (status) => {
    const onError = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status, statusText: 'Synthetic failure' });
    vi.stubGlobal('fetch', fetchMock);
    const { target, widget } = createWidget({}, {
      webhookUrl: 'https://example.test/lead',
      callbacks: { onError },
    });

    const submission = await widget.submitLead(COMPLETE_LEAD);

    expect(fetchMock).toHaveBeenCalledOnce();
    expectSubmissionIdentity(submission);
    expect(submission.delivery).toMatchObject({
      status: 'rejected',
      channel: 'webhook',
      httpStatus: status,
      ok: false,
    });
    expect(widget.getLastDeliveryReceipt()).toEqual(submission.delivery);
    expect(onError).not.toHaveBeenCalled();
    expect(target.textContent).toContain(`declined this quote (HTTP ${status})`);
    expect(target.textContent).not.toMatch(/dispatched to your email|saved and confirmed/i);
  });

  it('keeps the local submission and records a failed receipt when webhook transport rejects', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('synthetic network failure'));
    vi.stubGlobal('fetch', fetchMock);
    const { target, widget } = createWidget({}, { webhookUrl: 'https://example.test/lead' });

    const submission = await widget.submitLead(COMPLETE_LEAD);

    expect(fetchMock).toHaveBeenCalledOnce();
    expectSubmissionIdentity(submission);
    expect(submission.delivery).toMatchObject({ status: 'failed', channel: 'webhook', ok: false });
    expect(submission.delivery?.httpStatus).toBeUndefined();
    expect(target.textContent).toContain('could not reach the destination');
    expect(target.textContent).not.toMatch(/dispatched to your email|saved and confirmed/i);
  });

  it('records an accepted receipt only after a successful webhook response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, statusText: 'No Content' });
    vi.stubGlobal('fetch', fetchMock);
    const { target, widget } = createWidget({}, { webhookUrl: 'https://example.test/lead' });

    const submission = await widget.submitLead(COMPLETE_LEAD);

    expect(fetchMock).toHaveBeenCalledOnce();
    expectSubmissionIdentity(submission);
    expect(submission.delivery).toMatchObject({
      status: 'accepted',
      channel: 'webhook',
      httpStatus: 204,
      ok: true,
    });
    expect(target.textContent).toContain('Your quote was accepted by the destination.');
    expect(target.textContent).not.toMatch(/dispatched to your email|saved and confirmed/i);
  });

  it('records local-only capture when no delivery integration exists', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { target, widget } = createWidget();

    const submission = await widget.submitLead(COMPLETE_LEAD);

    expect(fetchMock).not.toHaveBeenCalled();
    expectSubmissionIdentity(submission);
    expect(submission.delivery).toMatchObject({ status: 'not_configured', channel: 'none' });
    expect(target.textContent).toContain('Local capture only: no delivery destination is configured');
    expect(target.textContent).not.toMatch(/dispatched to your email|saved and confirmed/i);
  });
});
