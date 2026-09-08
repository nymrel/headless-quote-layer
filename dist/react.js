import { C as e, D as t, E as n, S as r, T as i, _ as a, a as o, b as s, c, d as l, f as u, g as d, h as f, i as p, l as m, m as h, o as g, p as _, r as v, s as y, t as b, u as x, v as S, w as C, x as w, y as T } from "./QuoteWidget-C1EZZYjo.js";
import { useCallback as E, useEffect as D, useRef as O, useState as k } from "react";
import { jsx as A } from "react/jsx-runtime";
//#region src/components/ReactQuoteWidget.tsx
var j = ({ schema: e, initialState: t, theme: n, sourceLabel: r, webhookUrl: i, useShadowDom: a = !0, onCalculate: o, onStepChange: s, onSubmit: c, onError: l, className: u, style: d }) => {
	let f = O(null), p = O(null);
	return D(() => {
		if (!f.current) return;
		let u = n ? {
			...e,
			theme: {
				...e.theme,
				...n
			}
		} : e, d = new b(f.current, {
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
	]), /* @__PURE__ */ A("div", {
		ref: f,
		className: `nymrel-quote-widget-root ${u || ""}`.trim(),
		style: d
	});
};
function M(e, r) {
	let [i, a] = k(() => {
		let t = {};
		return e.steps.forEach((e) => {
			e.fields.forEach((e) => {
				e.defaultValue !== void 0 && (t[e.id] = e.defaultValue);
			});
		}), {
			...t,
			...r
		};
	}), [o, s] = k(0), [c, l] = k(() => w(e, i)), [f, m] = k({}), [h, g] = k(!1), [_, y] = k(!1), [b, x] = k(null), [S, C] = k(null);
	return D(() => {
		let t = w(e, i);
		l(t);
	}, [e, i]), {
		quote: c,
		formState: i,
		currentStepIndex: o,
		fieldErrors: f,
		isSubmitting: h,
		isSubmitted: _,
		lastSubmission: b,
		deliveryReceipt: S,
		updateField: E((e, t) => {
			a((r) => ({
				...r,
				[e]: n(t)
			})), m((t) => {
				let n = { ...t };
				return delete n[e], n;
			});
		}, []),
		nextStep: E(() => {
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
		prevStep: E(() => {
			o > 0 && s((e) => e - 1);
		}, [o]),
		submitLead: E(async (t, r = {}) => {
			g(!0);
			let a = u({ sourceLabel: r.sourceLabel }), o = {
				quoteId: c.quoteId,
				schemaId: e.id,
				schemaName: e.name,
				quote: c,
				formState: i,
				lead: {
					name: n(t.name),
					email: n(t.email),
					phone: n(t.phone || ""),
					address: n(t.address || ""),
					zipCode: n(t.zipCode || ""),
					preferredDate: n(t.preferredDate || ""),
					preferredTime: n(t.preferredTime || ""),
					notes: n(t.notes || "")
				},
				attribution: a,
				submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
				metadata: e.metadata
			};
			if (r.webhookUrl) {
				let e = await p(r.webhookUrl, o);
				(e.status === "rejected" || e.status === "failed") && console.warn("[useQuoteEngine] Webhook delivery notice:", e.message), o.delivery = e;
			} else o.delivery = v();
			return d(e.id, o.quoteId, c.target, o.lead.email), g(!1), y(!0), x(o), C(o.delivery ?? null), o;
		}, [
			e,
			c,
			i
		]),
		reset: E(() => {
			let t = {};
			e.steps.forEach((e) => {
				e.fields.forEach((e) => {
					e.defaultValue !== void 0 && (t[e.id] = e.defaultValue);
				});
			}), a({
				...t,
				...r
			}), s(0), y(!1), g(!1), x(null), C(null), m({});
		}, [e, r])
	};
}
//#endregion
export { o as DARK_THEME, g as DEFAULT_WARM_THEME, y as LIGHT_THEME, j as QuoteWidget, s as applyRounding, w as calculateQuote, l as emitAnalyticsEvent, r as evaluateCondition, u as extractAttribution, e as formatCurrency, c as generateCssVariables, C as generateQuoteId, _ as getDeviceType, h as getReferringDomain, m as getShadowStyles, i as isValidEmail, x as resolveTheme, n as sanitizeInput, f as trackCtaClicked, d as trackLeadSubmitted, a as trackQuoteCalculated, S as trackQuoteViewed, T as trackStepCompleted, M as useQuoteEngine, t as validateField };
