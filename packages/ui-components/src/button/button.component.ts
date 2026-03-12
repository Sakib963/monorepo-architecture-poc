import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'poc-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
    >
      <span *ngIf="loading" class="poc-spinner" aria-hidden="true"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
    }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .poc-spinner {
      width: 1em; height: 1em;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;

  get buttonClasses(): string {
    return [
      'poc-btn',
      `poc-btn--${this.variant}`,
      `poc-btn--${this.size}`,
    ].join(' ');
  }
}
