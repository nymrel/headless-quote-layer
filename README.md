# @nymrel/headless-quote

[![npm version](https://img.shields.io/npm/v/@nymrel/headless-quote.svg?style=flat-square&color=A8541F)](https://www.npmjs.com/package/@nymrel/headless-quote)
[![License: MIT](https://img.shields.io/badge/License-MIT-2A332E.svg?style=flat-square)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2E6B4F.svg?style=flat-square)]()
[![Bundle Size](https://img.shields.io/badge/Bundle-20kB%20gzipped-2A332E.svg?style=flat-square)]()

> **Zero-dependency embeddable visual quote calculator, dynamic range estimator, and lead capture engine with Nymrel Warm Paper aesthetics (`#FAF8F2`, `#F4F0E6`, `#2A332E`, `#A8541F`).**

---

```
                       NYMREL HEADLESS QUOTE LAYER
                       ===========================

  +-----------------------------------------------------------------------+
  |  [1-Line HTML Script]   [Autonomous Web Component]   [React Component]|
  |  <nymrel-quote-layer>   <nymrel-quote-layer>         <QuoteWidget />  |
  +-----------------------------------+-----------------------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  |                         CORE FORMULA ENGINE                           |
  |  * Additive & Multiplicative Math    * Min/Max Spread Confidence      |
  |  * Square Footage / Linear Units     * Option Adders & Multipliers    |
  |  * Tiered Packages & Surcharges      * Zero-Eval Safe Rule Evaluator  |
  +-----------------------------------+-----------------------------------+
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
  +-------------------------------+     +---------------------------------+
  |    WARM PAPER DESIGN TOKENS   |     |    ATTRIBUTION & TELEMETRY      |
  |  * Warm Cream (#FAF8F2)       |     |  * UTM Params (source, medium)  |
  |  * Soft Linen (#F4F0E6)       |     |  * Ad Click IDs (gclid, fbclid) |
  |  * Cedar Green (#2A332E)      |     |  * Referring Domain & Session   |
  |  * Terracotta CTA (#A8541F)   |     |  * GA4 / GTM dataLayer Emission |
  +-------------------------------+     +---------------------------------+
                 |                                         |
                 +--------------------+--------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  |              LEAD CAPTURE & DISPATCH ENGINE                           |
  |  * Instant Itemized PDF Breakdown    * Webhook JSON POST Payload      |
  |  * Inspection / Consultation Booking * Dual-Audience Entity Graph     |
  +-----------------------------------------------------------------------+
```

---

## 🌟 Highlights

- ⚡ **Zero Runtime Dependencies**: Pure Vanilla TypeScript engine with native custom element `<nymrel-quote-layer>` and first-class React wrappers.
- 🎨 **Nymrel Warm Paper Aesthetics**: Built from the ground up for high-trust human readability and conversion using warm cream `#FAF8F2`, soft linen `#F4F0E6`, deep cedar `#2A332E`, and terracotta `#A8541F` accents.
- 🛡️ **Autonomous Shadow DOM Isolation**: 100% collision-free CSS embedding on any WordPress, Webflow, Shopify, Squarespace, or custom landing page.
- 📐 **Dynamic Range & Margin Estimator**: Instantly transforms raw formulas into trustworthy confidence bounds (e.g. `$4,500 – $5,200`) to increase lead conversion without underbidding.
- 🎯 **Deep Marketing Attribution**: Automatically captures UTM parameters (`utm_source`, `utm_campaign`, etc.), Google Ads `gclid`, Meta `fbclid`, referring domains, and dispatches clean events to Google Tag Manager / GA4 `dataLayer`.
- 🔌 **Instant Webhook Ingestion**: Sends structured JSON payloads directly to your CRM, Zapier, Make, Supabase, or custom REST endpoint upon submission.
- 📦 **Pre-Configured Flagship Presets**: Ready-to-use calculators for **Roofing & Siding**, **HVAC Heat Pumps**, **Residential Plumbing & Repiping**, and **B2B Software Scoping**.

---

## 🚀 Quickstart: 1-Line Embed

Add this single tag anywhere in your HTML, Webflow custom code, or WordPress page:

```html
<!-- Load Nymrel Quote Layer CDN script -->
<script src="https://cdn.jsdelivr.net/npm/@nymrel/headless-quote/dist/quote-layer.min.js"></script>

<!-- Embed Calculator -->
<nymrel-quote-layer 
  config="roofing" 
  webhook-url="https://api.yourcompany.com/v1/leads"
  source-label="hero-pricing-cta">
</nymrel-quote-layer>
```

### Custom Element Attributes

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `config` | `string` | `"roofing"` | Preset name (`"roofing"`, `"hvac"`, `"plumbing"`, `"software"`) OR inline JSON schema string |
| `src` | `string` | `undefined` | URL to fetch external JSON pricing schema dynamically |
| `webhook-url` | `string` | `undefined` | Endpoint to receive HTTP POST webhook upon lead submission |
| `source-label` | `string` | `undefined` | Custom marketing attribution tag (e.g. `landing-page-v2`) |
| `theme-mode` | `string` | `"warm"` | Palette mode: `"warm"` (Warm Paper), `"light"`, `"dark"` |
| `mode` | `string` | `"shadow"` | DOM encapsulation mode: `"shadow"` (isolated) or `"light"` |

---

## ⚛️ React & Next.js Usage

Install via npm or pnpm:

```bash
npm install @nymrel/headless-quote
```

### 1. Drop-In Component

```tsx
import React from 'react';
import { QuoteWidget, roofingPreset } from '@nymrel/headless-quote';

export default function PricingSection() {
  const handleLeadSubmit = async (submission) => {
    console.log('New Lead Captured:', submission.lead);
    console.log('Calculated Estimate:', submission.quote.formattedTarget);
    console.log('Attribution:', submission.attribution);
  };

  return (
    <section className="py-12 bg-[#FAF8F2]">
      <QuoteWidget 
        schema={roofingPreset}
        webhookUrl="/api/quotes/lead-capture"
        onSubmit={handleLeadSubmit}
      />
    </section>
  );
}
```

### 2. Headless Hook for Custom UI

If you prefer building your own custom inputs while leveraging the Nymrel calculation engine and attribution:

```tsx
import React from 'react';
import { useQuoteEngine, hvacPreset } from '@nymrel/headless-quote';

export function CustomHvacScoper() {
  const { quote, formState, updateField, nextStep, prevStep, submitLead } = useQuoteEngine(hvacPreset);

  return (
    <div>
      <h3>Live Quote: {quote.formattedMin} – {quote.formattedMax}</h3>
      <input 
        type="range" 
        min="800" 
        max="4000" 
        value={formState.home_sqft || 1800} 
        onChange={(e) => updateField('home_sqft', Number(e.target.value))}
      />
      <button onClick={() => nextStep()}>Continue</button>
    </div>
  );
}
```

---

## 📊 Dynamic Pricing Schema Specification

A `QuoteSchema` is a declarative, serializable JSON configuration:

```json
{
  "id": "commercial-solar-v1",
  "name": "Commercial Solar & Storage Estimator",
  "pricing": {
    "baseCalloutFee": 750,
    "marginPercent": 10,
    "minRangeSpreadPercent": 8,
    "maxRangeSpreadPercent": 14,
    "currency": "USD",
    "currencySymbol": "$",
    "rounding": "nearest50"
  },
  "steps": [
    {
      "id": "step-system",
      "title": "System Sizing & Roof Characteristics",
      "fields": [
        {
          "id": "system_kw",
          "label": "Estimated System Capacity",
          "type": "slider",
          "min": 5,
          "max": 100,
          "step": 1,
          "defaultValue": 15,
          "unit": "kW",
          "unitPrice": 1850,
          "category": "dimension",
          "required": true
        },
        {
          "id": "panel_tier",
          "label": "Photovoltaic Panel Tier",
          "type": "radio",
          "defaultValue": "tier1_mono",
          "options": [
            {
              "id": "standard_poly",
              "label": "Standard Polycrystalline (18% Efficiency)",
              "multiplier": 1.0
            },
            {
              "id": "tier1_mono",
              "label": "Tier-1 Monocrystalline TOPCon (22.5% Efficiency)",
              "multiplier": 1.25,
              "adder": 1200,
              "badge": "Top Efficiency"
            }
          ]
        }
      ]
    }
  ],
  "leadForm": {
    "enabled": true,
    "title": "Receive Your Interconnection Feasibility Study",
    "requirePhone": true,
    "requireAddress": true
  }
}
```

---

## 📈 Webhook Payload Specification

When a lead submits their details, the widget automatically posts a structured JSON payload to `webhookUrl`:

```json
{
  "quoteId": "NYM-20260821-K8X9Q2",
  "schemaId": "roofing-estimator-v1",
  "schemaName": "Residential Roofing & Siding Estimator",
  "quote": {
    "target": 8650,
    "min": 7950,
    "max": 9850,
    "formattedTarget": "$8,650",
    "formattedMin": "$7,950",
    "formattedMax": "$9,850",
    "currency": "USD",
    "currencySymbol": "$",
    "breakdown": [
      {
        "id": "base-fee",
        "label": "Base Callout / Setup Fee",
        "amount": 450,
        "formattedAmount": "$450",
        "type": "base"
      },
      {
        "id": "roof_sqft",
        "label": "Estimated Roof Surface Area (2200 sq ft @ $3.50/sq ft)",
        "amount": 7700,
        "formattedAmount": "$7,700",
        "type": "labor"
      }
    ],
    "recommendations": [
      "Flexible Financing Available: 0% APR for 12 months on qualifying projects."
    ],
    "calculatedAt": "2026-08-21T20:14:00.000Z",
    "quoteId": "NYM-20260821-K8X9Q2"
  },
  "formState": {
    "roof_sqft": 2200,
    "roof_pitch": "medium",
    "material": "arch_shingle",
    "addons": ["tear_off"]
  },
  "lead": {
    "name": "Jordan Peterson",
    "email": "jordan@example.com",
    "phone": "(555) 234-5678",
    "address": "742 Evergreen Terrace",
    "zipCode": "97477",
    "preferredDate": "2026-08-25",
    "preferredTime": "morning",
    "notes": "Interested in completing work before rainy season."
  },
  "attribution": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "residential-roofing-summer",
    "gclid": "EAIaIQobChMI...",
    "referrer": "https://www.google.com",
    "referring_domain": "www.google.com",
    "landing_page": "https://contractor.example.com/quote",
    "source_label": "hero-pricing-cta",
    "session_id": "sess_8f3a92",
    "device_type": "desktop",
    "timestamp": "2026-08-21T20:14:00.000Z"
  },
  "submittedAt": "2026-08-21T20:14:05.000Z"
}
```

---

### Delivery receipt semantics

`submitLead` preserves the captured submission locally and records what this
browser observed in `submission.delivery`:

- `accepted` means the configured webhook returned an HTTP 2xx response.
- `rejected` means the webhook responded with a non-2xx status.
- `failed` means the webhook request or local page handler failed; `channel`
  identifies which attempt failed.
- `callback_only` means the submission was handed to the local page handler;
  no external delivery was attempted by the widget.
- `not_configured` means no webhook or local callback delivery target exists.

An `accepted` receipt confirms only the HTTP response from the configured
endpoint. It does not prove downstream CRM persistence, email delivery, or any
other provider-side outcome. A rejected or failed receipt leaves the quote and
lead details available in the local submission and renders the observed failure
instead of claiming delivery. Local-only capture does not send the lead anywhere.
If a page callback fails after webhook acceptance, the accepted receipt remains
available and `localHandlingFailed` records the separate callback error.

## 🎨 Design Philosophy: Nymrel Warm Paper

Built under the **Nymrel Design Contract**, prioritizing organic, human-friendly warmth over harsh neon dark-modes:

| Token | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| **Warm Cream** | `#FAF8F2` | Canvas Background & Outer Surface |
| **Soft Linen** | `#F4F0E6` | Reactive Range Banner, Inputs & Secondary Cards |
| **Cedar Green** | `#2A332E` | Deep Contrast Typography, Progress Dots & Headings |
| **Terracotta** | `#A8541F` | High-Converting Action Buttons & Badges |
| **Terracotta Dark** | `#8E4316` | Active / Hover State for Buttons |
| **Muted Slate** | `#637069` | Helper Copy, Footers & Secondary Labels |
| **Sand Border** | `#E2DCCE` | Subtle 1px Boundaries & Divider Lines |

---

## 🤖 Dual-Audience Machine Trust

Every package published under `@nymrel` satisfies the **Dual-Audience Rule**:

- **Human Visitors**: Visually stunning, responsive, tactile UI with real-time feedback.
- **Autonomous AI Agents**: Structured machine interfaces:
  - Canonical Entity Graph: `parentOrganization: Nymrel -> JalenBuilds LLC`
  - `/llms.txt` standard specification included for automated RAG and MCP tooling.
  - Zero `eval()`, zero unvalidated DOM injections, strict TypeScript type declarations.

---

## 🛠️ Development & Testing

```bash
# Clone the repository
git clone https://github.com/nymrel/headless-quote-layer.git
cd headless-quote-layer

# Install dependencies
npm install

# Run Vitest test suites
npm test

# Build production bundles (ESM, CJS, Standalone IIFE, Types)
npm run build

# Start interactive preview playground
npm run dev
```

---

## 📄 License & Governance

- **License**: MIT License
- **Copyright**: &copy; 2026 Nymrel / JalenBuilds LLC (`contact@nymrel.com`)
- **Parent Legal Entity**: JalenBuilds LLC
- **Lead Architect**: Built by Jalen
