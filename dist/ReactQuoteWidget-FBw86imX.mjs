var Z = Object.defineProperty;
var X = (t, e, r) => e in t ? Z(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var $ = (t, e, r) => X(t, typeof e != "symbol" ? e + "" : e, r);
import { jsx as ee } from "react/jsx-runtime";
import { useRef as H, useEffect as U, useState as A, useCallback as P } from "react";
function te(t = "NYM") {
  const e = /* @__PURE__ */ new Date(), r = e.getFullYear(), i = String(e.getMonth() + 1).padStart(2, "0"), a = String(e.getDate()).padStart(2, "0"), d = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${t}-${r}${i}${a}-${d}`;
}
function I(t, e = "USD", r = "$", i = 0) {
  if (isNaN(t) || t === null || t === void 0)
    return `${r}0`;
  const d = (i > 0 ? t.toFixed(i) : Math.round(t).toString()).split(".");
  return d[0] = d[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","), `${r}${d.join(".")}`;
}
function k(t) {
  return t == null ? t : typeof t == "string" ? t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim() : typeof t == "number" ? isNaN(t) ? 0 : t : Array.isArray(t) ? t.map(k) : t;
}
function j(t, e) {
  if (!t || !t.fieldId) return !0;
  const r = e[t.fieldId];
  switch (t.operator) {
    case "equals":
      return r === t.value || String(r) === String(t.value);
    case "notEquals":
      return r !== t.value && String(r) !== String(t.value);
    case "greaterThan":
      return Number(r) > Number(t.value);
    case "lessThan":
      return Number(r) < Number(t.value);
    case "in":
      return Array.isArray(t.value) ? t.value.includes(r) : !1;
    case "contains":
      return Array.isArray(r) ? r.includes(t.value) : typeof r == "string" ? r.includes(String(t.value)) : !1;
    default:
      return !0;
  }
}
function O(t, e) {
  if (t.required && (e == null || e === "" || Array.isArray(e) && e.length === 0))
    return { valid: !1, error: `${t.label} is required.` };
  if (e != null && e !== "") {
    if (t.type === "number" || t.type === "slider" || t.type === "stepper") {
      const r = Number(e);
      if (isNaN(r))
        return { valid: !1, error: `${t.label} must be a valid number.` };
      if (t.min !== void 0 && r < t.min)
        return { valid: !1, error: `Minimum value is ${t.min} ${t.unit || ""}`.trim() };
      if (t.max !== void 0 && r > t.max)
        return { valid: !1, error: `Maximum value is ${t.max} ${t.unit || ""}`.trim() };
    }
    if (t.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e)))
      return { valid: !1, error: "Please enter a valid email address." };
    if (t.type === "phone") {
      const r = String(e).replace(/[\s()\-\.]/g, ""), i = /^\+?[0-9]{7,15}$/;
      if (r.length < 7 || !i.test(r))
        return { valid: !1, error: "Please enter a valid phone number." };
    }
  }
  return { valid: !0 };
}
function q(t, e) {
  if (!e || e === "none") return t;
  switch (e) {
    case "round":
      return Math.round(t);
    case "ceil":
      return Math.ceil(t);
    case "floor":
      return Math.floor(t);
    case "nearest10":
      return Math.round(t / 10) * 10;
    case "nearest50":
      return Math.round(t / 50) * 50;
    case "nearest100":
      return Math.round(t / 100) * 100;
    default:
      return t;
  }
}
function Q(t, e) {
  var S, v;
  const r = ((S = t.pricing) == null ? void 0 : S.currency) || "USD", i = ((v = t.pricing) == null ? void 0 : v.currencySymbol) || "$", a = t.pricing || {}, d = e._quoteId || te(), u = [];
  if (t.steps.forEach((s) => {
    s.fields.forEach((E) => {
      u.push(E);
    });
  }), a.formula === "custom" && typeof a.customFormula == "function") {
    const s = a.customFormula(e, u), E = q(s.target, a.rounding), h = q(s.min, a.rounding), p = q(s.max, a.rounding);
    return {
      min: h,
      max: p,
      target: E,
      formattedMin: I(h, r, i),
      formattedMax: I(p, r, i),
      formattedTarget: I(E, r, i),
      currency: r,
      currencySymbol: i,
      breakdown: s.breakdown || [],
      recommendations: [],
      calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      quoteId: d
    };
  }
  let c = Number(a.baseFee || a.baseCalloutFee || 0), o = 0, l = 0, x = 0, w = 1;
  const m = [], b = [];
  c > 0 && m.push({
    id: "base-fee",
    label: "Base Callout / Setup Fee",
    amount: c,
    formattedAmount: I(c, r, i),
    type: "base",
    description: "Standard initial mobilization and inspection base"
  });
  for (const s of u) {
    if (!j(s.condition, e))
      continue;
    const E = e[s.id] !== void 0 ? e[s.id] : s.defaultValue;
    if (!(E == null || E === "")) {
      if (s.type === "number" || s.type === "slider" || s.type === "stepper") {
        const h = Number(E);
        if (!isNaN(h) && h > 0) {
          if (s.unitPrice && s.unitPrice > 0) {
            const p = h * s.unitPrice;
            s.category === "material" ? o += p : l += p, m.push({
              id: s.id,
              label: `${s.label} (${h} ${s.unit || "units"} @ ${I(s.unitPrice, r, i)}/${s.unit || "unit"})`,
              amount: p,
              formattedAmount: I(p, r, i),
              type: s.category === "material" ? "material" : "labor"
            });
          }
          s.multiplier && s.multiplier !== 1 && (w *= s.multiplier);
        }
      }
      if ((s.type === "select" || s.type === "radio" || s.type === "toggle") && s.options && s.options.length > 0) {
        const h = s.options.find((p) => String(p.id) === String(E) || String(p.value) === String(E));
        if (h) {
          if (h.adder && Number(h.adder) !== 0) {
            const p = Number(h.adder);
            x += p, m.push({
              id: `${s.id}-${h.id}`,
              label: `${s.label}: ${h.label}`,
              amount: p,
              formattedAmount: I(p, r, i),
              type: s.category === "material" ? "material" : "addon",
              description: h.description
            });
          }
          if (h.multiplier && Number(h.multiplier) !== 1) {
            const p = Number(h.multiplier);
            w *= p, m.push({
              id: `${s.id}-${h.id}-mult`,
              label: `${h.label} Factor (${p}x)`,
              amount: 0,
              formattedAmount: `${p}x`,
              type: "multiplier",
              description: h.description
            });
          }
        }
      }
      if (s.type === "checkbox")
        if (Array.isArray(E) && s.options)
          for (const h of E) {
            const p = s.options.find((M) => String(M.id) === String(h) || String(M.value) === String(h));
            if (p) {
              if (p.adder && Number(p.adder) !== 0) {
                const M = Number(p.adder);
                x += M, m.push({
                  id: `${s.id}-${p.id}`,
                  label: p.label,
                  amount: M,
                  formattedAmount: I(M, r, i),
                  type: "addon",
                  description: p.description
                });
              }
              p.multiplier && Number(p.multiplier) !== 1 && (w *= Number(p.multiplier));
            }
          }
        else typeof E == "boolean" && E === !0 && (s.unitPrice && (x += s.unitPrice, m.push({
          id: s.id,
          label: s.label,
          amount: s.unitPrice,
          formattedAmount: I(s.unitPrice, r, i),
          type: "addon"
        })), s.multiplier && s.multiplier !== 1 && (w *= s.multiplier));
    }
  }
  const f = c + o + l + x;
  let g = f * w;
  if (a.taxRate && a.taxRate > 0) {
    const s = g * a.taxRate;
    m.push({
      id: "tax",
      label: `Estimated Tax (${(a.taxRate * 100).toFixed(1)}%)`,
      amount: s,
      formattedAmount: I(s, r, i),
      type: "tax"
    }), g += s;
  }
  const C = a.marginPercent ? a.marginPercent / 100 : 0.1, L = a.minRangeSpreadPercent ? a.minRangeSpreadPercent / 100 : C, R = a.maxRangeSpreadPercent ? a.maxRangeSpreadPercent / 100 : C;
  let _ = Math.max(0, g), z = Math.max(0, _ * (1 - L)), N = Math.max(z, _ * (1 + R));
  f === 0 && c === 0 && (_ = 0, z = 0, N = 0);
  const T = q(_, a.rounding), y = q(z, a.rounding), F = q(N, a.rounding);
  return (e.pitch === "steep" || e.difficulty === "extreme" || e.urgency === "emergency") && b.push("Priority Crew Dispatch: Includes safety rigging and on-site supervisor."), T > 5e3 && b.push("Flexible Financing Available: 0% APR for 12 months on qualifying projects."), (e.material === "metal" || e.efficiency === "ultra") && b.push("Qualifies for Energy Efficiency Tax Credits & Lifetime Manufacturer Warranty."), {
    min: y,
    max: F,
    target: T,
    formattedMin: I(y, r, i),
    formattedMax: I(F, r, i),
    formattedTarget: I(T, r, i),
    currency: r,
    currencySymbol: i,
    breakdown: m,
    recommendations: b,
    calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    quoteId: d
  };
}
function D() {
  return "sess_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
function re() {
  if (typeof window > "u") return "desktop";
  const t = navigator.userAgent.toLowerCase(), e = window.innerWidth || 1024;
  return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(t) || e >= 768 && e <= 1024 ? "tablet" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(t) || e < 768 ? "mobile" : "desktop";
}
function ne(t) {
  if (!t) return "";
  try {
    return new URL(t).hostname;
  } catch {
    return "";
  }
}
function V(t = {}) {
  const e = typeof window < "u", r = e ? new URLSearchParams(window.location.search) : new URLSearchParams(), i = e && document.referrer || "", a = e && window.location.href || "", d = e && document.title || "", u = e && navigator.userAgent || "";
  let c = t.customSessionId || "";
  if (!c && e) {
    const R = t.storageKey || "nymrel_quote_session_id";
    try {
      c = window.sessionStorage.getItem(R) || "", c || (c = D(), window.sessionStorage.setItem(R, c));
    } catch {
      c = D();
    }
  } else c || (c = D());
  const o = r.get("utm_source") || void 0, l = r.get("utm_medium") || void 0, x = r.get("utm_campaign") || void 0, w = r.get("utm_term") || void 0, m = r.get("utm_content") || void 0, b = r.get("gclid") || void 0, f = r.get("fbclid") || void 0, g = r.get("msclkid") || void 0, C = r.get("ttclid") || void 0, L = r.get("li_fat_id") || void 0;
  return {
    utm_source: o,
    utm_medium: l,
    utm_campaign: x,
    utm_term: w,
    utm_content: m,
    gclid: b,
    fbclid: f,
    msclkid: g,
    ttclid: C,
    li_fat_id: L,
    referrer: i,
    referring_domain: ne(i),
    landing_page: a,
    page_title: d,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    source_label: t.sourceLabel,
    session_id: c,
    device_type: re(),
    userAgent: u
  };
}
function B(t, e = {}, r = {}) {
  if (typeof window > "u") return;
  const i = r.pushToDataLayer !== !1, a = r.useGtag !== !1, d = r.dispatchDomEvent !== !1, c = `${r.prefix || "nymrel_quote"}_${t}`, o = {
    event: c,
    ...e,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (i) {
    const l = window;
    l.dataLayer = l.dataLayer || [], l.dataLayer.push(o);
  }
  if (a) {
    const l = window;
    typeof l.gtag == "function" && l.gtag("event", c, e);
  }
  if (d)
    try {
      const l = new CustomEvent(c, {
        bubbles: !0,
        cancelable: !0,
        detail: o
      });
      window.dispatchEvent(l);
    } catch {
    }
}
function ae(t, e) {
  B("viewed", { schemaId: t, ...e });
}
function ie(t, e, r, i) {
  B("step_completed", { schemaId: t, stepIndex: e, stepTitle: r, timeSpentMs: i });
}
function se(t, e, r, i, a) {
  B("calculated", { schemaId: t, target: e, min: r, max: i, quoteId: a });
}
function Y(t, e, r, i) {
  B("lead_submitted", {
    schemaId: t,
    quoteId: e,
    value: r,
    currency: "USD",
    hasEmail: !!i
  });
}
function fe(t, e, r) {
  B("cta_clicked", { schemaId: t, ctaName: e, quoteId: r });
}
const oe = {
  mode: "warm",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  primaryColor: "#2A332E",
  // Cedar Green
  accentColor: "#A8541F",
  // Terracotta
  accentHoverColor: "#8E4316",
  // Deep Terracotta
  backgroundColor: "#FAF8F2",
  // Warm Cream
  surfaceColor: "#F4F0E6",
  // Soft Linen
  cardColor: "#FFFFFF",
  // Clean White Card
  textColor: "#2A332E",
  // Deep Cedar Typography
  mutedTextColor: "#637069",
  // Muted Cedar Slate
  borderColor: "#E2DCCE",
  // Warm Sand Border
  borderRadius: "14px",
  boxShadow: "0 8px 30px -4px rgba(42, 51, 46, 0.08), 0 2px 8px -2px rgba(42, 51, 46, 0.04)",
  focusRingColor: "rgba(168, 84, 31, 0.28)"
}, le = {
  mode: "light",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  primaryColor: "#0F172A",
  accentColor: "#2563EB",
  accentHoverColor: "#1D4ED8",
  backgroundColor: "#F8FAFC",
  surfaceColor: "#F1F5F9",
  cardColor: "#FFFFFF",
  textColor: "#0F172A",
  mutedTextColor: "#64748B",
  borderColor: "#E2E8F0",
  borderRadius: "12px",
  boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
  focusRingColor: "rgba(37, 99, 235, 0.25)"
}, de = {
  mode: "dark",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  primaryColor: "#F1F5F9",
  accentColor: "#F97316",
  accentHoverColor: "#EA580C",
  backgroundColor: "#0F172A",
  surfaceColor: "#1E293B",
  cardColor: "#1E293B",
  textColor: "#F8FAFC",
  mutedTextColor: "#94A3B8",
  borderColor: "#334155",
  borderRadius: "12px",
  boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.4)",
  focusRingColor: "rgba(249, 115, 22, 0.3)"
};
function ce(t) {
  return {
    ...(t == null ? void 0 : t.mode) === "dark" ? de : (t == null ? void 0 : t.mode) === "light" ? le : oe,
    ...t
  };
}
function me(t) {
  return `
    --nym-font: ${t.fontFamily};
    --nym-primary: ${t.primaryColor};
    --nym-accent: ${t.accentColor};
    --nym-accent-hover: ${t.accentHoverColor};
    --nym-bg: ${t.backgroundColor};
    --nym-surface: ${t.surfaceColor};
    --nym-card: ${t.cardColor};
    --nym-text: ${t.textColor};
    --nym-muted: ${t.mutedTextColor};
    --nym-border: ${t.borderColor};
    --nym-radius: ${t.borderRadius};
    --nym-shadow: ${t.boxShadow};
    --nym-focus: ${t.focusRingColor};
    --nym-success: #2E6B4F;
    --nym-error: #B83A2C;
  `;
}
function ue(t) {
  const e = ce(t);
  return `
    :host {
      display: block;
      box-sizing: border-box;
      font-family: var(--nym-font);
      color: var(--nym-text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      ${me(e)}
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }

    .nym-container {
      background: var(--nym-bg);
      border: 1px solid var(--nym-border);
      border-radius: var(--nym-radius);
      box-shadow: var(--nym-shadow);
      padding: 24px;
      max-width: 760px;
      margin: 0 auto;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    @media (max-width: 640px) {
      .nym-container {
        padding: 16px;
        border-radius: 10px;
      }
    }

    /* Header Bar */
    .nym-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--nym-border);
    }

    .nym-header-content h2 {
      margin: 0 0 4px 0;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--nym-primary);
      letter-spacing: -0.015em;
    }

    .nym-header-content p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--nym-muted);
    }

    .nym-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      background: var(--nym-surface);
      border: 1px solid var(--nym-border);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--nym-accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Live Range Banner */
    .nym-range-banner {
      background: var(--nym-surface);
      border: 1px solid var(--nym-border);
      border-radius: 12px;
      padding: 18px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      position: relative;
      box-shadow: inset 0 1px 2px rgba(42, 51, 46, 0.03);
    }

    .nym-range-info {
      display: flex;
      flex-direction: column;
    }

    .nym-range-label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--nym-muted);
      margin-bottom: 2px;
    }

    .nym-range-values {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .nym-range-amount {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--nym-primary);
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }

    .nym-range-separator {
      color: var(--nym-muted);
      font-size: 1.25rem;
      font-weight: 400;
    }

    .nym-range-target {
      font-size: 0.85rem;
      color: var(--nym-muted);
      margin-top: 2px;
    }

    .nym-btn-breakdown {
      background: transparent;
      border: 1px solid var(--nym-border);
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--nym-primary);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .nym-btn-breakdown:hover {
      background: var(--nym-card);
      border-color: var(--nym-accent);
      color: var(--nym-accent);
    }

    /* Stepper Progress */
    .nym-stepper {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      position: relative;
    }

    .nym-step-dot {
      flex: 1;
      height: 4px;
      background: var(--nym-border);
      border-radius: 2px;
      transition: background 0.3s ease;
    }

    .nym-step-dot.active {
      background: var(--nym-accent);
    }

    .nym-step-dot.completed {
      background: var(--nym-primary);
    }

    .nym-step-legend {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--nym-muted);
      margin-top: -18px;
      margin-bottom: 20px;
    }

    /* Step Title */
    .nym-step-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--nym-primary);
      margin: 0 0 6px 0;
    }

    .nym-step-subtitle {
      font-size: 0.875rem;
      color: var(--nym-muted);
      margin: 0 0 20px 0;
    }

    /* Form Fields */
    .nym-field-group {
      margin-bottom: 20px;
    }

    .nym-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--nym-primary);
      margin-bottom: 8px;
    }

    .nym-helper-text {
      font-size: 0.78rem;
      color: var(--nym-muted);
      margin-top: 4px;
    }

    .nym-error-text {
      font-size: 0.78rem;
      color: var(--nym-error);
      margin-top: 4px;
    }

    /* Text / Number / Date Inputs */
    .nym-input, .nym-select, .nym-textarea {
      width: 100%;
      padding: 10px 14px;
      font-family: inherit;
      font-size: 0.95rem;
      color: var(--nym-text);
      background: var(--nym-card);
      border: 1px solid var(--nym-border);
      border-radius: 8px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      outline: none;
    }

    .nym-input:focus, .nym-select:focus, .nym-textarea:focus {
      border-color: var(--nym-accent);
      box-shadow: 0 0 0 3px var(--nym-focus);
    }

    .nym-textarea {
      min-height: 80px;
      resize: vertical;
    }

    /* Range Slider */
    .nym-slider-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nym-slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nym-slider-val {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--nym-accent);
      background: var(--nym-surface);
      padding: 2px 10px;
      border-radius: 6px;
      border: 1px solid var(--nym-border);
      font-variant-numeric: tabular-nums;
    }

    .nym-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: var(--nym-border);
      outline: none;
      transition: background 0.2s;
    }

    .nym-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--nym-accent);
      cursor: pointer;
      border: 3px solid var(--nym-card);
      box-shadow: 0 2px 6px rgba(42, 51, 46, 0.2);
      transition: transform 0.15s ease, background 0.2s ease;
    }

    .nym-slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
      background: var(--nym-accent-hover);
    }

    .nym-slider::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--nym-accent);
      cursor: pointer;
      border: 3px solid var(--nym-card);
      box-shadow: 0 2px 6px rgba(42, 51, 46, 0.2);
    }

    .nym-slider-ticks {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--nym-muted);
    }

    /* Option Cards Grid (Radio & Select) */
    .nym-options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .nym-option-card {
      background: var(--nym-card);
      border: 1.5px solid var(--nym-border);
      border-radius: 10px;
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      user-select: none;
    }

    .nym-option-card:hover {
      border-color: var(--nym-accent);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(42, 51, 46, 0.05);
    }

    .nym-option-card.selected {
      border-color: var(--nym-accent);
      background: var(--nym-surface);
      box-shadow: 0 0 0 2px var(--nym-accent);
    }

    .nym-option-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
    }

    .nym-option-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--nym-primary);
    }

    .nym-option-desc {
      font-size: 0.8rem;
      color: var(--nym-muted);
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .nym-option-price {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--nym-accent);
      margin-top: auto;
    }

    .nym-option-badge {
      font-size: 0.7rem;
      font-weight: 700;
      background: var(--nym-accent);
      color: #FFFFFF;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    /* Checkbox & Addon List */
    .nym-checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .nym-checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--nym-card);
      border: 1px solid var(--nym-border);
      border-radius: 8px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nym-checkbox-item:hover {
      border-color: var(--nym-accent);
      background: var(--nym-surface);
    }

    .nym-checkbox-item.checked {
      border-color: var(--nym-accent);
      background: var(--nym-surface);
    }

    .nym-checkbox-box {
      width: 18px;
      height: 18px;
      border: 2px solid var(--nym-border);
      border-radius: 4px;
      margin-top: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .nym-checkbox-item.checked .nym-checkbox-box {
      background: var(--nym-accent);
      border-color: var(--nym-accent);
      color: #FFFFFF;
    }

    .nym-checkbox-info {
      flex: 1;
    }

    .nym-checkbox-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--nym-primary);
      display: flex;
      justify-content: space-between;
    }

    .nym-checkbox-desc {
      font-size: 0.8rem;
      color: var(--nym-muted);
      margin-top: 2px;
    }

    /* Recommendations Box */
    .nym-recommendations {
      background: #F4F8F5;
      border: 1px solid #C2DCCE;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 20px;
      font-size: 0.85rem;
      color: var(--nym-success);
    }

    .nym-recommendation-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .nym-recommendation-item:last-child {
      margin-bottom: 0;
    }

    /* Action Buttons Footer */
    .nym-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 28px;
      padding-top: 18px;
      border-top: 1px solid var(--nym-border);
      gap: 12px;
    }

    .nym-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 11px 22px;
      font-family: inherit;
      font-size: 0.92rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      text-decoration: none;
      outline: none;
    }

    .nym-btn-primary {
      background: var(--nym-accent);
      color: #FFFFFF;
      box-shadow: 0 2px 8px rgba(168, 84, 31, 0.25);
    }

    .nym-btn-primary:hover {
      background: var(--nym-accent-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(168, 84, 31, 0.35);
    }

    .nym-btn-primary:active {
      transform: translateY(0);
    }

    .nym-btn-secondary {
      background: transparent;
      color: var(--nym-primary);
      border: 1px solid var(--nym-border);
    }

    .nym-btn-secondary:hover {
      background: var(--nym-surface);
      border-color: var(--nym-primary);
    }

    .nym-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Breakdown Drawer / Modal */
    .nym-modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(42, 51, 46, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 50;
      animation: nymFadeIn 0.2s ease;
    }

    .nym-modal {
      background: var(--nym-card);
      border: 1px solid var(--nym-border);
      border-radius: 12px;
      box-shadow: var(--nym-shadow);
      width: 100%;
      max-width: 520px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      animation: nymSlideUp 0.25s ease;
      overflow: hidden;
    }

    .nym-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--nym-border);
    }

    .nym-modal-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--nym-primary);
    }

    .nym-btn-close {
      background: transparent;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--nym-muted);
      padding: 4px;
      line-height: 1;
      border-radius: 4px;
    }

    .nym-btn-close:hover {
      color: var(--nym-primary);
      background: var(--nym-surface);
    }

    .nym-modal-body {
      padding: 16px 20px;
      overflow-y: auto;
    }

    .nym-breakdown-table {
      width: 100%;
      border-collapse: collapse;
    }

    .nym-breakdown-table tr {
      border-bottom: 1px solid var(--nym-surface);
    }

    .nym-breakdown-table td {
      padding: 10px 0;
      font-size: 0.88rem;
    }

    .nym-breakdown-label {
      color: var(--nym-primary);
      font-weight: 500;
    }

    .nym-breakdown-subtext {
      font-size: 0.75rem;
      color: var(--nym-muted);
    }

    .nym-breakdown-val {
      text-align: right;
      font-weight: 700;
      color: var(--nym-primary);
      font-variant-numeric: tabular-nums;
    }

    .nym-breakdown-total {
      border-top: 2px solid var(--nym-border) !important;
      border-bottom: none !important;
    }

    .nym-breakdown-total td {
      padding-top: 14px;
      font-size: 1rem;
      font-weight: 800;
      color: var(--nym-accent);
    }

    /* Success / Receipt Screen */
    .nym-success-screen {
      text-align: center;
      padding: 30px 10px;
      animation: nymFadeIn 0.3s ease;
    }

    .nym-success-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #E8F5E9;
      color: var(--nym-success);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 16px;
    }

    .nym-receipt-card {
      background: var(--nym-surface);
      border: 1px solid var(--nym-border);
      border-radius: 10px;
      padding: 18px;
      margin: 20px auto;
      max-width: 480px;
      text-align: left;
    }

    .nym-receipt-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 0.88rem;
    }

    .nym-receipt-row:last-child {
      margin-bottom: 0;
    }

    .nym-receipt-key {
      color: var(--nym-muted);
    }

    .nym-receipt-val {
      font-weight: 600;
      color: var(--nym-primary);
    }

    /* Trust & Attribution Footer */
    .nym-trust-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      font-size: 0.72rem;
      color: var(--nym-muted);
      border-top: 1px dashed var(--nym-border);
      padding-top: 10px;
    }

    .nym-trust-link {
      color: var(--nym-muted);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .nym-trust-link:hover {
      color: var(--nym-accent);
    }

    /* Animations */
    @keyframes nymFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes nymSlideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
}
function W(t = (/* @__PURE__ */ new Date()).toISOString()) {
  return {
    status: "not_configured",
    channel: "none",
    attemptedAt: t,
    message: "Local capture only: no delivery destination is configured, so nothing was sent."
  };
}
function G(t = (/* @__PURE__ */ new Date()).toISOString()) {
  return {
    status: "callback_only",
    channel: "callback",
    attemptedAt: t,
    message: "Captured locally and handed to this page. No external delivery was attempted."
  };
}
async function K(t, e) {
  const r = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const i = await fetch(t, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Nymrel-Quote-Id": e.quoteId
      },
      body: JSON.stringify(e)
    });
    return i.ok ? {
      status: "accepted",
      channel: "webhook",
      attemptedAt: r,
      httpStatus: i.status,
      ok: !0,
      message: "Your quote was accepted by the destination."
    } : {
      status: "rejected",
      channel: "webhook",
      attemptedAt: r,
      httpStatus: i.status,
      ok: !1,
      message: `Delivery failed: the destination declined this quote (HTTP ${i.status}). Your quote is shown below for your records.`
    };
  } catch {
    return {
      status: "failed",
      channel: "webhook",
      attemptedAt: r,
      ok: !1,
      message: "Delivery failed: could not reach the destination. Your quote is shown below for your records."
    };
  }
}
function pe(t) {
  return t ? t.message : W().message;
}
function n(t) {
  return t == null ? "" : String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
class J {
  constructor(e, r) {
    $(this, "container");
    $(this, "schema");
    $(this, "callbacks");
    $(this, "formState", {});
    $(this, "currentStepIndex", 0);
    $(this, "currentQuote");
    $(this, "showBreakdownModal", !1);
    $(this, "isSubmitted", !1);
    $(this, "isSubmitting", !1);
    $(this, "lastSubmission", null);
    $(this, "lastDeliveryReceipt", null);
    $(this, "sourceLabel");
    $(this, "webhookUrl");
    $(this, "fieldErrors", {});
    $(this, "stepStartTime", Date.now());
    this.schema = r.schema, this.callbacks = r.callbacks || {}, this.sourceLabel = r.sourceLabel || this.schema.sourceLabel, this.webhookUrl = r.webhookUrl || this.schema.webhookUrl, this.schema.steps.forEach((i) => {
      i.fields.forEach((a) => {
        a.defaultValue !== void 0 && (this.formState[a.id] = a.defaultValue);
      });
    }), r.initialState && (this.formState = { ...this.formState, ...r.initialState }), r.useShadowDom !== !1 && e.attachShadow ? e.shadowRoot ? this.container = e.shadowRoot : this.container = e.attachShadow({ mode: "open" }) : this.container = e, this.currentQuote = Q(this.schema, this.formState), ae(this.schema.id, { sourceLabel: this.sourceLabel }), this.render();
  }
  /**
   * Update Form State and trigger reactive recalculation
   */
  updateState(e, r) {
    this.formState[e] = k(r), delete this.fieldErrors[e], this.recalculate();
  }
  /**
   * Recalculate quote
   */
  recalculate() {
    return this.currentQuote = Q(this.schema, this.formState), se(
      this.schema.id,
      this.currentQuote.target,
      this.currentQuote.min,
      this.currentQuote.max,
      this.currentQuote.quoteId
    ), this.callbacks.onCalculate && this.callbacks.onCalculate(this.currentQuote, this.formState), this.render(), this.currentQuote;
  }
  /**
   * Go to next step
   */
  nextStep() {
    if (!this.isLeadFormStep()) {
      const r = this.schema.steps[this.currentStepIndex];
      let i = !1;
      this.fieldErrors = {};
      for (const d of r.fields) {
        if (!j(d.condition, this.formState)) continue;
        const u = O(d, this.formState[d.id]);
        u.valid || (this.fieldErrors[d.id] = u.error || "Invalid value", i = !0);
      }
      if (i)
        return this.render(), !1;
      const a = Date.now() - this.stepStartTime;
      if (ie(this.schema.id, this.currentStepIndex, r.title, a), this.currentStepIndex < this.schema.steps.length - 1)
        return this.currentStepIndex++, this.stepStartTime = Date.now(), this.callbacks.onStepChange && this.callbacks.onStepChange(this.currentStepIndex, this.schema.steps[this.currentStepIndex]), this.render(), !0;
      if (this.isLeadFormEnabled())
        return this.currentStepIndex++, this.stepStartTime = Date.now(), this.render(), !0;
    }
    return !1;
  }
  /**
   * Go to previous step
   */
  prevStep() {
    this.currentStepIndex > 0 && (this.currentStepIndex--, this.stepStartTime = Date.now(), this.callbacks.onStepChange && this.currentStepIndex < this.schema.steps.length && this.callbacks.onStepChange(this.currentStepIndex, this.schema.steps[this.currentStepIndex]), this.render());
  }
  isLeadFormEnabled() {
    var e;
    return ((e = this.schema.leadForm) == null ? void 0 : e.enabled) !== !1;
  }
  isLeadFormStep() {
    return this.isLeadFormEnabled() && this.currentStepIndex === this.schema.steps.length;
  }
  getTotalStepsCount() {
    return this.schema.steps.length + (this.isLeadFormEnabled() ? 1 : 0);
  }
  /**
   * Submit lead capture and finalize quote
   */
  async submitLead(e) {
    var u, c, o;
    const r = this.schema.leadForm;
    this.fieldErrors = {}, (!e.name || String(e.name).trim() === "") && (this.fieldErrors.lead_name = "Full Name is required.");
    const i = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ((!e.email || !i.test(String(e.email))) && (this.fieldErrors.lead_email = "A valid email address is required."), r != null && r.requirePhone) {
      const l = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      (!e.phone || !l.test(String(e.phone))) && (this.fieldErrors.lead_phone = "Phone number is required.");
    }
    if (r != null && r.requireAddress && !e.address && (this.fieldErrors.lead_address = "Street address or zip code is required."), Object.keys(this.fieldErrors).length > 0)
      return this.render(), null;
    this.isSubmitting = !0, this.render();
    const a = V({ sourceLabel: this.sourceLabel }), d = {
      quoteId: this.currentQuote.quoteId,
      schemaId: this.schema.id,
      schemaName: this.schema.name,
      quote: this.currentQuote,
      formState: { ...this.formState },
      lead: {
        name: k(e.name),
        email: k(e.email),
        phone: k(e.phone || ""),
        address: k(e.address || ""),
        zipCode: k(e.zipCode || ""),
        preferredDate: k(e.preferredDate || ""),
        preferredTime: k(e.preferredTime || ""),
        notes: k(e.notes || "")
      },
      attribution: a,
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      metadata: this.schema.metadata
    };
    try {
      if (this.webhookUrl) {
        const l = await K(this.webhookUrl, d);
        (l.status === "rejected" || l.status === "failed") && console.warn("[NymrelQuote] Webhook delivery notice:", l.message), d.delivery = l;
      } else
        d.delivery = this.callbacks.onSubmit ? G() : W();
      if (this.callbacks.onSubmit)
        try {
          await this.callbacks.onSubmit(d);
        } catch (l) {
          d.localHandlingFailed = !0, ((u = d.delivery) == null ? void 0 : u.channel) === "callback" && (d.delivery = {
            ...d.delivery,
            status: "failed",
            ok: !1,
            message: "The page handler failed. No external delivery was attempted by the widget. Your quote is shown below."
          });
          try {
            (o = (c = this.callbacks).onError) == null || o.call(c, l);
          } catch {
          }
        }
      try {
        Y(
          this.schema.id,
          d.quoteId,
          this.currentQuote.target,
          d.lead.email
        );
      } catch {
      }
      return this.isSubmitting = !1, this.isSubmitted = !0, this.lastSubmission = d, this.lastDeliveryReceipt = d.delivery ?? null, this.render(), d;
    } catch (l) {
      return this.isSubmitting = !1, this.callbacks.onError && this.callbacks.onError(l), this.fieldErrors._global = "Submission failed. Please check your connection and try again.", this.render(), null;
    }
  }
  /**
   * Truthful delivery receipt for the most recent submission.
   * Null before any submission; cleared by reset().
   * Only `status === 'accepted'` reflects a verified (2xx) webhook response.
   */
  getLastDeliveryReceipt() {
    return this.lastDeliveryReceipt;
  }
  /**
   * Reset Quote to initial state
   */
  reset() {
    this.formState = {}, this.schema.steps.forEach((e) => {
      e.fields.forEach((r) => {
        r.defaultValue !== void 0 && (this.formState[r.id] = r.defaultValue);
      });
    }), this.currentStepIndex = 0, this.isSubmitted = !1, this.isSubmitting = !1, this.lastSubmission = null, this.lastDeliveryReceipt = null, this.fieldErrors = {}, this.recalculate();
  }
  /**
   * Print or Download summary receipt
   */
  printReceipt() {
    typeof window < "u" && window.print();
  }
  /**
   * Render complete DOM tree into container
   */
  render() {
    var d;
    const e = ue(this.schema.theme);
    let r = "";
    this.isSubmitted && this.lastSubmission ? r = this.renderSuccessScreen(this.lastSubmission) : this.isLeadFormStep() ? r = this.renderLeadFormStep() : r = this.renderStepForm(this.schema.steps[this.currentStepIndex]);
    const i = this.showBreakdownModal ? this.renderBreakdownModal() : "", a = `
      <style>${e}</style>
      <div class="nym-container" role="region" aria-label="${n(this.schema.name)}">
        <!-- Header -->
        <header class="nym-header">
          <div class="nym-header-content">
            <h2>${n(this.schema.name)}</h2>
            ${this.schema.description ? `<p>${n(this.schema.description)}</p>` : ""}
          </div>
          ${this.schema.badge ? `<span class="nym-badge">${n(this.schema.badge)}</span>` : ""}
        </header>

        <!-- Live Reactive Range Banner -->
        <div class="nym-range-banner">
          <div class="nym-range-info">
            <span class="nym-range-label">Instant Estimated Range</span>
            <div class="nym-range-values">
              <span class="nym-range-amount">${n(this.currentQuote.formattedMin)}</span>
              <span class="nym-range-separator">&ndash;</span>
              <span class="nym-range-amount">${n(this.currentQuote.formattedMax)}</span>
            </div>
            <span class="nym-range-target">Baseline Target: <strong>${n(this.currentQuote.formattedTarget)}</strong></span>
          </div>
          <button type="button" class="nym-btn-breakdown" id="nym-toggle-breakdown" aria-label="View cost breakdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            Itemized Breakdown
          </button>
        </div>

        <!-- Stepper Progress Dots -->
        <div class="nym-stepper" aria-label="Quote Progress">
          ${Array.from({ length: this.getTotalStepsCount() }).map((u, c) => {
      let o = "nym-step-dot";
      return c === this.currentStepIndex && (o += " active"), c < this.currentStepIndex && (o += " completed"), `<div class="${o}"></div>`;
    }).join("")}
        </div>
        <div class="nym-step-legend">
          <span>Step ${this.currentStepIndex + 1} of ${this.getTotalStepsCount()}</span>
          <span>${this.isLeadFormStep() ? "Lead Contact & Booking" : n(((d = this.schema.steps[this.currentStepIndex]) == null ? void 0 : d.title) || "")}</span>
        </div>

        <!-- Main Step Form Content -->
        ${r}

        <!-- Recommendations Box if available -->
        ${this.currentQuote.recommendations.length > 0 && !this.isSubmitted ? `
          <div class="nym-recommendations">
            ${this.currentQuote.recommendations.map((u) => `
              <div class="nym-recommendation-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${n(u)}</span>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Trust Footer -->
        <footer class="nym-trust-footer">
          <span>🔒 Instant Guaranteed Price Range &bull; Zero Spam Guarantee</span>
          <a class="nym-trust-link" href="https://github.com/nymrel/headless-quote-layer" target="_blank" rel="noopener noreferrer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Built with Nymrel Quote Layer
          </a>
        </footer>

        <!-- Itemized Breakdown Modal / Drawer -->
        ${i}
      </div>
    `;
    this.container.innerHTML = a, this.attachEventListeners();
  }
  /**
   * Render Standard Calculation Step
   */
  renderStepForm(e) {
    const r = this.currentStepIndex === 0;
    return `
      <div class="nym-step-view">
        <h3 class="nym-step-title">${n(e.title)}</h3>
        ${e.subtitle ? `<p class="nym-step-subtitle">${n(e.subtitle)}</p>` : ""}

        <div class="nym-fields-list">
          ${e.fields.map((i) => this.renderField(i)).join("")}
        </div>

        <div class="nym-footer">
          ${r ? "<div></div>" : `
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Back
            </button>
          `}
          <button type="button" class="nym-btn nym-btn-primary" id="nym-btn-next">
            ${this.currentStepIndex === this.schema.steps.length - 1 && !this.isLeadFormEnabled() ? "Finish Quote" : "Continue &rarr;"}
          </button>
        </div>
      </div>
    `;
  }
  /**
   * Render Individual Field Controls
   */
  renderField(e) {
    var d, u, c;
    if (!j(e.condition, this.formState))
      return "";
    const r = this.formState[e.id] !== void 0 ? this.formState[e.id] : e.defaultValue ?? "", i = this.fieldErrors[e.id];
    let a = "";
    switch (e.type) {
      case "slider": {
        const o = e.min ?? 100, l = e.max ?? 5e3, x = e.step ?? 50, w = Number(r) || o;
        a = `
          <div class="nym-slider-container">
            <div class="nym-slider-header">
              <span class="nym-slider-ticks">${o} ${e.unit || ""}</span>
              <span class="nym-slider-val" id="val-${e.id}">${w} ${e.unit || ""}</span>
              <span class="nym-slider-ticks">${l} ${e.unit || ""}</span>
            </div>
            <input 
              type="range" 
              class="nym-slider nym-reactive-input" 
              data-field-id="${e.id}" 
              min="${o}" 
              max="${l}" 
              step="${x}" 
              value="${w}"
              aria-label="${n(e.label)}"
            />
          </div>
        `;
        break;
      }
      case "select": {
        a = `
          <select class="nym-select nym-reactive-input" data-field-id="${e.id}" aria-label="${n(e.label)}">
            ${(d = e.options) == null ? void 0 : d.map((o) => `
              <option value="${n(o.id)}" ${String(r) === String(o.id) ? "selected" : ""}>
                ${n(o.label)} ${o.adder ? `(+${this.currentQuote.currencySymbol}${o.adder})` : ""} ${o.multiplier ? `(${o.multiplier}x)` : ""}
              </option>
            `).join("")}
          </select>
        `;
        break;
      }
      case "radio": {
        a = `
          <div class="nym-options-grid" role="radiogroup" aria-label="${n(e.label)}">
            ${(u = e.options) == null ? void 0 : u.map((o) => {
          const l = String(r) === String(o.id);
          return `
                <div 
                  class="nym-option-card ${l ? "selected" : ""}" 
                  data-field-id="${e.id}" 
                  data-option-id="${n(o.id)}"
                  role="radio"
                  aria-checked="${l}"
                  tabindex="0"
                >
                  <div class="nym-option-header">
                    <span class="nym-option-title">${n(o.label)}</span>
                    ${o.badge ? `<span class="nym-option-badge">${n(o.badge)}</span>` : ""}
                  </div>
                  ${o.description ? `<p class="nym-option-desc">${n(o.description)}</p>` : ""}
                  ${o.adder || o.multiplier ? `
                    <div class="nym-option-price">
                      ${o.adder ? `+${this.currentQuote.currencySymbol}${o.adder}` : ""}
                      ${o.multiplier ? `${o.multiplier}x multiplier` : ""}
                    </div>
                  ` : ""}
                </div>
              `;
        }).join("")}
          </div>
        `;
        break;
      }
      case "checkbox": {
        const o = Array.isArray(r) ? r : [];
        a = `
          <div class="nym-checkbox-list">
            ${(c = e.options) == null ? void 0 : c.map((l) => {
          const x = o.includes(l.id);
          return `
                <div 
                  class="nym-checkbox-item ${x ? "checked" : ""}" 
                  data-field-id="${e.id}" 
                  data-checkbox-id="${n(l.id)}"
                  role="checkbox"
                  aria-checked="${x}"
                  tabindex="0"
                >
                  <div class="nym-checkbox-box">
                    ${x ? "✓" : ""}
                  </div>
                  <div class="nym-checkbox-info">
                    <div class="nym-checkbox-title">
                      <span>${n(l.label)}</span>
                      ${l.adder ? `<span>+${this.currentQuote.currencySymbol}${l.adder}</span>` : ""}
                    </div>
                    ${l.description ? `<div class="nym-checkbox-desc">${n(l.description)}</div>` : ""}
                  </div>
                </div>
              `;
        }).join("")}
          </div>
        `;
        break;
      }
      case "number":
      case "stepper": {
        a = `
          <input 
            type="number" 
            class="nym-input nym-reactive-input" 
            data-field-id="${e.id}" 
            min="${e.min ?? 0}" 
            max="${e.max ?? 999999}" 
            step="${e.step ?? 1}" 
            value="${n(r)}"
            placeholder="${e.placeholder ? n(e.placeholder) : ""}"
            aria-label="${n(e.label)}"
          />
        `;
        break;
      }
      default:
        a = `
          <input 
            type="text" 
            class="nym-input nym-reactive-input" 
            data-field-id="${e.id}" 
            value="${n(r)}"
            placeholder="${e.placeholder ? n(e.placeholder) : ""}"
            aria-label="${n(e.label)}"
          />
        `;
    }
    return `
      <div class="nym-field-group">
        <label class="nym-label">
          <span>${n(e.label)}${e.required ? " *" : ""}</span>
          ${e.unit && e.type !== "slider" ? `<span class="nym-helper-text">${n(e.unit)}</span>` : ""}
        </label>
        ${a}
        ${e.helperText ? `<div class="nym-helper-text">${n(e.helperText)}</div>` : ""}
        ${i ? `<div class="nym-error-text">${n(i)}</div>` : ""}
      </div>
    `;
  }
  /**
   * Render Lead Contact & Scheduling Capture Step
   */
  renderLeadFormStep() {
    const e = this.schema.leadForm, r = this.fieldErrors._global;
    return `
      <div class="nym-lead-step">
        <h3 class="nym-step-title">${n((e == null ? void 0 : e.title) || "Lock in Your Official Quote")}</h3>
        <p class="nym-step-subtitle">${n((e == null ? void 0 : e.subtitle) || "Enter your contact details to save your estimate, receive your official PDF breakdown, and schedule an on-site inspection.")}</p>

        ${r ? `<div class="nym-error-text" style="margin-bottom: 16px;">${n(r)}</div>` : ""}

        <form id="nym-lead-form">
          <div class="nym-field-group">
            <label class="nym-label">Full Name *</label>
            <input type="text" name="name" class="nym-input" required placeholder="e.g. Alex Morgan" value="${n(this.formState._lead_name || "")}" />
            ${this.fieldErrors.lead_name ? `<div class="nym-error-text">${n(this.fieldErrors.lead_name)}</div>` : ""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Email Address *</label>
            <input type="email" name="email" class="nym-input" required placeholder="alex@example.com" value="${n(this.formState._lead_email || "")}" />
            ${this.fieldErrors.lead_email ? `<div class="nym-error-text">${n(this.fieldErrors.lead_email)}</div>` : ""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Phone Number ${e != null && e.requirePhone ? "*" : "(Optional)"}</label>
            <input type="tel" name="phone" class="nym-input" ${e != null && e.requirePhone ? "required" : ""} placeholder="(555) 019-2834" value="${n(this.formState._lead_phone || "")}" />
            ${this.fieldErrors.lead_phone ? `<div class="nym-error-text">${n(this.fieldErrors.lead_phone)}</div>` : ""}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="nym-field-group">
              <label class="nym-label">Street Address ${e != null && e.requireAddress ? "*" : ""}</label>
              <input type="text" name="address" class="nym-input" placeholder="123 Maple Way" value="${n(this.formState._lead_address || "")}" />
              ${this.fieldErrors.lead_address ? `<div class="nym-error-text">${n(this.fieldErrors.lead_address)}</div>` : ""}
            </div>
            <div class="nym-field-group">
              <label class="nym-label">Zip Code</label>
              <input type="text" name="zipCode" class="nym-input" placeholder="90210" value="${n(this.formState._lead_zip || "")}" />
            </div>
          </div>

          ${e != null && e.requireDate ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nym-field-group">
                <label class="nym-label">Preferred Date</label>
                <input type="date" name="preferredDate" class="nym-input" value="${n(this.formState._lead_date || "")}" />
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
          ` : ""}

          ${(e == null ? void 0 : e.collectNotes) !== !1 ? `
            <div class="nym-field-group">
              <label class="nym-label">Project Notes or Questions</label>
              <textarea name="notes" class="nym-textarea" placeholder="Tell us about specific property access, timeline goals, or special requirements...">${n(this.formState._lead_notes || "")}</textarea>
            </div>
          ` : ""}

          <div class="nym-helper-text" style="margin-bottom: 20px;">
            ${n((e == null ? void 0 : e.disclaimerText) || "By submitting, you agree to receive project updates and quote confirmation. We respect your privacy and never sell data.")}
          </div>

          <div class="nym-footer">
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Edit Parameters
            </button>
            <button type="submit" class="nym-btn nym-btn-primary" ${this.isSubmitting ? "disabled" : ""}>
              ${this.isSubmitting ? "Processing..." : (e == null ? void 0 : e.submitButtonText) || "Lock In My Estimate &rarr;"}
            </button>
          </div>
        </form>
      </div>
    `;
  }
  /**
   * Render Success / Receipt Confirmation Screen
   */
  renderSuccessScreen(e) {
    var a;
    const r = this.schema.leadForm, i = ((a = e.delivery) == null ? void 0 : a.status) === "accepted" && !e.localHandlingFailed;
    return `
      <div class="nym-success-screen">
        <div class="nym-success-icon">✓</div>
        <h3 class="nym-step-title">${n(i && (r == null ? void 0 : r.successTitle) || "Estimate Captured Successfully!")}</h3>
        <p class="nym-step-subtitle">${n(i && (r == null ? void 0 : r.successMessage) || "Your quote summary is below. Print or save a copy for your records.")}</p>
        ${e.localHandlingFailed ? '<p role="alert">The page handler failed after capture. The delivery status below records the observed outcome.</p>' : ""}

        <div class="nym-receipt-card">
          <div class="nym-delivery-status nym-receipt-row" role="status">
            <span class="nym-receipt-key">Delivery Status:</span>
            <span class="nym-receipt-val">${n(pe(this.lastDeliveryReceipt))}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Quote Reference ID:</span>
            <span class="nym-receipt-val" style="font-family: monospace;">${n(e.quoteId)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Estimated Price Range:</span>
            <span class="nym-receipt-val" style="color: var(--nym-accent); font-size: 1.05rem;">
              ${n(e.quote.formattedMin)} &ndash; ${n(e.quote.formattedMax)}
            </span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Baseline Target:</span>
            <span class="nym-receipt-val">${n(e.quote.formattedTarget)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Recipient:</span>
            <span class="nym-receipt-val">${n(e.lead.name)} (${n(e.lead.email)})</span>
          </div>
          ${e.lead.preferredDate ? `
            <div class="nym-receipt-row">
              <span class="nym-receipt-key">Requested Consultation:</span>
              <span class="nym-receipt-val">${n(e.lead.preferredDate)} (${n(e.lead.preferredTime || "Anytime")})</span>
            </div>
          ` : ""}
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
  renderBreakdownModal() {
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
                ${this.currentQuote.breakdown.map((e) => `
                  <tr>
                    <td>
                      <div class="nym-breakdown-label">${n(e.label)}</div>
                      ${e.description ? `<div class="nym-breakdown-subtext">${n(e.description)}</div>` : ""}
                    </td>
                    <td class="nym-breakdown-val">${n(e.formattedAmount)}</td>
                  </tr>
                `).join("")}
                <tr class="nym-breakdown-total">
                  <td><strong>Estimated Baseline Target</strong></td>
                  <td class="nym-breakdown-val">${n(this.currentQuote.formattedTarget)}</td>
                </tr>
                <tr>
                  <td><strong>Dynamic Estimated Range</strong></td>
                  <td class="nym-breakdown-val">${n(this.currentQuote.formattedMin)} &ndash; ${n(this.currentQuote.formattedMax)}</td>
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
  attachEventListeners() {
    this.container.querySelectorAll(".nym-reactive-input").forEach((m) => {
      m.addEventListener("input", (b) => {
        const f = b.target, g = f.getAttribute("data-field-id");
        if (g) {
          this.updateState(g, f.value);
          const C = this.container.querySelector(`#val-${g}`);
          C && (C.textContent = `${f.value} ${f.getAttribute("data-unit") || ""}`.trim());
        }
      });
    }), this.container.querySelectorAll(".nym-option-card").forEach((m) => {
      m.addEventListener("click", () => {
        const b = m.getAttribute("data-field-id"), f = m.getAttribute("data-option-id");
        b && f && this.updateState(b, f);
      });
    }), this.container.querySelectorAll(".nym-checkbox-item").forEach((m) => {
      m.addEventListener("click", () => {
        const b = m.getAttribute("data-field-id"), f = m.getAttribute("data-checkbox-id");
        if (b && f) {
          const g = Array.isArray(this.formState[b]) ? [...this.formState[b]] : [], C = g.indexOf(f);
          C >= 0 ? g.splice(C, 1) : g.push(f), this.updateState(b, g);
        }
      });
    });
    const a = this.container.querySelector("#nym-btn-next");
    a && a.addEventListener("click", () => this.nextStep());
    const d = this.container.querySelector("#nym-btn-prev");
    d && d.addEventListener("click", () => this.prevStep());
    const u = this.container.querySelector("#nym-lead-form");
    u && u.addEventListener("submit", (m) => {
      m.preventDefault();
      const b = new FormData(u), f = {};
      b.forEach((g, C) => {
        f[C] = g;
      }), this.submitLead(f);
    });
    const c = this.container.querySelector("#nym-toggle-breakdown");
    c && c.addEventListener("click", () => {
      this.showBreakdownModal = !0, this.render();
    });
    const o = this.container.querySelector("#nym-modal-close");
    o && o.addEventListener("click", () => {
      this.showBreakdownModal = !1, this.render();
    });
    const l = this.container.querySelector("#nym-modal-backdrop");
    l && l.addEventListener("click", (m) => {
      m.target === l && (this.showBreakdownModal = !1, this.render());
    });
    const x = this.container.querySelector("#nym-btn-print");
    x && x.addEventListener("click", () => this.printReceipt());
    const w = this.container.querySelector("#nym-btn-restart");
    w && w.addEventListener("click", () => this.reset());
  }
}
function ge(t, e) {
  const r = typeof t == "string" ? document.querySelector(t) : t;
  if (!r)
    throw new Error(`[NymrelQuote] Container element not found: ${t}`);
  return new J(r, e);
}
const ve = ({
  schema: t,
  initialState: e,
  theme: r,
  sourceLabel: i,
  webhookUrl: a,
  useShadowDom: d = !0,
  onCalculate: u,
  onStepChange: c,
  onSubmit: o,
  onError: l,
  className: x,
  style: w
}) => {
  const m = H(null), b = H(null);
  return U(() => {
    if (!m.current) return;
    const f = r ? { ...t, theme: { ...t.theme, ...r } } : t, g = new J(m.current, {
      schema: f,
      initialState: e,
      sourceLabel: i,
      webhookUrl: a,
      useShadowDom: d,
      callbacks: {
        onCalculate: u,
        onStepChange: c,
        onSubmit: o,
        onError: l
      }
    });
    return b.current = g, () => {
      b.current = null, m.current && (m.current.innerHTML = "");
    };
  }, [t, r, i, a, d]), /* @__PURE__ */ ee(
    "div",
    {
      ref: m,
      className: `nymrel-quote-widget-root ${x || ""}`.trim(),
      style: w
    }
  );
};
function xe(t, e) {
  const [r, i] = A(() => {
    const y = {};
    return t.steps.forEach((F) => {
      F.fields.forEach((S) => {
        S.defaultValue !== void 0 && (y[S.id] = S.defaultValue);
      });
    }), { ...y, ...e };
  }), [a, d] = A(0), [u, c] = A(() => Q(t, r)), [o, l] = A({}), [x, w] = A(!1), [m, b] = A(!1), [f, g] = A(null), [C, L] = A(null);
  U(() => {
    const y = Q(t, r);
    c(y);
  }, [t, r]);
  const R = P((y, F) => {
    i((S) => ({ ...S, [y]: k(F) })), l((S) => {
      const v = { ...S };
      return delete v[y], v;
    });
  }, []), _ = P(() => {
    const y = t.steps[a];
    if (!y) return !1;
    let F = !1;
    const S = {};
    for (const v of y.fields) {
      const s = O(v, r[v.id]);
      s.valid || (S[v.id] = s.error || "Invalid value", F = !0);
    }
    return F ? (l(S), !1) : a < t.steps.length ? (d((v) => v + 1), !0) : !1;
  }, [t, a, r]), z = P(() => {
    a > 0 && d((y) => y - 1);
  }, [a]), N = P(async (y, F = {}) => {
    w(!0);
    const S = V({ sourceLabel: F.sourceLabel }), v = {
      quoteId: u.quoteId,
      schemaId: t.id,
      schemaName: t.name,
      quote: u,
      formState: r,
      lead: {
        name: k(y.name),
        email: k(y.email),
        phone: k(y.phone || ""),
        address: k(y.address || ""),
        zipCode: k(y.zipCode || ""),
        preferredDate: k(y.preferredDate || ""),
        preferredTime: k(y.preferredTime || ""),
        notes: k(y.notes || "")
      },
      attribution: S,
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      metadata: t.metadata
    };
    if (F.webhookUrl) {
      const s = await K(F.webhookUrl, v);
      (s.status === "rejected" || s.status === "failed") && console.warn("[useQuoteEngine] Webhook delivery notice:", s.message), v.delivery = s;
    } else
      v.delivery = G();
    return Y(t.id, v.quoteId, u.target, v.lead.email), w(!1), b(!0), g(v), L(v.delivery ?? null), v;
  }, [t, u, r]), T = P(() => {
    const y = {};
    t.steps.forEach((F) => {
      F.fields.forEach((S) => {
        S.defaultValue !== void 0 && (y[S.id] = S.defaultValue);
      });
    }), i({ ...y, ...e }), d(0), b(!1), w(!1), g(null), L(null), l({});
  }, [t, e]);
  return {
    quote: u,
    formState: r,
    currentStepIndex: a,
    fieldErrors: o,
    isSubmitting: x,
    isSubmitted: m,
    lastSubmission: f,
    deliveryReceipt: C,
    updateField: R,
    nextStep: _,
    prevStep: z,
    submitLead: N,
    reset: T
  };
}
export {
  de as D,
  le as L,
  J as N,
  ve as Q,
  oe as a,
  q as b,
  Q as c,
  j as d,
  B as e,
  V as f,
  I as g,
  me as h,
  te as i,
  re as j,
  ne as k,
  ue as l,
  Y as m,
  se as n,
  ae as o,
  ie as p,
  ge as q,
  ce as r,
  k as s,
  fe as t,
  xe as u,
  O as v
};
