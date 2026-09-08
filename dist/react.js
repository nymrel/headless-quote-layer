import { C as e, E as t, S as n, T as r, _ as i, a, b as o, c as s, d as c, f as l, g as u, h as d, i as f, l as p, m, o as h, p as g, r as _, s as v, t as y, u as b, v as x, w as S, x as C, y as w } from "./QuoteWidget-tyza_4TZ.js";
import { useCallback as T, useEffect as E, useRef as D, useState as O } from "react";
import { jsx as k } from "react/jsx-runtime";
//#region src/components/ReactQuoteWidget.tsx
var A = ({ schema: e, initialState: t, theme: n, sourceLabel: r, webhookUrl: i, useShadowDom: a = !0, onCalculate: o, onStepChange: s, onSubmit: c, onError: l, className: u, style: d }) => {
	let f = D(null), p = D(null);
	return E(() => {
		if (!f.current) return;
		let u = n ? {
			...e,
			theme: {
				...e.theme,
				...n
			}
		} : e, d = new y(f.current, {
			schema: u,
			initialState: t,
			sourceLabel: r,
			webhookUrl: i,
			useShadowDom: a,
			callbacks: {
				onCalculate: o,
				onStepChange: s,
				onSubmit: c,
				onError: l
			}
		});
		return p.current = d, () => {
			p.current = null, f.current && (f.current.innerHTML = "");
		};
	}, [
		e,
		n,
		r,
		i,
		a
	]), /* @__PURE__ */ k("div", {
		ref: f,
		className: `nymrel-quote-widget-root ${u || ""}`.trim(),
		style: d
	});
};
function j(e, n) {
	let [i, a] = O(() => {
		let t = {};
		return e.steps.forEach((e) => {
			e.fields.forEach((e) => {
				e.defaultValue !== void 0 && (t[e.id] = e.defaultValue);
			});
		}), {
			...t,
			...n
		};
	}), [o, s] = O(0), [c, d] = O(() => C(e, i)), [p, m] = O({}), [h, g] = O(!1), [v, y] = O(!1), [b, x] = O(null), [S, w] = O(null);
	return E(() => {
		let t = C(e, i);
		d(t);
	}, [e, i]), {
		quote: c,
		formState: i,
		currentStepIndex: o,
		fieldErrors: p,
		isSubmitting: h,
		isSubmitted: v,
		lastSubmission: b,
		deliveryReceipt: S,
		updateField: T((e, t) => {
			a((n) => ({
				...n,
				[e]: r(t)
			})), m((t) => {
				let n = { ...t };
				return delete n[e], n;
			});
		}, []),
		nextStep: T(() => {
			let n = e.steps[o];
			if (!n) return !1;
			let r = !1, a = {};
			for (let e of n.fields) {
				let n = t(e, i[e.id]);
				n.valid || (a[e.id] = n.error || "Invalid value", r = !0);
			}
			return r ? (m(a), !1) : o < e.steps.length && (s((e) => e + 1), !0);
		}, [
			e,
			o,
			i
		]),
		prevStep: T(() => {
			o > 0 && s((e) => e - 1);
		}, [o]),
		submitLead: T(async (t, n = {}) => {
			g(!0);
			let a = l({ sourceLabel: n.sourceLabel }), o = {
				quoteId: c.quoteId,
				schemaId: e.id,
				schemaName: e.name,
				quote: c,
				formState: i,
				lead: {
					name: r(t.name),
					email: r(t.email),
					phone: r(t.phone || ""),
					address: r(t.address || ""),
					zipCode: r(t.zipCode || ""),
					preferredDate: r(t.preferredDate || ""),
					preferredTime: r(t.preferredTime || ""),
					notes: r(t.notes || "")
				},
				attribution: a,
				submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
				metadata: e.metadata
			};
			if (n.webhookUrl) {
				let e = await f(n.webhookUrl, o);
				(e.status === "rejected" || e.status === "failed") && console.warn("[useQuoteEngine] Webhook delivery notice:", e.message), o.delivery = e;
			} else o.delivery = _();
			return u(e.id, o.quoteId, c.target, o.lead.email), g(!1), y(!0), x(o), w(o.delivery ?? null), o;
		}, [
			e,
			c,
			i
		]),
		reset: T(() => {
			let t = {};
			e.steps.forEach((e) => {
				e.fields.forEach((e) => {
					e.defaultValue !== void 0 && (t[e.id] = e.defaultValue);
				});
			}), a({
				...t,
				...n
			}), s(0), y(!1), g(!1), x(null), w(null), m({});
		}, [e, n])
	};
}
//#endregion
export { a as DARK_THEME, h as DEFAULT_WARM_THEME, v as LIGHT_THEME, A as QuoteWidget, o as applyRounding, C as calculateQuote, c as emitAnalyticsEvent, n as evaluateCondition, l as extractAttribution, e as formatCurrency, s as generateCssVariables, S as generateQuoteId, g as getDeviceType, m as getReferringDomain, p as getShadowStyles, b as resolveTheme, r as sanitizeInput, d as trackCtaClicked, u as trackLeadSubmitted, i as trackQuoteCalculated, x as trackQuoteViewed, w as trackStepCompleted, j as useQuoteEngine, t as validateField };
