import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'poc-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="poc-card" [class.poc-card--elevated]="elevated" [class.poc-card--bordered]="bordered">
      <div *ngIf="title || subtitle" class="poc-card__header">
        <h3 *ngIf="title" class="poc-card__title">{{ title }}</h3>
        <p *ngIf="subtitle" class="poc-card__subtitle">{{ subtitle }}</p>
      </div>
      <div class="poc-card__body">
        <ng-content></ng-content>
      </div>
      <div *ngIf="hasFooter" class="poc-card__footer">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .poc-card {
      background: #fff;
      border-radius: 0.5rem;
      padding: 1.25rem;
      overflow: hidden;
    }
    .poc-card--elevated { box-shadow: 0 2px 8px rgba(0,0,0,.12); }
    .poc-card--bordered { border: 1px solid #e2e8f0; }
    .poc-card__header { margin-bottom: 0.75rem; }
    .poc-card__title { font-size: 1rem; font-weight: 600; margin: 0 0 0.25rem; }
    .poc-card__subtitle { font-size: 0.875rem; color: #718096; margin: 0; }
    .poc-card__footer { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
  `],
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() elevated = false;
  @Input() bordered = true;
  @Input() hasFooter = false;
}
