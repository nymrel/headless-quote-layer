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
export declare function createNotConfiguredReceipt(attemptedAt?: string): LeadDeliveryReceipt;
/**
 * Receipt for a submission handled only by a local/programmatic handler
 * (onSubmit callback or the hook caller). No HTTP attempt was made.
 */
export declare function createCallbackOnlyReceipt(attemptedAt?: string): LeadDeliveryReceipt;
/**
 * POST the submission to the configured webhook and return a truthful receipt.
 *
 * Only a resolved fetch whose `response.ok === true` counts as acceptance.
 * Non-2xx responses produce 'rejected'; thrown fetches produce 'failed'.
 * This function never throws — failures are captured in the receipt so local
 * submission data always survives an unavailable endpoint.
 */
export declare function deliverSubmissionViaWebhook(webhookUrl: string, submission: QuoteSubmission): Promise<LeadDeliveryReceipt>;
/**
 * True only when a real HTTP response with ok === true was observed.
 */
export declare function isDeliveryAccepted(receipt?: LeadDeliveryReceipt | null): boolean;
/**
 * Concise, truthful display copy for a receipt. Never implies provider
 * acceptance unless the receipt itself is an accepted one.
 */
export declare function describeLeadDelivery(receipt?: LeadDeliveryReceipt | null): string;
