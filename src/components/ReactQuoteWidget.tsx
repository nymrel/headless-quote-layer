/**
 * @nymrel/headless-quote - React Component & Headless Hook
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  QuoteResult,
  QuoteSchema,
  QuoteSubmission,
  StepConfig,
  ThemeConfig
} from '../core/types';
import { NymrelQuoteWidget } from './QuoteWidget';
import { calculateQuote, sanitizeInput, validateField } from '../core/engine';
import { extractAttribution, trackLeadSubmitted } from '../core/attribution';

export interface QuoteWidgetProps {
  schema: QuoteSchema;
  initialState?: Record<string, any>;
  theme?: ThemeConfig;
  sourceLabel?: string;
  webhookUrl?: string;
  useShadowDom?: boolean;
  onCalculate?: (quote: QuoteResult, formState: Record<string, any>) => void;
  onStepChange?: (stepIndex: number, step: StepConfig) => void;
  onSubmit?: (submission: QuoteSubmission) => void | Promise<any>;
  onError?: (error: Error | string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * High-performance embeddable React Quote Widget
 */
export const QuoteWidget: React.FC<QuoteWidgetProps> = ({
  schema,
  initialState,
  theme,
  sourceLabel,
  webhookUrl,
  useShadowDom = true,
  onCalculate,
  onStepChange,
  onSubmit,
  onError,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<NymrelQuoteWidget | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mergedSchema = theme ? { ...schema, theme: { ...schema.theme, ...theme } } : schema;

    const widget = new NymrelQuoteWidget(containerRef.current, {
      schema: mergedSchema,
      initialState,
      sourceLabel,
      webhookUrl,
      useShadowDom,
      callbacks: {
        onCalculate,
        onStepChange,
        onSubmit,
        onError
      }
    });

    widgetRef.current = widget;

    return () => {
      widgetRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [schema, theme, sourceLabel, webhookUrl, useShadowDom]);

  return (
    <div 
      ref={containerRef} 
      className={`nymrel-quote-widget-root ${className || ''}`.trim()} 
      style={style}
    />
  );
};

/**
 * Headless React Hook for custom UI implementations
 */
export function useQuoteEngine(
  schema: QuoteSchema,
  initialState?: Record<string, any>
) {
  const [formState, setFormState] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    schema.steps.forEach(step => {
      step.fields.forEach(f => {
        if (f.defaultValue !== undefined) defaults[f.id] = f.defaultValue;
      });
    });
    return { ...defaults, ...initialState };
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [quote, setQuote] = useState<QuoteResult>(() => calculateQuote(schema, formState));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<QuoteSubmission | null>(null);

  // Recalculate on state change
  useEffect(() => {
    const result = calculateQuote(schema, formState);
    setQuote(result);
  }, [schema, formState]);

  const updateField = useCallback((fieldId: string, value: any) => {
    setFormState(prev => {
      const next = { ...prev, [fieldId]: sanitizeInput(value) };
      return next;
    });
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const nextStep = useCallback(() => {
    const currentStep = schema.steps[currentStepIndex];
    if (!currentStep) return false;

    let hasError = false;
    const errors: Record<string, string> = {};

    for (const field of currentStep.fields) {
      const res = validateField(field, formState[field.id]);
      if (!res.valid) {
        errors[field.id] = res.error || 'Invalid value';
        hasError = true;
      }
    }

    if (hasError) {
      setFieldErrors(errors);
      return false;
    }

    if (currentStepIndex < schema.steps.length) {
      setCurrentStepIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [schema, currentStepIndex, formState]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const submitLead = useCallback(async (leadData: Record<string, any>, options: { webhookUrl?: string; sourceLabel?: string } = {}) => {
    setIsSubmitting(true);
    const attribution = extractAttribution({ sourceLabel: options.sourceLabel });

    const submission: QuoteSubmission = {
      quoteId: quote.quoteId,
      schemaId: schema.id,
      schemaName: schema.name,
      quote,
      formState,
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
      metadata: schema.metadata
    };

    if (options.webhookUrl) {
      try {
        await fetch(options.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
      } catch (err) {
        console.warn('[useQuoteEngine] Webhook error:', err);
      }
    }

    trackLeadSubmitted(schema.id, submission.quoteId, quote.target, submission.lead.email);

    setIsSubmitting(false);
    setIsSubmitted(true);
    setLastSubmission(submission);
    return submission;
  }, [schema, quote, formState]);

  const reset = useCallback(() => {
    const defaults: Record<string, any> = {};
    schema.steps.forEach(step => {
      step.fields.forEach(f => {
        if (f.defaultValue !== undefined) defaults[f.id] = f.defaultValue;
      });
    });
    setFormState({ ...defaults, ...initialState });
    setCurrentStepIndex(0);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setLastSubmission(null);
    setFieldErrors({});
  }, [schema, initialState]);

  return {
    quote,
    formState,
    currentStepIndex,
    fieldErrors,
    isSubmitting,
    isSubmitted,
    lastSubmission,
    updateField,
    nextStep,
    prevStep,
    submitLead,
    reset
  };
}
