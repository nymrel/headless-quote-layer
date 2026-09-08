//#region src/core/engine.ts
function e(e, t) {
	if (e == null || e === "" || typeof e == "boolean") throw RangeError(`${t} must be a finite number.`);
	let n;
	try {
		n = Number(e);
	} catch {
		throw RangeError(`${t} must be a finite number.`);
	}
	if (!Number.isFinite(n)) throw RangeError(`${t} must be a finite number.`);
	return n;
}
function t(t, n) {
	let r = e(t, n);
	if (r < 0) throw RangeError(`${n} must be greater than or equal to zero.`);
	return r;
}
function n(t, n) {
	let r = e(t, n);
	if (r <= 0) throw RangeError(`${n} must be greater than zero.`);
	return r;
}
function r(e, n, r, i) {
	if (t(e, `${i}.min`), t(n, `${i}.target`), t(r, `${i}.max`), e > n || n > r) throw RangeError(`${i} must satisfy 0 <= min <= target <= max.`);
}
function i(t, n) {
	for (let r of t) e(r.amount, `${n} breakdown item "${r.id}" amount`);
}
function a(r) {
	for (let i of r) {
		let r = `Field "${i.id}"`;
		if (i.min !== void 0 && e(i.min, `${r} min`), i.max !== void 0 && e(i.max, `${r} max`), i.step !== void 0 && n(i.step, `${r} step`), i.min !== void 0 && i.max !== void 0 && i.min > i.max) throw RangeError(`${r} must satisfy min <= max.`);
		i.unitPrice !== void 0 && t(i.unitPrice, `${r} unitPrice`), i.multiplier !== void 0 && n(i.multiplier, `${r} multiplier`);
		for (let t of i.options || []) {
			let r = `Option "${i.id}.${t.id}"`;
			t.adder !== void 0 && e(t.adder, `${r} adder`), t.multiplier !== void 0 && n(t.multiplier, `${r} multiplier`);
		}
	}
}
function o(e = "NYM") {
	let t = /* @__PURE__ */ new Date();
	return `${e}-${t.getFullYear()}${String(t.getMonth() + 1).padStart(2, "0")}${String(t.getDate()).padStart(2, "0")}-${Array.from(globalThis.crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6)), (e) => (e % 36).toString(36)).join("").toUpperCase()}`;
}
function s(t, n = "USD", r = "$", i = 0) {
	let a = e(t, "Currency amount"), o = (i > 0 ? a.toFixed(i) : Math.round(a).toString()).split(".");
	return o[0] = o[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","), `${r}${o.join(".")}`;
}
function c(t) {
	if (t == null) return t;
	if (typeof t == "string") {
		let e = "", n = !1, r = !1;
		for (let i = 0; i < t.length; i += 1) {
			let a = t[i];
			if (a === "<") {
				let e = t.slice(i, i + 7).toLowerCase() === "<script", a = t.slice(i, i + 8).toLowerCase() === "<\/script", o = t[i + (a ? 8 : 7)];
				(e || a) && (o === ">" || /\s/u.test(o || "")) && (r = e), n = !0;
			} else a === ">" ? n = !1 : !n && !r && (e += a);
		}
		return e.trim();
	}
	return typeof t == "number" ? e(t, "Numeric input") : Array.isArray(t) ? t.map(c) : t;
}
function l(e, t) {
	if (!e || !e.fieldId) return !0;
	let n = t[e.fieldId];
	switch (e.operator) {
		case "equals": return n === e.value || String(n) === String(e.value);
		case "notEquals": return n !== e.value && String(n) !== String(e.value);
		case "greaterThan": return Number(n) > Number(e.value);
		case "lessThan": return Number(n) < Number(e.value);
		case "in": return Array.isArray(e.value) ? e.value.includes(n) : !1;
		case "contains": return Array.isArray(n) ? n.includes(e.value) : typeof n == "string" && n.includes(String(e.value));
		default: return !0;
	}
}
function u(e) {
	if (typeof e != "string") return !1;
	let t = e;
	if (!t || t.length > 254 || /\s/u.test(t)) return !1;
	let n = t.indexOf("@"), r = t.slice(n + 1), i = r.lastIndexOf(".");
	return n > 0 && n === t.lastIndexOf("@") && i > 0 && i < r.length - 1;
}
function d(e, t) {
	if (e.required && (t == null || t === "" || Array.isArray(t) && t.length === 0)) return {
		valid: !1,
		error: `${e.label} is required.`
	};
	if (t != null && t !== "") {
		if (e.type === "number" || e.type === "slider" || e.type === "stepper") {
			let n;
			try {
				n = Number(t);
			} catch {
				return {
					valid: !1,
					error: `${e.label} must be a valid finite number.`
				};
			}
			if (!Number.isFinite(n)) return {
				valid: !1,
				error: `${e.label} must be a valid finite number.`
			};
			if (e.min !== void 0 && n < e.min) return {
				valid: !1,
				error: `Minimum value is ${e.min} ${e.unit || ""}`.trim()
			};
			if (e.max !== void 0 && n > e.max) return {
				valid: !1,
				error: `Maximum value is ${e.max} ${e.unit || ""}`.trim()
			};
		}
		if (e.type === "email" && !u(t)) return {
			valid: !1,
			error: "Please enter a valid email address."
		};
		if (e.type === "phone") {
			let e = String(t).replace(/[\s()\-\.]/g, "");
			if (e.length < 7 || !/^\+?[0-9]{7,15}$/.test(e)) return {
				valid: !1,
				error: "Please enter a valid phone number."
			};
		}
	}
	return { valid: !0 };
}
function f(t, n) {
	if (e(t, "Rounding amount"), !n || n === "none") return t;
	switch (n) {
		case "round": return Math.round(t);
		case "ceil": return Math.ceil(t);
		case "floor": return Math.floor(t);
		case "nearest10": return Math.round(t / 10) * 10;
		case "nearest50": return Math.round(t / 50) * 50;
		case "nearest100": return Math.round(t / 100) * 100;
		default: return t;
	}
}
function p(c, u) {
	let p = c.pricing?.currency || "USD", m = c.pricing?.currencySymbol || "$", h = c.pricing || {}, g = u._quoteId || o(), _ = [];
	if (c.steps.forEach((e) => {
		e.fields.forEach((e) => {
			_.push(e);
		});
	}), a(_), h.formula === "custom" && typeof h.customFormula == "function") {
		let e = h.customFormula(u, _);
		r(e.min, e.target, e.max, "Custom quote result");
		let t = e.breakdown || [];
		i(t, "Custom quote result");
		let n = f(e.target, h.rounding), a = f(e.min, h.rounding), o = f(e.max, h.rounding);
		return r(a, n, o, "Custom quote result"), {
			min: a,
			max: o,
			target: n,
			formattedMin: s(a, p, m),
			formattedMax: s(o, p, m),
			formattedTarget: s(n, p, m),
			currency: p,
			currencySymbol: m,
			breakdown: t,
			recommendations: [],
			calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			quoteId: g
		};
	}
	let v = h.baseFee === void 0 ? "pricing.baseCalloutFee" : "pricing.baseFee", y = t(h.baseFee ?? h.baseCalloutFee ?? 0, v), b = t(h.taxRate ?? 0, "pricing.taxRate"), x = t(h.marginPercent ?? 10, "pricing.marginPercent") / 100, S = t(h.minRangeSpreadPercent ?? x * 100, "pricing.minRangeSpreadPercent") / 100, C = t(h.maxRangeSpreadPercent ?? x * 100, "pricing.maxRangeSpreadPercent") / 100, w = 0, T = 0, E = 0, D = 1, O = [], k = [];
	y > 0 && O.push({
		id: "base-fee",
		label: "Base Callout / Setup Fee",
		amount: y,
		formattedAmount: s(y, p, m),
		type: "base",
		description: "Standard initial mobilization and inspection base"
	});
	for (let r of _) {
		if (!l(r.condition, u)) continue;
		let i = u[r.id] === void 0 ? r.defaultValue : u[r.id];
		if (i != null && i !== "") {
			if (r.type === "number" || r.type === "slider" || r.type === "stepper") {
				let a = t(i, `Field "${r.id}" value`), o = d(r, a);
				if (!o.valid) throw RangeError(`Field "${r.id}" is invalid: ${o.error}`);
				let c = r.unitPrice === void 0 ? void 0 : t(r.unitPrice, `Field "${r.id}" unitPrice`), l = r.multiplier === void 0 ? void 0 : n(r.multiplier, `Field "${r.id}" multiplier`);
				if (a > 0) {
					if (c !== void 0 && c > 0) {
						let t = e(a * c, `Field "${r.id}" item cost`);
						r.category === "material" ? w = e(w + t, "Material subtotal") : T = e(T + t, "Labor subtotal"), O.push({
							id: r.id,
							label: `${r.label} (${a} ${r.unit || "units"} @ ${s(c, p, m)}/${r.unit || "unit"})`,
							amount: t,
							formattedAmount: s(t, p, m),
							type: r.category === "material" ? "material" : "labor"
						});
					}
					l !== void 0 && l !== 1 && (D = n(D * l, "Composite multiplier"));
				}
			}
			if ((r.type === "select" || r.type === "radio" || r.type === "toggle") && r.options && r.options.length > 0) {
				let t = r.options.find((e) => String(e.id) === String(i) || String(e.value) === String(i));
				if (t) {
					let i = t.adder === void 0 ? void 0 : e(t.adder, `Option "${r.id}.${t.id}" adder`);
					i !== void 0 && i !== 0 && (E = e(E + i, "Add-on subtotal"), O.push({
						id: `${r.id}-${t.id}`,
						label: `${r.label}: ${t.label}`,
						amount: i,
						formattedAmount: s(i, p, m),
						type: r.category === "material" ? "material" : "addon",
						description: t.description
					}));
					let a = t.multiplier === void 0 ? void 0 : n(t.multiplier, `Option "${r.id}.${t.id}" multiplier`);
					a !== void 0 && a !== 1 && (D = n(D * a, "Composite multiplier"), O.push({
						id: `${r.id}-${t.id}-mult`,
						label: `${t.label} Factor (${a}x)`,
						amount: 0,
						formattedAmount: `${a}x`,
						type: "multiplier",
						description: t.description
					}));
				}
			}
			if (r.type === "checkbox") {
				if (Array.isArray(i) && r.options) for (let t of i) {
					let i = r.options.find((e) => String(e.id) === String(t) || String(e.value) === String(t));
					if (i) {
						let t = i.adder === void 0 ? void 0 : e(i.adder, `Option "${r.id}.${i.id}" adder`);
						t !== void 0 && t !== 0 && (E = e(E + t, "Add-on subtotal"), O.push({
							id: `${r.id}-${i.id}`,
							label: i.label,
							amount: t,
							formattedAmount: s(t, p, m),
							type: "addon",
							description: i.description
						}));
						let a = i.multiplier === void 0 ? void 0 : n(i.multiplier, `Option "${r.id}.${i.id}" multiplier`);
						a !== void 0 && a !== 1 && (D = n(D * a, "Composite multiplier"));
					}
				}
				else if (typeof i == "boolean" && i === !0) {
					let i = r.unitPrice === void 0 ? void 0 : t(r.unitPrice, `Field "${r.id}" unitPrice`);
					i !== void 0 && i !== 0 && (E = e(E + i, "Add-on subtotal"), O.push({
						id: r.id,
						label: r.label,
						amount: i,
						formattedAmount: s(i, p, m),
						type: "addon"
					}));
					let a = r.multiplier === void 0 ? void 0 : n(r.multiplier, `Field "${r.id}" multiplier`);
					a !== void 0 && a !== 1 && (D = n(D * a, "Composite multiplier"));
				}
			}
		}
	}
	let A = e(y + w + T + E, "Quote subtotal"), j = e(A * D, "Multiplied quote target");
	if (b > 0) {
		let t = e(j * b, "Tax amount");
		O.push({
			id: "tax",
			label: `Estimated Tax (${(b * 100).toFixed(1)}%)`,
			amount: t,
			formattedAmount: s(t, p, m),
			type: "tax"
		}), j = e(j + t, "Taxed quote target");
	}
	let M = Math.max(0, j), N = Math.max(0, e(M * (1 - S), "Minimum quote bound")), P = Math.max(M, e(M * (1 + C), "Maximum quote bound"));
	A === 0 && y === 0 && (M = 0, N = 0, P = 0);
	let F = f(M, h.rounding), I = f(N, h.rounding), L = f(P, h.rounding);
	return r(I, F, L, "Quote result"), i(O, "Quote result"), (u.pitch === "steep" || u.difficulty === "extreme" || u.urgency === "emergency") && k.push("Priority Crew Dispatch: Includes safety rigging and on-site supervisor."), F > 5e3 && k.push("Flexible Financing Available: 0% APR for 12 months on qualifying projects."), (u.material === "metal" || u.efficiency === "ultra") && k.push("Qualifies for Energy Efficiency Tax Credits & Lifetime Manufacturer Warranty."), {
		min: I,
		max: L,
		target: F,
		formattedMin: s(I, p, m),
		formattedMax: s(L, p, m),
		formattedTarget: s(F, p, m),
		currency: p,
		currencySymbol: m,
		breakdown: O,
		recommendations: k,
		calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		quoteId: g
	};
}
//#endregion
//#region src/core/attribution.ts
function m() {
	return "sess_" + Array.from(globalThis.crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
}
function h() {
	if (typeof window > "u") return "desktop";
	let e = navigator.userAgent.toLowerCase(), t = window.innerWidth || 1024;
	return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(e) || t >= 768 && t <= 1024 ? "tablet" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(e) || t < 768 ? "mobile" : "desktop";
}
function g(e) {
	if (!e) return "";
	try {
		return new URL(e).hostname;
	} catch {
		return "";
	}
}
function _(e = {}) {
	let t = typeof window < "u", n = t ? new URLSearchParams(window.location.search) : new URLSearchParams(), r = t && document.referrer || "", i = t && window.location.href || "", a = t && document.title || "", o = t && navigator.userAgent || "", s = e.customSessionId || "";
	if (!s && t) {
		let t = e.storageKey || "nymrel_quote_session_id";
		try {
			s = window.sessionStorage.getItem(t) || "", s || (s = m(), window.sessionStorage.setItem(t, s));
		} catch {
			s = m();
		}
	} else s ||= m();
	return {
		utm_source: n.get("utm_source") || void 0,
		utm_medium: n.get("utm_medium") || void 0,
		utm_campaign: n.get("utm_campaign") || void 0,
		utm_term: n.get("utm_term") || void 0,
		utm_content: n.get("utm_content") || void 0,
		gclid: n.get("gclid") || void 0,
		fbclid: n.get("fbclid") || void 0,
		msclkid: n.get("msclkid") || void 0,
		ttclid: n.get("ttclid") || void 0,
		li_fat_id: n.get("li_fat_id") || void 0,
		referrer: r,
		referring_domain: g(r),
		landing_page: i,
		page_title: a,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		source_label: e.sourceLabel,
		session_id: s,
		device_type: h(),
		userAgent: o
	};
}
function v(e, t = {}, n = {}) {
	if (typeof window > "u") return;
	let r = n.pushToDataLayer !== !1, i = n.useGtag !== !1, a = n.dispatchDomEvent !== !1, o = `${n.prefix || "nymrel_quote"}_${e}`, s = {
		event: o,
		...t,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (r) {
		let e = window;
		e.dataLayer = e.dataLayer || [], e.dataLayer.push(s);
	}
	if (i) {
		let e = window;
		typeof e.gtag == "function" && e.gtag("event", o, t);
	}
	if (a) try {
		let e = new CustomEvent(o, {
			bubbles: !0,
			cancelable: !0,
			detail: s
		});
		window.dispatchEvent(e);
	} catch {}
}
function y(e, t) {
	v("viewed", {
		schemaId: e,
		...t
	});
}
function b(e, t, n, r) {
	v("step_completed", {
		schemaId: e,
		stepIndex: t,
		stepTitle: n,
		timeSpentMs: r
	});
}
function x(e, t, n, r, i) {
	v("calculated", {
		schemaId: e,
		target: t,
		min: n,
		max: r,
		quoteId: i
	});
}
function S(e, t, n, r) {
	v("lead_submitted", {
		schemaId: e,
		quoteId: t,
		value: n,
		currency: "USD",
		hasEmail: !!r
	});
}
function C(e, t, n) {
	v("cta_clicked", {
		schemaId: e,
		ctaName: t,
		quoteId: n
	});
}
//#endregion
//#region src/components/WarmTheme.ts
var w = {
	mode: "warm",
	fontFamily: "-apple-system, BlinkMacSystemFont, \"Plus Jakarta Sans\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif",
	primaryColor: "#2A332E",
	accentColor: "#A8541F",
	accentHoverColor: "#8E4316",
	backgroundColor: "#FAF8F2",
	surfaceColor: "#F4F0E6",
	cardColor: "#FFFFFF",
	textColor: "#2A332E",
	mutedTextColor: "#637069",
	borderColor: "#E2DCCE",
	borderRadius: "14px",
	boxShadow: "0 8px 30px -4px rgba(42, 51, 46, 0.08), 0 2px 8px -2px rgba(42, 51, 46, 0.04)",
	focusRingColor: "rgba(168, 84, 31, 0.28)"
}, T = {
	mode: "light",
	fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
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
}, E = {
	mode: "dark",
	fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
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
function D(e) {
	return {
		...e?.mode === "dark" ? E : e?.mode === "light" ? T : w,
		...e
	};
}
function O(e) {
	return `
    --nym-font: ${e.fontFamily};
    --nym-primary: ${e.primaryColor};
    --nym-accent: ${e.accentColor};
    --nym-accent-hover: ${e.accentHoverColor};
    --nym-bg: ${e.backgroundColor};
    --nym-surface: ${e.surfaceColor};
    --nym-card: ${e.cardColor};
    --nym-text: ${e.textColor};
    --nym-muted: ${e.mutedTextColor};
    --nym-border: ${e.borderColor};
    --nym-radius: ${e.borderRadius};
    --nym-shadow: ${e.boxShadow};
    --nym-focus: ${e.focusRingColor};
    --nym-success: #2E6B4F;
    --nym-error: #B83A2C;
  `;
}
function k(e) {
	return `
    :host {
      display: block;
      box-sizing: border-box;
      font-family: var(--nym-font);
      color: var(--nym-text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      ${O(D(e))}
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
//#endregion
//#region src/core/lead-delivery.ts
function A(e = (/* @__PURE__ */ new Date()).toISOString()) {
	return {
		status: "not_configured",
		channel: "none",
		attemptedAt: e,
		message: "Local capture only: no delivery destination is configured, so nothing was sent."
	};
}
function j(e = (/* @__PURE__ */ new Date()).toISOString()) {
	return {
		status: "callback_only",
		channel: "callback",
		attemptedAt: e,
		message: "Captured locally and handed to this page. No external delivery was attempted."
	};
}
async function M(e, t) {
	let n = (/* @__PURE__ */ new Date()).toISOString();
	try {
		let r = await fetch(e, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Nymrel-Quote-Id": t.quoteId
			},
			body: JSON.stringify(t)
		});
		return r.ok ? {
			status: "accepted",
			channel: "webhook",
			attemptedAt: n,
			httpStatus: r.status,
			ok: !0,
			message: "Your quote was accepted by the destination."
		} : {
			status: "rejected",
			channel: "webhook",
			attemptedAt: n,
			httpStatus: r.status,
			ok: !1,
			message: `Delivery failed: the destination declined this quote (HTTP ${r.status}). Your quote is shown below for your records.`
		};
	} catch {
		return {
			status: "failed",
			channel: "webhook",
			attemptedAt: n,
			ok: !1,
			message: "Delivery failed: could not reach the destination. Your quote is shown below for your records."
		};
	}
}
function N(e) {
	return e ? e.message : A().message;
}
//#endregion
//#region src/components/QuoteWidget.ts
function P(e) {
	return e == null ? "" : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
var F = class {
	container;
	schema;
	callbacks;
	formState = {};
	currentStepIndex = 0;
	currentQuote;
	showBreakdownModal = !1;
	isSubmitted = !1;
	isSubmitting = !1;
	lastSubmission = null;
	lastDeliveryReceipt = null;
	sourceLabel;
	webhookUrl;
	fieldErrors = {};
	stepStartTime = Date.now();
	constructor(e, t) {
		this.schema = t.schema, this.callbacks = t.callbacks || {}, this.sourceLabel = t.sourceLabel || this.schema.sourceLabel, this.webhookUrl = t.webhookUrl || this.schema.webhookUrl, this.schema.steps.forEach((e) => {
			e.fields.forEach((e) => {
				e.defaultValue !== void 0 && (this.formState[e.id] = e.defaultValue);
			});
		}), t.initialState && (this.formState = {
			...this.formState,
			...t.initialState
		}), this.container = t.useShadowDom !== !1 && e.attachShadow ? e.shadowRoot ? e.shadowRoot : e.attachShadow({ mode: "open" }) : e, this.currentQuote = p(this.schema, this.formState), y(this.schema.id, { sourceLabel: this.sourceLabel }), this.render();
	}
	updateState(e, t) {
		this.formState[e] = c(t), delete this.fieldErrors[e], this.recalculate();
	}
	recalculate() {
		return this.currentQuote = p(this.schema, this.formState), x(this.schema.id, this.currentQuote.target, this.currentQuote.min, this.currentQuote.max, this.currentQuote.quoteId), this.callbacks.onCalculate && this.callbacks.onCalculate(this.currentQuote, this.formState), this.render(), this.currentQuote;
	}
	nextStep() {
		if (!this.isLeadFormStep()) {
			let e = this.schema.steps[this.currentStepIndex], t = !1;
			this.fieldErrors = {};
			for (let n of e.fields) {
				if (!l(n.condition, this.formState)) continue;
				let e = d(n, this.formState[n.id]);
				e.valid || (this.fieldErrors[n.id] = e.error || "Invalid value", t = !0);
			}
			if (t) return this.render(), !1;
			let n = Date.now() - this.stepStartTime;
			if (b(this.schema.id, this.currentStepIndex, e.title, n), this.currentStepIndex < this.schema.steps.length - 1) return this.currentStepIndex++, this.stepStartTime = Date.now(), this.callbacks.onStepChange && this.callbacks.onStepChange(this.currentStepIndex, this.schema.steps[this.currentStepIndex]), this.render(), !0;
			if (this.isLeadFormEnabled()) return this.currentStepIndex++, this.stepStartTime = Date.now(), this.render(), !0;
		}
		return !1;
	}
	prevStep() {
		this.currentStepIndex > 0 && (this.currentStepIndex--, this.stepStartTime = Date.now(), this.callbacks.onStepChange && this.currentStepIndex < this.schema.steps.length && this.callbacks.onStepChange(this.currentStepIndex, this.schema.steps[this.currentStepIndex]), this.render());
	}
	isLeadFormEnabled() {
		return this.schema.leadForm?.enabled !== !1;
	}
	isLeadFormStep() {
		return this.isLeadFormEnabled() && this.currentStepIndex === this.schema.steps.length;
	}
	getTotalStepsCount() {
		return this.schema.steps.length + +!!this.isLeadFormEnabled();
	}
	async submitLead(e) {
		let t = this.schema.leadForm;
		if (this.fieldErrors = {}, (!e.name || String(e.name).trim() === "") && (this.fieldErrors.lead_name = "Full Name is required."), u(e.email) || (this.fieldErrors.lead_email = "A valid email address is required."), t?.requirePhone && (!e.phone || !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(String(e.phone))) && (this.fieldErrors.lead_phone = "Phone number is required."), t?.requireAddress && !e.address && (this.fieldErrors.lead_address = "Street address or zip code is required."), Object.keys(this.fieldErrors).length > 0) return this.render(), null;
		this.isSubmitting = !0, this.render();
		let n = _({ sourceLabel: this.sourceLabel }), r = {
			quoteId: this.currentQuote.quoteId,
			schemaId: this.schema.id,
			schemaName: this.schema.name,
			quote: this.currentQuote,
			formState: { ...this.formState },
			lead: {
				name: c(e.name),
				email: c(e.email),
				phone: c(e.phone || ""),
				address: c(e.address || ""),
				zipCode: c(e.zipCode || ""),
				preferredDate: c(e.preferredDate || ""),
				preferredTime: c(e.preferredTime || ""),
				notes: c(e.notes || "")
			},
			attribution: n,
			submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
			metadata: this.schema.metadata
		};
		try {
			if (this.webhookUrl) {
				let e = await M(this.webhookUrl, r);
				(e.status === "rejected" || e.status === "failed") && console.warn("[NymrelQuote] Webhook delivery notice:", e.message), r.delivery = e;
			} else r.delivery = this.callbacks.onSubmit ? j() : A();
			if (this.callbacks.onSubmit) try {
				await this.callbacks.onSubmit(r);
			} catch (e) {
				r.localHandlingFailed = !0, r.delivery?.channel === "callback" && (r.delivery = {
					...r.delivery,
					status: "failed",
					ok: !1,
					message: "The page handler failed. No external delivery was attempted by the widget. Your quote is shown below."
				});
				try {
					this.callbacks.onError?.(e);
				} catch {}
			}
			try {
				S(this.schema.id, r.quoteId, this.currentQuote.target, r.lead.email);
			} catch {}
			return this.isSubmitting = !1, this.isSubmitted = !0, this.lastSubmission = r, this.lastDeliveryReceipt = r.delivery ?? null, this.render(), r;
		} catch (e) {
			return this.isSubmitting = !1, this.callbacks.onError && this.callbacks.onError(e), this.fieldErrors._global = "Submission failed. Please check your connection and try again.", this.render(), null;
		}
	}
	getLastDeliveryReceipt() {
		return this.lastDeliveryReceipt;
	}
	reset() {
		this.formState = {}, this.schema.steps.forEach((e) => {
			e.fields.forEach((e) => {
				e.defaultValue !== void 0 && (this.formState[e.id] = e.defaultValue);
			});
		}), this.currentStepIndex = 0, this.isSubmitted = !1, this.isSubmitting = !1, this.lastSubmission = null, this.lastDeliveryReceipt = null, this.fieldErrors = {}, this.recalculate();
	}
	printReceipt() {
		typeof window < "u" && window.print();
	}
	render() {
		let e = k(this.schema.theme), t = "";
		t = this.isSubmitted && this.lastSubmission ? this.renderSuccessScreen(this.lastSubmission) : this.isLeadFormStep() ? this.renderLeadFormStep() : this.renderStepForm(this.schema.steps[this.currentStepIndex]);
		let n = this.showBreakdownModal ? this.renderBreakdownModal() : "", r = `
      <style>${e}</style>
      <div class="nym-container" role="region" aria-label="${P(this.schema.name)}">
        <!-- Header -->
        <header class="nym-header">
          <div class="nym-header-content">
            <h2>${P(this.schema.name)}</h2>
            ${this.schema.description ? `<p>${P(this.schema.description)}</p>` : ""}
          </div>
          ${this.schema.badge ? `<span class="nym-badge">${P(this.schema.badge)}</span>` : ""}
        </header>

        <!-- Live Reactive Range Banner -->
        <div class="nym-range-banner">
          <div class="nym-range-info">
            <span class="nym-range-label">Instant Estimated Range</span>
            <div class="nym-range-values">
              <span class="nym-range-amount">${P(this.currentQuote.formattedMin)}</span>
              <span class="nym-range-separator">&ndash;</span>
              <span class="nym-range-amount">${P(this.currentQuote.formattedMax)}</span>
            </div>
            <span class="nym-range-target">Baseline Target: <strong>${P(this.currentQuote.formattedTarget)}</strong></span>
          </div>
          <button type="button" class="nym-btn-breakdown" id="nym-toggle-breakdown" aria-label="View cost breakdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            Itemized Breakdown
          </button>
        </div>

        <!-- Stepper Progress Dots -->
        <div class="nym-stepper" aria-label="Quote Progress">
          ${Array.from({ length: this.getTotalStepsCount() }).map((e, t) => {
			let n = "nym-step-dot";
			return t === this.currentStepIndex && (n += " active"), t < this.currentStepIndex && (n += " completed"), `<div class="${n}"></div>`;
		}).join("")}
        </div>
        <div class="nym-step-legend">
          <span>Step ${this.currentStepIndex + 1} of ${this.getTotalStepsCount()}</span>
          <span>${this.isLeadFormStep() ? "Lead Contact & Booking" : P(this.schema.steps[this.currentStepIndex]?.title || "")}</span>
        </div>

        <!-- Main Step Form Content -->
        ${t}

        <!-- Recommendations Box if available -->
        ${this.currentQuote.recommendations.length > 0 && !this.isSubmitted ? `
          <div class="nym-recommendations">
            ${this.currentQuote.recommendations.map((e) => `
              <div class="nym-recommendation-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${P(e)}</span>
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
        ${n}
      </div>
    `;
		this.container.innerHTML = r, this.attachEventListeners();
	}
	renderStepForm(e) {
		let t = this.currentStepIndex === 0;
		return `
      <div class="nym-step-view">
        <h3 class="nym-step-title">${P(e.title)}</h3>
        ${e.subtitle ? `<p class="nym-step-subtitle">${P(e.subtitle)}</p>` : ""}

        <div class="nym-fields-list">
          ${e.fields.map((e) => this.renderField(e)).join("")}
        </div>

        <div class="nym-footer">
          ${t ? "<div></div>" : "\n            <button type=\"button\" class=\"nym-btn nym-btn-secondary\" id=\"nym-btn-prev\">\n              &larr; Back\n            </button>\n          "}
          <button type="button" class="nym-btn nym-btn-primary" id="nym-btn-next">
            ${this.currentStepIndex === this.schema.steps.length - 1 && !this.isLeadFormEnabled() ? "Finish Quote" : "Continue &rarr;"}
          </button>
        </div>
      </div>
    `;
	}
	renderField(e) {
		if (!l(e.condition, this.formState)) return "";
		let t = this.formState[e.id] === void 0 ? e.defaultValue ?? "" : this.formState[e.id], n = this.fieldErrors[e.id], r = "";
		switch (e.type) {
			case "slider": {
				let n = e.min ?? 100, i = e.max ?? 5e3, a = e.step ?? 50, o = Number(t) || n;
				r = `
          <div class="nym-slider-container">
            <div class="nym-slider-header">
              <span class="nym-slider-ticks">${n} ${e.unit || ""}</span>
              <span class="nym-slider-val" id="val-${e.id}">${o} ${e.unit || ""}</span>
              <span class="nym-slider-ticks">${i} ${e.unit || ""}</span>
            </div>
            <input
              type="range"
              class="nym-slider nym-reactive-input"
              data-field-id="${e.id}"
              min="${n}"
              max="${i}"
              step="${a}"
              value="${o}"
              aria-label="${P(e.label)}"
            />
          </div>
        `;
				break;
			}
			case "select":
				r = `
          <select class="nym-select nym-reactive-input" data-field-id="${e.id}" aria-label="${P(e.label)}">
            ${e.options?.map((e) => `
              <option value="${P(e.id)}" ${String(t) === String(e.id) ? "selected" : ""}>
                ${P(e.label)} ${e.adder ? `(+${this.currentQuote.currencySymbol}${e.adder})` : ""} ${e.multiplier ? `(${e.multiplier}x)` : ""}
              </option>
            `).join("")}
          </select>
        `;
				break;
			case "radio":
				r = `
          <div class="nym-options-grid" role="radiogroup" aria-label="${P(e.label)}">
            ${e.options?.map((n) => {
					let r = String(t) === String(n.id);
					return `
                <div
                  class="nym-option-card ${r ? "selected" : ""}"
                  data-field-id="${e.id}"
                  data-option-id="${P(n.id)}"
                  role="radio"
                  aria-checked="${r}"
                  tabindex="0"
                >
                  <div class="nym-option-header">
                    <span class="nym-option-title">${P(n.label)}</span>
                    ${n.badge ? `<span class="nym-option-badge">${P(n.badge)}</span>` : ""}
                  </div>
                  ${n.description ? `<p class="nym-option-desc">${P(n.description)}</p>` : ""}
                  ${n.adder || n.multiplier ? `
                    <div class="nym-option-price">
                      ${n.adder ? `+${this.currentQuote.currencySymbol}${n.adder}` : ""}
                      ${n.multiplier ? `${n.multiplier}x multiplier` : ""}
                    </div>
                  ` : ""}
                </div>
              `;
				}).join("")}
          </div>
        `;
				break;
			case "checkbox": {
				let n = Array.isArray(t) ? t : [];
				r = `
          <div class="nym-checkbox-list">
            ${e.options?.map((t) => {
					let r = n.includes(t.id);
					return `
                <div
                  class="nym-checkbox-item ${r ? "checked" : ""}"
                  data-field-id="${e.id}"
                  data-checkbox-id="${P(t.id)}"
                  role="checkbox"
                  aria-checked="${r}"
                  tabindex="0"
                >
                  <div class="nym-checkbox-box">
                    ${r ? "✓" : ""}
                  </div>
                  <div class="nym-checkbox-info">
                    <div class="nym-checkbox-title">
                      <span>${P(t.label)}</span>
                      ${t.adder ? `<span>+${this.currentQuote.currencySymbol}${t.adder}</span>` : ""}
                    </div>
                    ${t.description ? `<div class="nym-checkbox-desc">${P(t.description)}</div>` : ""}
                  </div>
                </div>
              `;
				}).join("")}
          </div>
        `;
				break;
			}
			case "number":
			case "stepper":
				r = `
          <input
            type="number"
            class="nym-input nym-reactive-input"
            data-field-id="${e.id}"
            min="${e.min ?? 0}"
            max="${e.max ?? 999999}"
            step="${e.step ?? 1}"
            value="${P(t)}"
            placeholder="${e.placeholder ? P(e.placeholder) : ""}"
            aria-label="${P(e.label)}"
          />
        `;
				break;
			default: r = `
          <input
            type="text"
            class="nym-input nym-reactive-input"
            data-field-id="${e.id}"
            value="${P(t)}"
            placeholder="${e.placeholder ? P(e.placeholder) : ""}"
            aria-label="${P(e.label)}"
          />
        `;
		}
		return `
      <div class="nym-field-group">
        <label class="nym-label">
          <span>${P(e.label)}${e.required ? " *" : ""}</span>
          ${e.unit && e.type !== "slider" ? `<span class="nym-helper-text">${P(e.unit)}</span>` : ""}
        </label>
        ${r}
        ${e.helperText ? `<div class="nym-helper-text">${P(e.helperText)}</div>` : ""}
        ${n ? `<div class="nym-error-text">${P(n)}</div>` : ""}
      </div>
    `;
	}
	renderLeadFormStep() {
		let e = this.schema.leadForm, t = this.fieldErrors._global;
		return `
      <div class="nym-lead-step">
        <h3 class="nym-step-title">${P(e?.title || "Lock in Your Official Quote")}</h3>
        <p class="nym-step-subtitle">${P(e?.subtitle || "Enter your contact details to save your estimate, receive your official PDF breakdown, and schedule an on-site inspection.")}</p>

        ${t ? `<div class="nym-error-text" style="margin-bottom: 16px;">${P(t)}</div>` : ""}

        <form id="nym-lead-form">
          <div class="nym-field-group">
            <label class="nym-label">Full Name *</label>
            <input type="text" name="name" class="nym-input" required placeholder="e.g. Alex Morgan" value="${P(this.formState._lead_name || "")}" />
            ${this.fieldErrors.lead_name ? `<div class="nym-error-text">${P(this.fieldErrors.lead_name)}</div>` : ""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Email Address *</label>
            <input type="email" name="email" class="nym-input" required placeholder="alex@example.com" value="${P(this.formState._lead_email || "")}" />
            ${this.fieldErrors.lead_email ? `<div class="nym-error-text">${P(this.fieldErrors.lead_email)}</div>` : ""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Phone Number ${e?.requirePhone ? "*" : "(Optional)"}</label>
            <input type="tel" name="phone" class="nym-input" ${e?.requirePhone ? "required" : ""} placeholder="(555) 019-2834" value="${P(this.formState._lead_phone || "")}" />
            ${this.fieldErrors.lead_phone ? `<div class="nym-error-text">${P(this.fieldErrors.lead_phone)}</div>` : ""}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="nym-field-group">
              <label class="nym-label">Street Address ${e?.requireAddress ? "*" : ""}</label>
              <input type="text" name="address" class="nym-input" placeholder="123 Maple Way" value="${P(this.formState._lead_address || "")}" />
              ${this.fieldErrors.lead_address ? `<div class="nym-error-text">${P(this.fieldErrors.lead_address)}</div>` : ""}
            </div>
            <div class="nym-field-group">
              <label class="nym-label">Zip Code</label>
              <input type="text" name="zipCode" class="nym-input" placeholder="90210" value="${P(this.formState._lead_zip || "")}" />
            </div>
          </div>

          ${e?.requireDate ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nym-field-group">
                <label class="nym-label">Preferred Date</label>
                <input type="date" name="preferredDate" class="nym-input" value="${P(this.formState._lead_date || "")}" />
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

          ${e?.collectNotes === !1 ? "" : `
            <div class="nym-field-group">
              <label class="nym-label">Project Notes or Questions</label>
              <textarea name="notes" class="nym-textarea" placeholder="Tell us about specific property access, timeline goals, or special requirements...">${P(this.formState._lead_notes || "")}</textarea>
            </div>
          `}

          <div class="nym-helper-text" style="margin-bottom: 20px;">
            ${P(e?.disclaimerText || "By submitting, you agree to receive project updates and quote confirmation. We respect your privacy and never sell data.")}
          </div>

          <div class="nym-footer">
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Edit Parameters
            </button>
            <button type="submit" class="nym-btn nym-btn-primary" ${this.isSubmitting ? "disabled" : ""}>
              ${this.isSubmitting ? "Processing..." : e?.submitButtonText || "Lock In My Estimate &rarr;"}
            </button>
          </div>
        </form>
      </div>
    `;
	}
	renderSuccessScreen(e) {
		let t = this.schema.leadForm, n = e.delivery?.status === "accepted" && !e.localHandlingFailed;
		return `
      <div class="nym-success-screen">
        <div class="nym-success-icon">✓</div>
        <h3 class="nym-step-title">${P(n && t?.successTitle || "Estimate Captured Successfully!")}</h3>
        <p class="nym-step-subtitle">${P(n && t?.successMessage || "Your quote summary is below. Print or save a copy for your records.")}</p>
        ${e.localHandlingFailed ? "<p role=\"alert\">The page handler failed after capture. The delivery status below records the observed outcome.</p>" : ""}

        <div class="nym-receipt-card">
          <div class="nym-delivery-status nym-receipt-row" role="status">
            <span class="nym-receipt-key">Delivery Status:</span>
            <span class="nym-receipt-val">${P(N(this.lastDeliveryReceipt))}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Quote Reference ID:</span>
            <span class="nym-receipt-val" style="font-family: monospace;">${P(e.quoteId)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Estimated Price Range:</span>
            <span class="nym-receipt-val" style="color: var(--nym-accent); font-size: 1.05rem;">
              ${P(e.quote.formattedMin)} &ndash; ${P(e.quote.formattedMax)}
            </span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Baseline Target:</span>
            <span class="nym-receipt-val">${P(e.quote.formattedTarget)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Recipient:</span>
            <span class="nym-receipt-val">${P(e.lead.name)} (${P(e.lead.email)})</span>
          </div>
          ${e.lead.preferredDate ? `
            <div class="nym-receipt-row">
              <span class="nym-receipt-key">Requested Consultation:</span>
              <span class="nym-receipt-val">${P(e.lead.preferredDate)} (${P(e.lead.preferredTime || "Anytime")})</span>
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
                      <div class="nym-breakdown-label">${P(e.label)}</div>
                      ${e.description ? `<div class="nym-breakdown-subtext">${P(e.description)}</div>` : ""}
                    </td>
                    <td class="nym-breakdown-val">${P(e.formattedAmount)}</td>
                  </tr>
                `).join("")}
                <tr class="nym-breakdown-total">
                  <td><strong>Estimated Baseline Target</strong></td>
                  <td class="nym-breakdown-val">${P(this.currentQuote.formattedTarget)}</td>
                </tr>
                <tr>
                  <td><strong>Dynamic Estimated Range</strong></td>
                  <td class="nym-breakdown-val">${P(this.currentQuote.formattedMin)} &ndash; ${P(this.currentQuote.formattedMax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
	}
	attachEventListeners() {
		this.container.querySelectorAll(".nym-reactive-input").forEach((e) => {
			e.addEventListener("input", (e) => {
				let t = e.target, n = t.getAttribute("data-field-id");
				if (n) {
					this.updateState(n, t.value);
					let e = this.container.querySelector(`#val-${n}`);
					e && (e.textContent = `${t.value} ${t.getAttribute("data-unit") || ""}`.trim());
				}
			});
		}), this.container.querySelectorAll(".nym-option-card").forEach((e) => {
			e.addEventListener("click", () => {
				let t = e.getAttribute("data-field-id"), n = e.getAttribute("data-option-id");
				t && n && this.updateState(t, n);
			});
		}), this.container.querySelectorAll(".nym-checkbox-item").forEach((e) => {
			e.addEventListener("click", () => {
				let t = e.getAttribute("data-field-id"), n = e.getAttribute("data-checkbox-id");
				if (t && n) {
					let e = Array.isArray(this.formState[t]) ? [...this.formState[t]] : [], r = e.indexOf(n);
					r >= 0 ? e.splice(r, 1) : e.push(n), this.updateState(t, e);
				}
			});
		});
		let e = this.container.querySelector("#nym-btn-next");
		e && e.addEventListener("click", () => this.nextStep());
		let t = this.container.querySelector("#nym-btn-prev");
		t && t.addEventListener("click", () => this.prevStep());
		let n = this.container.querySelector("#nym-lead-form");
		n && n.addEventListener("submit", (e) => {
			e.preventDefault();
			let t = new FormData(n), r = {};
			t.forEach((e, t) => {
				r[t] = e;
			}), this.submitLead(r);
		});
		let r = this.container.querySelector("#nym-toggle-breakdown");
		r && r.addEventListener("click", () => {
			this.showBreakdownModal = !0, this.render();
		});
		let i = this.container.querySelector("#nym-modal-close");
		i && i.addEventListener("click", () => {
			this.showBreakdownModal = !1, this.render();
		});
		let a = this.container.querySelector("#nym-modal-backdrop");
		a && a.addEventListener("click", (e) => {
			e.target === a && (this.showBreakdownModal = !1, this.render());
		});
		let o = this.container.querySelector("#nym-btn-print");
		o && o.addEventListener("click", () => this.printReceipt());
		let s = this.container.querySelector("#nym-btn-restart");
		s && s.addEventListener("click", () => this.reset());
	}
};
function I(e, t) {
	let n = typeof e == "string" ? document.querySelector(e) : e;
	if (!n) throw Error(`[NymrelQuote] Container element not found: ${e}`);
	return new F(n, t);
}
//#endregion
export { s as C, d as D, c as E, l as S, u as T, x as _, E as a, f as b, O as c, v as d, _ as f, S as g, C as h, M as i, k as l, g as m, I as n, w as o, h as p, j as r, T as s, F as t, D as u, y as v, o as w, p as x, b as y };
