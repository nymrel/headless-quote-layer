/**
 * @nymrel/headless-quote - Custom B2B Software & Web App Scoping Preset
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import { QuoteSchema } from '../core/types';

export const softwarePreset: QuoteSchema = {
  id: 'software-estimator-v1',
  name: 'Custom Software & AI SaaS Scoping Calculator',
  description: 'Estimate engineering sprints, cloud architecture, AI workflows, and development timeline for bespoke web and mobile applications.',
  badge: 'SaaS & AI Scoping',
  pricing: {
    baseCalloutFee: 1500, // Architecture & Discovery sprint base
    marginPercent: 15,
    minRangeSpreadPercent: 12,
    maxRangeSpreadPercent: 20,
    currency: 'USD',
    currencySymbol: '$',
    rounding: 'nearest100'
  },
  steps: [
    {
      id: 'step-architecture',
      title: 'Platform Scope & User Architecture',
      subtitle: 'Define core views, auth complexity, and multi-tenant requirements.',
      fields: [
        {
          id: 'core_screens',
          label: 'Number of Core Custom Screens / Workflows',
          type: 'slider',
          min: 3,
          max: 30,
          step: 1,
          defaultValue: 8,
          unit: 'screens',
          unitPrice: 950, // Per responsive screen design + frontend integration
          category: 'dimension',
          required: true
        },
        {
          id: 'app_platform',
          label: 'Target Platform Deployment',
          type: 'radio',
          defaultValue: 'web_responsive',
          options: [
            {
              id: 'web_responsive',
              label: 'Responsive Web Application (Next.js / Vite)',
              description: 'Fast, SEO-optimized web app for desktop, tablet, and mobile browsers',
              value: 'web_responsive',
              multiplier: 1.0
            },
            {
              id: 'cross_platform',
              label: 'Full Cross-Platform (Web + iOS & Android Apps)',
              description: 'Unified React Native / Expo codebase with native App Store builds',
              value: 'cross_platform',
              multiplier: 1.65,
              adder: 3800,
              badge: 'Multi-Platform'
            }
          ]
        },
        {
          id: 'auth_security',
          label: 'Authentication & Access Control Tier',
          type: 'select',
          defaultValue: 'rbac_social',
          options: [
            { id: 'simple', label: 'Basic Email/Password + OAuth (Google/GitHub)', value: 'simple', multiplier: 1.0 },
            { id: 'rbac_social', label: 'Multi-Tenant RBAC + Team Invitations & Permissions', value: 'rbac_social', multiplier: 1.20, adder: 1200 },
            { id: 'enterprise_sso', label: 'Enterprise SAML / Okta SSO + Audit Logging + SOC2 Ready', value: 'enterprise_sso', multiplier: 1.45, adder: 4500 }
          ]
        }
      ]
    },
    {
      id: 'step-features',
      title: 'Integrations, Payments & AI Engine',
      subtitle: 'Select backend microservices, Stripe billing, and LLM automation pipelines.',
      fields: [
        {
          id: 'features',
          label: 'Capabilities & Backend Integrations',
          type: 'checkbox',
          defaultValue: ['stripe_billing'],
          category: 'addon',
          options: [
            {
              id: 'stripe_billing',
              label: 'Stripe Subscriptions, Invoicing & Usage Metering',
              description: 'Complete webhook lifecycle, customer portal, and tiered plan billing',
              value: 'stripe_billing',
              adder: 2200,
              badge: 'Monetization'
            },
            {
              id: 'ai_agent_workflows',
              label: 'Autonomous AI Agent Workflows & RAG Vector Search',
              description: 'Embedding generation, vector store retrieval, and streaming LLM chat agent',
              value: 'ai_agent_workflows',
              adder: 4800,
              badge: 'AI Powered'
            },
            {
              id: 'realtime_collab',
              label: 'Real-Time WebSockets & Multiplayer Collaboration',
              description: 'Live presence, collaborative canvas / state synchronization, and instant alerts',
              value: 'realtime_collab',
              adder: 2900
            },
            {
              id: 'analytics_bi',
              label: 'Custom Admin BI Dashboard & CSV/PDF Data Exports',
              description: 'Executive KPI reporting, interactive charts, and scheduled report delivery',
              value: 'analytics_bi',
              adder: 1850
            }
          ]
        }
      ]
    },
    {
      id: 'step-timeline',
      title: 'Timeline Urgency & SLA Support',
      subtitle: 'Choose delivery velocity and ongoing devops maintenance tier.',
      fields: [
        {
          id: 'timeline_urgency',
          label: 'Delivery Timeline',
          type: 'radio',
          defaultValue: 'standard',
          options: [
            {
              id: 'standard',
              label: 'Standard Sprint Cadence (6 - 8 Weeks MVP)',
              description: 'Thorough staging, weekly reviews, and structured QA sprints',
              value: 'standard',
              multiplier: 1.0
            },
            {
              id: 'expedited',
              label: 'Expedited Launch (3 - 4 Weeks Dedicated Swarm)',
              description: 'Dedicated multi-engineer team with continuous deployment cycles',
              value: 'expedited',
              multiplier: 1.35,
              badge: 'Fast Track'
            }
          ]
        }
      ]
    }
  ],
  leadForm: {
    enabled: true,
    title: 'Reserve Your Technical Architecture & Scoping Session',
    subtitle: 'Lock in sprint availability, receive an interactive scope document, and review database schemas with a Principal Engineer.',
    requirePhone: false,
    requireAddress: false,
    requireDate: true,
    submitButtonText: 'Submit Project Scope & Book Discovery Call'
  }
};
