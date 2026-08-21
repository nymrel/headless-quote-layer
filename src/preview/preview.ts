/**
 * @nymrel/headless-quote - Preview Playground Controller
 * Copyright 2026 Nymrel / JalenBuilds LLC
 */

import '../web-component';

document.addEventListener('DOMContentLoaded', () => {
  const quoteEl = document.getElementById('live-quote-element') as HTMLElement;
  const presetSelector = document.getElementById('preset-selector') as HTMLSelectElement;
  const themeSelector = document.getElementById('theme-selector') as HTMLSelectElement;
  const eventTerminal = document.getElementById('event-terminal') as HTMLElement;
  const embedDisplay = document.getElementById('embed-code-display') as HTMLElement;
  const btnCopy = document.getElementById('btn-copy-embed') as HTMLButtonElement;

  function logEvent(title: string, data: any) {
    const time = new Date().toLocaleTimeString();
    const entry = `[${time}] ${title}\n${JSON.stringify(data, null, 2)}\n\n`;
    eventTerminal.textContent = entry + eventTerminal.textContent;
  }

  function updateEmbedSnippet() {
    const preset = presetSelector.value;
    const theme = themeSelector.value;
    const themeAttr = theme !== 'warm' ? ` theme-mode="${theme}"` : '';

    embedDisplay.textContent = `<!-- 1-Line Embed -->\n<script src="https://cdn.jsdelivr.net/npm/@nymrel/headless-quote/dist/quote-layer.min.js"></script>\n<nymrel-quote-layer config="${preset}"${themeAttr} webhook-url="https://api.yourdomain.com/quote-leads"></nymrel-quote-layer>`;
  }

  // Preset Selector change
  presetSelector?.addEventListener('change', () => {
    quoteEl.setAttribute('config', presetSelector.value);
    updateEmbedSnippet();
    logEvent('PRESET_CHANGED', { preset: presetSelector.value });
  });

  // Theme Selector change
  themeSelector?.addEventListener('change', () => {
    quoteEl.setAttribute('theme-mode', themeSelector.value);
    updateEmbedSnippet();
    logEvent('THEME_CHANGED', { theme: themeSelector.value });
  });

  // Copy embed snippet button
  btnCopy?.addEventListener('click', () => {
    if (embedDisplay?.textContent) {
      navigator.clipboard.writeText(embedDisplay.textContent).then(() => {
        const orig = btnCopy.textContent;
        btnCopy.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
          btnCopy.textContent = orig;
        }, 2000);
      });
    }
  });

  // Global telemetry listeners for Nymrel custom events
  window.addEventListener('nymrel:quote-calculated', ((e: CustomEvent) => {
    logEvent('nymrel:quote-calculated', {
      quoteId: e.detail?.quote?.quoteId,
      range: `${e.detail?.quote?.formattedMin} - ${e.detail?.quote?.formattedMax}`,
      target: e.detail?.quote?.formattedTarget
    });
  }) as EventListener);

  window.addEventListener('nymrel:step-change', ((e: CustomEvent) => {
    logEvent('nymrel:step-change', {
      stepIndex: e.detail?.stepIndex,
      stepTitle: e.detail?.step?.title
    });
  }) as EventListener);

  window.addEventListener('nymrel:lead-submitted', ((e: CustomEvent) => {
    logEvent('nymrel:lead-submitted (SUCCESS)', {
      quoteId: e.detail?.submission?.quoteId,
      lead: e.detail?.submission?.lead,
      attribution: e.detail?.submission?.attribution
    });
  }) as EventListener);

  logEvent('INITIALIZED', {
    version: '1.0.0',
    preset: presetSelector?.value,
    theme: themeSelector?.value,
    ua: navigator.userAgent
  });
});
