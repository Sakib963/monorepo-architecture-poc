import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'poc-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="poc-empty">
      <div class="poc-empty__icon">{{ icon }}</div>
      <h4 class="poc-empty__title">{{ title }}</h4>
      <p class="poc-empty__message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .poc-empty {
      border: 1px dashed #cbd5e0;
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: center;
      color: #718096;
    }
    .poc-empty__icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .poc-empty__title { margin: 0.2rem 0; color: #4a5568; font-size: 0.95rem; }
    .poc-empty__message { margin: 0; font-size: 0.85rem; }
  `],
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'No data';
  @Input() message = 'Nothing to display right now.';
}
