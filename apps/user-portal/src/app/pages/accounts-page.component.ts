import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent } from '@poc/ui-components';
import { requestStatementActionSchema, validate } from '@poc/validators';
import { PortalApiService, type AccountSummary } from '../portal-api.service';

@Component({
  standalone: true,
  selector: 'app-accounts-page',
  imports: [CommonModule, FormsModule, CurrencyPipe, CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="Accounts" subtitle="Balances and statement requests" [bordered]="true">
      <poc-data-table [columns]="columns" *ngIf="accounts().length; else emptyTpl">
        <tr *ngFor="let account of accounts()">
          <td>{{ account.accountNo }}</td>
          <td>{{ account.type }}</td>
          <td>{{ account.currency }}</td>
          <td>{{ account.balance | currency:account.currency:'symbol':'1.0-0' }}</td>
          <td>{{ account.status }}</td>
        </tr>
      </poc-data-table>
    </poc-card>

    <poc-card title="Request Statement" subtitle="Generate account statement" [bordered]="true">
      <form (ngSubmit)="submit()" class="grid">
        <label>
          Account
          <select [(ngModel)]="accountId" name="accountId" required>
            <option *ngFor="let account of accounts()" [value]="account.id">{{ account.accountNo }}</option>
          </select>
        </label>
        <label>
          Format
          <select [(ngModel)]="format" name="format" required>
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
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

        <div class="actions">
          <button type="submit" class="submit-btn" [disabled]="submitting()">
            {{ submitting() ? 'Requesting...' : 'Request Statement' }}
          </button>
          <span class="success" *ngIf="successMessage()">{{ successMessage() }}</span>
        </div>
      </form>

      <poc-error-state *ngIf="errorMessage()" title="Statement request failed" [message]="errorMessage()!" [traceId]="traceId()"></poc-error-state>
    </poc-card>

    <ng-template #emptyTpl>
      <poc-empty-state icon="🏦" title="No accounts found" message="No linked accounts were returned for this user."></poc-empty-state>
    </ng-template>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 0.8rem; }
    label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: #475569; }
    input, select { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.7rem; font-size: 0.92rem; }
    .actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 0.75rem; margin-top: 0.35rem; }
    .submit-btn { border: 1px solid #475569; background: #64748b; color: #fff; border-radius: 0.5rem; padding: 0.55rem 0.9rem; font-weight: 600; cursor: pointer; }
    .submit-btn[disabled] { opacity: 0.65; cursor: not-allowed; }
    .success { color: #166534; font-size: 0.85rem; font-weight: 600; }
  `],
})
export class AccountsPageComponent implements OnInit {
  readonly columns = [
    { key: 'accountNo', label: 'Account No' },
    { key: 'type', label: 'Type' },
    { key: 'currency', label: 'Currency' },
    { key: 'balance', label: 'Balance' },
    { key: 'status', label: 'Status' },
  ];

  readonly accounts = signal<AccountSummary[]>([]);

  accountId = '';
  format: 'PDF' | 'CSV' = 'PDF';
  fromDate = '2026-03-01T00:00';
  toDate = '2026-03-29T23:59';

  readonly submitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  constructor(private readonly api: PortalApiService) {}

  async ngOnInit(): Promise<void> {
    const accounts = await this.api.getAccounts('a0d88eb8-83a4-45fa-a9cd-7ee95f47d181');
    this.accounts.set(accounts);
    this.accountId = accounts[0]?.id ?? '';
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload = {
      accountId: this.accountId,
      format: this.format,
      fromDate: new Date(this.fromDate).toISOString(),
      toDate: new Date(this.toDate).toISOString(),
    };

    const validated = validate(requestStatementActionSchema, payload);
    if (!validated.success) {
      this.errorMessage.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.submitting.set(true);
    const result = await this.api.requestStatement(validated.data!);
    this.submitting.set(false);

    if (result.ok) {
      this.successMessage.set(`Statement request accepted (${this.format}).`);
      return;
    }

    this.errorMessage.set(result.message);
    this.traceId.set(result.traceId);
  }
}
