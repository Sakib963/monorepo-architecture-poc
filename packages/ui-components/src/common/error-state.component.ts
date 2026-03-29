import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'poc-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="poc-error" role="alert">
      <strong>{{ title }}</strong>
      <p>{{ message }}</p>
      <small *ngIf="traceId">traceId: {{ traceId }}</small>
    </div>
  `,
  styles: [`
    .poc-error {
      background: #fff5f5;
      border: 1px solid #fed7d7;
      border-left: 4px solid #e53e3e;
      border-radius: 0.4rem;
      padding: 0.75rem;
      color: #742a2a;
      font-size: 0.85rem;
    }
    .poc-error p { margin: 0.35rem 0; }
    .poc-error small { color: #9b2c2c; font-family: monospace; }
  `],
})
export class ErrorStateComponent {
  @Input() title = 'Action failed';
  @Input() message = 'Please try again.';
  @Input() traceId?: string;
}
