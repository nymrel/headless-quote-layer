var h = Object.defineProperty;
var g = (s, a, e) => a in s ? h(s, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[a] = e;
var c = (s, a, e) => g(s, typeof a != "symbol" ? a + "" : a, e);
import { N as b } from "./ReactQuoteWidget-D_unP1kP.mjs";
import { D as A, a as I, L as Q, Q as T, b as L, c as W, q as x, e as M, d as P, f as R, g as q, h as D, i as H, j as N, k as _, l as F, r as U, s as $, t as j, m as G, n as J, o as O, p as V, u as z, v as K } from "./ReactQuoteWidget-D_unP1kP.mjs";
import { roofingPreset as p, getPreset as f } from "./presets.js";
import { PRESET_REGISTRY as B, hvacPreset as X, plumbingPreset as Z, softwarePreset as ee } from "./presets.js";
class w extends HTMLElement {
  constructor() {
    super(...arguments);
    c(this, "widgetInstance", null);
  }
  static get observedAttributes() {
    return ["config", "src", "webhook-url", "source-label", "theme-mode", "mode"];
  }
  connectedCallback() {
    this.initWidget();
  }
  disconnectedCallback() {
    this.widgetInstance = null;
  }
  attributeChangedCallback(e, o, i) {
    o !== i && this.isConnected && this.initWidget();
  }
  async initWidget() {
    const e = this.getAttribute("config"), o = this.getAttribute("src"), i = this.getAttribute("webhook-url") || void 0, l = this.getAttribute("source-label") || void 0, u = this.getAttribute("theme-mode") || "warm", d = this.getAttribute("mode") || "shadow";
    let r = p;
    if (o)
      try {
        const t = await fetch(o);
        if (!t.ok)
          throw new Error(`Failed to load quote config from ${o}: HTTP ${t.status}`);
        r = await t.json();
      } catch (t) {
        console.error("[NymrelQuoteLayer] Schema fetch error:", t), this.dispatchEvent(new CustomEvent("nymrel:error", { bubbles: !0, composed: !0, detail: { error: t.message } }));
      }
    else if (e) {
      const t = f(e);
      if (t)
        r = t;
      else
        try {
          r = JSON.parse(e);
        } catch {
          console.warn(`[NymrelQuoteLayer] Could not parse config attribute as JSON or preset name: "${e}". Using default roofing preset.`);
        }
    }
    r && (r = {
      ...r,
      theme: {
        ...r.theme,
        mode: u
      }
    }), this.widgetInstance = new b(this, {
      schema: r,
      sourceLabel: l,
      webhookUrl: i,
      useShadowDom: d !== "light",
      callbacks: {
        onCalculate: (t, n) => {
          this.dispatchEvent(new CustomEvent("nymrel:quote-calculated", {
            bubbles: !0,
            composed: !0,
            detail: { quote: t, formState: n }
          }));
        },
        onStepChange: (t, n) => {
          this.dispatchEvent(new CustomEvent("nymrel:step-change", {
            bubbles: !0,
            composed: !0,
            detail: { stepIndex: t, step: n }
          }));
        },
        onSubmit: (t) => {
          this.dispatchEvent(new CustomEvent("nymrel:lead-submitted", {
            bubbles: !0,
            composed: !0,
            detail: { submission: t }
          }));
        },
        onError: (t) => {
          this.dispatchEvent(new CustomEvent("nymrel:error", {
            bubbles: !0,
            composed: !0,
            detail: { error: typeof t == "string" ? t : t.message }
          }));
        }
      }
    });
    const m = this.widgetInstance.recalculate();
    this.dispatchEvent(new CustomEvent("nymrel:quote-calculated", {
      bubbles: !0,
      composed: !0,
      detail: { quote: m, formState: {} }
    }));
  }
  /**
   * Public Programmatic Methods on the DOM Element
   */
  getWidget() {
    return this.widgetInstance;
  }
  nextStep() {
    var e;
    return ((e = this.widgetInstance) == null ? void 0 : e.nextStep()) ?? !1;
  }
  prevStep() {
    var e;
    (e = this.widgetInstance) == null || e.prevStep();
  }
  reset() {
    var e;
    (e = this.widgetInstance) == null || e.reset();
  }
  recalculate() {
    var e;
    return (e = this.widgetInstance) == null ? void 0 : e.recalculate();
  }
}
function E(s = "nymrel-quote-layer") {
  typeof window < "u" && typeof customElements < "u" && (customElements.get(s) || customElements.define(s, w));
}
E();
export {
  A as DARK_THEME,
  I as DEFAULT_WARM_THEME,
  Q as LIGHT_THEME,
  w as NymrelQuoteLayerElement,
  b as NymrelQuoteWidget,
  B as PRESET_REGISTRY,
  T as QuoteWidget,
  L as applyRounding,
  W as calculateQuote,
  x as createQuoteWidget,
  M as emitAnalyticsEvent,
  P as evaluateCondition,
  R as extractAttribution,
  q as formatCurrency,
  D as generateCssVariables,
  H as generateQuoteId,
  N as getDeviceType,
  f as getPreset,
  _ as getReferringDomain,
  F as getShadowStyles,
  X as hvacPreset,
  Z as plumbingPreset,
  E as registerWebComponent,
  U as resolveTheme,
  p as roofingPreset,
  $ as sanitizeInput,
  ee as softwarePreset,
  j as trackCtaClicked,
  G as trackLeadSubmitted,
  J as trackQuoteCalculated,
  O as trackQuoteViewed,
  V as trackStepCompleted,
  z as useQuoteEngine,
  K as validateField
};
