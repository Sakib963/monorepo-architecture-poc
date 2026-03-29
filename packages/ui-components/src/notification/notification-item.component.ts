import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'poc-notification-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="poc-notification" [class.poc-notification--read]="read">
      <div class="poc-notification__header">
        <strong>{{ title }}</strong>
        <span class="poc-notification__time">{{ timeLabel }}</span>
      </div>
      <p class="poc-notification__message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .poc-notification {
      border: 1px solid #e2e8f0;
      border-left: 4px solid #4299e1;
      border-radius: 0.4rem;
      padding: 0.65rem 0.75rem;
      background: #ffffff;
    }
    .poc-notification--read {
      border-left-color: #a0aec0;
      background: #f7fafc;
    }
    .poc-notification__header {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      color: #2d3748;
    }
    .poc-notification__time {
      font-size: 0.75rem;
      color: #718096;
    }
    .poc-notification__message {
      margin: 0;
      color: #4a5568;
      font-size: 0.85rem;
    }
  `],
})
export class NotificationItemComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() timeLabel = '';
  @Input() read = false;
}
