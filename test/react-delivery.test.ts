import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuoteEngine } from '../src/components/ReactQuoteWidget';
import type { QuoteSchema, QuoteSubmission } from '../src/core/types';

const SOURCE_LABEL = 'react-delivery-test';
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

const SCHEMA: QuoteSchema = {
  id: 'react-delivery-contract',
  name: 'React delivery contract',
  pricing: { baseFee: 100, currency: 'USD', currencySymbol: '$' },
  steps: [],
  leadForm: { enabled: true },
};

type QuoteEngine = ReturnType<typeof useQuoteEngine>;

function expectSubmissionIdentity(submission: QuoteSubmission) {
  expect(submission.quoteId).toMatch(/^NYM-/);
  expect(submission.quote.quoteId).toBe(submission.quoteId);
  expect(submission.schemaId).toBe(SCHEMA.id);
  expect(Number.isNaN(Date.parse(submission.submittedAt))).toBe(false);
  expect(submission.attribution).toMatchObject({ source_label: SOURCE_LABEL });
  expect(submission.attribution.session_id).toEqual(expect.any(String));
  expect(submission.lead).toEqual(expect.objectContaining(COMPLETE_LEAD));
}

describe('useQuoteEngine delivery receipts', () => {
  let container: HTMLDivElement;
  let root: Root;
  let engine: QuoteEngine;

  beforeEach(async () => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    function Probe() {
      engine = useQuoteEngine(SCHEMA);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Probe));
    });
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it('returns an accepted receipt and preserves the quote and lead after a 2xx webhook response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    vi.stubGlobal('fetch', fetchMock);
    let submission: QuoteSubmission | undefined;

    await act(async () => {
      submission = await engine.submitLead(COMPLETE_LEAD, {
        webhookUrl: 'https://example.test/lead',
        sourceLabel: SOURCE_LABEL,
      });
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(submission).toBeDefined();
    expectSubmissionIdentity(submission!);
    expect(submission?.delivery).toMatchObject({
      status: 'accepted',
      channel: 'webhook',
      httpStatus: 204,
      ok: true,
    });
    expect(engine.deliveryReceipt).toEqual(submission?.delivery);
  });

  it.each([400, 500])('returns a rejected receipt and preserves the local submission on webhook HTTP %s', async (status) => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('fetch', fetchMock);
    let submission: QuoteSubmission | undefined;

    await act(async () => {
      submission = await engine.submitLead(COMPLETE_LEAD, {
        webhookUrl: 'https://example.test/lead',
        sourceLabel: SOURCE_LABEL,
      });
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expectSubmissionIdentity(submission!);
    expect(submission?.delivery).toMatchObject({
      status: 'rejected',
      channel: 'webhook',
      httpStatus: status,
      ok: false,
    });
    expect(engine.deliveryReceipt).toEqual(submission?.delivery);
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('returns a failed receipt and preserves the local submission when webhook transport rejects', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('synthetic network failure'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('fetch', fetchMock);
    let submission: QuoteSubmission | undefined;

    await act(async () => {
      submission = await engine.submitLead(COMPLETE_LEAD, {
        webhookUrl: 'https://example.test/lead',
        sourceLabel: SOURCE_LABEL,
      });
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expectSubmissionIdentity(submission!);
    expect(submission?.delivery).toMatchObject({ status: 'failed', channel: 'webhook', ok: false });
    expect(submission?.delivery?.httpStatus).toBeUndefined();
    expect(engine.deliveryReceipt).toEqual(submission?.delivery);
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('returns a callback-only receipt and preserves the local submission without a webhook', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    let submission: QuoteSubmission | undefined;

    await act(async () => {
      submission = await engine.submitLead(COMPLETE_LEAD, { sourceLabel: SOURCE_LABEL });
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expectSubmissionIdentity(submission!);
    expect(submission?.delivery).toMatchObject({ status: 'callback_only', channel: 'callback' });
    expect(engine.deliveryReceipt).toEqual(submission?.delivery);
  });

  it('clears the delivery receipt and last submission on reset', async () => {
    await act(async () => {
      await engine.submitLead(COMPLETE_LEAD, { sourceLabel: SOURCE_LABEL });
    });
    expect(engine.deliveryReceipt?.status).toBe('callback_only');
    expect(engine.lastSubmission).not.toBeNull();

    await act(async () => {
      engine.reset();
    });

    expect(engine.deliveryReceipt).toBeNull();
    expect(engine.lastSubmission).toBeNull();
    expect(engine.isSubmitted).toBe(false);
  });
});
