import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent } from '@poc/ui-components';
import { exportAuditLogActionSchema, validate } from '@poc/validators';
import { AdminPortalApiService, type AuditLogItem } from '../admin-portal-api.service';

@Component({
  standalone: true,
  selector: 'app-audit-logs-page',
  imports: [CommonModule, FormsModule, CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="Audit Logs" subtitle="List and export CSV/PDF" [bordered]="true">
      <poc-data-table [columns]="columns" *ngIf="logs().length; else emptyTpl">
        <tr *ngFor="let log of logs()">
          <td>{{ log.actor }}</td>
          <td>{{ log.action }}</td>
          <td>{{ log.target }}</td>
          <td>{{ log.createdAt | date:'short' }}</td>
        </tr>
      </poc-data-table>

      <form (ngSubmit)="exportLogs()" class="export-form">
        <label>
          Format
          <select [(ngModel)]="format" name="format" required>
            <option value="CSV">CSV</option>
            <option value="PDF">PDF</option>
          </select>
        </label>
        <label>
          From
          <input type="datetime-local" [(ngModel)]="fromDate" name="fromDate" required />
        </label>
        <label>
          To
          <input type="datetime-local" [(ngModel)]="toDate" name="toDate" required />
        </label>

        <button type="submit" class="submit-btn" [disabled]="submitting()">{{ submitting() ? 'Exporting...' : 'Export Logs' }}</button>
      </form>

      <div *ngIf="successMessage()" class="success">{{ successMessage() }}</div>
      <poc-error-state *ngIf="errorMessage()" title="Audit export failed" [message]="errorMessage()!" [traceId]="traceId()"></poc-error-state>
    </poc-card>

    <ng-template #emptyTpl>
      <poc-empty-state icon="📁" title="No audit logs" message="No audit records available in current data source"></poc-empty-state>
    </ng-template>
  `,
  styles: [`
    .export-form {
      margin-top: 0.85rem;
      display: grid;
      grid-template-columns: 180px 1fr 1fr auto;
      gap: 0.65rem;
      align-items: end;
    }
    label { display: flex; flex-direction: column; gap: 0.35rem; color: #334155; font-size: 0.82rem; }
    input, select { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.65rem; background: #ffffff; color: #0f172a; }
    .submit-btn { border: 1px solid #475569; background: #64748b; color: #fff; border-radius: 0.5rem; padding: 0.55rem 0.9rem; font-weight: 600; cursor: pointer; }
    .submit-btn[disabled] { opacity: 0.65; cursor: not-allowed; }
    .success { margin-top: 0.7rem; color: #166534; font-weight: 600; font-size: 0.85rem; }
  `],
})
export class AuditLogsPageComponent implements OnInit {
  readonly columns = [
    { key: 'actor', label: 'Actor' },
    { key: 'action', label: 'Action' },
    { key: 'target', label: 'Target' },
    { key: 'createdAt', label: 'Created At' },
  ];

  readonly logs = signal<AuditLogItem[]>([]);
  readonly submitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  format: 'CSV' | 'PDF' = 'CSV';
  fromDate = '2026-03-01T00:00';
  toDate = '2026-03-29T23:59';

  constructor(private readonly api: AdminPortalApiService) {}

  async ngOnInit(): Promise<void> {
    this.logs.set(await this.api.getAuditLogs());
  }

  async exportLogs(): Promise<void> {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const validated = validate(exportAuditLogActionSchema, {
      fromDate: new Date(this.fromDate).toISOString(),
      toDate: new Date(this.toDate).toISOString(),
      format: this.format,
      requestedBy: 'admin-portal',
    });

    if (!validated.success) {
      this.errorMessage.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.submitting.set(true);
    const result = await this.api.exportAuditLogs(validated.data!);
    this.submitting.set(false);

    if (!result.ok) {
      this.errorMessage.set(result.message);
      this.traceId.set(result.traceId);
      return;
    }

    this.successMessage.set(`Audit export requested (${this.format}).`);
  }
}
