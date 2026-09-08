import { C as e, E as t, S as n, T as r, _ as i, a, b as o, c as s, d as c, f as l, g as u, h as d, l as f, m as p, n as m, o as h, p as g, s as _, t as v, u as y, v as b, w as x, x as S, y as C } from "./QuoteWidget-Bnme2tBO.js";
import { a as w, i as T, n as E, o as D, r as O, t as k } from "./presets-B56HpqVm.js";
//#region src/web-component/NymrelQuoteLayer.ts
var A = globalThis.HTMLElement ?? class {}, j = class extends A {
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
		let e = this.getAttribute("config"), t = this.getAttribute("src"), n = this.getAttribute("webhook-url") || void 0, r = this.getAttribute("source-label") || void 0, i = this.getAttribute("theme-mode") || "warm", a = this.getAttribute("mode") || "shadow", o = D;
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
			let t = E(e);
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
function M(e = "nymrel-quote-layer") {
	typeof window < "u" && typeof customElements < "u" && (customElements.get(e) || customElements.define(e, j));
}
//#endregion
//#region src/web-component/index.ts
M();
//#endregion
export { a as DARK_THEME, h as DEFAULT_WARM_THEME, _ as LIGHT_THEME, j as NymrelQuoteLayerElement, v as NymrelQuoteWidget, k as PRESET_REGISTRY, o as applyRounding, S as calculateQuote, m as createQuoteWidget, c as emitAnalyticsEvent, n as evaluateCondition, l as extractAttribution, e as formatCurrency, s as generateCssVariables, x as generateQuoteId, g as getDeviceType, E as getPreset, p as getReferringDomain, f as getShadowStyles, w as hvacPreset, T as plumbingPreset, M as registerWebComponent, y as resolveTheme, D as roofingPreset, r as sanitizeInput, O as softwarePreset, d as trackCtaClicked, u as trackLeadSubmitted, i as trackQuoteCalculated, b as trackQuoteViewed, C as trackStepCompleted, t as validateField };
