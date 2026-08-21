(function(h,$){typeof exports=="object"&&typeof module<"u"?$(exports):typeof define=="function"&&define.amd?define(["exports"],$):(h=typeof globalThis<"u"?globalThis:h||self,$(h.NymrelQuoteLayer=h.NymrelQuoteLayer||{}))})(this,(function(h){"use strict";var me=Object.defineProperty;var ue=(h,$,g)=>$ in h?me(h,$,{enumerable:!0,configurable:!0,writable:!0,value:g}):h[$]=g;var w=(h,$,g)=>ue(h,typeof $!="symbol"?$+"":$,g);function $(r="NYM"){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0"),l=Math.random().toString(36).substring(2,8).toUpperCase();return`${r}-${t}${n}${i}-${l}`}function g(r,e="USD",t="$",n=0){if(isNaN(r)||r===null||r===void 0)return`${t}0`;const l=(n>0?r.toFixed(n):Math.round(r).toString()).split(".");return l[0]=l[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),`${t}${l.join(".")}`}function C(r){return r==null?r:typeof r=="string"?r.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"").replace(/<[^>]*>/g,"").replace(/[<>]/g,"").trim():typeof r=="number"?isNaN(r)?0:r:Array.isArray(r)?r.map(C):r}function M(r,e){if(!r||!r.fieldId)return!0;const t=e[r.fieldId];switch(r.operator){case"equals":return t===r.value||String(t)===String(r.value);case"notEquals":return t!==r.value&&String(t)!==String(r.value);case"greaterThan":return Number(t)>Number(r.value);case"lessThan":return Number(t)<Number(r.value);case"in":return Array.isArray(r.value)?r.value.includes(t):!1;case"contains":return Array.isArray(t)?t.includes(r.value):typeof t=="string"?t.includes(String(r.value)):!1;default:return!0}}function te(r,e){if(r.required&&(e==null||e===""||Array.isArray(e)&&e.length===0))return{valid:!1,error:`${r.label} is required.`};if(e!=null&&e!==""){if(r.type==="number"||r.type==="slider"||r.type==="stepper"){const t=Number(e);if(isNaN(t))return{valid:!1,error:`${r.label} must be a valid number.`};if(r.min!==void 0&&t<r.min)return{valid:!1,error:`Minimum value is ${r.min} ${r.unit||""}`.trim()};if(r.max!==void 0&&t>r.max)return{valid:!1,error:`Maximum value is ${r.max} ${r.unit||""}`.trim()}}if(r.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e)))return{valid:!1,error:"Please enter a valid email address."};if(r.type==="phone"){const t=String(e).replace(/[\s()\-\.]/g,""),n=/^\+?[0-9]{7,15}$/;if(t.length<7||!n.test(t))return{valid:!1,error:"Please enter a valid phone number."}}}return{valid:!0}}function _(r,e){if(!e||e==="none")return r;switch(e){case"round":return Math.round(r);case"ceil":return Math.ceil(r);case"floor":return Math.floor(r);case"nearest10":return Math.round(r/10)*10;case"nearest50":return Math.round(r/50)*50;case"nearest100":return Math.round(r/100)*100;default:return r}}function P(r,e){var X,ee;const t=((X=r.pricing)==null?void 0:X.currency)||"USD",n=((ee=r.pricing)==null?void 0:ee.currencySymbol)||"$",i=r.pricing||{},l=e._quoteId||$(),p=[];if(r.steps.forEach(o=>{o.fields.forEach(k=>{p.push(k)})}),i.formula==="custom"&&typeof i.customFormula=="function"){const o=i.customFormula(e,p),k=_(o.target,i.rounding),y=_(o.min,i.rounding),u=_(o.max,i.rounding);return{min:y,max:u,target:k,formattedMin:g(y,t,n),formattedMax:g(u,t,n),formattedTarget:g(k,t,n),currency:t,currencySymbol:n,breakdown:o.breakdown||[],recommendations:[],calculatedAt:new Date().toISOString(),quoteId:l}}let m=Number(i.baseFee||i.baseCalloutFee||0),s=0,c=0,d=0,v=1;const b=[],x=[];m>0&&b.push({id:"base-fee",label:"Base Callout / Setup Fee",amount:m,formattedAmount:g(m,t,n),type:"base",description:"Standard initial mobilization and inspection base"});for(const o of p){if(!M(o.condition,e))continue;const k=e[o.id]!==void 0?e[o.id]:o.defaultValue;if(!(k==null||k==="")){if(o.type==="number"||o.type==="slider"||o.type==="stepper"){const y=Number(k);if(!isNaN(y)&&y>0){if(o.unitPrice&&o.unitPrice>0){const u=y*o.unitPrice;o.category==="material"?s+=u:c+=u,b.push({id:o.id,label:`${o.label} (${y} ${o.unit||"units"} @ ${g(o.unitPrice,t,n)}/${o.unit||"unit"})`,amount:u,formattedAmount:g(u,t,n),type:o.category==="material"?"material":"labor"})}o.multiplier&&o.multiplier!==1&&(v*=o.multiplier)}}if((o.type==="select"||o.type==="radio"||o.type==="toggle")&&o.options&&o.options.length>0){const y=o.options.find(u=>String(u.id)===String(k)||String(u.value)===String(k));if(y){if(y.adder&&Number(y.adder)!==0){const u=Number(y.adder);d+=u,b.push({id:`${o.id}-${y.id}`,label:`${o.label}: ${y.label}`,amount:u,formattedAmount:g(u,t,n),type:o.category==="material"?"material":"addon",description:y.description})}if(y.multiplier&&Number(y.multiplier)!==1){const u=Number(y.multiplier);v*=u,b.push({id:`${o.id}-${y.id}-mult`,label:`${y.label} Factor (${u}x)`,amount:0,formattedAmount:`${u}x`,type:"multiplier",description:y.description})}}}if(o.type==="checkbox")if(Array.isArray(k)&&o.options)for(const y of k){const u=o.options.find(F=>String(F.id)===String(y)||String(F.value)===String(y));if(u){if(u.adder&&Number(u.adder)!==0){const F=Number(u.adder);d+=F,b.push({id:`${o.id}-${u.id}`,label:u.label,amount:F,formattedAmount:g(F,t,n),type:"addon",description:u.description})}u.multiplier&&Number(u.multiplier)!==1&&(v*=Number(u.multiplier))}}else typeof k=="boolean"&&k===!0&&(o.unitPrice&&(d+=o.unitPrice,b.push({id:o.id,label:o.label,amount:o.unitPrice,formattedAmount:g(o.unitPrice,t,n),type:"addon"})),o.multiplier&&o.multiplier!==1&&(v*=o.multiplier))}}const f=m+s+c+d;let S=f*v;if(i.taxRate&&i.taxRate>0){const o=S*i.taxRate;b.push({id:"tax",label:`Estimated Tax (${(i.taxRate*100).toFixed(1)}%)`,amount:o,formattedAmount:g(o,t,n),type:"tax"}),S+=o}const E=i.marginPercent?i.marginPercent/100:.1,z=i.minRangeSpreadPercent?i.minRangeSpreadPercent/100:E,I=i.maxRangeSpreadPercent?i.maxRangeSpreadPercent/100:E;let L=Math.max(0,S),Q=Math.max(0,L*(1-z)),Z=Math.max(Q,L*(1+I));f===0&&m===0&&(L=0,Q=0,Z=0);const H=_(L,i.rounding),J=_(Q,i.rounding),K=_(Z,i.rounding);return(e.pitch==="steep"||e.difficulty==="extreme"||e.urgency==="emergency")&&x.push("Priority Crew Dispatch: Includes safety rigging and on-site supervisor."),H>5e3&&x.push("Flexible Financing Available: 0% APR for 12 months on qualifying projects."),(e.material==="metal"||e.efficiency==="ultra")&&x.push("Qualifies for Energy Efficiency Tax Credits & Lifetime Manufacturer Warranty."),{min:J,max:K,target:H,formattedMin:g(J,t,n),formattedMax:g(K,t,n),formattedTarget:g(H,t,n),currency:t,currencySymbol:n,breakdown:b,recommendations:x,calculatedAt:new Date().toISOString(),quoteId:l}}function q(){return"sess_"+Math.random().toString(36).substring(2,10)+Date.now().toString(36)}function re(){if(typeof window>"u")return"desktop";const r=navigator.userAgent.toLowerCase(),e=window.innerWidth||1024;return/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(r)||e>=768&&e<=1024?"tablet":/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(r)||e<768?"mobile":"desktop"}function ae(r){if(!r)return"";try{return new URL(r).hostname}catch{return""}}function T(r={}){const e=typeof window<"u",t=e?new URLSearchParams(window.location.search):new URLSearchParams,n=e&&document.referrer||"",i=e&&window.location.href||"",l=e&&document.title||"",p=e&&navigator.userAgent||"";let m=r.customSessionId||"";if(!m&&e){const I=r.storageKey||"nymrel_quote_session_id";try{m=window.sessionStorage.getItem(I)||"",m||(m=q(),window.sessionStorage.setItem(I,m))}catch{m=q()}}else m||(m=q());const s=t.get("utm_source")||void 0,c=t.get("utm_medium")||void 0,d=t.get("utm_campaign")||void 0,v=t.get("utm_term")||void 0,b=t.get("utm_content")||void 0,x=t.get("gclid")||void 0,f=t.get("fbclid")||void 0,S=t.get("msclkid")||void 0,E=t.get("ttclid")||void 0,z=t.get("li_fat_id")||void 0;return{utm_source:s,utm_medium:c,utm_campaign:d,utm_term:v,utm_content:b,gclid:x,fbclid:f,msclkid:S,ttclid:E,li_fat_id:z,referrer:n,referring_domain:ae(n),landing_page:i,page_title:l,timestamp:new Date().toISOString(),source_label:r.sourceLabel,session_id:m,device_type:re(),userAgent:p}}function A(r,e={},t={}){if(typeof window>"u")return;const n=t.pushToDataLayer!==!1,i=t.useGtag!==!1,l=t.dispatchDomEvent!==!1,m=`${t.prefix||"nymrel_quote"}_${r}`,s={event:m,...e,timestamp:new Date().toISOString()};if(n){const c=window;c.dataLayer=c.dataLayer||[],c.dataLayer.push(s)}if(i){const c=window;typeof c.gtag=="function"&&c.gtag("event",m,e)}if(l)try{const c=new CustomEvent(m,{bubbles:!0,cancelable:!0,detail:s});window.dispatchEvent(c)}catch{}}function ie(r,e){A("viewed",{schemaId:r,...e})}function ne(r,e,t,n){A("step_completed",{schemaId:r,stepIndex:e,stepTitle:t,timeSpentMs:n})}function oe(r,e,t,n,i){A("calculated",{schemaId:r,target:e,min:t,max:n,quoteId:i})}function se(r,e,t,n){A("lead_submitted",{schemaId:r,quoteId:e,value:t,currency:"USD",hasEmail:!!n})}const V={mode:"warm",fontFamily:'-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',primaryColor:"#2A332E",accentColor:"#A8541F",accentHoverColor:"#8E4316",backgroundColor:"#FAF8F2",surfaceColor:"#F4F0E6",cardColor:"#FFFFFF",textColor:"#2A332E",mutedTextColor:"#637069",borderColor:"#E2DCCE",borderRadius:"14px",boxShadow:"0 8px 30px -4px rgba(42, 51, 46, 0.08), 0 2px 8px -2px rgba(42, 51, 46, 0.04)",focusRingColor:"rgba(168, 84, 31, 0.28)"},j={mode:"light",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',primaryColor:"#0F172A",accentColor:"#2563EB",accentHoverColor:"#1D4ED8",backgroundColor:"#F8FAFC",surfaceColor:"#F1F5F9",cardColor:"#FFFFFF",textColor:"#0F172A",mutedTextColor:"#64748B",borderColor:"#E2E8F0",borderRadius:"12px",boxShadow:"0 4px 20px -2px rgba(0, 0, 0, 0.06)",focusRingColor:"rgba(37, 99, 235, 0.25)"},U={mode:"dark",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',primaryColor:"#F1F5F9",accentColor:"#F97316",accentHoverColor:"#EA580C",backgroundColor:"#0F172A",surfaceColor:"#1E293B",cardColor:"#1E293B",textColor:"#F8FAFC",mutedTextColor:"#94A3B8",borderColor:"#334155",borderRadius:"12px",boxShadow:"0 8px 30px -4px rgba(0, 0, 0, 0.4)",focusRingColor:"rgba(249, 115, 22, 0.3)"};function le(r){return{...(r==null?void 0:r.mode)==="dark"?U:(r==null?void 0:r.mode)==="light"?j:V,...r}}function de(r){return`
    --nym-font: ${r.fontFamily};
    --nym-primary: ${r.primaryColor};
    --nym-accent: ${r.accentColor};
    --nym-accent-hover: ${r.accentHoverColor};
    --nym-bg: ${r.backgroundColor};
    --nym-surface: ${r.surfaceColor};
    --nym-card: ${r.cardColor};
    --nym-text: ${r.textColor};
    --nym-muted: ${r.mutedTextColor};
    --nym-border: ${r.borderColor};
    --nym-radius: ${r.borderRadius};
    --nym-shadow: ${r.boxShadow};
    --nym-focus: ${r.focusRingColor};
    --nym-success: #2E6B4F;
    --nym-error: #B83A2C;
  `}function W(r){const e=le(r);return`
    :host {
      display: block;
      box-sizing: border-box;
      font-family: var(--nym-font);
      color: var(--nym-text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      ${de(e)}
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
  `}function a(r){return r==null?"":String(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}class R{constructor(e,t){w(this,"container");w(this,"schema");w(this,"callbacks");w(this,"formState",{});w(this,"currentStepIndex",0);w(this,"currentQuote");w(this,"showBreakdownModal",!1);w(this,"isSubmitted",!1);w(this,"isSubmitting",!1);w(this,"lastSubmission",null);w(this,"sourceLabel");w(this,"webhookUrl");w(this,"fieldErrors",{});w(this,"stepStartTime",Date.now());this.schema=t.schema,this.callbacks=t.callbacks||{},this.sourceLabel=t.sourceLabel||this.schema.sourceLabel,this.webhookUrl=t.webhookUrl||this.schema.webhookUrl,this.schema.steps.forEach(n=>{n.fields.forEach(i=>{i.defaultValue!==void 0&&(this.formState[i.id]=i.defaultValue)})}),t.initialState&&(this.formState={...this.formState,...t.initialState}),t.useShadowDom!==!1&&e.attachShadow?e.shadowRoot?this.container=e.shadowRoot:this.container=e.attachShadow({mode:"open"}):this.container=e,this.currentQuote=P(this.schema,this.formState),ie(this.schema.id,{sourceLabel:this.sourceLabel}),this.render()}updateState(e,t){this.formState[e]=C(t),delete this.fieldErrors[e],this.recalculate()}recalculate(){return this.currentQuote=P(this.schema,this.formState),oe(this.schema.id,this.currentQuote.target,this.currentQuote.min,this.currentQuote.max,this.currentQuote.quoteId),this.callbacks.onCalculate&&this.callbacks.onCalculate(this.currentQuote,this.formState),this.render(),this.currentQuote}nextStep(){if(!this.isLeadFormStep()){const t=this.schema.steps[this.currentStepIndex];let n=!1;this.fieldErrors={};for(const l of t.fields){if(!M(l.condition,this.formState))continue;const p=te(l,this.formState[l.id]);p.valid||(this.fieldErrors[l.id]=p.error||"Invalid value",n=!0)}if(n)return this.render(),!1;const i=Date.now()-this.stepStartTime;if(ne(this.schema.id,this.currentStepIndex,t.title,i),this.currentStepIndex<this.schema.steps.length-1)return this.currentStepIndex++,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render(),!0;if(this.isLeadFormEnabled())return this.currentStepIndex++,this.stepStartTime=Date.now(),this.render(),!0}return!1}prevStep(){this.currentStepIndex>0&&(this.currentStepIndex--,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.currentStepIndex<this.schema.steps.length&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render())}isLeadFormEnabled(){var e;return((e=this.schema.leadForm)==null?void 0:e.enabled)!==!1}isLeadFormStep(){return this.isLeadFormEnabled()&&this.currentStepIndex===this.schema.steps.length}getTotalStepsCount(){return this.schema.steps.length+(this.isLeadFormEnabled()?1:0)}async submitLead(e){const t=this.schema.leadForm;this.fieldErrors={},(!e.name||String(e.name).trim()==="")&&(this.fieldErrors.lead_name="Full Name is required.");const n=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;if((!e.email||!n.test(String(e.email)))&&(this.fieldErrors.lead_email="A valid email address is required."),t!=null&&t.requirePhone){const p=/^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$/;(!e.phone||!p.test(String(e.phone)))&&(this.fieldErrors.lead_phone="Phone number is required.")}if(t!=null&&t.requireAddress&&!e.address&&(this.fieldErrors.lead_address="Street address or zip code is required."),Object.keys(this.fieldErrors).length>0)return this.render(),null;this.isSubmitting=!0,this.render();const i=T({sourceLabel:this.sourceLabel}),l={quoteId:this.currentQuote.quoteId,schemaId:this.schema.id,schemaName:this.schema.name,quote:this.currentQuote,formState:{...this.formState},lead:{name:C(e.name),email:C(e.email),phone:C(e.phone||""),address:C(e.address||""),zipCode:C(e.zipCode||""),preferredDate:C(e.preferredDate||""),preferredTime:C(e.preferredTime||""),notes:C(e.notes||"")},attribution:i,submittedAt:new Date().toISOString(),metadata:this.schema.metadata};try{if(this.webhookUrl)try{await fetch(this.webhookUrl,{method:"POST",headers:{"Content-Type":"application/json","X-Nymrel-Quote-Id":l.quoteId},body:JSON.stringify(l)})}catch(p){console.warn("[NymrelQuote] Webhook delivery notice:",p)}return this.callbacks.onSubmit&&await this.callbacks.onSubmit(l),se(this.schema.id,l.quoteId,this.currentQuote.target,l.lead.email),this.isSubmitting=!1,this.isSubmitted=!0,this.lastSubmission=l,this.render(),l}catch(p){return this.isSubmitting=!1,this.callbacks.onError&&this.callbacks.onError(p),this.fieldErrors._global="Submission failed. Please check your connection and try again.",this.render(),null}}reset(){this.formState={},this.schema.steps.forEach(e=>{e.fields.forEach(t=>{t.defaultValue!==void 0&&(this.formState[t.id]=t.defaultValue)})}),this.currentStepIndex=0,this.isSubmitted=!1,this.isSubmitting=!1,this.lastSubmission=null,this.fieldErrors={},this.recalculate()}printReceipt(){typeof window<"u"&&window.print()}render(){var l;const e=W(this.schema.theme);let t="";this.isSubmitted&&this.lastSubmission?t=this.renderSuccessScreen(this.lastSubmission):this.isLeadFormStep()?t=this.renderLeadFormStep():t=this.renderStepForm(this.schema.steps[this.currentStepIndex]);const n=this.showBreakdownModal?this.renderBreakdownModal():"",i=`
      <style>${e}</style>
      <div class="nym-container" role="region" aria-label="${a(this.schema.name)}">
        <!-- Header -->
        <header class="nym-header">
          <div class="nym-header-content">
            <h2>${a(this.schema.name)}</h2>
            ${this.schema.description?`<p>${a(this.schema.description)}</p>`:""}
          </div>
          ${this.schema.badge?`<span class="nym-badge">${a(this.schema.badge)}</span>`:""}
        </header>

        <!-- Live Reactive Range Banner -->
        <div class="nym-range-banner">
          <div class="nym-range-info">
            <span class="nym-range-label">Instant Estimated Range</span>
            <div class="nym-range-values">
              <span class="nym-range-amount">${a(this.currentQuote.formattedMin)}</span>
              <span class="nym-range-separator">&ndash;</span>
              <span class="nym-range-amount">${a(this.currentQuote.formattedMax)}</span>
            </div>
            <span class="nym-range-target">Baseline Target: <strong>${a(this.currentQuote.formattedTarget)}</strong></span>
          </div>
          <button type="button" class="nym-btn-breakdown" id="nym-toggle-breakdown" aria-label="View cost breakdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            Itemized Breakdown
          </button>
        </div>

        <!-- Stepper Progress Dots -->
        <div class="nym-stepper" aria-label="Quote Progress">
          ${Array.from({length:this.getTotalStepsCount()}).map((p,m)=>{let s="nym-step-dot";return m===this.currentStepIndex&&(s+=" active"),m<this.currentStepIndex&&(s+=" completed"),`<div class="${s}"></div>`}).join("")}
        </div>
        <div class="nym-step-legend">
          <span>Step ${this.currentStepIndex+1} of ${this.getTotalStepsCount()}</span>
          <span>${this.isLeadFormStep()?"Lead Contact & Booking":a(((l=this.schema.steps[this.currentStepIndex])==null?void 0:l.title)||"")}</span>
        </div>

        <!-- Main Step Form Content -->
        ${t}

        <!-- Recommendations Box if available -->
        ${this.currentQuote.recommendations.length>0&&!this.isSubmitted?`
          <div class="nym-recommendations">
            ${this.currentQuote.recommendations.map(p=>`
              <div class="nym-recommendation-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${a(p)}</span>
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
        ${n}
      </div>
    `;this.container.innerHTML=i,this.attachEventListeners()}renderStepForm(e){const t=this.currentStepIndex===0;return`
      <div class="nym-step-view">
        <h3 class="nym-step-title">${a(e.title)}</h3>
        ${e.subtitle?`<p class="nym-step-subtitle">${a(e.subtitle)}</p>`:""}

        <div class="nym-fields-list">
          ${e.fields.map(n=>this.renderField(n)).join("")}
        </div>

        <div class="nym-footer">
          ${t?"<div></div>":`
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Back
            </button>
          `}
          <button type="button" class="nym-btn nym-btn-primary" id="nym-btn-next">
            ${this.currentStepIndex===this.schema.steps.length-1&&!this.isLeadFormEnabled()?"Finish Quote":"Continue &rarr;"}
          </button>
        </div>
      </div>
    `}renderField(e){var l,p,m;if(!M(e.condition,this.formState))return"";const t=this.formState[e.id]!==void 0?this.formState[e.id]:e.defaultValue??"",n=this.fieldErrors[e.id];let i="";switch(e.type){case"slider":{const s=e.min??100,c=e.max??5e3,d=e.step??50,v=Number(t)||s;i=`
          <div class="nym-slider-container">
            <div class="nym-slider-header">
              <span class="nym-slider-ticks">${s} ${e.unit||""}</span>
              <span class="nym-slider-val" id="val-${e.id}">${v} ${e.unit||""}</span>
              <span class="nym-slider-ticks">${c} ${e.unit||""}</span>
            </div>
            <input 
              type="range" 
              class="nym-slider nym-reactive-input" 
              data-field-id="${e.id}" 
              min="${s}" 
              max="${c}" 
              step="${d}" 
              value="${v}"
              aria-label="${a(e.label)}"
            />
          </div>
        `;break}case"select":{i=`
          <select class="nym-select nym-reactive-input" data-field-id="${e.id}" aria-label="${a(e.label)}">
            ${(l=e.options)==null?void 0:l.map(s=>`
              <option value="${a(s.id)}" ${String(t)===String(s.id)?"selected":""}>
                ${a(s.label)} ${s.adder?`(+${this.currentQuote.currencySymbol}${s.adder})`:""} ${s.multiplier?`(${s.multiplier}x)`:""}
              </option>
            `).join("")}
          </select>
        `;break}case"radio":{i=`
          <div class="nym-options-grid" role="radiogroup" aria-label="${a(e.label)}">
            ${(p=e.options)==null?void 0:p.map(s=>{const c=String(t)===String(s.id);return`
                <div 
                  class="nym-option-card ${c?"selected":""}" 
                  data-field-id="${e.id}" 
                  data-option-id="${a(s.id)}"
                  role="radio"
                  aria-checked="${c}"
                  tabindex="0"
                >
                  <div class="nym-option-header">
                    <span class="nym-option-title">${a(s.label)}</span>
                    ${s.badge?`<span class="nym-option-badge">${a(s.badge)}</span>`:""}
                  </div>
                  ${s.description?`<p class="nym-option-desc">${a(s.description)}</p>`:""}
                  ${s.adder||s.multiplier?`
                    <div class="nym-option-price">
                      ${s.adder?`+${this.currentQuote.currencySymbol}${s.adder}`:""}
                      ${s.multiplier?`${s.multiplier}x multiplier`:""}
                    </div>
                  `:""}
                </div>
              `}).join("")}
          </div>
        `;break}case"checkbox":{const s=Array.isArray(t)?t:[];i=`
          <div class="nym-checkbox-list">
            ${(m=e.options)==null?void 0:m.map(c=>{const d=s.includes(c.id);return`
                <div 
                  class="nym-checkbox-item ${d?"checked":""}" 
                  data-field-id="${e.id}" 
                  data-checkbox-id="${a(c.id)}"
                  role="checkbox"
                  aria-checked="${d}"
                  tabindex="0"
                >
                  <div class="nym-checkbox-box">
                    ${d?"✓":""}
                  </div>
                  <div class="nym-checkbox-info">
                    <div class="nym-checkbox-title">
                      <span>${a(c.label)}</span>
                      ${c.adder?`<span>+${this.currentQuote.currencySymbol}${c.adder}</span>`:""}
                    </div>
                    ${c.description?`<div class="nym-checkbox-desc">${a(c.description)}</div>`:""}
                  </div>
                </div>
              `}).join("")}
          </div>
        `;break}case"number":case"stepper":{i=`
          <input 
            type="number" 
            class="nym-input nym-reactive-input" 
            data-field-id="${e.id}" 
            min="${e.min??0}" 
            max="${e.max??999999}" 
            step="${e.step??1}" 
            value="${a(t)}"
            placeholder="${e.placeholder?a(e.placeholder):""}"
            aria-label="${a(e.label)}"
          />
        `;break}default:i=`
          <input 
            type="text" 
            class="nym-input nym-reactive-input" 
            data-field-id="${e.id}" 
            value="${a(t)}"
            placeholder="${e.placeholder?a(e.placeholder):""}"
            aria-label="${a(e.label)}"
          />
        `}return`
      <div class="nym-field-group">
        <label class="nym-label">
          <span>${a(e.label)}${e.required?" *":""}</span>
          ${e.unit&&e.type!=="slider"?`<span class="nym-helper-text">${a(e.unit)}</span>`:""}
        </label>
        ${i}
        ${e.helperText?`<div class="nym-helper-text">${a(e.helperText)}</div>`:""}
        ${n?`<div class="nym-error-text">${a(n)}</div>`:""}
      </div>
    `}renderLeadFormStep(){const e=this.schema.leadForm,t=this.fieldErrors._global;return`
      <div class="nym-lead-step">
        <h3 class="nym-step-title">${a((e==null?void 0:e.title)||"Lock in Your Official Quote")}</h3>
        <p class="nym-step-subtitle">${a((e==null?void 0:e.subtitle)||"Enter your contact details to save your estimate, receive your official PDF breakdown, and schedule an on-site inspection.")}</p>

        ${t?`<div class="nym-error-text" style="margin-bottom: 16px;">${a(t)}</div>`:""}

        <form id="nym-lead-form">
          <div class="nym-field-group">
            <label class="nym-label">Full Name *</label>
            <input type="text" name="name" class="nym-input" required placeholder="e.g. Alex Morgan" value="${a(this.formState._lead_name||"")}" />
            ${this.fieldErrors.lead_name?`<div class="nym-error-text">${a(this.fieldErrors.lead_name)}</div>`:""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Email Address *</label>
            <input type="email" name="email" class="nym-input" required placeholder="alex@example.com" value="${a(this.formState._lead_email||"")}" />
            ${this.fieldErrors.lead_email?`<div class="nym-error-text">${a(this.fieldErrors.lead_email)}</div>`:""}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Phone Number ${e!=null&&e.requirePhone?"*":"(Optional)"}</label>
            <input type="tel" name="phone" class="nym-input" ${e!=null&&e.requirePhone?"required":""} placeholder="(555) 019-2834" value="${a(this.formState._lead_phone||"")}" />
            ${this.fieldErrors.lead_phone?`<div class="nym-error-text">${a(this.fieldErrors.lead_phone)}</div>`:""}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="nym-field-group">
              <label class="nym-label">Street Address ${e!=null&&e.requireAddress?"*":""}</label>
              <input type="text" name="address" class="nym-input" placeholder="123 Maple Way" value="${a(this.formState._lead_address||"")}" />
              ${this.fieldErrors.lead_address?`<div class="nym-error-text">${a(this.fieldErrors.lead_address)}</div>`:""}
            </div>
            <div class="nym-field-group">
              <label class="nym-label">Zip Code</label>
              <input type="text" name="zipCode" class="nym-input" placeholder="90210" value="${a(this.formState._lead_zip||"")}" />
            </div>
          </div>

          ${e!=null&&e.requireDate?`
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nym-field-group">
                <label class="nym-label">Preferred Date</label>
                <input type="date" name="preferredDate" class="nym-input" value="${a(this.formState._lead_date||"")}" />
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
              <textarea name="notes" class="nym-textarea" placeholder="Tell us about specific property access, timeline goals, or special requirements...">${a(this.formState._lead_notes||"")}</textarea>
            </div>
          `:""}

          <div class="nym-helper-text" style="margin-bottom: 20px;">
            ${a((e==null?void 0:e.disclaimerText)||"By submitting, you agree to receive project updates and quote confirmation. We respect your privacy and never sell data.")}
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
    `}renderSuccessScreen(e){const t=this.schema.leadForm;return`
      <div class="nym-success-screen">
        <div class="nym-success-icon">✓</div>
        <h3 class="nym-step-title">${a((t==null?void 0:t.successTitle)||"Estimate Successfully Saved & Confirmed!")}</h3>
        <p class="nym-step-subtitle">${a((t==null?void 0:t.successMessage)||"A detailed quote confirmation and project summary have been dispatched to your email.")}</p>

        <div class="nym-receipt-card">
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Quote Reference ID:</span>
            <span class="nym-receipt-val" style="font-family: monospace;">${a(e.quoteId)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Estimated Price Range:</span>
            <span class="nym-receipt-val" style="color: var(--nym-accent); font-size: 1.05rem;">
              ${a(e.quote.formattedMin)} &ndash; ${a(e.quote.formattedMax)}
            </span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Baseline Target:</span>
            <span class="nym-receipt-val">${a(e.quote.formattedTarget)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Recipient:</span>
            <span class="nym-receipt-val">${a(e.lead.name)} (${a(e.lead.email)})</span>
          </div>
          ${e.lead.preferredDate?`
            <div class="nym-receipt-row">
              <span class="nym-receipt-key">Requested Consultation:</span>
              <span class="nym-receipt-val">${a(e.lead.preferredDate)} (${a(e.lead.preferredTime||"Anytime")})</span>
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
                      <div class="nym-breakdown-label">${a(e.label)}</div>
                      ${e.description?`<div class="nym-breakdown-subtext">${a(e.description)}</div>`:""}
                    </td>
                    <td class="nym-breakdown-val">${a(e.formattedAmount)}</td>
                  </tr>
                `).join("")}
                <tr class="nym-breakdown-total">
                  <td><strong>Estimated Baseline Target</strong></td>
                  <td class="nym-breakdown-val">${a(this.currentQuote.formattedTarget)}</td>
                </tr>
                <tr>
                  <td><strong>Dynamic Estimated Range</strong></td>
                  <td class="nym-breakdown-val">${a(this.currentQuote.formattedMin)} &ndash; ${a(this.currentQuote.formattedMax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(".nym-reactive-input").forEach(b=>{b.addEventListener("input",x=>{const f=x.target,S=f.getAttribute("data-field-id");if(S){this.updateState(S,f.value);const E=this.container.querySelector(`#val-${S}`);E&&(E.textContent=`${f.value} ${f.getAttribute("data-unit")||""}`.trim())}})}),this.container.querySelectorAll(".nym-option-card").forEach(b=>{b.addEventListener("click",()=>{const x=b.getAttribute("data-field-id"),f=b.getAttribute("data-option-id");x&&f&&this.updateState(x,f)})}),this.container.querySelectorAll(".nym-checkbox-item").forEach(b=>{b.addEventListener("click",()=>{const x=b.getAttribute("data-field-id"),f=b.getAttribute("data-checkbox-id");if(x&&f){const S=Array.isArray(this.formState[x])?[...this.formState[x]]:[],E=S.indexOf(f);E>=0?S.splice(E,1):S.push(f),this.updateState(x,S)}})});const i=this.container.querySelector("#nym-btn-next");i&&i.addEventListener("click",()=>this.nextStep());const l=this.container.querySelector("#nym-btn-prev");l&&l.addEventListener("click",()=>this.prevStep());const p=this.container.querySelector("#nym-lead-form");p&&p.addEventListener("submit",b=>{b.preventDefault();const x=new FormData(p),f={};x.forEach((S,E)=>{f[E]=S}),this.submitLead(f)});const m=this.container.querySelector("#nym-toggle-breakdown");m&&m.addEventListener("click",()=>{this.showBreakdownModal=!0,this.render()});const s=this.container.querySelector("#nym-modal-close");s&&s.addEventListener("click",()=>{this.showBreakdownModal=!1,this.render()});const c=this.container.querySelector("#nym-modal-backdrop");c&&c.addEventListener("click",b=>{b.target===c&&(this.showBreakdownModal=!1,this.render())});const d=this.container.querySelector("#nym-btn-print");d&&d.addEventListener("click",()=>this.printReceipt());const v=this.container.querySelector("#nym-btn-restart");v&&v.addEventListener("click",()=>this.reset())}}function O(r,e){const t=typeof r=="string"?document.querySelector(r):r;if(!t)throw new Error(`[NymrelQuote] Container element not found: ${r}`);return new R(t,e)}const Y={id:"roofing-estimator-v1",name:"Residential Roofing & Siding Estimator",description:"Calculate instant replacement estimates based on roof footprint, pitch difficulty, and premium material options.",badge:"Instant Estimate",pricing:{baseCalloutFee:450,marginPercent:10,minRangeSpreadPercent:8,maxRangeSpreadPercent:14,currency:"USD",currencySymbol:"$",rounding:"nearest50"},steps:[{id:"step-dimensions",title:"Roof Dimensions & Slope",subtitle:"Specify your home roof area and pitch characteristics.",fields:[{id:"roof_sqft",label:"Estimated Roof Surface Area",type:"slider",min:800,max:6e3,step:50,defaultValue:2200,unit:"sq ft",unitPrice:3.5,category:"dimension",required:!0,helperText:"A typical 2,000 sq ft home usually has approx. 2,200 - 2,400 sq ft of roof area."},{id:"roof_pitch",label:"Roof Pitch / Steepness",type:"radio",defaultValue:"medium",category:"condition",options:[{id:"flat",label:"Flat / Low Slope (0:12 - 3:12)",description:"Requires specialized membrane or self-adhering roll roofing",value:"flat",multiplier:1.15},{id:"medium",label:"Standard Pitch (4:12 - 7:12)",description:"Walkable standard residential pitch",value:"medium",multiplier:1,badge:"Most Common"},{id:"steep",label:"Steep Pitch (8:12 - 12:12)",description:"Requires full safety rigging, specialized scaffolding, and harness anchors",value:"steep",multiplier:1.3,badge:"Specialized"}]},{id:"stories",label:"Number of Stories",type:"select",defaultValue:"1",options:[{id:"1",label:"1 Story (Standard Access)",value:"1",multiplier:1},{id:"2",label:"2 Stories (High Reach)",value:"2",multiplier:1.12},{id:"3",label:"3+ Stories (Crane / Scaffolding Required)",value:"3",multiplier:1.25}]}]},{id:"step-materials",title:"Material Tier & Underlayment",subtitle:"Select your preferred roofing material and architectural style.",fields:[{id:"material",label:"Roofing Material",type:"radio",defaultValue:"arch_shingle",category:"material",required:!0,options:[{id:"3tab_shingle",label:"Standard 3-Tab Asphalt",description:"20-year rated economical protection",value:"3tab_shingle",multiplier:1,adder:0},{id:"arch_shingle",label:"Architectural Shingles (Timberline HDZ)",description:"30-50 year architectural dimensional shingles with 130 MPH wind warranty",value:"arch_shingle",multiplier:1.22,adder:600,badge:"Top Pick"},{id:"standing_seam",label:"Standing Seam Metal (24-Gauge)",description:"Lifetime 50+ year energy-star rated metal roof with concealed fasteners",value:"standing_seam",multiplier:2.1,adder:3500,badge:"Lifetime"},{id:"cedar_shake",label:"Hand-Split Cedar Shake",description:"Natural rustic wood shake treated with Class A fire retardant",value:"cedar_shake",multiplier:2.65,adder:5200}]}]},{id:"step-addons",title:"Tear-Off, Ventilation & Add-Ons",subtitle:"Select optional upgrades, disposal services, and protective warranties.",fields:[{id:"addons",label:"Project Options & Upgrades",type:"checkbox",defaultValue:["tear_off"],category:"addon",options:[{id:"tear_off",label:"Complete Old Roof Tear-Off & Haul Away Disposal",description:"Stripping existing layers down to bare decking and inspecting plywood",value:"tear_off",adder:1250,badge:"Recommended"},{id:"ice_water_barrier",label:"Full Eave & Valley Ice & Water Shield Membrane",description:"Prevents ice-dam backup and heavy rain infiltration",value:"ice_water_barrier",adder:650},{id:"ridge_vent",label:"Continuous High-Flow Ridge Ventilation System",description:"Improves attic airflow and lowers summer cooling costs",value:"ridge_vent",adder:480},{id:"gutter_replacement",label:'Seamless Aluminum 6" Gutters & Downspouts',description:"Replaces perimeter gutters with seamless custom-extruded aluminum",value:"gutter_replacement",adder:1800}]}]}],leadForm:{enabled:!0,title:"Lock In Your Free Roof Inspection & Exact Quote",subtitle:"Enter your address to receive an official PDF report, satellite roof measurement verification, and schedule your on-site consultation.",requirePhone:!0,requireAddress:!0,requireDate:!0,submitButtonText:"Confirm Quote & Book Inspection",successTitle:"Quote Confirmed & Roofing Inspector Assigned!",successMessage:"Your estimated quote has been saved. Our master roofer will confirm your consultation window shortly."}},D={roofing:Y,hvac:{id:"hvac-estimator-v1",name:"HVAC & Heat Pump System Replacement Calculator",description:"Size your home HVAC requirements, calculate SEER2 efficiency tiers, and evaluate full installation costs.",badge:"Energy Star Ready",pricing:{baseCalloutFee:650,marginPercent:8,minRangeSpreadPercent:6,maxRangeSpreadPercent:12,currency:"USD",currencySymbol:"$",rounding:"nearest50"},steps:[{id:"step-sizing",title:"Home Square Footage & Climate",subtitle:"Determine thermal load and ton sizing.",fields:[{id:"home_sqft",label:"Conditioned Living Space",type:"slider",min:600,max:5e3,step:100,defaultValue:1800,unit:"sq ft",unitPrice:1.8,category:"dimension",required:!0},{id:"system_type",label:"System Configuration",type:"radio",defaultValue:"heat_pump",options:[{id:"heat_pump",label:"Inverter Heat Pump (All-Electric Heating & Cooling)",description:"Year-round high efficiency heating down to -15°F with Federal Tax Credit eligibility",value:"heat_pump",adder:1800,multiplier:1.15,badge:"$2,000 Tax Credit"},{id:"split_system",label:"Standard AC + High-Efficiency Gas Furnace",description:"Dual fuel conventional system with 96% AFUE gas heating",value:"split_system",adder:1200,multiplier:1.05},{id:"ductless_mini",label:"Multi-Zone Ductless Mini-Split (3 Zones)",description:"Zoned climate control without requiring existing central ductwork",value:"ductless_mini",adder:2600,multiplier:1.25,badge:"No Ducts Needed"}]}]},{id:"step-efficiency",title:"SEER2 Efficiency & Equipment Tier",subtitle:"Select energy rating and compressor technology.",fields:[{id:"efficiency_tier",label:"Efficiency Tier",type:"radio",defaultValue:"seer16",category:"material",options:[{id:"seer14",label:"Standard 14.3 SEER2 (Single-Stage)",description:"Baseline reliable code-compliant cooling",value:"seer14",multiplier:1,adder:0},{id:"seer16",label:"High Efficiency 16.2 SEER2 (Two-Stage)",description:"Quieter operation, superior humidity removal, and lower utility bills",value:"seer16",multiplier:1.2,adder:950,badge:"Most Popular"},{id:"seer20",label:"Ultra Inverter 20+ SEER2 (Variable Speed)",description:"Whisper-quiet modulation with up to 45% electricity savings",value:"seer20",multiplier:1.55,adder:2400,badge:"Maximum Rebates"}]}]},{id:"step-addons",title:"Ductwork & Air Quality Add-Ons",subtitle:"Select optional filtration, smart thermostats, and extended warranties.",fields:[{id:"hvac_addons",label:"Air Quality & Installation Upgrades",type:"checkbox",defaultValue:["smart_thermostat"],category:"addon",options:[{id:"smart_thermostat",label:"Ecobee / Nest Smart Thermostat with Room Sensors",description:"Wi-Fi learning thermostat with multi-room temperature balancing",value:"smart_thermostat",adder:350},{id:"air_purifier",label:"Whole-Home MERV 16 & UV-C Air Scrubber System",description:"Destroys 99% of airborne allergens, mold spores, and viruses",value:"air_purifier",adder:1100},{id:"duct_mod",label:"Ductwork Sealing, Return Plenum Rework & Insulation",description:"AeroSeal duct leakage sealing to recover up to 30% lost conditioned air",value:"duct_mod",adder:1450},{id:"warranty_10yr",label:"10-Year Full Parts & Labor Extended Master Warranty",description:"Zero deductible 10-year total coverage including annual tune-up",value:"warranty_10yr",adder:850,badge:"Peace of Mind"}]}]}],leadForm:{enabled:!0,title:"Schedule Your In-Home Load Calculation",subtitle:"Lock in manufacturer instant rebates and federal tax credit guidance with an on-site EPA-certified technician.",requirePhone:!0,requireAddress:!0,requireDate:!0,submitButtonText:"Reserve HVAC Installation Window"}},plumbing:{id:"plumbing-estimator-v1",name:"Residential Plumbing & Whole-House Repipe Estimator",description:"Calculate instant costs for bathroom fixture installations, tankless water heater retrofits, and whole-home copper-to-PEX repiping.",badge:"Same-Day Dispatch",pricing:{baseCalloutFee:195,marginPercent:12,minRangeSpreadPercent:10,maxRangeSpreadPercent:16,currency:"USD",currencySymbol:"$",rounding:"nearest10"},steps:[{id:"step-scope",title:"Project Scope & Fixture Count",subtitle:"Specify the bathrooms, kitchens, and plumbing fixtures involved.",fields:[{id:"bathrooms",label:"Total Number of Bathrooms in Home",type:"select",defaultValue:"2",options:[{id:"1",label:"1 Full Bathroom",value:"1",multiplier:1},{id:"2",label:"2 Bathrooms",value:"2",multiplier:1.35},{id:"3",label:"3 Bathrooms",value:"3",multiplier:1.7},{id:"4",label:"4+ Bathrooms",value:"4",multiplier:2.1}]},{id:"job_type",label:"Primary Plumbing Service Needed",type:"radio",defaultValue:"repipe",required:!0,options:[{id:"water_heater",label:"Water Heater Replacement / Upgrade",description:"Replace aging tank with high-efficiency standard or tankless model",value:"water_heater",adder:1600},{id:"repipe",label:"Whole-House Water Supply Line Repiping",description:"Replacing old galvanized or leaking polybutylene with Uponor PEX-A expansion piping",value:"repipe",adder:4200,badge:"Flagship Service"},{id:"main_sewer",label:"Trenchless Sewer Line Repair / Hydro-Jetting",description:"CIPP epoxy pipelining or directional drilling without digging trenches",value:"main_sewer",adder:3800},{id:"fixtures",label:"Fixture Installation & Drain Relocation",description:"New vanity, toilet, tub/shower valves, and garbage disposal",value:"fixtures",adder:850}]},{id:"pipe_material",label:"Supply Piping Material Preference",type:"radio",defaultValue:"pex_a",condition:{fieldId:"job_type",operator:"equals",value:"repipe"},options:[{id:"pex_a",label:"Uponor PEX-A ProPEX Expansion",description:"Freeze-resistant flexible cross-linked polyethylene with 25-year manufacturer warranty",value:"pex_a",multiplier:1,badge:"Recommended"},{id:"copper_type_l",label:"Type L Rigid Copper Tubing (Lead-Free Solder)",description:"Traditional solid American-made hard drawn copper piping",value:"copper_type_l",multiplier:1.55,adder:1200}]}]},{id:"step-addons",title:"Water Heater & Filtration Upgrades",subtitle:"Optional whole-home filtration, recirculation loops, and emergency rush dispatch.",fields:[{id:"plumbing_upgrades",label:"System Upgrades & Add-Ons",type:"checkbox",defaultValue:[],category:"addon",options:[{id:"tankless_gas",label:"Navien Premium Condensing Tankless Water Heater (NPE-240A2)",description:"Endless continuous on-demand hot water with built-in recirculation pump",value:"tankless_gas",adder:2850,badge:"Endless Hot Water"},{id:"water_softener",label:"Whole-Home Water Softener & Carbon Filtration System",description:"Protects pipes and appliances against hard water scale buildup and removes chlorine",value:"water_softener",adder:1650},{id:"smart_shutoff",label:"Flo by Moen Smart Water Shutoff & Ultrasonic Leak Detector",description:"24/7 automated monitoring that shuts off water main in seconds during a pipe burst",value:"smart_shutoff",adder:750,badge:"Insurance Discount"},{id:"emergency_rush",label:"24/7 Emergency Priority Dispatch (Same-Day / Weekend)",description:"Dispatches emergency master plumber within 2 hours",value:"emergency_rush",adder:350,multiplier:1.15}]}]}],leadForm:{enabled:!0,title:"Book Your Licensed Master Plumber Inspection",subtitle:"Lock in pricing with zero surprise charges. All work backed by our 100% Satisfaction Guarantee.",requirePhone:!0,requireAddress:!0,requireDate:!0,submitButtonText:"Book Plumbing Service"}},software:{id:"software-estimator-v1",name:"Custom Software & AI SaaS Scoping Calculator",description:"Estimate engineering sprints, cloud architecture, AI workflows, and development timeline for bespoke web and mobile applications.",badge:"SaaS & AI Scoping",pricing:{baseCalloutFee:1500,marginPercent:15,minRangeSpreadPercent:12,maxRangeSpreadPercent:20,currency:"USD",currencySymbol:"$",rounding:"nearest100"},steps:[{id:"step-architecture",title:"Platform Scope & User Architecture",subtitle:"Define core views, auth complexity, and multi-tenant requirements.",fields:[{id:"core_screens",label:"Number of Core Custom Screens / Workflows",type:"slider",min:3,max:30,step:1,defaultValue:8,unit:"screens",unitPrice:950,category:"dimension",required:!0},{id:"app_platform",label:"Target Platform Deployment",type:"radio",defaultValue:"web_responsive",options:[{id:"web_responsive",label:"Responsive Web Application (Next.js / Vite)",description:"Fast, SEO-optimized web app for desktop, tablet, and mobile browsers",value:"web_responsive",multiplier:1},{id:"cross_platform",label:"Full Cross-Platform (Web + iOS & Android Apps)",description:"Unified React Native / Expo codebase with native App Store builds",value:"cross_platform",multiplier:1.65,adder:3800,badge:"Multi-Platform"}]},{id:"auth_security",label:"Authentication & Access Control Tier",type:"select",defaultValue:"rbac_social",options:[{id:"simple",label:"Basic Email/Password + OAuth (Google/GitHub)",value:"simple",multiplier:1},{id:"rbac_social",label:"Multi-Tenant RBAC + Team Invitations & Permissions",value:"rbac_social",multiplier:1.2,adder:1200},{id:"enterprise_sso",label:"Enterprise SAML / Okta SSO + Audit Logging + SOC2 Ready",value:"enterprise_sso",multiplier:1.45,adder:4500}]}]},{id:"step-features",title:"Integrations, Payments & AI Engine",subtitle:"Select backend microservices, Stripe billing, and LLM automation pipelines.",fields:[{id:"features",label:"Capabilities & Backend Integrations",type:"checkbox",defaultValue:["stripe_billing"],category:"addon",options:[{id:"stripe_billing",label:"Stripe Subscriptions, Invoicing & Usage Metering",description:"Complete webhook lifecycle, customer portal, and tiered plan billing",value:"stripe_billing",adder:2200,badge:"Monetization"},{id:"ai_agent_workflows",label:"Autonomous AI Agent Workflows & RAG Vector Search",description:"Embedding generation, vector store retrieval, and streaming LLM chat agent",value:"ai_agent_workflows",adder:4800,badge:"AI Powered"},{id:"realtime_collab",label:"Real-Time WebSockets & Multiplayer Collaboration",description:"Live presence, collaborative canvas / state synchronization, and instant alerts",value:"realtime_collab",adder:2900},{id:"analytics_bi",label:"Custom Admin BI Dashboard & CSV/PDF Data Exports",description:"Executive KPI reporting, interactive charts, and scheduled report delivery",value:"analytics_bi",adder:1850}]}]},{id:"step-timeline",title:"Timeline Urgency & SLA Support",subtitle:"Choose delivery velocity and ongoing devops maintenance tier.",fields:[{id:"timeline_urgency",label:"Delivery Timeline",type:"radio",defaultValue:"standard",options:[{id:"standard",label:"Standard Sprint Cadence (6 - 8 Weeks MVP)",description:"Thorough staging, weekly reviews, and structured QA sprints",value:"standard",multiplier:1},{id:"expedited",label:"Expedited Launch (3 - 4 Weeks Dedicated Swarm)",description:"Dedicated multi-engineer team with continuous deployment cycles",value:"expedited",multiplier:1.35,badge:"Fast Track"}]}]}],leadForm:{enabled:!0,title:"Reserve Your Technical Architecture & Scoping Session",subtitle:"Lock in sprint availability, receive an interactive scope document, and review database schemas with a Principal Engineer.",requirePhone:!1,requireAddress:!1,requireDate:!0,submitButtonText:"Submit Project Scope & Book Discovery Call"}}};function B(r){const e=r.toLowerCase().trim();return D[e]}class N extends HTMLElement{constructor(){super(...arguments);w(this,"widgetInstance",null)}static get observedAttributes(){return["config","src","webhook-url","source-label","theme-mode","mode"]}connectedCallback(){this.initWidget()}disconnectedCallback(){this.widgetInstance=null}attributeChangedCallback(t,n,i){n!==i&&this.isConnected&&this.initWidget()}async initWidget(){const t=this.getAttribute("config"),n=this.getAttribute("src"),i=this.getAttribute("webhook-url")||void 0,l=this.getAttribute("source-label")||void 0,p=this.getAttribute("theme-mode")||"warm",m=this.getAttribute("mode")||"shadow";let s=Y;if(n)try{const d=await fetch(n);if(!d.ok)throw new Error(`Failed to load quote config from ${n}: HTTP ${d.status}`);s=await d.json()}catch(d){console.error("[NymrelQuoteLayer] Schema fetch error:",d),this.dispatchEvent(new CustomEvent("nymrel:error",{bubbles:!0,composed:!0,detail:{error:d.message}}))}else if(t){const d=B(t);if(d)s=d;else try{s=JSON.parse(t)}catch{console.warn(`[NymrelQuoteLayer] Could not parse config attribute as JSON or preset name: "${t}". Using default roofing preset.`)}}s&&(s={...s,theme:{...s.theme,mode:p}}),this.widgetInstance=new R(this,{schema:s,sourceLabel:l,webhookUrl:i,useShadowDom:m!=="light",callbacks:{onCalculate:(d,v)=>{this.dispatchEvent(new CustomEvent("nymrel:quote-calculated",{bubbles:!0,composed:!0,detail:{quote:d,formState:v}}))},onStepChange:(d,v)=>{this.dispatchEvent(new CustomEvent("nymrel:step-change",{bubbles:!0,composed:!0,detail:{stepIndex:d,step:v}}))},onSubmit:d=>{this.dispatchEvent(new CustomEvent("nymrel:lead-submitted",{bubbles:!0,composed:!0,detail:{submission:d}}))},onError:d=>{this.dispatchEvent(new CustomEvent("nymrel:error",{bubbles:!0,composed:!0,detail:{error:typeof d=="string"?d:d.message}}))}}});const c=this.widgetInstance.recalculate();this.dispatchEvent(new CustomEvent("nymrel:quote-calculated",{bubbles:!0,composed:!0,detail:{quote:c,formState:{}}}))}getWidget(){return this.widgetInstance}nextStep(){var t;return((t=this.widgetInstance)==null?void 0:t.nextStep())??!1}prevStep(){var t;(t=this.widgetInstance)==null||t.prevStep()}reset(){var t;(t=this.widgetInstance)==null||t.reset()}recalculate(){var t;return(t=this.widgetInstance)==null?void 0:t.recalculate()}}function ce(r="nymrel-quote-layer"){typeof window<"u"&&typeof customElements<"u"&&(customElements.get(r)||customElements.define(r,N))}ce("nymrel-quote-layer");const G={version:"1.0.0",createQuoteWidget:O,NymrelQuoteWidget:R,NymrelQuoteLayerElement:N,calculateQuote:P,formatCurrency:g,generateQuoteId:$,extractAttribution:T,emitAnalyticsEvent:A,getPreset:B,presets:D,themes:{warm:V,light:j,dark:U,getShadowStyles:W}};typeof window<"u"&&(window.NymrelQuote=G),h.NymrelQuoteLayerElement=N,h.NymrelQuoteWidget=R,h.PRESET_REGISTRY=D,h.calculateQuote=P,h.createQuoteWidget=O,h.default=G,h.extractAttribution=T,h.formatCurrency=g,h.getPreset=B,Object.defineProperties(h,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
