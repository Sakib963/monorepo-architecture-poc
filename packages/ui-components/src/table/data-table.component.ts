import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface DataTableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'poc-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="poc-table">
      <thead>
        <tr>
          <th *ngFor="let col of columns">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <ng-content></ng-content>
      </tbody>
    </table>
  `,
  styles: [`
    .poc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .poc-table th {
      text-align: left;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #718096;
      padding: 0.5rem 0.75rem;
      border-bottom: 2px solid #e2e8f0;
    }
    .poc-table :where(td) {
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid #f1f5f9;
      color: #2d3748;
    }
  `],
})
export class DataTableComponent {
  @Input() columns: DataTableColumn[] = [];
}
