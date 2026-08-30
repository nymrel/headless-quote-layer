var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},s=(n,r,s)=>(s=n==null?{}:e(i(n)),o(r||!n||!n.__esModule||!a.call(n,`default`)?t(s,`default`,{value:n,enumerable:!0}):s,n));let c=require("react");c=s(c,1);let l=require("react/jsx-runtime");function u(e=`NYM`){let t=new Date;return`${e}-${t.getFullYear()}${String(t.getMonth()+1).padStart(2,`0`)}${String(t.getDate()).padStart(2,`0`)}-${Math.random().toString(36).substring(2,8).toUpperCase()}`}function d(e,t=`USD`,n=`$`,r=0){if(isNaN(e)||e==null)return`${n}0`;let i=(r>0?e.toFixed(r):Math.round(e).toString()).split(`.`);return i[0]=i[0].replace(/\B(?=(\d{3})+(?!\d))/g,`,`),`${n}${i.join(`.`)}`}function f(e){return e==null?e:typeof e==`string`?e.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,``).replace(/<[^>]*>/g,``).replace(/[<>]/g,``).trim():typeof e==`number`?isNaN(e)?0:e:Array.isArray(e)?e.map(f):e}function p(e,t){if(!e||!e.fieldId)return!0;let n=t[e.fieldId];switch(e.operator){case`equals`:return n===e.value||String(n)===String(e.value);case`notEquals`:return n!==e.value&&String(n)!==String(e.value);case`greaterThan`:return Number(n)>Number(e.value);case`lessThan`:return Number(n)<Number(e.value);case`in`:return Array.isArray(e.value)?e.value.includes(n):!1;case`contains`:return Array.isArray(n)?n.includes(e.value):typeof n==`string`&&n.includes(String(e.value));default:return!0}}function m(e,t){if(e.required&&(t==null||t===``||Array.isArray(t)&&t.length===0))return{valid:!1,error:`${e.label} is required.`};if(t!=null&&t!==``){if(e.type===`number`||e.type===`slider`||e.type===`stepper`){let n=Number(t);if(isNaN(n))return{valid:!1,error:`${e.label} must be a valid number.`};if(e.min!==void 0&&n<e.min)return{valid:!1,error:`Minimum value is ${e.min} ${e.unit||``}`.trim()};if(e.max!==void 0&&n>e.max)return{valid:!1,error:`Maximum value is ${e.max} ${e.unit||``}`.trim()}}if(e.type===`email`&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(t)))return{valid:!1,error:`Please enter a valid email address.`};if(e.type===`phone`){let e=String(t).replace(/[\s()\-\.]/g,``);if(e.length<7||!/^\+?[0-9]{7,15}$/.test(e))return{valid:!1,error:`Please enter a valid phone number.`}}}return{valid:!0}}function h(e,t){if(!t||t===`none`)return e;switch(t){case`round`:return Math.round(e);case`ceil`:return Math.ceil(e);case`floor`:return Math.floor(e);case`nearest10`:return Math.round(e/10)*10;case`nearest50`:return Math.round(e/50)*50;case`nearest100`:return Math.round(e/100)*100;default:return e}}function g(e,t){let n=e.pricing?.currency||`USD`,r=e.pricing?.currencySymbol||`$`,i=e.pricing||{},a=t._quoteId||u(),o=[];if(e.steps.forEach(e=>{e.fields.forEach(e=>{o.push(e)})}),i.formula===`custom`&&typeof i.customFormula==`function`){let e=i.customFormula(t,o),s=h(e.target,i.rounding),c=h(e.min,i.rounding),l=h(e.max,i.rounding);return{min:c,max:l,target:s,formattedMin:d(c,n,r),formattedMax:d(l,n,r),formattedTarget:d(s,n,r),currency:n,currencySymbol:r,breakdown:e.breakdown||[],recommendations:[],calculatedAt:new Date().toISOString(),quoteId:a}}let s=Number(i.baseFee||i.baseCalloutFee||0),c=0,l=0,f=0,m=1,g=[],_=[];s>0&&g.push({id:`base-fee`,label:`Base Callout / Setup Fee`,amount:s,formattedAmount:d(s,n,r),type:`base`,description:`Standard initial mobilization and inspection base`});for(let e of o){if(!p(e.condition,t))continue;let i=t[e.id]===void 0?e.defaultValue:t[e.id];if(i!=null&&i!==``){if(e.type===`number`||e.type===`slider`||e.type===`stepper`){let t=Number(i);if(!isNaN(t)&&t>0){if(e.unitPrice&&e.unitPrice>0){let i=t*e.unitPrice;e.category===`material`?c+=i:l+=i,g.push({id:e.id,label:`${e.label} (${t} ${e.unit||`units`} @ ${d(e.unitPrice,n,r)}/${e.unit||`unit`})`,amount:i,formattedAmount:d(i,n,r),type:e.category===`material`?`material`:`labor`})}e.multiplier&&e.multiplier!==1&&(m*=e.multiplier)}}if((e.type===`select`||e.type===`radio`||e.type===`toggle`)&&e.options&&e.options.length>0){let t=e.options.find(e=>String(e.id)===String(i)||String(e.value)===String(i));if(t){if(t.adder&&Number(t.adder)!==0){let i=Number(t.adder);f+=i,g.push({id:`${e.id}-${t.id}`,label:`${e.label}: ${t.label}`,amount:i,formattedAmount:d(i,n,r),type:e.category===`material`?`material`:`addon`,description:t.description})}if(t.multiplier&&Number(t.multiplier)!==1){let n=Number(t.multiplier);m*=n,g.push({id:`${e.id}-${t.id}-mult`,label:`${t.label} Factor (${n}x)`,amount:0,formattedAmount:`${n}x`,type:`multiplier`,description:t.description})}}}if(e.type===`checkbox`){if(Array.isArray(i)&&e.options)for(let t of i){let i=e.options.find(e=>String(e.id)===String(t)||String(e.value)===String(t));if(i){if(i.adder&&Number(i.adder)!==0){let t=Number(i.adder);f+=t,g.push({id:`${e.id}-${i.id}`,label:i.label,amount:t,formattedAmount:d(t,n,r),type:`addon`,description:i.description})}i.multiplier&&Number(i.multiplier)!==1&&(m*=Number(i.multiplier))}}else typeof i==`boolean`&&i===!0&&(e.unitPrice&&(f+=e.unitPrice,g.push({id:e.id,label:e.label,amount:e.unitPrice,formattedAmount:d(e.unitPrice,n,r),type:`addon`})),e.multiplier&&e.multiplier!==1&&(m*=e.multiplier))}}}let v=s+c+l+f,y=v*m;if(i.taxRate&&i.taxRate>0){let e=y*i.taxRate;g.push({id:`tax`,label:`Estimated Tax (${(i.taxRate*100).toFixed(1)}%)`,amount:e,formattedAmount:d(e,n,r),type:`tax`}),y+=e}let b=i.marginPercent?i.marginPercent/100:.1,x=i.minRangeSpreadPercent?i.minRangeSpreadPercent/100:b,S=i.maxRangeSpreadPercent?i.maxRangeSpreadPercent/100:b,C=Math.max(0,y),w=Math.max(0,C*(1-x)),T=Math.max(w,C*(1+S));v===0&&s===0&&(C=0,w=0,T=0);let E=h(C,i.rounding),D=h(w,i.rounding),O=h(T,i.rounding);return(t.pitch===`steep`||t.difficulty===`extreme`||t.urgency===`emergency`)&&_.push(`Priority Crew Dispatch: Includes safety rigging and on-site supervisor.`),E>5e3&&_.push(`Flexible Financing Available: 0% APR for 12 months on qualifying projects.`),(t.material===`metal`||t.efficiency===`ultra`)&&_.push(`Qualifies for Energy Efficiency Tax Credits & Lifetime Manufacturer Warranty.`),{min:D,max:O,target:E,formattedMin:d(D,n,r),formattedMax:d(O,n,r),formattedTarget:d(E,n,r),currency:n,currencySymbol:r,breakdown:g,recommendations:_,calculatedAt:new Date().toISOString(),quoteId:a}}function _(){return`sess_`+Math.random().toString(36).substring(2,10)+Date.now().toString(36)}function v(){if(typeof window>`u`)return`desktop`;let e=navigator.userAgent.toLowerCase(),t=window.innerWidth||1024;return/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(e)||t>=768&&t<=1024?`tablet`:/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(e)||t<768?`mobile`:`desktop`}function y(e){if(!e)return``;try{return new URL(e).hostname}catch{return``}}function b(e={}){let t=typeof window<`u`,n=t?new URLSearchParams(window.location.search):new URLSearchParams,r=t&&document.referrer||``,i=t&&window.location.href||``,a=t&&document.title||``,o=t&&navigator.userAgent||``,s=e.customSessionId||``;if(!s&&t){let t=e.storageKey||`nymrel_quote_session_id`;try{s=window.sessionStorage.getItem(t)||``,s||(s=_(),window.sessionStorage.setItem(t,s))}catch{s=_()}}else s||=_();return{utm_source:n.get(`utm_source`)||void 0,utm_medium:n.get(`utm_medium`)||void 0,utm_campaign:n.get(`utm_campaign`)||void 0,utm_term:n.get(`utm_term`)||void 0,utm_content:n.get(`utm_content`)||void 0,gclid:n.get(`gclid`)||void 0,fbclid:n.get(`fbclid`)||void 0,msclkid:n.get(`msclkid`)||void 0,ttclid:n.get(`ttclid`)||void 0,li_fat_id:n.get(`li_fat_id`)||void 0,referrer:r,referring_domain:y(r),landing_page:i,page_title:a,timestamp:new Date().toISOString(),source_label:e.sourceLabel,session_id:s,device_type:v(),userAgent:o}}function x(e,t={},n={}){if(typeof window>`u`)return;let r=n.pushToDataLayer!==!1,i=n.useGtag!==!1,a=n.dispatchDomEvent!==!1,o=`${n.prefix||`nymrel_quote`}_${e}`,s={event:o,...t,timestamp:new Date().toISOString()};if(r){let e=window;e.dataLayer=e.dataLayer||[],e.dataLayer.push(s)}if(i){let e=window;typeof e.gtag==`function`&&e.gtag(`event`,o,t)}if(a)try{let e=new CustomEvent(o,{bubbles:!0,cancelable:!0,detail:s});window.dispatchEvent(e)}catch{}}function S(e,t){x(`viewed`,{schemaId:e,...t})}function C(e,t,n,r){x(`step_completed`,{schemaId:e,stepIndex:t,stepTitle:n,timeSpentMs:r})}function w(e,t,n,r,i){x(`calculated`,{schemaId:e,target:t,min:n,max:r,quoteId:i})}function T(e,t,n,r){x(`lead_submitted`,{schemaId:e,quoteId:t,value:n,currency:`USD`,hasEmail:!!r})}function E(e,t,n){x(`cta_clicked`,{schemaId:e,ctaName:t,quoteId:n})}var D={mode:`warm`,fontFamily:`-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, "Helvetica Neue", sans-serif`,primaryColor:`#2A332E`,accentColor:`#A8541F`,accentHoverColor:`#8E4316`,backgroundColor:`#FAF8F2`,surfaceColor:`#F4F0E6`,cardColor:`#FFFFFF`,textColor:`#2A332E`,mutedTextColor:`#637069`,borderColor:`#E2DCCE`,borderRadius:`14px`,boxShadow:`0 8px 30px -4px rgba(42, 51, 46, 0.08), 0 2px 8px -2px rgba(42, 51, 46, 0.04)`,focusRingColor:`rgba(168, 84, 31, 0.28)`},O={mode:`light`,fontFamily:`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,primaryColor:`#0F172A`,accentColor:`#2563EB`,accentHoverColor:`#1D4ED8`,backgroundColor:`#F8FAFC`,surfaceColor:`#F1F5F9`,cardColor:`#FFFFFF`,textColor:`#0F172A`,mutedTextColor:`#64748B`,borderColor:`#E2E8F0`,borderRadius:`12px`,boxShadow:`0 4px 20px -2px rgba(0, 0, 0, 0.06)`,focusRingColor:`rgba(37, 99, 235, 0.25)`},k={mode:`dark`,fontFamily:`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,primaryColor:`#F1F5F9`,accentColor:`#F97316`,accentHoverColor:`#EA580C`,backgroundColor:`#0F172A`,surfaceColor:`#1E293B`,cardColor:`#1E293B`,textColor:`#F8FAFC`,mutedTextColor:`#94A3B8`,borderColor:`#334155`,borderRadius:`12px`,boxShadow:`0 8px 30px -4px rgba(0, 0, 0, 0.4)`,focusRingColor:`rgba(249, 115, 22, 0.3)`};function A(e){return{...e?.mode===`dark`?k:e?.mode===`light`?O:D,...e}}function j(e){return`
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
  `}function M(e){return`
    :host {
      display: block;
      box-sizing: border-box;
      font-family: var(--nym-font);
      color: var(--nym-text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      ${j(A(e))}
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
  `}function N(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var P=class{container;schema;callbacks;formState={};currentStepIndex=0;currentQuote;showBreakdownModal=!1;isSubmitted=!1;isSubmitting=!1;lastSubmission=null;sourceLabel;webhookUrl;fieldErrors={};stepStartTime=Date.now();constructor(e,t){this.schema=t.schema,this.callbacks=t.callbacks||{},this.sourceLabel=t.sourceLabel||this.schema.sourceLabel,this.webhookUrl=t.webhookUrl||this.schema.webhookUrl,this.schema.steps.forEach(e=>{e.fields.forEach(e=>{e.defaultValue!==void 0&&(this.formState[e.id]=e.defaultValue)})}),t.initialState&&(this.formState={...this.formState,...t.initialState}),this.container=t.useShadowDom!==!1&&e.attachShadow?e.shadowRoot?e.shadowRoot:e.attachShadow({mode:`open`}):e,this.currentQuote=g(this.schema,this.formState),S(this.schema.id,{sourceLabel:this.sourceLabel}),this.render()}updateState(e,t){this.formState[e]=f(t),delete this.fieldErrors[e],this.recalculate()}recalculate(){return this.currentQuote=g(this.schema,this.formState),w(this.schema.id,this.currentQuote.target,this.currentQuote.min,this.currentQuote.max,this.currentQuote.quoteId),this.callbacks.onCalculate&&this.callbacks.onCalculate(this.currentQuote,this.formState),this.render(),this.currentQuote}nextStep(){if(!this.isLeadFormStep()){let e=this.schema.steps[this.currentStepIndex],t=!1;this.fieldErrors={};for(let n of e.fields){if(!p(n.condition,this.formState))continue;let e=m(n,this.formState[n.id]);e.valid||(this.fieldErrors[n.id]=e.error||`Invalid value`,t=!0)}if(t)return this.render(),!1;let n=Date.now()-this.stepStartTime;if(C(this.schema.id,this.currentStepIndex,e.title,n),this.currentStepIndex<this.schema.steps.length-1)return this.currentStepIndex++,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render(),!0;if(this.isLeadFormEnabled())return this.currentStepIndex++,this.stepStartTime=Date.now(),this.render(),!0}return!1}prevStep(){this.currentStepIndex>0&&(this.currentStepIndex--,this.stepStartTime=Date.now(),this.callbacks.onStepChange&&this.currentStepIndex<this.schema.steps.length&&this.callbacks.onStepChange(this.currentStepIndex,this.schema.steps[this.currentStepIndex]),this.render())}isLeadFormEnabled(){return this.schema.leadForm?.enabled!==!1}isLeadFormStep(){return this.isLeadFormEnabled()&&this.currentStepIndex===this.schema.steps.length}getTotalStepsCount(){return this.schema.steps.length+ +!!this.isLeadFormEnabled()}async submitLead(e){let t=this.schema.leadForm;if(this.fieldErrors={},(!e.name||String(e.name).trim()===``)&&(this.fieldErrors.lead_name=`Full Name is required.`),(!e.email||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(e.email)))&&(this.fieldErrors.lead_email=`A valid email address is required.`),t?.requirePhone&&(!e.phone||!/^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$/.test(String(e.phone)))&&(this.fieldErrors.lead_phone=`Phone number is required.`),t?.requireAddress&&!e.address&&(this.fieldErrors.lead_address=`Street address or zip code is required.`),Object.keys(this.fieldErrors).length>0)return this.render(),null;this.isSubmitting=!0,this.render();let n=b({sourceLabel:this.sourceLabel}),r={quoteId:this.currentQuote.quoteId,schemaId:this.schema.id,schemaName:this.schema.name,quote:this.currentQuote,formState:{...this.formState},lead:{name:f(e.name),email:f(e.email),phone:f(e.phone||``),address:f(e.address||``),zipCode:f(e.zipCode||``),preferredDate:f(e.preferredDate||``),preferredTime:f(e.preferredTime||``),notes:f(e.notes||``)},attribution:n,submittedAt:new Date().toISOString(),metadata:this.schema.metadata};try{if(this.webhookUrl)try{await fetch(this.webhookUrl,{method:`POST`,headers:{"Content-Type":`application/json`,"X-Nymrel-Quote-Id":r.quoteId},body:JSON.stringify(r)})}catch(e){console.warn(`[NymrelQuote] Webhook delivery notice:`,e)}return this.callbacks.onSubmit&&await this.callbacks.onSubmit(r),T(this.schema.id,r.quoteId,this.currentQuote.target,r.lead.email),this.isSubmitting=!1,this.isSubmitted=!0,this.lastSubmission=r,this.render(),r}catch(e){return this.isSubmitting=!1,this.callbacks.onError&&this.callbacks.onError(e),this.fieldErrors._global=`Submission failed. Please check your connection and try again.`,this.render(),null}}reset(){this.formState={},this.schema.steps.forEach(e=>{e.fields.forEach(e=>{e.defaultValue!==void 0&&(this.formState[e.id]=e.defaultValue)})}),this.currentStepIndex=0,this.isSubmitted=!1,this.isSubmitting=!1,this.lastSubmission=null,this.fieldErrors={},this.recalculate()}printReceipt(){typeof window<`u`&&window.print()}render(){let e=M(this.schema.theme),t=``;t=this.isSubmitted&&this.lastSubmission?this.renderSuccessScreen(this.lastSubmission):this.isLeadFormStep()?this.renderLeadFormStep():this.renderStepForm(this.schema.steps[this.currentStepIndex]);let n=this.showBreakdownModal?this.renderBreakdownModal():``,r=`
      <style>${e}</style>
      <div class="nym-container" role="region" aria-label="${N(this.schema.name)}">
        <!-- Header -->
        <header class="nym-header">
          <div class="nym-header-content">
            <h2>${N(this.schema.name)}</h2>
            ${this.schema.description?`<p>${N(this.schema.description)}</p>`:``}
          </div>
          ${this.schema.badge?`<span class="nym-badge">${N(this.schema.badge)}</span>`:``}
        </header>

        <!-- Live Reactive Range Banner -->
        <div class="nym-range-banner">
          <div class="nym-range-info">
            <span class="nym-range-label">Instant Estimated Range</span>
            <div class="nym-range-values">
              <span class="nym-range-amount">${N(this.currentQuote.formattedMin)}</span>
              <span class="nym-range-separator">&ndash;</span>
              <span class="nym-range-amount">${N(this.currentQuote.formattedMax)}</span>
            </div>
            <span class="nym-range-target">Baseline Target: <strong>${N(this.currentQuote.formattedTarget)}</strong></span>
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
          <span>${this.isLeadFormStep()?`Lead Contact & Booking`:N(this.schema.steps[this.currentStepIndex]?.title||``)}</span>
        </div>

        <!-- Main Step Form Content -->
        ${t}

        <!-- Recommendations Box if available -->
        ${this.currentQuote.recommendations.length>0&&!this.isSubmitted?`
          <div class="nym-recommendations">
            ${this.currentQuote.recommendations.map(e=>`
              <div class="nym-recommendation-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${N(e)}</span>
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
        <h3 class="nym-step-title">${N(e.title)}</h3>
        ${e.subtitle?`<p class="nym-step-subtitle">${N(e.subtitle)}</p>`:``}

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
    `}renderField(e){if(!p(e.condition,this.formState))return``;let t=this.formState[e.id]===void 0?e.defaultValue??``:this.formState[e.id],n=this.fieldErrors[e.id],r=``;switch(e.type){case`slider`:{let n=e.min??100,i=e.max??5e3,a=e.step??50,o=Number(t)||n;r=`
          <div class="nym-slider-container">
            <div class="nym-slider-header">
              <span class="nym-slider-ticks">${n} ${e.unit||``}</span>
              <span class="nym-slider-val" id="val-${e.id}">${o} ${e.unit||``}</span>
              <span class="nym-slider-ticks">${i} ${e.unit||``}</span>
            </div>
            <input
              type="range"
              class="nym-slider nym-reactive-input"
              data-field-id="${e.id}"
              min="${n}"
              max="${i}"
              step="${a}"
              value="${o}"
              aria-label="${N(e.label)}"
            />
          </div>
        `;break}case`select`:r=`
          <select class="nym-select nym-reactive-input" data-field-id="${e.id}" aria-label="${N(e.label)}">
            ${e.options?.map(e=>`
              <option value="${N(e.id)}" ${String(t)===String(e.id)?`selected`:``}>
                ${N(e.label)} ${e.adder?`(+${this.currentQuote.currencySymbol}${e.adder})`:``} ${e.multiplier?`(${e.multiplier}x)`:``}
              </option>
            `).join(``)}
          </select>
        `;break;case`radio`:r=`
          <div class="nym-options-grid" role="radiogroup" aria-label="${N(e.label)}">
            ${e.options?.map(n=>{let r=String(t)===String(n.id);return`
                <div
                  class="nym-option-card ${r?`selected`:``}"
                  data-field-id="${e.id}"
                  data-option-id="${N(n.id)}"
                  role="radio"
                  aria-checked="${r}"
                  tabindex="0"
                >
                  <div class="nym-option-header">
                    <span class="nym-option-title">${N(n.label)}</span>
                    ${n.badge?`<span class="nym-option-badge">${N(n.badge)}</span>`:``}
                  </div>
                  ${n.description?`<p class="nym-option-desc">${N(n.description)}</p>`:``}
                  ${n.adder||n.multiplier?`
                    <div class="nym-option-price">
                      ${n.adder?`+${this.currentQuote.currencySymbol}${n.adder}`:``}
                      ${n.multiplier?`${n.multiplier}x multiplier`:``}
                    </div>
                  `:``}
                </div>
              `}).join(``)}
          </div>
        `;break;case`checkbox`:{let n=Array.isArray(t)?t:[];r=`
          <div class="nym-checkbox-list">
            ${e.options?.map(t=>{let r=n.includes(t.id);return`
                <div
                  class="nym-checkbox-item ${r?`checked`:``}"
                  data-field-id="${e.id}"
                  data-checkbox-id="${N(t.id)}"
                  role="checkbox"
                  aria-checked="${r}"
                  tabindex="0"
                >
                  <div class="nym-checkbox-box">
                    ${r?`✓`:``}
                  </div>
                  <div class="nym-checkbox-info">
                    <div class="nym-checkbox-title">
                      <span>${N(t.label)}</span>
                      ${t.adder?`<span>+${this.currentQuote.currencySymbol}${t.adder}</span>`:``}
                    </div>
                    ${t.description?`<div class="nym-checkbox-desc">${N(t.description)}</div>`:``}
                  </div>
                </div>
              `}).join(``)}
          </div>
        `;break}case`number`:case`stepper`:r=`
          <input
            type="number"
            class="nym-input nym-reactive-input"
            data-field-id="${e.id}"
            min="${e.min??0}"
            max="${e.max??999999}"
            step="${e.step??1}"
            value="${N(t)}"
            placeholder="${e.placeholder?N(e.placeholder):``}"
            aria-label="${N(e.label)}"
          />
        `;break;default:r=`
          <input
            type="text"
            class="nym-input nym-reactive-input"
            data-field-id="${e.id}"
            value="${N(t)}"
            placeholder="${e.placeholder?N(e.placeholder):``}"
            aria-label="${N(e.label)}"
          />
        `}return`
      <div class="nym-field-group">
        <label class="nym-label">
          <span>${N(e.label)}${e.required?` *`:``}</span>
          ${e.unit&&e.type!==`slider`?`<span class="nym-helper-text">${N(e.unit)}</span>`:``}
        </label>
        ${r}
        ${e.helperText?`<div class="nym-helper-text">${N(e.helperText)}</div>`:``}
        ${n?`<div class="nym-error-text">${N(n)}</div>`:``}
      </div>
    `}renderLeadFormStep(){let e=this.schema.leadForm,t=this.fieldErrors._global;return`
      <div class="nym-lead-step">
        <h3 class="nym-step-title">${N(e?.title||`Lock in Your Official Quote`)}</h3>
        <p class="nym-step-subtitle">${N(e?.subtitle||`Enter your contact details to save your estimate, receive your official PDF breakdown, and schedule an on-site inspection.`)}</p>

        ${t?`<div class="nym-error-text" style="margin-bottom: 16px;">${N(t)}</div>`:``}

        <form id="nym-lead-form">
          <div class="nym-field-group">
            <label class="nym-label">Full Name *</label>
            <input type="text" name="name" class="nym-input" required placeholder="e.g. Alex Morgan" value="${N(this.formState._lead_name||``)}" />
            ${this.fieldErrors.lead_name?`<div class="nym-error-text">${N(this.fieldErrors.lead_name)}</div>`:``}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Email Address *</label>
            <input type="email" name="email" class="nym-input" required placeholder="alex@example.com" value="${N(this.formState._lead_email||``)}" />
            ${this.fieldErrors.lead_email?`<div class="nym-error-text">${N(this.fieldErrors.lead_email)}</div>`:``}
          </div>

          <div class="nym-field-group">
            <label class="nym-label">Phone Number ${e?.requirePhone?`*`:`(Optional)`}</label>
            <input type="tel" name="phone" class="nym-input" ${e?.requirePhone?`required`:``} placeholder="(555) 019-2834" value="${N(this.formState._lead_phone||``)}" />
            ${this.fieldErrors.lead_phone?`<div class="nym-error-text">${N(this.fieldErrors.lead_phone)}</div>`:``}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="nym-field-group">
              <label class="nym-label">Street Address ${e?.requireAddress?`*`:``}</label>
              <input type="text" name="address" class="nym-input" placeholder="123 Maple Way" value="${N(this.formState._lead_address||``)}" />
              ${this.fieldErrors.lead_address?`<div class="nym-error-text">${N(this.fieldErrors.lead_address)}</div>`:``}
            </div>
            <div class="nym-field-group">
              <label class="nym-label">Zip Code</label>
              <input type="text" name="zipCode" class="nym-input" placeholder="90210" value="${N(this.formState._lead_zip||``)}" />
            </div>
          </div>

          ${e?.requireDate?`
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nym-field-group">
                <label class="nym-label">Preferred Date</label>
                <input type="date" name="preferredDate" class="nym-input" value="${N(this.formState._lead_date||``)}" />
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
              <textarea name="notes" class="nym-textarea" placeholder="Tell us about specific property access, timeline goals, or special requirements...">${N(this.formState._lead_notes||``)}</textarea>
            </div>
          `}

          <div class="nym-helper-text" style="margin-bottom: 20px;">
            ${N(e?.disclaimerText||`By submitting, you agree to receive project updates and quote confirmation. We respect your privacy and never sell data.`)}
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
    `}renderSuccessScreen(e){let t=this.schema.leadForm;return`
      <div class="nym-success-screen">
        <div class="nym-success-icon">✓</div>
        <h3 class="nym-step-title">${N(t?.successTitle||`Estimate Successfully Saved & Confirmed!`)}</h3>
        <p class="nym-step-subtitle">${N(t?.successMessage||`A detailed quote confirmation and project summary have been dispatched to your email.`)}</p>

        <div class="nym-receipt-card">
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Quote Reference ID:</span>
            <span class="nym-receipt-val" style="font-family: monospace;">${N(e.quoteId)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Estimated Price Range:</span>
            <span class="nym-receipt-val" style="color: var(--nym-accent); font-size: 1.05rem;">
              ${N(e.quote.formattedMin)} &ndash; ${N(e.quote.formattedMax)}
            </span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Baseline Target:</span>
            <span class="nym-receipt-val">${N(e.quote.formattedTarget)}</span>
          </div>
          <div class="nym-receipt-row">
            <span class="nym-receipt-key">Recipient:</span>
            <span class="nym-receipt-val">${N(e.lead.name)} (${N(e.lead.email)})</span>
          </div>
          ${e.lead.preferredDate?`
            <div class="nym-receipt-row">
              <span class="nym-receipt-key">Requested Consultation:</span>
              <span class="nym-receipt-val">${N(e.lead.preferredDate)} (${N(e.lead.preferredTime||`Anytime`)})</span>
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
                      <div class="nym-breakdown-label">${N(e.label)}</div>
                      ${e.description?`<div class="nym-breakdown-subtext">${N(e.description)}</div>`:``}
                    </td>
                    <td class="nym-breakdown-val">${N(e.formattedAmount)}</td>
                  </tr>
                `).join(``)}
                <tr class="nym-breakdown-total">
                  <td><strong>Estimated Baseline Target</strong></td>
                  <td class="nym-breakdown-val">${N(this.currentQuote.formattedTarget)}</td>
                </tr>
                <tr>
                  <td><strong>Dynamic Estimated Range</strong></td>
                  <td class="nym-breakdown-val">${N(this.currentQuote.formattedMin)} &ndash; ${N(this.currentQuote.formattedMax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(`.nym-reactive-input`).forEach(e=>{e.addEventListener(`input`,e=>{let t=e.target,n=t.getAttribute(`data-field-id`);if(n){this.updateState(n,t.value);let e=this.container.querySelector(`#val-${n}`);e&&(e.textContent=`${t.value} ${t.getAttribute(`data-unit`)||``}`.trim())}})}),this.container.querySelectorAll(`.nym-option-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-field-id`),n=e.getAttribute(`data-option-id`);t&&n&&this.updateState(t,n)})}),this.container.querySelectorAll(`.nym-checkbox-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-field-id`),n=e.getAttribute(`data-checkbox-id`);if(t&&n){let e=Array.isArray(this.formState[t])?[...this.formState[t]]:[],r=e.indexOf(n);r>=0?e.splice(r,1):e.push(n),this.updateState(t,e)}})});let e=this.container.querySelector(`#nym-btn-next`);e&&e.addEventListener(`click`,()=>this.nextStep());let t=this.container.querySelector(`#nym-btn-prev`);t&&t.addEventListener(`click`,()=>this.prevStep());let n=this.container.querySelector(`#nym-lead-form`);n&&n.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(n),r={};t.forEach((e,t)=>{r[t]=e}),this.submitLead(r)});let r=this.container.querySelector(`#nym-toggle-breakdown`);r&&r.addEventListener(`click`,()=>{this.showBreakdownModal=!0,this.render()});let i=this.container.querySelector(`#nym-modal-close`);i&&i.addEventListener(`click`,()=>{this.showBreakdownModal=!1,this.render()});let a=this.container.querySelector(`#nym-modal-backdrop`);a&&a.addEventListener(`click`,e=>{e.target===a&&(this.showBreakdownModal=!1,this.render())});let o=this.container.querySelector(`#nym-btn-print`);o&&o.addEventListener(`click`,()=>this.printReceipt());let s=this.container.querySelector(`#nym-btn-restart`);s&&s.addEventListener(`click`,()=>this.reset())}};function F(e,t){let n=typeof e==`string`?document.querySelector(e):e;if(!n)throw Error(`[NymrelQuote] Container element not found: ${e}`);return new P(n,t)}var I=({schema:e,initialState:t,theme:n,sourceLabel:r,webhookUrl:i,useShadowDom:a=!0,onCalculate:o,onStepChange:s,onSubmit:u,onError:d,className:f,style:p})=>{let m=(0,c.useRef)(null),h=(0,c.useRef)(null);return(0,c.useEffect)(()=>{if(!m.current)return;let c=n?{...e,theme:{...e.theme,...n}}:e,l=new P(m.current,{schema:c,initialState:t,sourceLabel:r,webhookUrl:i,useShadowDom:a,callbacks:{onCalculate:o,onStepChange:s,onSubmit:u,onError:d}});return h.current=l,()=>{h.current=null,m.current&&(m.current.innerHTML=``)}},[e,n,r,i,a]),(0,l.jsx)(`div`,{ref:m,className:`nymrel-quote-widget-root ${f||``}`.trim(),style:p})};function L(e,t){let[n,r]=(0,c.useState)(()=>{let n={};return e.steps.forEach(e=>{e.fields.forEach(e=>{e.defaultValue!==void 0&&(n[e.id]=e.defaultValue)})}),{...n,...t}}),[i,a]=(0,c.useState)(0),[o,s]=(0,c.useState)(()=>g(e,n)),[l,u]=(0,c.useState)({}),[d,p]=(0,c.useState)(!1),[h,_]=(0,c.useState)(!1),[v,y]=(0,c.useState)(null);return(0,c.useEffect)(()=>{let t=g(e,n);s(t)},[e,n]),{quote:o,formState:n,currentStepIndex:i,fieldErrors:l,isSubmitting:d,isSubmitted:h,lastSubmission:v,updateField:(0,c.useCallback)((e,t)=>{r(n=>({...n,[e]:f(t)})),u(t=>{let n={...t};return delete n[e],n})},[]),nextStep:(0,c.useCallback)(()=>{let t=e.steps[i];if(!t)return!1;let r=!1,o={};for(let e of t.fields){let t=m(e,n[e.id]);t.valid||(o[e.id]=t.error||`Invalid value`,r=!0)}return r?(u(o),!1):i<e.steps.length&&(a(e=>e+1),!0)},[e,i,n]),prevStep:(0,c.useCallback)(()=>{i>0&&a(e=>e-1)},[i]),submitLead:(0,c.useCallback)(async(t,r={})=>{p(!0);let i=b({sourceLabel:r.sourceLabel}),a={quoteId:o.quoteId,schemaId:e.id,schemaName:e.name,quote:o,formState:n,lead:{name:f(t.name),email:f(t.email),phone:f(t.phone||``),address:f(t.address||``),zipCode:f(t.zipCode||``),preferredDate:f(t.preferredDate||``),preferredTime:f(t.preferredTime||``),notes:f(t.notes||``)},attribution:i,submittedAt:new Date().toISOString(),metadata:e.metadata};if(r.webhookUrl)try{await fetch(r.webhookUrl,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(a)})}catch(e){console.warn(`[useQuoteEngine] Webhook error:`,e)}return T(e.id,a.quoteId,o.target,a.lead.email),p(!1),_(!0),y(a),a},[e,o,n]),reset:(0,c.useCallback)(()=>{let n={};e.steps.forEach(e=>{e.fields.forEach(e=>{e.defaultValue!==void 0&&(n[e.id]=e.defaultValue)})}),r({...n,...t}),a(0),_(!1),p(!1),y(null),u({})},[e,t])}}Object.defineProperty(exports,"C",{enumerable:!0,get:function(){return d}}),Object.defineProperty(exports,"E",{enumerable:!0,get:function(){return m}}),Object.defineProperty(exports,"S",{enumerable:!0,get:function(){return p}}),Object.defineProperty(exports,"T",{enumerable:!0,get:function(){return f}}),Object.defineProperty(exports,"_",{enumerable:!0,get:function(){return w}}),Object.defineProperty(exports,"a",{enumerable:!0,get:function(){return k}}),Object.defineProperty(exports,"b",{enumerable:!0,get:function(){return h}}),Object.defineProperty(exports,"c",{enumerable:!0,get:function(){return j}}),Object.defineProperty(exports,"d",{enumerable:!0,get:function(){return x}}),Object.defineProperty(exports,"f",{enumerable:!0,get:function(){return b}}),Object.defineProperty(exports,"g",{enumerable:!0,get:function(){return T}}),Object.defineProperty(exports,"h",{enumerable:!0,get:function(){return E}}),Object.defineProperty(exports,"i",{enumerable:!0,get:function(){return F}}),Object.defineProperty(exports,"l",{enumerable:!0,get:function(){return M}}),Object.defineProperty(exports,"m",{enumerable:!0,get:function(){return y}}),Object.defineProperty(exports,"n",{enumerable:!0,get:function(){return L}}),Object.defineProperty(exports,"o",{enumerable:!0,get:function(){return D}}),Object.defineProperty(exports,"p",{enumerable:!0,get:function(){return v}}),Object.defineProperty(exports,"r",{enumerable:!0,get:function(){return P}}),Object.defineProperty(exports,"s",{enumerable:!0,get:function(){return O}}),Object.defineProperty(exports,"t",{enumerable:!0,get:function(){return I}}),Object.defineProperty(exports,"u",{enumerable:!0,get:function(){return A}}),Object.defineProperty(exports,"v",{enumerable:!0,get:function(){return S}}),Object.defineProperty(exports,"w",{enumerable:!0,get:function(){return u}}),Object.defineProperty(exports,"x",{enumerable:!0,get:function(){return g}}),Object.defineProperty(exports,"y",{enumerable:!0,get:function(){return C}});