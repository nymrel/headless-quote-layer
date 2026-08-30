import { C as e, E as t, S as n, T as r, _ as i, a, b as o, c as s, d as c, f as l, g as u, h as d, i as f, l as p, m, n as h, o as g, p as _, r as v, s as y, t as b, u as x, v as S, w as C, x as w, y as T } from "./ReactQuoteWidget-8waIBoF_.js";
import { a as E, i as D, n as O, o as k, r as A, t as j } from "./presets-dLAJB748.js";
//#region src/web-component/NymrelQuoteLayer.ts
var M = globalThis.HTMLElement ?? class {}, N = class extends M {
	widgetInstance = null;
	static get observedAttributes() {
		return [
			"config",
			"src",
			"webhook-url",
			"source-label",
			"theme-mode",
			"mode"
		];
	}
	connectedCallback() {
		this.initWidget();
	}
	disconnectedCallback() {
		this.widgetInstance = null;
	}
	attributeChangedCallback(e, t, n) {
		t !== n && this.isConnected && this.initWidget();
	}
	async initWidget() {
		let e = this.getAttribute("config"), t = this.getAttribute("src"), n = this.getAttribute("webhook-url") || void 0, r = this.getAttribute("source-label") || void 0, i = this.getAttribute("theme-mode") || "warm", a = this.getAttribute("mode") || "shadow", o = k;
		if (t) try {
			let e = await fetch(t);
			if (!e.ok) throw Error(`Failed to load quote config from ${t}: HTTP ${e.status}`);
			o = await e.json();
		} catch (e) {
			console.error("[NymrelQuoteLayer] Schema fetch error:", e), this.dispatchEvent(new CustomEvent("nymrel:error", {
				bubbles: !0,
				composed: !0,
				detail: { error: e.message }
			}));
		}
		else if (e) {
			let t = O(e);
			if (t) o = t;
			else try {
				o = JSON.parse(e);
			} catch {
				console.warn(`[NymrelQuoteLayer] Could not parse config attribute as JSON or preset name: "${e}". Using default roofing preset.`);
			}
		}
		i && o && (o = {
			...o,
			theme: {
				...o.theme,
				mode: i
			}
		}), this.widgetInstance = new v(this, {
			schema: o,
			sourceLabel: r,
			webhookUrl: n,
			useShadowDom: a !== "light",
			callbacks: {
				onCalculate: (e, t) => {
					this.dispatchEvent(new CustomEvent("nymrel:quote-calculated", {
						bubbles: !0,
						composed: !0,
						detail: {
							quote: e,
							formState: t
						}
					}));
				},
				onStepChange: (e, t) => {
					this.dispatchEvent(new CustomEvent("nymrel:step-change", {
						bubbles: !0,
						composed: !0,
						detail: {
							stepIndex: e,
							step: t
						}
					}));
				},
				onSubmit: (e) => {
					this.dispatchEvent(new CustomEvent("nymrel:lead-submitted", {
						bubbles: !0,
						composed: !0,
						detail: { submission: e }
					}));
				},
				onError: (e) => {
					this.dispatchEvent(new CustomEvent("nymrel:error", {
						bubbles: !0,
						composed: !0,
						detail: { error: typeof e == "string" ? e : e.message }
					}));
				}
			}
		});
		let s = this.widgetInstance.recalculate();
		this.dispatchEvent(new CustomEvent("nymrel:quote-calculated", {
			bubbles: !0,
			composed: !0,
			detail: {
				quote: s,
				formState: {}
			}
		}));
	}
	getWidget() {
		return this.widgetInstance;
	}
	nextStep() {
		return this.widgetInstance?.nextStep() ?? !1;
	}
	prevStep() {
		this.widgetInstance?.prevStep();
	}
	reset() {
		this.widgetInstance?.reset();
	}
	recalculate() {
		return this.widgetInstance?.recalculate();
	}
};
function P(e = "nymrel-quote-layer") {
	typeof window < "u" && typeof customElements < "u" && (customElements.get(e) || customElements.define(e, N));
}
//#endregion
//#region src/web-component/index.ts
P();
//#endregion
export { a as DARK_THEME, g as DEFAULT_WARM_THEME, y as LIGHT_THEME, N as NymrelQuoteLayerElement, v as NymrelQuoteWidget, j as PRESET_REGISTRY, b as QuoteWidget, o as applyRounding, w as calculateQuote, f as createQuoteWidget, c as emitAnalyticsEvent, n as evaluateCondition, l as extractAttribution, e as formatCurrency, s as generateCssVariables, C as generateQuoteId, _ as getDeviceType, O as getPreset, m as getReferringDomain, p as getShadowStyles, E as hvacPreset, D as plumbingPreset, P as registerWebComponent, x as resolveTheme, k as roofingPreset, r as sanitizeInput, A as softwarePreset, d as trackCtaClicked, u as trackLeadSubmitted, i as trackQuoteCalculated, S as trackQuoteViewed, T as trackStepCompleted, h as useQuoteEngine, t as validateField };
