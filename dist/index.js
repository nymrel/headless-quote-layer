import { C as e, D as t, E as n, S as r, T as i, _ as a, a as o, b as s, c, d as l, f as u, g as d, h as f, l as p, m, n as h, o as g, p as _, s as v, t as y, u as b, v as x, w as S, x as C, y as w } from "./QuoteWidget-R7q69x3D.js";
import { a as T, i as E, n as D, o as O, r as k, t as A } from "./presets-B56HpqVm.js";
//#region src/web-component/NymrelQuoteLayer.ts
var j = globalThis.HTMLElement ?? class {}, M = class extends j {
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
		let e = this.getAttribute("config"), t = this.getAttribute("src"), n = this.getAttribute("webhook-url") || void 0, r = this.getAttribute("source-label") || void 0, i = this.getAttribute("theme-mode") || "warm", a = this.getAttribute("mode") || "shadow", o = O;
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
			let t = D(e);
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
		}), this.widgetInstance = new y(this, {
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
function N(e = "nymrel-quote-layer") {
	typeof window < "u" && typeof customElements < "u" && (customElements.get(e) || customElements.define(e, M));
}
//#endregion
//#region src/web-component/index.ts
N();
//#endregion
export { o as DARK_THEME, g as DEFAULT_WARM_THEME, v as LIGHT_THEME, M as NymrelQuoteLayerElement, y as NymrelQuoteWidget, A as PRESET_REGISTRY, s as applyRounding, C as calculateQuote, h as createQuoteWidget, l as emitAnalyticsEvent, r as evaluateCondition, u as extractAttribution, e as formatCurrency, c as generateCssVariables, S as generateQuoteId, _ as getDeviceType, D as getPreset, m as getReferringDomain, p as getShadowStyles, T as hvacPreset, i as isValidEmail, E as plumbingPreset, N as registerWebComponent, b as resolveTheme, O as roofingPreset, n as sanitizeInput, k as softwarePreset, f as trackCtaClicked, d as trackLeadSubmitted, a as trackQuoteCalculated, x as trackQuoteViewed, w as trackStepCompleted, t as validateField };
