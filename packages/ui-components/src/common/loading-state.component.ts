import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'poc-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="poc-loading" [attr.aria-label]="message">
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    .poc-loading {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #718096;
      font-size: 0.9rem;
      padding: 0.5rem 0;
    }
    .spinner {
      width: 0.85rem;
      height: 0.85rem;
      border: 2px solid #cbd5e0;
      border-top-color: #4299e1;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class LoadingStateComponent {
  @Input() message = 'Loading...';
}
