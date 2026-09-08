function e(e=`NYM`){let t=new Date;return`${e}-${t.getFullYear()}${String(t.getMonth()+1).padStart(2,`0`)}${String(t.getDate()).padStart(2,`0`)}-${Array.from(globalThis.crypto.getRandomValues(new Uint8Array(6)),e=>(e%36).toString(36)).join(``).toUpperCase()}`}function t(e,t=`USD`,n=`$`,r=0){if(isNaN(e)||e==null)return`${n}0`;let i=(r>0?e.toFixed(r):Math.round(e).toString()).split(`.`);return i[0]=i[0].replace(/\B(?=(\d{3})+(?!\d))/g,`,`),`${n}${i.join(`.`)}`}function n(e){if(e==null)return e;if(typeof e==`string`){let t=``,n=!1,r=!1;for(let i=0;i<e.length;i+=1){let a=e[i];if(a===`<`){let t=e.slice(i,i+7).toLowerCase()===`<script`,a=e.slice(i,i+8).toLowerCase()===`<\/script`,o=e[i+(a?8:7)];(t||a)&&(o===`>`||/\s/u.test(o||``))&&(r=t),n=!0}else a===`>`?n=!1:!n&&!r&&(t+=a)}return t.trim()}return typeof e==`number`?isNaN(e)?0:e:Array.isArray(e)?e.map(n):e}function r(e,t){if(!e||!e.fieldId)return!0;let n=t[e.fieldId];switch(e.operator){case`equals`:return n===e.value||String(n)===String(e.value);case`notEquals`:return n!==e.value&&String(n)!==String(e.value);case`greaterThan`:return Number(n)>Number(e.value);case`lessThan`:return Number(n)<Number(e.value);case`in`:return Array.isArray(e.value)?e.value.includes(n):!1;case`contains`:return Array.isArray(n)?n.includes(e.value):typeof n==`string`&&n.includes(String(e.value));default:return!0}}function i(e,t){if(e.required&&(t==null||t===``||Array.isArray(t)&&t.length===0))return{valid:!1,error:`${e.label} is required.`};if(t!=null&&t!==``){if(e.type===`number`||e.type===`slider`||e.type===`stepper`){let n=Number(t);if(isNaN(n))return{valid:!1,error:`${e.label} must be a valid number.`};if(e.min!==void 0&&n<e.min)return{valid:!1,error:`Minimum value is ${e.min} ${e.unit||``}`.trim()};if(e.max!==void 0&&n>e.max)return{valid:!1,error:`Maximum value is ${e.max} ${e.unit||``}`.trim()}}if(e.type===`email`&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(t)))return{valid:!1,error:`Please enter a valid email address.`};if(e.type===`phone`){let e=String(t).replace(/[\s()\-\.]/g,``);if(e.length<7||!/^\+?[0-9]{7,15}$/.test(e))return{valid:!1,error:`Please enter a valid phone number.`}}}return{valid:!0}}function a(e,t){if(!t||t===`none`)return e;switch(t){case`round`:return Math.round(e);case`ceil`:return Math.ceil(e);case`floor`:return Math.floor(e);case`nearest10`:return Math.round(e/10)*10;case`nearest50`:return Math.round(e/50)*50;case`nearest100`:return Math.round(e/100)*100;default:return e}}function o(n,i){let o=n.pricing?.currency||`USD`,s=n.pricing?.currencySymbol||`$`,c=n.pricing||{},l=i._quoteId||e(),u=[];if(n.steps.forEach(e=>{e.fields.forEach(e=>{u.push(e)})}),c.formula===`custom`&&typeof c.customFormula==`function`){let e=c.customFormula(i,u),n=a(e.target,c.rounding),r=a(e.min,c.rounding),d=a(e.max,c.rounding);return{min:r,max:d,target:n,formattedMin:t(r,o,s),formattedMax:t(d,o,s),formattedTarget:t(n,o,s),currency:o,currencySymbol:s,breakdown:e.breakdown||[],recommendations:[],calculatedAt:new Date().toISOString(),quoteId:l}}let d=Number(c.baseFee||c.baseCalloutFee||0),f=0,p=0,m=0,h=1,g=[],_=[];d>0&&g.push({id:`base-fee`,label:`Base Callout / Setup Fee`,amount:d,formattedAmount:t(d,o,s),type:`base`,description:`Standard initial mobilization and inspection base`});for(let e of u){if(!r(e.condition,i))continue;let n=i[e.id]===void 0?e.defaultValue:i[e.id];if(n!=null&&n!==``){if(e.type===`number`||e.type===`slider`||e.type===`stepper`){let r=Number(n);if(!isNaN(r)&&r>0){if(e.unitPrice&&e.unitPrice>0){let n=r*e.unitPrice;e.category===`material`?f+=n:p+=n,g.push({id:e.id,label:`${e.label} (${r} ${e.unit||`units`} @ ${t(e.unitPrice,o,s)}/${e.unit||`unit`})`,amount:n,formattedAmount:t(n,o,s),type:e.category===`material`?`material`:`labor`})}e.multiplier&&e.multiplier!==1&&(h*=e.multiplier)}}if((e.type===`select`||e.type===`radio`||e.type===`toggle`)&&e.options&&e.options.length>0){let r=e.options.find(e=>String(e.id)===String(n)||String(e.value)===String(n));if(r){if(r.adder&&Number(r.adder)!==0){let n=Number(r.adder);m+=n,g.push({id:`${e.id}-${r.id}`,label:`${e.label}: ${r.label}`,amount:n,formattedAmount:t(n,o,s),type:e.category===`material`?`material`:`addon`,description:r.description})}if(r.multiplier&&Number(r.multiplier)!==1){let t=Number(r.multiplier);h*=t,g.push({id:`${e.id}-${r.id}-mult`,label:`${r.label} Factor (${t}x)`,amount:0,formattedAmount:`${t}x`,type:`multiplier`,description:r.description})}}}if(e.type===`checkbox`){if(Array.isArray(n)&&e.options)for(let r of n){let n=e.options.find(e=>String(e.id)===String(r)||String(e.value)===String(r));if(n){if(n.adder&&Number(n.adder)!==0){let r=Number(n.adder);m+=r,g.push({id:`${e.id}-${n.id}`,label:n.label,amount:r,formattedAmount:t(r,o,s),type:`addon`,description:n.description})}n.multiplier&&Number(n.multiplier)!==1&&(h*=Number(n.multiplier))}}else typeof n==`boolean`&&n===!0&&(e.unitPrice&&(m+=e.unitPrice,g.push({id:e.id,label:e.label,amount:e.unitPrice,formattedAmount:t(e.unitPrice,o,s),type:`addon`})),e.multiplier&&e.multiplier!==1&&(h*=e.multiplier))}}}let v=d+f+p+m,y=v*h;if(c.taxRate&&c.taxRate>0){let e=y*c.taxRate;g.push({id:`tax`,label:`Estimated Tax (${(c.taxRate*100).toFixed(1)}%)`,amount:e,formattedAmount:t(e,o,s),type:`tax`}),y+=e}let b=c.marginPercent?c.marginPercent/100:.1,x=c.minRangeSpreadPercent?c.minRangeSpreadPercent/100:b,S=c.maxRangeSpreadPercent?c.maxRangeSpreadPercent/100:b,C=Math.max(0,y),w=Math.max(0,C*(1-x)),T=Math.max(w,C*(1+S));v===0&&d===0&&(C=0,w=0,T=0);let E=a(C,c.rounding),D=a(w,c.rounding),O=a(T,c.rounding);return(i.pitch===`steep`||i.difficulty===`extreme`||i.urgency===`emergency`)&&_.push(`Priority Crew Dispatch: Includes safety rigging and on-site supervisor.`),E>5e3&&_.push(`Flexible Financing Available: 0% APR for 12 months on qualifying projects.`),(i.material===`metal`||i.efficiency===`ultra`)&&_.push(`Qualifies for Energy Efficiency Tax Credits & Lifetime Manufacturer Warranty.`),{min:D,max:O,target:E,formattedMin:t(D,o,s),formattedMax:t(O,o,s),formattedTarget:t(E,o,s),currency:o,currencySymbol:s,breakdown:g,recommendations:_,calculatedAt:new Date().toISOString(),quoteId:l}}function s(){return`sess_`+Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)),e=>e.toString(16).padStart(2,`0`)).join(``)}function c(){if(typeof window>`u`)return`desktop`;let e=navigator.userAgent.toLowerCase(),t=window.innerWidth||1024;return/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(e)||t>=768&&t<=1024?`tablet`:/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(e)||t<768?`mobile`:`desktop`}function l(e){if(!e)return``;try{return new URL(e).hostname}catch{return``}}function u(e={}){let t=typeof window<`u`,n=t?new URLSearchParams(window.location.search):new URLSearchParams,r=t&&document.referrer||``,i=t&&window.location.href||``,a=t&&document.title||``,o=t&&navigator.userAgent||``,u=e.customSessionId||``;if(!u&&t){let t=e.storageKey||`nymrel_quote_session_id`;try{u=window.sessionStorage.getItem(t)||``,u||(u=s(),window.sessionStorage.setItem(t,u))}catch{u=s()}}else u||=s();return{utm_source:n.get(`utm_source`)||void 0,utm_medium:n.get(`utm_medium`)||void 0,utm_campaign:n.get(`utm_campaign`)||void 0,utm_term:n.get(`utm_term`)||void 0,utm_content:n.get(`utm_content`)||void 0,gclid:n.get(`gclid`)||void 0,fbclid:n.get(`fbclid`)||void 0,msclkid:n.get(`msclkid`)||void 0,ttclid:n.get(`ttclid`)||void 0,li_fat_id:n.get(`li_fat_id`)||void 0,referrer:r,referring_domain:l(r),landing_page:i,page_title:a,timestamp:new Date().toISOString(),source_label:e.sourceLabel,session_id:u,device_type:c(),userAgent:o}}function d(e,t={},n={}){if(typeof window>`u`)return;let r=n.pushToDataLayer!==!1,i=n.useGtag!==!1,a=n.dispatchDomEvent!==!1,o=`${n.prefix||`nymrel_quote`}_${e}`,s={event:o,...t,timestamp:new Date().toISOString()};if(r){let e=window;e.dataLayer=e.dataLayer||[],e.dataLayer.push(s)}if(i){let e=window;typeof e.gtag==`function`&&e.gtag(`event`,o,t)}if(a)try{let e=new CustomEvent(o,{bubbles:!0,cancelable:!0,detail:s});window.dispatchEvent(e)}catch{}}function f(e,t){d(`viewed`,{schemaId:e,...t})}function p(e,t,n,r){d(`step_completed`,{schemaId:e,stepIndex:t,stepTitle:n,timeSpentMs:r})}function m(e,t,n,r,i){d(`calculated`,{schemaId:e,target:t,min:n,max:r,quoteId:i})}function h(e,t,n,r){d(`lead_submitted`,{schemaId:e,quoteId:t,value:n,currency:`USD`,hasEmail:!!r})}function g(e,t,n){d(`cta_clicked`,{schemaId:e,ctaName:t,quoteId:n})}var _={mode:`warm`,fontFamily:`-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, "Helvetica Neue", sans-serif`,primaryColor:`#2A332E`,accentColor:`#A8541F`,accentHoverColor:`#8E4316`,backgroundColor:`#FAF8F2`,surfaceColor:`#F4F0E6`,cardColor:`#FFFFFF`,textColor:`#2A332E`,mutedTextColor:`#637069`,borderColor:`#E2DCCE`,borderRadius:`14px`,boxShadow:`0 8px 30px -4px rgba(42, 51, 46, 0.08), 0 2px 8px -2px rgba(42, 51, 46, 0.04)`,focusRingColor:`rgba(168, 84, 31, 0.28)`},v={mode:`light`,fontFamily:`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,primaryColor:`#0F172A`,accentColor:`#2563EB`,accentHoverColor:`#1D4ED8`,backgroundColor:`#F8FAFC`,surfaceColor:`#F1F5F9`,cardColor:`#FFFFFF`,textColor:`#0F172A`,mutedTextColor:`#64748B`,borderColor:`#E2E8F0`,borderRadius:`12px`,boxShadow:`0 4px 20px -2px rgba(0, 0, 0, 0.06)`,focusRingColor:`rgba(37, 99, 235, 0.25)`},y={mode:`dark`,fontFamily:`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,primaryColor:`#F1F5F9`,accentColor:`#F97316`,accentHoverColor:`#EA580C`,backgroundColor:`#0F172A`,surfaceColor:`#1E293B`,cardColor:`#1E293B`,textColor:`#F8FAFC`,mutedTextColor:`#94A3B8`,borderColor:`#334155`,borderRadius:`12px`,boxShadow:`0 8px 30px -4px rgba(0, 0, 0, 0.4)`,focusRingColor:`rgba(249, 115, 22, 0.3)`};function b(e){return{...e?.mode===`dark`?y:e?.mode===`light`?v:_,...e}}function x(e){return`
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
  `}function S(e){return`
    :host {
      display: block;
      box-sizing: border-box;
      font-family: var(--nym-font);
      color: var(--nym-text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      ${x(b(e))}
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
  `}function C(e=new Date().toISOString()){return{status:`not_configured`,channel:`none`,attemptedAt:e,message:`Local capture only: no delivery destination is configured, so nothing was sent.`}}function w(e=new Date().toISOString()){return{status:`callback_only`,channel:`callback`,attemptedAt:e,message:`Captured locally and handed to this page. No external delivery was attempted.`}}async function T(e,t){let n=new Date().toISOString();try{let r=await fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`,"X-Nymrel-Quote-Id":t.quoteId},body:JSON.stringify(t)});return r.ok?{status:`accepted`,channel:`webhook`,attemptedAt:n,httpStatus:r.status,ok:!0,message:`Your quote was accepted by the destination.`}:{status:`rejected`,channel:`webhook`,attemptedAt:n,httpStatus:r.status,ok:!1,message:`Delivery failed: the destination declined this quote (HTTP ${r.status}). Your quote is shown below for your records.`}}catch{return{status:`failed`,channel:`webhook`,attemptedAt:n,ok:!1,message:`Delivery failed: could not reach the destination. Your quote is shown below for your records.`}}}function E(e){return e?e.message:C().message}function D(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var O=class{container;schema;callbacks;formState={};currentStepIndex=0;currentQuote;showBreakdownModal=!1;isSubmitted=!1;isSubmitting=!1;lastSubmission=null;lastDeliveryReceipt=null;sourceLabel;webhookUrl;fieldErrors={};stepStartTime=Date.now();constructor(e,t){this.schema=t.schema,this.callbacks=t.callbacks||{},this.sourceLabel=t.sourceLabel||this.schema.sourceLabel,this.webhookUrl=t.webhookUrl||this.schema.webhookUrl,this.schema.steps.forEach(e=>{e.fields.forEach(e=>{e.defaultValue!==void 0&&(this.formState[e.id]=e.defaultValue)})}),t.initialState&&(this.formState={...this.formState,...t.initialState}),this.container=t.useShadowDom!==!1&&e.attachShadow?e.shadowRoot?e.shadowRoot:e.attachShadow({mode:`open`}):e,this.currentQuote=o(this.schema,this.formState),f(this.schema.id,{sourceLabel:this.sourceLabel}),this.render()}updateState(e,t){this.formState[e]=n(t),delete this.fieldErrors[e],this.recalculate()}recalculate(){return this.currentQuote=o(this.schema,this.formState),m(this.schema.id,this.currentQuote.target,this.currentQuote.min,this.currentQuote.max,this.currentQuote.quoteId),this.callbacks.onCalculate&&this.callbacks.onCalculate(this.currentQuote,this.formState),this.render(),this.currentQuote}nextStep(){if(!this.isLeadFormStep()){let e=this.schema.steps[this.currentStepIndex],t=!1;this.fieldErrors={};for(let n of e.fields){if(!r(n.condition,this.formState))continue;let e=i(n,this.formState[n.id]);e.valid||(this.fieldErrors[n.id]=e.error||`Invalid value`,t=!0)}if(t)return this.render(),!1;let n=Date.now()-this.stepStartTime;if(p(this.schema.id,this.currentStepIndex,e.title,n),this.currentStepIndex<this.schema.steps.length-1)return this.currentStepIndex++,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render(),!0;if(this.isLeadFormEnabled())return this.currentStepIndex++,this.stepStartTime=Date.now(),this.render(),!0}return!1}prevStep(){this.currentStepIndex>0&&(this.currentStepIndex--,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.currentStepIndex<this.schema.steps.length&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render())}isLeadFormEnabled(){return this.schema.leadForm?.enabled!==!1}isLeadFormStep(){return this.isLeadFormEnabled()&&this.currentStepIndex===this.schema.steps.length}getTotalStepsCount(){return this.schema.steps.length+ +!!this.isLeadFormEnabled()}async submitLead(e){let t=this.schema.leadForm;if(this.fieldErrors={},(!e.name||String(e.name).trim()===``)&&(this.fieldErrors.lead_name=`Full Name is required.`),(!e.email||String(e.email).length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e.email)))&&(this.fieldErrors.lead_email=`A valid email address is required.`),t?.requirePhone&&(!e.phone||!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(String(e.phone)))&&(this.fieldErrors.lead_phone=`Phone number is required.`),t?.requireAddress&&!e.address&&(this.fieldErrors.lead_address=`Street address or zip code is required.`),Object.keys(this.fieldErrors).length>0)return this.render(),null;this.isSubmitting=!0,this.render();let r=u({sourceLabel:this.sourceLabel}),i={quoteId:this.currentQuote.quoteId,schemaId:this.schema.id,schemaName:this.schema.name,quote:this.currentQuote,formState:{...this.formState},lead:{name:n(e.name),email:n(e.email),phone:n(e.phone||``),address:n(e.address||``),zipCode:n(e.zipCode||``),preferredDate:n(e.preferredDate||``),preferredTime:n(e.preferredTime||``),notes:n(e.notes||``)},attribution:r,submittedAt:new Date().toISOString(),metadata:this.schema.metadata};try{if(this.webhookUrl){let e=await T(this.webhookUrl,i);(e.status===`rejected`||e.status===`failed`)&&console.warn(`[NymrelQuote] Webhook delivery notice:`,e.message),i.delivery=e}else i.delivery=this.callbacks.onSubmit?w():C();if(this.callbacks.onSubmit)try{await this.callbacks.onSubmit(i)}catch(e){i.localHandlingFailed=!0,i.delivery?.channel===`callback`&&(i.delivery={...i.delivery,status:`failed`,ok:!1,message:`The page handler failed. No external delivery was attempted by the widget. Your quote is shown below.`});try{this.callbacks.onError?.(e)}catch{}}try{h(this.schema.id,i.quoteId,this.currentQuote.target,i.lead.email)}catch{}return this.isSubmitting=!1,this.isSubmitted=!0,this.lastSubmission=i,this.lastDeliveryReceipt=i.delivery??null,this.render(),i}catch(e){return this.isSubmitting=!1,this.callbacks.onError&&this.callbacks.onError(e),this.fieldErrors._global=`Submission failed. Please check your connection and try again.`,this.render(),null}}getLastDeliveryReceipt(){return this.lastDeliveryReceipt}reset(){this.formState={},this.schema.steps.forEach(e=>{e.fields.forEach(e=>{e.defaultValue!==void 0&&(this.formState[e.id]=e.defaultValue)})}),this.currentStepIndex=0,this.isSubmitted=!1,this.isSubmitting=!1,this.lastSubmission=null,this.lastDeliveryReceipt=null,this.fieldErrors={},this.recalculate()}printReceipt(){typeof window<`u`&&window.print()}render(){let e=S(this.schema.theme),t=``;t=this.isSubmitted&&this.lastSubmission?this.renderSuccessScreen(this.lastSubmission):this.isLeadFormStep()?this.renderLeadFormStep():this.renderStepForm(this.schema.steps[this.currentStepIndex]);let n=this.showBreakdownModal?this.renderBreakdownModal():``,r=`
      <style>${e}</style>
      <div class="nym-container" role="region" aria-label="${D(this.schema.name)}">
        <!-- Header -->
        <header class="nym-header">
          <div class="nym-header-content">
            <h2>${D(this.schema.name)}</h2>
            ${this.schema.description?`<p>${D(this.schema.description)}</p>`:``}
          </div>
          ${this.schema.badge?`<span class="nym-badge">${D(this.schema.badge)}</span>`:``}
        </header>

        <!-- Live Reactive Range Banner -->
        <div class="nym-range-banner">
          <div class="nym-range-info">
            <span class="nym-range-label">Instant Estimated Range</span>
            <div class="nym-range-values">
              <span class="nym-range-amount">${D(this.currentQuote.formattedMin)}</span>
              <span class="nym-range-separator">&ndash;</span>
              <span class="nym-range-amount">${D(this.currentQuote.formattedMax)}</span>
            </div>
            <span class="nym-range-target">Baseline Target: <strong>${D(this.currentQuote.formattedTarget)}</strong></span>
          </div>
          <button type="button" class="nym-btn-breakdown" id="nym-toggle-breakdown" aria-label="View cost breakdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            Itemized Breakdown
          </button>
        </div>

        <!-- Stepper Progress Dots -->
        <div class="nym-stepper" aria-label="Quote Progress">
          ${Array.from({length:this.getTotalStepsCount()}).map((e,t)=>{let n=`nym-step-dot`;return t===this.currentStepIndex&&(n+=` active`),t<this.currentStepIndex&&(n+=` completed`),`<div class="${n}"></div>`}).join(``)}
        </div>
        <div class="nym-step-legend">
          <span>Step ${this.currentStepIndex+1} of ${this.getTotalStepsCount()}</span>
          <span>${this.isLeadFormStep()?`Lead Contact & Booking`:D(this.schema.steps[this.currentStepIndex]?.title||``)}</span>
        </div>

        <!-- Main Step Form Content -->
        ${t}

        <!-- Recommendations Box if available -->
        ${this.currentQuote.recommendations.length>0&&!this.isSubmitted?`
          <div class="nym-recommendations">
            ${this.currentQuote.recommendations.map(e=>`
              <div class="nym-recommendation-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${D(e)}</span>
              </div>
            `).join(``)}
          </div>
        `:``}

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
    `;this.container.innerHTML=r,this.attachEventListeners()}renderStepForm(e){let t=this.currentStepIndex===0;return`
      <div class="nym-step-view">
        <h3 class="nym-step-title">${D(e.title)}</h3>
        ${e.subtitle?`<p class="nym-step-subtitle">${D(e.subtitle)}</p>`:``}

        <div class="nym-fields-list">
          ${e.fields.map(e=>this.renderField(e)).join(``)}
        </div>

        <div class="nym-footer">
          ${t?`<div></div>`:`
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Back
            </button>
          `}
          <button type="button" class="nym-btn nym-btn-primary" id="nym-btn-next">
            ${this.currentStepIndex===this.schema.steps.length-1&&!this.isLeadFormEnabled()?`Finish Quote`:`Continue &rarr;`}
          </button>
        </div>
      </div>
    `}renderField(e){if(!r(e.condition,this.formState))return``;let t=this.formState[e.id]===void 0?e.defaultValue??``:this.formState[e.id],n=this.fieldErrors[e.id],i=``;switch(e.type){case`slider`:{let n=e.min??100,r=e.max??5e3,a=e.step??50,o=Number(t)||n;i=`
          <div class="nym-slider-container">
            <div class="nym-slider-header">
              <span class="nym-slider-ticks">${n} ${e.unit||``}</span>
              <span class="nym-slider-val" id="val-${e.id}">${o} ${e.unit||``}</span>
              <span class="nym-slider-ticks">${r} ${e.unit||``}</span>
            </div>
            <input
              type="range"
              class="nym-slider nym-reactive-input"
              data-field-id="${e.id}"
              min="${n}"
              max="${r}"
              step="${a}"
              value="${o}"
              aria-label="${D(e.label)}"
            />
          </div>
        `;break}case`select`:i=`
          <select class="nym-select nym-reactive-input" data-field-id="${e.id}" aria-label="${D(e.label)}">
            ${e.options?.map(e=>`
              <option value="${D(e.id)}" ${String(t)===String(e.id)?`selected`:``}>
                ${D(e.label)} ${e.adder?`(+${this.currentQuote.currencySymbol}${e.adder})`:``} ${e.multiplier?`(${e.multiplier}x)`:``}
              </option>
            `).join(``)}
          </select>
        `;break;case`radio`:i=`
          <div class="nym-options-grid" role="radiogroup" aria-label="${D(e.label)}">
            ${e.options?.map(n=>{let r=String(t)===String(n.id);return`
                <div
                  class="nym-option-card ${r?`selected`:``}"
                  data-field-id="${e.id}"
                  data-option-id="${D(n.id)}"
                  role="radio"
                  aria-checked="${r}"
                  tabindex="0"
                >
                  <div class="nym-option-header">
                    <span class="nym-option-title">${D(n.label)}</span>
                    ${n.badge?`<span class="nym-option-badge">${D(n.badge)}</span>`:``}
                  </div>
                  ${n.description?`<p class="nym-option-desc">${D(n.description)}</p>`:``}
                  ${n.adder||n.multiplier?`
                    <div class="nym-option-price">
                      ${n.adder?`+${this.currentQuote.currencySymbol}${n.adder}`:``}
                      ${n.multiplier?`${n.multiplier}x multiplier`:``}
                    </div>
                  `:``}
                </div>
              `}).join(``)}
          </div>
        `;break;case`checkbox`:{let n=Array.isArray(t)?t:[];i=`
          <div class="nym-checkbox-list">
            ${e.options?.map(t=>{let r=n.includes(t.id);return`
                <div
                  class="nym-checkbox-item ${r?`checked`:``}"
                  data-field-id="${e.id}"
                  data-checkbox-id="${D(t.id)}"
                  role="checkbox"
                  aria-checked="${r}"
                  tabindex="0"
                >
                  <div class="nym-checkbox-box">
                    ${r?`✓`:``}
                  </div>
                  <div class="nym-checkbox-info">
                    <div class="nym-checkbox-title">
                      <span>${D(t.label)}</span>
                      ${t.adder?`<span>+${this.currentQuote.currencySymbol}${t.adder}</span>`:``}
                    </div>
                    ${t.description?`<div class="nym-checkbox-desc">${D(t.description)}</div>`:``}
                  </div>
                </div>
              `}).join(``)}
          </div>
        `;break}case`number`:case`stepper`:i=`
          <input
            type="number"
            class="nym-input nym-reactive-input"
            data-field-id="${e.id}"
            min="${e.min??0}"
            max="${e.max??999999}"
            step="${e.step??1}"
            value="${D(t)}"
            placeholder="${e.placeholder?D(e.placeholder):``}"
            aria-label="${D(e.label)}"
          />
        `;break;default:i=`
          <input
            type="text"
            class="nym-input nym-reactive-input"
            data-field-id="${e.id}"
            value="${D(t)}"
            placeholder="${e.placeholder?D(e.placeholder):``}"
            aria-label="${D(e.label)}"
          />
        `}return`
      <div class="nym-field-group">
        <label class="nym-label">
          <span>${D(e.label)}${e.required?` *`:``}</span>
          ${e.unit&&e.type!==`slider`?`<span class="nym-helper-text">${D(e.unit)}</span>`:``}
        </label>
        ${i}
        ${e.helperText?`<div class="nym-helper-text">${D(e.helperText)}</div>`:``}
        ${n?`<div class="nym-error-text">${D(n)}</div>`:``}
      </div>
    `}renderLeadFormStep(){let e=this.schema.leadForm,t=this.fieldErrors._global;return`
      <div class="nym-lead-step">
        <h3 class="nym-step-title">${D(e?.title||`Lock in Your Official Quote`)}</h3>
        <p class="nym-step-subtitle">${D(e?.subtitle||`Enter your contact details to save your estimate, receive your official PDF breakdown, and schedule an on-site inspection.`)}</p>

        ${t?`<div class="nym-error-text" style="margin-bottom: 16px;">${D(t)}</div>`:``}

        <form id="nym-lead-form">
          <div class="nym-field-group">
            <label class="nym-label">Full Name *</label>
            <input type="text" name="name" class="nym-input" required placeholder="e.g. Alex Morgan" value="${D(this.formState._lead_name||``)}" />
            ${this.fieldErrors.lead_name?`<div class="nym-error-text">${D(this.fieldErrors.lead_name)}</div>`:``}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Email Address *</label>
            <input type="email" name="email" class="nym-input" required placeholder="alex@example.com" value="${D(this.formState._lead_email||``)}" />
            ${this.fieldErrors.lead_email?`<div class="nym-error-text">${D(this.fieldErrors.lead_email)}</div>`:``}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Phone Number ${e?.requirePhone?`*`:`(Optional)`}</label>
            <input type="tel" name="phone" class="nym-input" ${e?.requirePhone?`required`:``} placeholder="(555) 019-2834" value="${D(this.formState._lead_phone||``)}" />
            ${this.fieldErrors.lead_phone?`<div class="nym-error-text">${D(this.fieldErrors.lead_phone)}</div>`:``}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="nym-field-group">
              <label class="nym-label">Street Address ${e?.requireAddress?`*`:``}</label>
              <input type="text" name="address" class="nym-input" placeholder="123 Maple Way" value="${D(this.formState._lead_address||``)}" />
              ${this.fieldErrors.lead_address?`<div class="nym-error-text">${D(this.fieldErrors.lead_address)}</div>`:``}
            </div>
            <div class="nym-field-group">
              <label class="nym-label">Zip Code</label>
              <input type="text" name="zipCode" class="nym-input" placeholder="90210" value="${D(this.formState._lead_zip||``)}" />
            </div>
          </div>

          ${e?.requireDate?`
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nym-field-group">
                <label class="nym-label">Preferred Date</label>
                <input type="date" name="preferredDate" class="nym-input" value="${D(this.formState._lead_date||``)}" />
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
          `:``}

          ${e?.collectNotes===!1?``:`
            <div class="nym-field-group">
              <label class="nym-label">Project Notes or Questions</label>
              <textarea name="notes" class="nym-textarea" placeholder="Tell us about specific property access, timeline goals, or special requirements...">${D(this.formState._lead_notes||``)}</textarea>
            </div>
          `}

          <div class="nym-helper-text" style="margin-bottom: 20px;">
            ${D(e?.disclaimerText||`By submitting, you agree to receive project updates and quote confirmation. We respect your privacy and never sell data.`)}
          </div>

          <div class="nym-footer">
            <button type="button" class="nym-btn nym-btn-secondary" id="nym-btn-prev">
              &larr; Edit Parameters
            </button>
            <button type="submit" class="nym-btn nym-btn-primary" ${this.isSubmitting?`disabled`:``}>
              ${this.isSubmitting?`Processing...`:e?.submitButtonText||`Lock In My Estimate &rarr;`}
            </button>
          </div>
        </form>
      </div>
    `}renderSuccessScreen(e){let t=this.schema.leadForm,n=e.delivery?.status===`accepted`&&!e.localHandlingFailed;return`
      <div class="nym-success-screen">
        <div class="nym-success-icon">✓</div>
        <h3 class="nym-step-title">${D(n&&t?.successTitle||`Estimate Captured Successfully!`)}</h3>
        <p class="nym-step-subtitle">${D(n&&t?.successMessage||`Your quote summary is below. Print or save a copy for your records.`)}</p>
        ${e.localHandlingFailed?`<p role="alert">The page handler failed after capture. The delivery status below records the observed outcome.</p>`:``}

        <div class="nym-receipt-card">
          <div class="nym-delivery-status nym-receipt-row" role="status">
            <span class="nym-receipt-key">Delivery Status:</span>
            <span class="nym-receipt-val">${D(E(this.lastDeliveryReceipt))}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Quote Reference ID:</span>
            <span class="nym-receipt-val" style="font-family: monospace;">${D(e.quoteId)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Estimated Price Range:</span>
            <span class="nym-receipt-val" style="color: var(--nym-accent); font-size: 1.05rem;">
              ${D(e.quote.formattedMin)} &ndash; ${D(e.quote.formattedMax)}
            </span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Baseline Target:</span>
            <span class="nym-receipt-val">${D(e.quote.formattedTarget)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Recipient:</span>
            <span class="nym-receipt-val">${D(e.lead.name)} (${D(e.lead.email)})</span>
          </div>
          ${e.lead.preferredDate?`
            <div class="nym-receipt-row">
              <span class="nym-receipt-key">Requested Consultation:</span>
              <span class="nym-receipt-val">${D(e.lead.preferredDate)} (${D(e.lead.preferredTime||`Anytime`)})</span>
            </div>
          `:``}
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
                      <div class="nym-breakdown-label">${D(e.label)}</div>
                      ${e.description?`<div class="nym-breakdown-subtext">${D(e.description)}</div>`:``}
                    </td>
                    <td class="nym-breakdown-val">${D(e.formattedAmount)}</td>
                  </tr>
                `).join(``)}
                <tr class="nym-breakdown-total">
                  <td><strong>Estimated Baseline Target</strong></td>
                  <td class="nym-breakdown-val">${D(this.currentQuote.formattedTarget)}</td>
                </tr>
                <tr>
                  <td><strong>Dynamic Estimated Range</strong></td>
                  <td class="nym-breakdown-val">${D(this.currentQuote.formattedMin)} &ndash; ${D(this.currentQuote.formattedMax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(`.nym-reactive-input`).forEach(e=>{e.addEventListener(`input`,e=>{let t=e.target,n=t.getAttribute(`data-field-id`);if(n){this.updateState(n,t.value);let e=this.container.querySelector(`#val-${n}`);e&&(e.textContent=`${t.value} ${t.getAttribute(`data-unit`)||``}`.trim())}})}),this.container.querySelectorAll(`.nym-option-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-field-id`),n=e.getAttribute(`data-option-id`);t&&n&&this.updateState(t,n)})}),this.container.querySelectorAll(`.nym-checkbox-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-field-id`),n=e.getAttribute(`data-checkbox-id`);if(t&&n){let e=Array.isArray(this.formState[t])?[...this.formState[t]]:[],r=e.indexOf(n);r>=0?e.splice(r,1):e.push(n),this.updateState(t,e)}})});let e=this.container.querySelector(`#nym-btn-next`);e&&e.addEventListener(`click`,()=>this.nextStep());let t=this.container.querySelector(`#nym-btn-prev`);t&&t.addEventListener(`click`,()=>this.prevStep());let n=this.container.querySelector(`#nym-lead-form`);n&&n.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(n),r={};t.forEach((e,t)=>{r[t]=e}),this.submitLead(r)});let r=this.container.querySelector(`#nym-toggle-breakdown`);r&&r.addEventListener(`click`,()=>{this.showBreakdownModal=!0,this.render()});let i=this.container.querySelector(`#nym-modal-close`);i&&i.addEventListener(`click`,()=>{this.showBreakdownModal=!1,this.render()});let a=this.container.querySelector(`#nym-modal-backdrop`);a&&a.addEventListener(`click`,e=>{e.target===a&&(this.showBreakdownModal=!1,this.render())});let o=this.container.querySelector(`#nym-btn-print`);o&&o.addEventListener(`click`,()=>this.printReceipt());let s=this.container.querySelector(`#nym-btn-restart`);s&&s.addEventListener(`click`,()=>this.reset())}};function k(e,t){let n=typeof e==`string`?document.querySelector(e):e;if(!n)throw Error(`[NymrelQuote] Container element not found: ${e}`);return new O(n,t)}Object.defineProperty(exports,"C",{enumerable:!0,get:function(){return t}}),Object.defineProperty(exports,"E",{enumerable:!0,get:function(){return i}}),Object.defineProperty(exports,"S",{enumerable:!0,get:function(){return r}}),Object.defineProperty(exports,"T",{enumerable:!0,get:function(){return n}}),Object.defineProperty(exports,"_",{enumerable:!0,get:function(){return m}}),Object.defineProperty(exports,"a",{enumerable:!0,get:function(){return y}}),Object.defineProperty(exports,"b",{enumerable:!0,get:function(){return a}}),Object.defineProperty(exports,"c",{enumerable:!0,get:function(){return x}}),Object.defineProperty(exports,"d",{enumerable:!0,get:function(){return d}}),Object.defineProperty(exports,"f",{enumerable:!0,get:function(){return u}}),Object.defineProperty(exports,"g",{enumerable:!0,get:function(){return h}}),Object.defineProperty(exports,"h",{enumerable:!0,get:function(){return g}}),Object.defineProperty(exports,"i",{enumerable:!0,get:function(){return T}}),Object.defineProperty(exports,"l",{enumerable:!0,get:function(){return S}}),Object.defineProperty(exports,"m",{enumerable:!0,get:function(){return l}}),Object.defineProperty(exports,"n",{enumerable:!0,get:function(){return k}}),Object.defineProperty(exports,"o",{enumerable:!0,get:function(){return _}}),Object.defineProperty(exports,"p",{enumerable:!0,get:function(){return c}}),Object.defineProperty(exports,"r",{enumerable:!0,get:function(){return w}}),Object.defineProperty(exports,"s",{enumerable:!0,get:function(){return v}}),Object.defineProperty(exports,"t",{enumerable:!0,get:function(){return O}}),Object.defineProperty(exports,"u",{enumerable:!0,get:function(){return b}}),Object.defineProperty(exports,"v",{enumerable:!0,get:function(){return f}}),Object.defineProperty(exports,"w",{enumerable:!0,get:function(){return e}}),Object.defineProperty(exports,"x",{enumerable:!0,get:function(){return o}}),Object.defineProperty(exports,"y",{enumerable:!0,get:function(){return p}});