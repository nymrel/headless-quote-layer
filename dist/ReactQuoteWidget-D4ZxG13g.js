"use strict";var ae=Object.defineProperty;var ie=(t,e,r)=>e in t?ae(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var C=(t,e,r)=>ie(t,typeof e!="symbol"?e+"":e,r);const oe=require("react/jsx-runtime"),E=require("react");function O(t="NYM"){const e=new Date,r=e.getFullYear(),i=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0"),l=Math.random().toString(36).substring(2,8).toUpperCase();return`${t}-${r}${i}${a}-${l}`}function I(t,e="USD",r="$",i=0){if(isNaN(t)||t===null||t===void 0)return`${r}0`;const l=(i>0?t.toFixed(i):Math.round(t).toString()).split(".");return l[0]=l[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),`${r}${l.join(".")}`}function x(t){return t==null?t:typeof t=="string"?t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"").replace(/<[^>]*>/g,"").replace(/[<>]/g,"").trim():typeof t=="number"?isNaN(t)?0:t:Array.isArray(t)?t.map(x):t}function P(t,e){if(!t||!t.fieldId)return!0;const r=e[t.fieldId];switch(t.operator){case"equals":return r===t.value||String(r)===String(t.value);case"notEquals":return r!==t.value&&String(r)!==String(t.value);case"greaterThan":return Number(r)>Number(t.value);case"lessThan":return Number(r)<Number(t.value);case"in":return Array.isArray(t.value)?t.value.includes(r):!1;case"contains":return Array.isArray(r)?r.includes(t.value):typeof r=="string"?r.includes(String(t.value)):!1;default:return!0}}function j(t,e){if(t.required&&(e==null||e===""||Array.isArray(e)&&e.length===0))return{valid:!1,error:`${t.label} is required.`};if(e!=null&&e!==""){if(t.type==="number"||t.type==="slider"||t.type==="stepper"){const r=Number(e);if(isNaN(r))return{valid:!1,error:`${t.label} must be a valid number.`};if(t.min!==void 0&&r<t.min)return{valid:!1,error:`Minimum value is ${t.min} ${t.unit||""}`.trim()};if(t.max!==void 0&&r>t.max)return{valid:!1,error:`Maximum value is ${t.max} ${t.unit||""}`.trim()}}if(t.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e)))return{valid:!1,error:"Please enter a valid email address."};if(t.type==="phone"){const r=String(e).replace(/[\s()\-\.]/g,""),i=/^\+?[0-9]{7,15}$/;if(r.length<7||!i.test(r))return{valid:!1,error:"Please enter a valid phone number."}}}return{valid:!0}}function M(t,e){if(!e||e==="none")return t;switch(e){case"round":return Math.round(t);case"ceil":return Math.ceil(t);case"floor":return Math.floor(t);case"nearest10":return Math.round(t/10)*10;case"nearest50":return Math.round(t/50)*50;case"nearest100":return Math.round(t/100)*100;default:return t}}function B(t,e){var L,V;const r=((L=t.pricing)==null?void 0:L.currency)||"USD",i=((V=t.pricing)==null?void 0:V.currencySymbol)||"$",a=t.pricing||{},l=e._quoteId||O(),c=[];if(t.steps.forEach(o=>{o.fields.forEach(F=>{c.push(F)})}),a.formula==="custom"&&typeof a.customFormula=="function"){const o=a.customFormula(e,c),F=M(o.target,a.rounding),h=M(o.min,a.rounding),p=M(o.max,a.rounding);return{min:h,max:p,target:F,formattedMin:I(h,r,i),formattedMax:I(p,r,i),formattedTarget:I(F,r,i),currency:r,currencySymbol:i,breakdown:o.breakdown||[],recommendations:[],calculatedAt:new Date().toISOString(),quoteId:l}}let m=Number(a.baseFee||a.baseCalloutFee||0),s=0,d=0,v=0,S=1;const u=[],b=[];m>0&&u.push({id:"base-fee",label:"Base Callout / Setup Fee",amount:m,formattedAmount:I(m,r,i),type:"base",description:"Standard initial mobilization and inspection base"});for(const o of c){if(!P(o.condition,e))continue;const F=e[o.id]!==void 0?e[o.id]:o.defaultValue;if(!(F==null||F==="")){if(o.type==="number"||o.type==="slider"||o.type==="stepper"){const h=Number(F);if(!isNaN(h)&&h>0){if(o.unitPrice&&o.unitPrice>0){const p=h*o.unitPrice;o.category==="material"?s+=p:d+=p,u.push({id:o.id,label:`${o.label} (${h} ${o.unit||"units"} @ ${I(o.unitPrice,r,i)}/${o.unit||"unit"})`,amount:p,formattedAmount:I(p,r,i),type:o.category==="material"?"material":"labor"})}o.multiplier&&o.multiplier!==1&&(S*=o.multiplier)}}if((o.type==="select"||o.type==="radio"||o.type==="toggle")&&o.options&&o.options.length>0){const h=o.options.find(p=>String(p.id)===String(F)||String(p.value)===String(F));if(h){if(h.adder&&Number(h.adder)!==0){const p=Number(h.adder);v+=p,u.push({id:`${o.id}-${h.id}`,label:`${o.label}: ${h.label}`,amount:p,formattedAmount:I(p,r,i),type:o.category==="material"?"material":"addon",description:h.description})}if(h.multiplier&&Number(h.multiplier)!==1){const p=Number(h.multiplier);S*=p,u.push({id:`${o.id}-${h.id}-mult`,label:`${h.label} Factor (${p}x)`,amount:0,formattedAmount:`${p}x`,type:"multiplier",description:h.description})}}}if(o.type==="checkbox")if(Array.isArray(F)&&o.options)for(const h of F){const p=o.options.find(q=>String(q.id)===String(h)||String(q.value)===String(h));if(p){if(p.adder&&Number(p.adder)!==0){const q=Number(p.adder);v+=q,u.push({id:`${o.id}-${p.id}`,label:p.label,amount:q,formattedAmount:I(q,r,i),type:"addon",description:p.description})}p.multiplier&&Number(p.multiplier)!==1&&(S*=Number(p.multiplier))}}else typeof F=="boolean"&&F===!0&&(o.unitPrice&&(v+=o.unitPrice,u.push({id:o.id,label:o.label,amount:o.unitPrice,formattedAmount:I(o.unitPrice,r,i),type:"addon"})),o.multiplier&&o.multiplier!==1&&(S*=o.multiplier))}}const f=m+s+d+v;let g=f*S;if(a.taxRate&&a.taxRate>0){const o=g*a.taxRate;u.push({id:"tax",label:`Estimated Tax (${(a.taxRate*100).toFixed(1)}%)`,amount:o,formattedAmount:I(o,r,i),type:"tax"}),g+=o}const A=a.marginPercent?a.marginPercent/100:.1,z=a.minRangeSpreadPercent?a.minRangeSpreadPercent/100:A,_=a.maxRangeSpreadPercent?a.maxRangeSpreadPercent/100:A;let R=Math.max(0,g),Q=Math.max(0,R*(1-z)),y=Math.max(Q,R*(1+_));f===0&&m===0&&(R=0,Q=0,y=0);const $=M(R,a.rounding),w=M(Q,a.rounding),k=M(y,a.rounding);return(e.pitch==="steep"||e.difficulty==="extreme"||e.urgency==="emergency")&&b.push("Priority Crew Dispatch: Includes safety rigging and on-site supervisor."),$>5e3&&b.push("Flexible Financing Available: 0% APR for 12 months on qualifying projects."),(e.material==="metal"||e.efficiency==="ultra")&&b.push("Qualifies for Energy Efficiency Tax Credits & Lifetime Manufacturer Warranty."),{min:w,max:k,target:$,formattedMin:I(w,r,i),formattedMax:I(k,r,i),formattedTarget:I($,r,i),currency:r,currencySymbol:i,breakdown:u,recommendations:b,calculatedAt:new Date().toISOString(),quoteId:l}}function N(){return"sess_"+Math.random().toString(36).substring(2,10)+Date.now().toString(36)}function W(){if(typeof window>"u")return"desktop";const t=navigator.userAgent.toLowerCase(),e=window.innerWidth||1024;return/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(t)||e>=768&&e<=1024?"tablet":/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(t)||e<768?"mobile":"desktop"}function Y(t){if(!t)return"";try{return new URL(t).hostname}catch{return""}}function D(t={}){const e=typeof window<"u",r=e?new URLSearchParams(window.location.search):new URLSearchParams,i=e&&document.referrer||"",a=e&&window.location.href||"",l=e&&document.title||"",c=e&&navigator.userAgent||"";let m=t.customSessionId||"";if(!m&&e){const _=t.storageKey||"nymrel_quote_session_id";try{m=window.sessionStorage.getItem(_)||"",m||(m=N(),window.sessionStorage.setItem(_,m))}catch{m=N()}}else m||(m=N());const s=r.get("utm_source")||void 0,d=r.get("utm_medium")||void 0,v=r.get("utm_campaign")||void 0,S=r.get("utm_term")||void 0,u=r.get("utm_content")||void 0,b=r.get("gclid")||void 0,f=r.get("fbclid")||void 0,g=r.get("msclkid")||void 0,A=r.get("ttclid")||void 0,z=r.get("li_fat_id")||void 0;return{utm_source:s,utm_medium:d,utm_campaign:v,utm_term:S,utm_content:u,gclid:b,fbclid:f,msclkid:g,ttclid:A,li_fat_id:z,referrer:i,referring_domain:Y(i),landing_page:a,page_title:l,timestamp:new Date().toISOString(),source_label:t.sourceLabel,session_id:m,device_type:W(),userAgent:c}}function T(t,e={},r={}){if(typeof window>"u")return;const i=r.pushToDataLayer!==!1,a=r.useGtag!==!1,l=r.dispatchDomEvent!==!1,m=`${r.prefix||"nymrel_quote"}_${t}`,s={event:m,...e,timestamp:new Date().toISOString()};if(i){const d=window;d.dataLayer=d.dataLayer||[],d.dataLayer.push(s)}if(a){const d=window;typeof d.gtag=="function"&&d.gtag("event",m,e)}if(l)try{const d=new CustomEvent(m,{bubbles:!0,cancelable:!0,detail:s});window.dispatchEvent(d)}catch{}}function G(t,e){T("viewed",{schemaId:t,...e})}function K(t,e,r,i){T("step_completed",{schemaId:t,stepIndex:e,stepTitle:r,timeSpentMs:i})}function J(t,e,r,i,a){T("calculated",{schemaId:t,target:e,min:r,max:i,quoteId:a})}function H(t,e,r,i){T("lead_submitted",{schemaId:t,quoteId:e,value:r,currency:"USD",hasEmail:!!i})}function se(t,e,r){T("cta_clicked",{schemaId:t,ctaName:e,quoteId:r})}const Z={mode:"warm",fontFamily:'-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',primaryColor:"#2A332E",accentColor:"#A8541F",accentHoverColor:"#8E4316",backgroundColor:"#FAF8F2",surfaceColor:"#F4F0E6",cardColor:"#FFFFFF",textColor:"#2A332E",mutedTextColor:"#637069",borderColor:"#E2DCCE",borderRadius:"14px",boxShadow:"0 8px 30px -4px rgba(42, 51, 46, 0.08), 0 2px 8px -2px rgba(42, 51, 46, 0.04)",focusRingColor:"rgba(168, 84, 31, 0.28)"},X={mode:"light",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',primaryColor:"#0F172A",accentColor:"#2563EB",accentHoverColor:"#1D4ED8",backgroundColor:"#F8FAFC",surfaceColor:"#F1F5F9",cardColor:"#FFFFFF",textColor:"#0F172A",mutedTextColor:"#64748B",borderColor:"#E2E8F0",borderRadius:"12px",boxShadow:"0 4px 20px -2px rgba(0, 0, 0, 0.06)",focusRingColor:"rgba(37, 99, 235, 0.25)"},ee={mode:"dark",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',primaryColor:"#F1F5F9",accentColor:"#F97316",accentHoverColor:"#EA580C",backgroundColor:"#0F172A",surfaceColor:"#1E293B",cardColor:"#1E293B",textColor:"#F8FAFC",mutedTextColor:"#94A3B8",borderColor:"#334155",borderRadius:"12px",boxShadow:"0 8px 30px -4px rgba(0, 0, 0, 0.4)",focusRingColor:"rgba(249, 115, 22, 0.3)"};function te(t){return{...(t==null?void 0:t.mode)==="dark"?ee:(t==null?void 0:t.mode)==="light"?X:Z,...t}}function re(t){return`
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
  `}function ne(t){const e=te(t);return`
    :host {
      display: block;
      box-sizing: border-box;
      font-family: var(--nym-font);
      color: var(--nym-text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      ${re(e)}
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
  `}function n(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}class U{constructor(e,r){C(this,"container");C(this,"schema");C(this,"callbacks");C(this,"formState",{});C(this,"currentStepIndex",0);C(this,"currentQuote");C(this,"showBreakdownModal",!1);C(this,"isSubmitted",!1);C(this,"isSubmitting",!1);C(this,"lastSubmission",null);C(this,"sourceLabel");C(this,"webhookUrl");C(this,"fieldErrors",{});C(this,"stepStartTime",Date.now());this.schema=r.schema,this.callbacks=r.callbacks||{},this.sourceLabel=r.sourceLabel||this.schema.sourceLabel,this.webhookUrl=r.webhookUrl||this.schema.webhookUrl,this.schema.steps.forEach(i=>{i.fields.forEach(a=>{a.defaultValue!==void 0&&(this.formState[a.id]=a.defaultValue)})}),r.initialState&&(this.formState={...this.formState,...r.initialState}),r.useShadowDom!==!1&&e.attachShadow?e.shadowRoot?this.container=e.shadowRoot:this.container=e.attachShadow({mode:"open"}):this.container=e,this.currentQuote=B(this.schema,this.formState),G(this.schema.id,{sourceLabel:this.sourceLabel}),this.render()}updateState(e,r){this.formState[e]=x(r),delete this.fieldErrors[e],this.recalculate()}recalculate(){return this.currentQuote=B(this.schema,this.formState),J(this.schema.id,this.currentQuote.target,this.currentQuote.min,this.currentQuote.max,this.currentQuote.quoteId),this.callbacks.onCalculate&&this.callbacks.onCalculate(this.currentQuote,this.formState),this.render(),this.currentQuote}nextStep(){if(!this.isLeadFormStep()){const r=this.schema.steps[this.currentStepIndex];let i=!1;this.fieldErrors={};for(const l of r.fields){if(!P(l.condition,this.formState))continue;const c=j(l,this.formState[l.id]);c.valid||(this.fieldErrors[l.id]=c.error||"Invalid value",i=!0)}if(i)return this.render(),!1;const a=Date.now()-this.stepStartTime;if(K(this.schema.id,this.currentStepIndex,r.title,a),this.currentStepIndex<this.schema.steps.length-1)return this.currentStepIndex++,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render(),!0;if(this.isLeadFormEnabled())return this.currentStepIndex++,this.stepStartTime=Date.now(),this.render(),!0}return!1}prevStep(){this.currentStepIndex>0&&(this.currentStepIndex--,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.currentStepIndex<this.schema.steps.length&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render())}isLeadFormEnabled(){var e;return((e=this.schema.leadForm)==null?void 0:e.enabled)!==!1}isLeadFormStep(){return this.isLeadFormEnabled()&&this.currentStepIndex===this.schema.steps.length}getTotalStepsCount(){return this.schema.steps.length+(this.isLeadFormEnabled()?1:0)}async submitLead(e){const r=this.schema.leadForm;this.fieldErrors={},(!e.name||String(e.name).trim()==="")&&(this.fieldErrors.lead_name="Full Name is required.");const i=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;if((!e.email||!i.test(String(e.email)))&&(this.fieldErrors.lead_email="A valid email address is required."),r!=null&&r.requirePhone){const c=/^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$/;(!e.phone||!c.test(String(e.phone)))&&(this.fieldErrors.lead_phone="Phone number is required.")}if(r!=null&&r.requireAddress&&!e.address&&(this.fieldErrors.lead_address="Street address or zip code is required."),Object.keys(this.fieldErrors).length>0)return this.render(),null;this.isSubmitting=!0,this.render();const a=D({sourceLabel:this.sourceLabel}),l={quoteId:this.currentQuote.quoteId,schemaId:this.schema.id,schemaName:this.schema.name,quote:this.currentQuote,formState:{...this.formState},lead:{name:x(e.name),email:x(e.email),phone:x(e.phone||""),address:x(e.address||""),zipCode:x(e.zipCode||""),preferredDate:x(e.preferredDate||""),preferredTime:x(e.preferredTime||""),notes:x(e.notes||"")},attribution:a,submittedAt:new Date().toISOString(),metadata:this.schema.metadata};try{if(this.webhookUrl)try{await fetch(this.webhookUrl,{method:"POST",headers:{"Content-Type":"application/json","X-Nymrel-Quote-Id":l.quoteId},body:JSON.stringify(l)})}catch(c){console.warn("[NymrelQuote] Webhook delivery notice:",c)}return this.callbacks.onSubmit&&await this.callbacks.onSubmit(l),H(this.schema.id,l.quoteId,this.currentQuote.target,l.lead.email),this.isSubmitting=!1,this.isSubmitted=!0,this.lastSubmission=l,this.render(),l}catch(c){return this.isSubmitting=!1,this.callbacks.onError&&this.callbacks.onError(c),this.fieldErrors._global="Submission failed. Please check your connection and try again.",this.render(),null}}reset(){this.formState={},this.schema.steps.forEach(e=>{e.fields.forEach(r=>{r.defaultValue!==void 0&&(this.formState[r.id]=r.defaultValue)})}),this.currentStepIndex=0,this.isSubmitted=!1,this.isSubmitting=!1,this.lastSubmission=null,this.fieldErrors={},this.recalculate()}printReceipt(){typeof window<"u"&&window.print()}render(){var l;const e=ne(this.schema.theme);let r="";this.isSubmitted&&this.lastSubmission?r=this.renderSuccessScreen(this.lastSubmission):this.isLeadFormStep()?r=this.renderLeadFormStep():r=this.renderStepForm(this.schema.steps[this.currentStepIndex]);const i=this.showBreakdownModal?this.renderBreakdownModal():"",a=`
      <style>${e}</style>
      <div class="nym-container" role="region" aria-label="${n(this.schema.name)}">
        <!-- Header -->
        <header class="nym-header">
          <div class="nym-header-content">
            <h2>${n(this.schema.name)}</h2>
            ${this.schema.description?`<p>${n(this.schema.description)}</p>`:""}
          </div>
          ${this.schema.badge?`<span class="nym-badge">${n(this.schema.badge)}</span>`:""}
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
          ${Array.from({length:this.getTotalStepsCount()}).map((c,m)=>{let s="nym-step-dot";return m===this.currentStepIndex&&(s+=" active"),m<this.currentStepIndex&&(s+=" completed"),`<div class="${s}"></div>`}).join("")}
        </div>
        <div class="nym-step-legend">
          <span>Step ${this.currentStepIndex+1} of ${this.getTotalStepsCount()}</span>
          <span>${this.isLeadFormStep()?"Lead Contact & Booking":n(((l=this.schema.steps[this.currentStepIndex])==null?void 0:l.title)||"")}</span>
        </div>

        <!-- Main Step Form Content -->
        ${r}

        <!-- Recommendations Box if available -->
        ${this.currentQuote.recommendations.length>0&&!this.isSubmitted?`
          <div class="nym-recommendations">
            ${this.currentQuote.recommendations.map(c=>`
              <div class="nym-recommendation-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${n(c)}</span>
              </div>
            `).join("")}
          </div>
        `:""}

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
    `;this.container.innerHTML=a,this.attachEventListeners()}renderStepForm(e){const r=this.currentStepIndex===0;return`
      <div class="nym-step-view">
        <h3 class="nym-step-title">${n(e.title)}</h3>
        ${e.subtitle?`<p class="nym-step-subtitle">${n(e.subtitle)}</p>`:""}

        <div class="nym-fields-list">
          ${e.fields.map(i=>this.renderField(i)).join("")}
        </div>

        <div class="nym-footer">
          ${r?"<div></div>":`
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Back
            </button>
          `}
          <button type="button" class="nym-btn nym-btn-primary" id="nym-btn-next">
            ${this.currentStepIndex===this.schema.steps.length-1&&!this.isLeadFormEnabled()?"Finish Quote":"Continue &rarr;"}
          </button>
        </div>
      </div>
    `}renderField(e){var l,c,m;if(!P(e.condition,this.formState))return"";const r=this.formState[e.id]!==void 0?this.formState[e.id]:e.defaultValue??"",i=this.fieldErrors[e.id];let a="";switch(e.type){case"slider":{const s=e.min??100,d=e.max??5e3,v=e.step??50,S=Number(r)||s;a=`
          <div class="nym-slider-container">
            <div class="nym-slider-header">
              <span class="nym-slider-ticks">${s} ${e.unit||""}</span>
              <span class="nym-slider-val" id="val-${e.id}">${S} ${e.unit||""}</span>
              <span class="nym-slider-ticks">${d} ${e.unit||""}</span>
            </div>
            <input 
              type="range" 
              class="nym-slider nym-reactive-input" 
              data-field-id="${e.id}" 
              min="${s}" 
              max="${d}" 
              step="${v}" 
              value="${S}"
              aria-label="${n(e.label)}"
            />
          </div>
        `;break}case"select":{a=`
          <select class="nym-select nym-reactive-input" data-field-id="${e.id}" aria-label="${n(e.label)}">
            ${(l=e.options)==null?void 0:l.map(s=>`
              <option value="${n(s.id)}" ${String(r)===String(s.id)?"selected":""}>
                ${n(s.label)} ${s.adder?`(+${this.currentQuote.currencySymbol}${s.adder})`:""} ${s.multiplier?`(${s.multiplier}x)`:""}
              </option>
            `).join("")}
          </select>
        `;break}case"radio":{a=`
          <div class="nym-options-grid" role="radiogroup" aria-label="${n(e.label)}">
            ${(c=e.options)==null?void 0:c.map(s=>{const d=String(r)===String(s.id);return`
                <div 
                  class="nym-option-card ${d?"selected":""}" 
                  data-field-id="${e.id}" 
                  data-option-id="${n(s.id)}"
                  role="radio"
                  aria-checked="${d}"
                  tabindex="0"
                >
                  <div class="nym-option-header">
                    <span class="nym-option-title">${n(s.label)}</span>
                    ${s.badge?`<span class="nym-option-badge">${n(s.badge)}</span>`:""}
                  </div>
                  ${s.description?`<p class="nym-option-desc">${n(s.description)}</p>`:""}
                  ${s.adder||s.multiplier?`
                    <div class="nym-option-price">
                      ${s.adder?`+${this.currentQuote.currencySymbol}${s.adder}`:""}
                      ${s.multiplier?`${s.multiplier}x multiplier`:""}
                    </div>
                  `:""}
                </div>
              `}).join("")}
          </div>
        `;break}case"checkbox":{const s=Array.isArray(r)?r:[];a=`
          <div class="nym-checkbox-list">
            ${(m=e.options)==null?void 0:m.map(d=>{const v=s.includes(d.id);return`
                <div 
                  class="nym-checkbox-item ${v?"checked":""}" 
                  data-field-id="${e.id}" 
                  data-checkbox-id="${n(d.id)}"
                  role="checkbox"
                  aria-checked="${v}"
                  tabindex="0"
                >
                  <div class="nym-checkbox-box">
                    ${v?"✓":""}
                  </div>
                  <div class="nym-checkbox-info">
                    <div class="nym-checkbox-title">
                      <span>${n(d.label)}</span>
                      ${d.adder?`<span>+${this.currentQuote.currencySymbol}${d.adder}</span>`:""}
                    </div>
                    ${d.description?`<div class="nym-checkbox-desc">${n(d.description)}</div>`:""}
                  </div>
                </div>
              `}).join("")}
          </div>
        `;break}case"number":case"stepper":{a=`
          <input 
            type="number" 
            class="nym-input nym-reactive-input" 
            data-field-id="${e.id}" 
            min="${e.min??0}" 
            max="${e.max??999999}" 
            step="${e.step??1}" 
            value="${n(r)}"
            placeholder="${e.placeholder?n(e.placeholder):""}"
            aria-label="${n(e.label)}"
          />
        `;break}default:a=`
          <input 
            type="text" 
            class="nym-input nym-reactive-input" 
            data-field-id="${e.id}" 
            value="${n(r)}"
            placeholder="${e.placeholder?n(e.placeholder):""}"
            aria-label="${n(e.label)}"
          />
        `}return`
      <div class="nym-field-group">
        <label class="nym-label">
          <span>${n(e.label)}${e.required?" *":""}</span>
          ${e.unit&&e.type!=="slider"?`<span class="nym-helper-text">${n(e.unit)}</span>`:""}
        </label>
        ${a}
        ${e.helperText?`<div class="nym-helper-text">${n(e.helperText)}</div>`:""}
        ${i?`<div class="nym-error-text">${n(i)}</div>`:""}
      </div>
    `}renderLeadFormStep(){const e=this.schema.leadForm,r=this.fieldErrors._global;return`
      <div class="nym-lead-step">
        <h3 class="nym-step-title">${n((e==null?void 0:e.title)||"Lock in Your Official Quote")}</h3>
        <p class="nym-step-subtitle">${n((e==null?void 0:e.subtitle)||"Enter your contact details to save your estimate, receive your official PDF breakdown, and schedule an on-site inspection.")}</p>

        ${r?`<div class="nym-error-text" style="margin-bottom: 16px;">${n(r)}</div>`:""}

        <form id="nym-lead-form">
          <div class="nym-field-group">
            <label class="nym-label">Full Name *</label>
            <input type="text" name="name" class="nym-input" required placeholder="e.g. Alex Morgan" value="${n(this.formState._lead_name||"")}" />
            ${this.fieldErrors.lead_name?`<div class="nym-error-text">${n(this.fieldErrors.lead_name)}</div>`:""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Email Address *</label>
            <input type="email" name="email" class="nym-input" required placeholder="alex@example.com" value="${n(this.formState._lead_email||"")}" />
            ${this.fieldErrors.lead_email?`<div class="nym-error-text">${n(this.fieldErrors.lead_email)}</div>`:""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Phone Number ${e!=null&&e.requirePhone?"*":"(Optional)"}</label>
            <input type="tel" name="phone" class="nym-input" ${e!=null&&e.requirePhone?"required":""} placeholder="(555) 019-2834" value="${n(this.formState._lead_phone||"")}" />
            ${this.fieldErrors.lead_phone?`<div class="nym-error-text">${n(this.fieldErrors.lead_phone)}</div>`:""}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="nym-field-group">
              <label class="nym-label">Street Address ${e!=null&&e.requireAddress?"*":""}</label>
              <input type="text" name="address" class="nym-input" placeholder="123 Maple Way" value="${n(this.formState._lead_address||"")}" />
              ${this.fieldErrors.lead_address?`<div class="nym-error-text">${n(this.fieldErrors.lead_address)}</div>`:""}
            </div>
            <div class="nym-field-group">
              <label class="nym-label">Zip Code</label>
              <input type="text" name="zipCode" class="nym-input" placeholder="90210" value="${n(this.formState._lead_zip||"")}" />
            </div>
          </div>

          ${e!=null&&e.requireDate?`
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nym-field-group">
                <label class="nym-label">Preferred Date</label>
                <input type="date" name="preferredDate" class="nym-input" value="${n(this.formState._lead_date||"")}" />
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
          `:""}

          ${(e==null?void 0:e.collectNotes)!==!1?`
            <div class="nym-field-group">
              <label class="nym-label">Project Notes or Questions</label>
              <textarea name="notes" class="nym-textarea" placeholder="Tell us about specific property access, timeline goals, or special requirements...">${n(this.formState._lead_notes||"")}</textarea>
            </div>
          `:""}

          <div class="nym-helper-text" style="margin-bottom: 20px;">
            ${n((e==null?void 0:e.disclaimerText)||"By submitting, you agree to receive project updates and quote confirmation. We respect your privacy and never sell data.")}
          </div>

          <div class="nym-footer">
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Edit Parameters
            </button>
            <button type="submit" class="nym-btn nym-btn-primary" ${this.isSubmitting?"disabled":""}>
              ${this.isSubmitting?"Processing...":(e==null?void 0:e.submitButtonText)||"Lock In My Estimate &rarr;"}
            </button>
          </div>
        </form>
      </div>
    `}renderSuccessScreen(e){const r=this.schema.leadForm;return`
      <div class="nym-success-screen">
        <div class="nym-success-icon">✓</div>
        <h3 class="nym-step-title">${n((r==null?void 0:r.successTitle)||"Estimate Successfully Saved & Confirmed!")}</h3>
        <p class="nym-step-subtitle">${n((r==null?void 0:r.successMessage)||"A detailed quote confirmation and project summary have been dispatched to your email.")}</p>

        <div class="nym-receipt-card">
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
          ${e.lead.preferredDate?`
            <div class="nym-receipt-row">
              <span class="nym-receipt-key">Requested Consultation:</span>
              <span class="nym-receipt-val">${n(e.lead.preferredDate)} (${n(e.lead.preferredTime||"Anytime")})</span>
            </div>
          `:""}
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
    `}renderBreakdownModal(){return`
      <div class="nym-modal-backdrop" id="nym-modal-backdrop">
        <div class="nym-modal" role="dialog" aria-modal="true" aria-labelledby="nym-modal-heading">
          <div class="nym-modal-header">
            <h3 id="nym-modal-heading">Cost Calculation Breakdown</h3>
            <button type="button" class="nym-btn-close" id="nym-modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="nym-modal-body">
            <table class="nym-breakdown-table">
              <tbody>
                ${this.currentQuote.breakdown.map(e=>`
                  <tr>
                    <td>
                      <div class="nym-breakdown-label">${n(e.label)}</div>
                      ${e.description?`<div class="nym-breakdown-subtext">${n(e.description)}</div>`:""}
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
    `}attachEventListeners(){this.container.querySelectorAll(".nym-reactive-input").forEach(u=>{u.addEventListener("input",b=>{const f=b.target,g=f.getAttribute("data-field-id");if(g){this.updateState(g,f.value);const A=this.container.querySelector(`#val-${g}`);A&&(A.textContent=`${f.value} ${f.getAttribute("data-unit")||""}`.trim())}})}),this.container.querySelectorAll(".nym-option-card").forEach(u=>{u.addEventListener("click",()=>{const b=u.getAttribute("data-field-id"),f=u.getAttribute("data-option-id");b&&f&&this.updateState(b,f)})}),this.container.querySelectorAll(".nym-checkbox-item").forEach(u=>{u.addEventListener("click",()=>{const b=u.getAttribute("data-field-id"),f=u.getAttribute("data-checkbox-id");if(b&&f){const g=Array.isArray(this.formState[b])?[...this.formState[b]]:[],A=g.indexOf(f);A>=0?g.splice(A,1):g.push(f),this.updateState(b,g)}})});const a=this.container.querySelector("#nym-btn-next");a&&a.addEventListener("click",()=>this.nextStep());const l=this.container.querySelector("#nym-btn-prev");l&&l.addEventListener("click",()=>this.prevStep());const c=this.container.querySelector("#nym-lead-form");c&&c.addEventListener("submit",u=>{u.preventDefault();const b=new FormData(c),f={};b.forEach((g,A)=>{f[A]=g}),this.submitLead(f)});const m=this.container.querySelector("#nym-toggle-breakdown");m&&m.addEventListener("click",()=>{this.showBreakdownModal=!0,this.render()});const s=this.container.querySelector("#nym-modal-close");s&&s.addEventListener("click",()=>{this.showBreakdownModal=!1,this.render()});const d=this.container.querySelector("#nym-modal-backdrop");d&&d.addEventListener("click",u=>{u.target===d&&(this.showBreakdownModal=!1,this.render())});const v=this.container.querySelector("#nym-btn-print");v&&v.addEventListener("click",()=>this.printReceipt());const S=this.container.querySelector("#nym-btn-restart");S&&S.addEventListener("click",()=>this.reset())}}function le(t,e){const r=typeof t=="string"?document.querySelector(t):t;if(!r)throw new Error(`[NymrelQuote] Container element not found: ${t}`);return new U(r,e)}const de=({schema:t,initialState:e,theme:r,sourceLabel:i,webhookUrl:a,useShadowDom:l=!0,onCalculate:c,onStepChange:m,onSubmit:s,onError:d,className:v,style:S})=>{const u=E.useRef(null),b=E.useRef(null);return E.useEffect(()=>{if(!u.current)return;const f=r?{...t,theme:{...t.theme,...r}}:t,g=new U(u.current,{schema:f,initialState:e,sourceLabel:i,webhookUrl:a,useShadowDom:l,callbacks:{onCalculate:c,onStepChange:m,onSubmit:s,onError:d}});return b.current=g,()=>{b.current=null,u.current&&(u.current.innerHTML="")}},[t,r,i,a,l]),oe.jsx("div",{ref:u,className:`nymrel-quote-widget-root ${v||""}`.trim(),style:S})};function ce(t,e){const[r,i]=E.useState(()=>{const y={};return t.steps.forEach($=>{$.fields.forEach(w=>{w.defaultValue!==void 0&&(y[w.id]=w.defaultValue)})}),{...y,...e}}),[a,l]=E.useState(0),[c,m]=E.useState(()=>B(t,r)),[s,d]=E.useState({}),[v,S]=E.useState(!1),[u,b]=E.useState(!1),[f,g]=E.useState(null);E.useEffect(()=>{const y=B(t,r);m(y)},[t,r]);const A=E.useCallback((y,$)=>{i(w=>({...w,[y]:x($)})),d(w=>{const k={...w};return delete k[y],k})},[]),z=E.useCallback(()=>{const y=t.steps[a];if(!y)return!1;let $=!1;const w={};for(const k of y.fields){const L=j(k,r[k.id]);L.valid||(w[k.id]=L.error||"Invalid value",$=!0)}return $?(d(w),!1):a<t.steps.length?(l(k=>k+1),!0):!1},[t,a,r]),_=E.useCallback(()=>{a>0&&l(y=>y-1)},[a]),R=E.useCallback(async(y,$={})=>{S(!0);const w=D({sourceLabel:$.sourceLabel}),k={quoteId:c.quoteId,schemaId:t.id,schemaName:t.name,quote:c,formState:r,lead:{name:x(y.name),email:x(y.email),phone:x(y.phone||""),address:x(y.address||""),zipCode:x(y.zipCode||""),preferredDate:x(y.preferredDate||""),preferredTime:x(y.preferredTime||""),notes:x(y.notes||"")},attribution:w,submittedAt:new Date().toISOString(),metadata:t.metadata};if($.webhookUrl)try{await fetch($.webhookUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(k)})}catch(L){console.warn("[useQuoteEngine] Webhook error:",L)}return H(t.id,k.quoteId,c.target,k.lead.email),S(!1),b(!0),g(k),k},[t,c,r]),Q=E.useCallback(()=>{const y={};t.steps.forEach($=>{$.fields.forEach(w=>{w.defaultValue!==void 0&&(y[w.id]=w.defaultValue)})}),i({...y,...e}),l(0),b(!1),S(!1),g(null),d({})},[t,e]);return{quote:c,formState:r,currentStepIndex:a,fieldErrors:s,isSubmitting:v,isSubmitted:u,lastSubmission:f,updateField:A,nextStep:z,prevStep:_,submitLead:R,reset:Q}}exports.DARK_THEME=ee;exports.DEFAULT_WARM_THEME=Z;exports.LIGHT_THEME=X;exports.NymrelQuoteWidget=U;exports.QuoteWidget=de;exports.applyRounding=M;exports.calculateQuote=B;exports.createQuoteWidget=le;exports.emitAnalyticsEvent=T;exports.evaluateCondition=P;exports.extractAttribution=D;exports.formatCurrency=I;exports.generateCssVariables=re;exports.generateQuoteId=O;exports.getDeviceType=W;exports.getReferringDomain=Y;exports.getShadowStyles=ne;exports.resolveTheme=te;exports.sanitizeInput=x;exports.trackCtaClicked=se;exports.trackLeadSubmitted=H;exports.trackQuoteCalculated=J;exports.trackQuoteViewed=G;exports.trackStepCompleted=K;exports.useQuoteEngine=ce;exports.validateField=j;
