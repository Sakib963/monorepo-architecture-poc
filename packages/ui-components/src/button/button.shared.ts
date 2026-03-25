export type SharedButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type SharedButtonSize = 'sm' | 'md' | 'lg';

const TAG = 'poc-shared-button';

class SharedButtonElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant', 'size', 'disabled', 'loading', 'type'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    if (!this.shadowRoot) return;

    const variant = (this.getAttribute('variant') ?? 'primary') as SharedButtonVariant;
    const size = (this.getAttribute('size') ?? 'md') as SharedButtonSize;
    const type = this.getAttribute('type') ?? 'button';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s, border-color 0.15s;
          font-size: 0.875rem;
          line-height: 1;
        }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        button:hover:not(:disabled) { opacity: 0.9; }

        .size-sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
        .size-md { padding: 0.5rem 1rem; }
        .size-lg { padding: 0.75rem 1.5rem; font-size: 0.95rem; }

        .variant-primary { background: #4299e1; color: #fff; border: 1px solid #4299e1; }
        .variant-primary:hover:not(:disabled) { background: #3182ce; }

        .variant-secondary { background: #edf2f7; color: #2d3748; border: 1px solid #cbd5e0; }
        .variant-secondary:hover:not(:disabled) { background: #e2e8f0; }

        .variant-danger { background: #fc8181; color: #fff; border: 1px solid #fc8181; }
        .variant-danger:hover:not(:disabled) { background: #f56565; }

        .variant-ghost { background: transparent; color: #718096; border: 1px solid #cbd5e0; }
        .variant-ghost:hover:not(:disabled) { background: #f7fafc; border-color: #a0aec0; }

        .spinner {
          display: inline-block;
          width: 1em;
          height: 1em;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
      <button type="${type}" class="variant-${variant} size-${size}" ${disabled || loading ? 'disabled' : ''}>
        ${loading ? '<span class="spinner" aria-hidden="true"></span>' : ''}
        <slot></slot>
      </button>
    `;
  }
}

export function registerSharedButtonElement(): void {
  if (!customElements.get(TAG)) {
    customElements.define(TAG, SharedButtonElement);
  }
}
