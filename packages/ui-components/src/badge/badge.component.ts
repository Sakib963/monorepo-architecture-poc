import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';

@Component({
  selector: 'poc-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    span {
      display: inline-flex;
      align-items: center;
      padding: 0.2em 0.65em;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      text-transform: uppercase;
    }
    .poc-badge--blue   { background: #ebf8ff; color: #2b6cb0; }
    .poc-badge--green  { background: #f0fff4; color: #276749; }
    .poc-badge--yellow { background: #fffff0; color: #975a16; }
    .poc-badge--red    { background: #fff5f5; color: #c53030; }
    .poc-badge--gray   { background: #f7fafc; color: #4a5568; }
    .poc-badge--purple { background: #faf5ff; color: #6b46c1; }
  `],
})
export class BadgeComponent {
  @Input() color: BadgeColor = 'gray';

  get badgeClasses(): string {
    return `poc-badge poc-badge--${this.color}`;
  }
}
