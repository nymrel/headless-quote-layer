import { afterEach, describe, expect, it } from 'vitest';
import { createQuoteWidget } from '../src/components/QuoteWidget';
import { QuoteSchema } from '../src/core/types';

const schema: QuoteSchema = {
  id: 'recovery', name: 'Project estimate',
  pricing: { baseFee: 100, currency: 'USD', currencySymbol: '$' },
  steps: [{ id: 'details', title: 'Project details', fields: [{ id: 'description', type: 'text', label: 'Project description' }] }],
  leadForm: { enabled: true, requireDate: true }
};

function mount(shadow = false) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const widget = createQuoteWidget(host, { schema, useShadowDom: shadow });
  return { widget, host, root: shadow ? host.shadowRoot! : host };
}

afterEach(() => { document.body.innerHTML = ''; });

describe('Customer input recovery', () => {
  for (const shadow of [false, true]) {
    it(`keeps typing focus and cursor when estimates recalculate (shadow=${shadow})`, () => {
      const { root } = mount(shadow);
      const input = root.querySelector<HTMLInputElement>('[data-field-id="description"]')!;
      input.focus();
      input.value = 'Kitchen ';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const continuing = root.querySelector<HTMLInputElement>('[data-field-id="description"]')!;
      expect(continuing.value).toBe('Kitchen ');
      continuing.value = 'Kitchen project';
      continuing.setSelectionRange(7, 7);
      continuing.dispatchEvent(new Event('input', { bubbles: true }));
      const updated = root.querySelector<HTMLInputElement>('[data-field-id="description"]')!;
      expect(updated.value).toBe('Kitchen project');
      expect('activeElement' in root ? root.activeElement : document.activeElement).toBe(updated);
      expect(updated.selectionStart).toBe(7);
    });
  }

  it('keeps contact details and chosen time through edit, breakdown, and validation recovery', async () => {
    const { widget, root } = mount();
    widget.nextStep();
    const change = (name: string, value: string) => {
      const input = root.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    change('name', 'Alex Morgan');
    change('email', 'alex@example.com');
    change('notes', 'Please use the side entrance.');
    change('preferredTime', 'evening');
    widget.prevStep();
    widget.nextStep();
    expect(root.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe('Alex Morgan');
    expect(root.querySelector('[name="preferredTime"] option[selected]')!.getAttribute('value')).toBe('evening');
    root.querySelector<HTMLButtonElement>('#nym-toggle-breakdown')!.click();
    expect(root.querySelector<HTMLTextAreaElement>('[name="notes"]')!.value).toBe('Please use the side entrance.');
    await widget.submitLead({ name: 'Alex Morgan', email: 'invalid', preferredTime: 'evening' });
    expect(root.querySelector<HTMLInputElement>('[name="email"]')!.value).toBe('invalid');
    expect(root.querySelector('label[for="nym-lead-email"]')!.textContent).toContain('Email');
    widget.reset();
    widget.nextStep();
    expect(root.querySelector<HTMLInputElement>('[name="email"]')!.value).toBe('');
  });
});
