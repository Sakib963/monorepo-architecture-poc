import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusLevel = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const STATUS_COLORS: Record<StatusLevel, string> = {
  success: '#48bb78',
  warning: '#ed8936',
  error:   '#fc8181',
  info:    '#63b3ed',
  neutral: '#a0aec0',
};

@Component({
  selector: 'poc-status-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="poc-status" [title]="label">
      <span class="poc-status__dot" [style.background]="dotColor" [class.poc-status__dot--pulse]="pulse"></span>
      <span *ngIf="showLabel" class="poc-status__label">{{ label }}</span>
    </span>
  `,
  styles: [`
    .poc-status { display: inline-flex; align-items: center; gap: 0.4rem; }
    .poc-status__dot {
      width: 0.5rem; height: 0.5rem;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .poc-status__dot--pulse {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .poc-status__label { font-size: 0.875rem; color: inherit; }
  `],
})
export class StatusIndicatorComponent {
  @Input() status: StatusLevel = 'neutral';
  @Input() label = '';
  @Input() showLabel = true;
  @Input() pulse = false;

  get dotColor(): string {
    return STATUS_COLORS[this.status];
  }
}
