import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NymrelQuoteWidget } from '../src/components/QuoteWidget';
import type { LeadFormConfig, QuoteSchema, WidgetCallbacks } from '../src/core/types';

function schema(overrides: Partial<LeadFormConfig> = {}): QuoteSchema {
  return {
    id: 'lead-contract',
    name: 'Lead delivery contract',
    pricing: { baseFee: 100 },
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
    webhookUrl: options.webhookUrl,
    useShadowDom: false,
  });
  return { target, widget };
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
      name: 'Alex Example',
      email: 'alex@example.com',
    });

    expect(submission).not.toBeNull();
    expect(submission?.lead.email).toBe('alex@example.com');
  });

  it.each(['(555) 123-4567', '+1-555-123-4567'])(
    'accepts a documented phone format: %s',
    async (phone) => {
      const { widget } = createWidget({ requirePhone: true });

      const submission = await widget.submitLead({
        name: 'Alex Example',
        email: 'alex@example.com',
        phone,
      });

      expect(submission).not.toBeNull();
      expect(submission?.lead.phone).toBe(phone);
    },
  );
});

describe('lead delivery contract', () => {
  it.each([400, 404, 500])('fails closed on webhook HTTP %s', async (status) => {
    const onError = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status,
      statusText: 'Synthetic failure',
    });
    vi.stubGlobal('fetch', fetchMock);
    const { target, widget } = createWidget({}, {
      webhookUrl: 'https://example.test/lead',
      callbacks: { onError },
    });

    const submission = await widget.submitLead({
      name: 'Alex Example',
      email: 'alex@example.com',
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(submission).toBeNull();
    expect(onError).toHaveBeenCalledOnce();
    expect(target.textContent).not.toMatch(/saved and confirmed/i);
  });

  it('fails closed when webhook transport rejects', async () => {
    const onError = vi.fn();
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('synthetic network failure'));
    vi.stubGlobal('fetch', fetchMock);
    const { target, widget } = createWidget({}, {
      webhookUrl: 'https://example.test/lead',
      callbacks: { onError },
    });

    const submission = await widget.submitLead({
      name: 'Alex Example',
      email: 'alex@example.com',
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(submission).toBeNull();
    expect(onError).toHaveBeenCalledOnce();
    expect(target.textContent).not.toMatch(/saved and confirmed/i);
  });

  it('allows completion after a successful webhook response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
    });
    vi.stubGlobal('fetch', fetchMock);
    const { widget } = createWidget({}, { webhookUrl: 'https://example.test/lead' });

    const submission = await widget.submitLead({
      name: 'Alex Example',
      email: 'alex@example.com',
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(submission).not.toBeNull();
  });

  it('does not claim email delivery when no delivery integration exists', async () => {
    const { target, widget } = createWidget();

    const submission = await widget.submitLead({
      name: 'Alex Example',
      email: 'alex@example.com',
    });

    expect(submission).not.toBeNull();
    expect(target.textContent).not.toMatch(/dispatched to your email/i);
    expect(target.textContent).not.toMatch(/saved and confirmed/i);
  });
});
