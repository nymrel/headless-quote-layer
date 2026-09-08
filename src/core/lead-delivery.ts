/**
 * @nymrel/headless-quote - Truthful Lead Delivery Receipts
 * Copyright 2026 Nymrel / JalenBuilds LLC
 *
 * A successful HTTP response proves webhook acceptance only. It does not
 * prove downstream email, CRM delivery, or durable provider storage.
 */

import { LeadDeliveryReceipt, QuoteSubmission } from './types';

/**
 * Receipt for a submission with no delivery target and no programmatic handler.
 */
export function createNotConfiguredReceipt(attemptedAt: string = new Date().toISOString()): LeadDeliveryReceipt {
  return {
    status: 'not_configured',
    channel: 'none',
    attemptedAt,
    message: 'Local capture only: no delivery destination is configured, so nothing was sent.'
  };
}

/**
 * Receipt for a submission handled only by a local/programmatic handler
 * (onSubmit callback or the hook caller). No HTTP attempt was made.
 */
export function createCallbackOnlyReceipt(attemptedAt: string = new Date().toISOString()): LeadDeliveryReceipt {
  return {
    status: 'callback_only',
    channel: 'callback',
    attemptedAt,
    message: 'Captured locally and handed to this page. No external delivery was attempted.'
  };
}

/**
 * POST the submission to the configured webhook and return a truthful receipt.
 *
 * Only a resolved fetch whose `response.ok === true` counts as acceptance.
 * Non-2xx responses produce 'rejected'; thrown fetches produce 'failed'.
 * This function never throws — failures are captured in the receipt so local
 * submission data always survives an unavailable endpoint.
 */
export async function deliverSubmissionViaWebhook(
  webhookUrl: string,
  submission: QuoteSubmission
): Promise<LeadDeliveryReceipt> {
  const attemptedAt = new Date().toISOString();

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Nymrel-Quote-Id': submission.quoteId
      },
      body: JSON.stringify(submission)
    });

    if (response.ok) {
      return {
        status: 'accepted',
        channel: 'webhook',
        attemptedAt,
        httpStatus: response.status,
        ok: true,
        message: 'Your quote was accepted by the destination.'
      };
    }

    return {
      status: 'rejected',
      channel: 'webhook',
      attemptedAt,
      httpStatus: response.status,
      ok: false,
      message: `Delivery failed: the destination declined this quote (HTTP ${response.status}). Your quote is shown below for your records.`
    };
  } catch {
    return {
      status: 'failed',
      channel: 'webhook',
      attemptedAt,
      ok: false,
      message: 'Delivery failed: could not reach the destination. Your quote is shown below for your records.'
    };
  }
}

/**
 * True only when a real HTTP response with ok === true was observed.
 */
export function isDeliveryAccepted(receipt?: LeadDeliveryReceipt | null): boolean {
  return !!receipt && receipt.status === 'accepted';
}

/**
 * Concise, truthful display copy for a receipt. Never implies provider
 * acceptance unless the receipt itself is an accepted one.
 */
export function describeLeadDelivery(receipt?: LeadDeliveryReceipt | null): string {
  if (!receipt) {
    return createNotConfiguredReceipt().message;
  }
  return receipt.message;
}
