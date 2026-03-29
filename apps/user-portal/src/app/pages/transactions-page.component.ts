import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, DataTableComponent, ErrorStateComponent } from '@poc/ui-components';
import { getFlag } from '@poc/feature-flags';
import { createTransferActionSchema, validate } from '@poc/validators';
import { PortalApiService, type AccountSummary, type TransactionSummary } from '../portal-api.service';

@Component({
  standalone: true,
  selector: 'app-transactions-page',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, CardComponent, DataTableComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="Transactions" subtitle="Recent account activity" [bordered]="true">
      <poc-data-table [columns]="columns">
        <tr *ngFor="let tx of transactions()">
          <td>{{ tx.date | date:'mediumDate' }}</td>
          <td>{{ tx.description }}</td>
          <td>{{ tx.debit ? (tx.debit | currency:'BDT':'symbol':'1.0-0') : '—' }}</td>
          <td>{{ tx.credit ? (tx.credit | currency:'BDT':'symbol':'1.0-0') : '—' }}</td>
          <td>{{ tx.balance | currency:'BDT':'symbol':'1.0-0' }}</td>
        </tr>
      </poc-data-table>
    </poc-card>

    <poc-card title="Create Transfer" subtitle="Submit a transfer instruction" [bordered]="true">
      <div *ngIf="isMaintenanceMode" class="maintenance-banner">
        Transfers are temporarily disabled by feature flag (<strong>CORE_MAINTENANCE_MODE</strong>).
      </div>

      <form (ngSubmit)="submit()" class="grid" [class.disabled]="isMaintenanceMode">
        <label>
          From account
          <select [(ngModel)]="fromAccountId" name="fromAccountId" required [disabled]="isMaintenanceMode">
            <option *ngFor="let account of accounts()" [value]="account.id">{{ account.accountNo }}</option>
          </select>
        </label>
        <label>
          To account (UUID)
          <input [(ngModel)]="toAccountId" name="toAccountId" required [disabled]="isMaintenanceMode" />
        </label>
        <label>
          Amount
          <input type="number" min="1" step="0.01" [(ngModel)]="amount" name="amount" required [disabled]="isMaintenanceMode" />
        </label>
        <label>
          Currency
          <select [(ngModel)]="currency" name="currency" required [disabled]="isMaintenanceMode">
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label class="full">
          Note
          <input [(ngModel)]="note" name="note" [disabled]="isMaintenanceMode" />
        </label>

        <div class="actions full">
          <button type="submit" class="submit-btn" [disabled]="submitting() || isMaintenanceMode">
            {{ submitting() ? 'Submitting...' : 'Submit Transfer' }}
          </button>
          <span class="success" *ngIf="successMessage()">{{ successMessage() }}</span>
        </div>
      </form>

      <poc-error-state *ngIf="errorMessage()" title="Transfer failed" [message]="errorMessage()!" [traceId]="traceId()"></poc-error-state>
    </poc-card>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 0.8rem; }
    .full { grid-column: 1 / -1; }
    label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: #475569; }
    input, select { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.7rem; font-size: 0.92rem; }
    .actions { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.35rem; }
    .submit-btn { border: 1px solid #1d4ed8; background: #2563eb; color: #fff; border-radius: 0.5rem; padding: 0.55rem 0.9rem; font-weight: 600; cursor: pointer; }
    .submit-btn[disabled] { opacity: 0.65; cursor: not-allowed; }
    .success { color: #166534; font-size: 0.85rem; font-weight: 600; }
    .maintenance-banner { margin-bottom: 0.85rem; padding: 0.6rem 0.8rem; border-radius: 0.5rem; font-size: 0.84rem; background: #fff7ed; color: #9a3412; border: 1px solid #fdba74; }
    .disabled { opacity: 0.72; }
  `],
})
export class TransactionsPageComponent implements OnInit {
  readonly columns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'debit', label: 'Debit' },
    { key: 'credit', label: 'Credit' },
    { key: 'balance', label: 'Balance' },
  ];

  readonly accounts = signal<AccountSummary[]>([]);
  readonly transactions = signal<TransactionSummary[]>([]);

  fromAccountId = '';
  toAccountId = '11472f32-68d9-449f-8f8f-f5ec0a47d95d';
  amount = 2500;
  currency: 'BDT' | 'USD' = 'BDT';
  note = 'Monthly savings transfer';

  readonly submitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);
  readonly isMaintenanceMode = getFlag('CORE_MAINTENANCE_MODE');

  constructor(private readonly api: PortalApiService) {}

  async ngOnInit(): Promise<void> {
    const [accounts, transactions] = await Promise.all([
      this.api.getAccounts('a0d88eb8-83a4-45fa-a9cd-7ee95f47d181'),
      this.api.getTransactions('a0d88eb8-83a4-45fa-a9cd-7ee95f47d181'),
    ]);
    this.accounts.set(accounts);
    this.transactions.set(transactions);
    this.fromAccountId = accounts[0]?.id ?? '';
  }

  async submit(): Promise<void> {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    if (this.isMaintenanceMode) {
      this.errorMessage.set('Transfers are disabled while CORE_MAINTENANCE_MODE is active.');
      return;
    }

    const validated = validate(createTransferActionSchema, {
      fromAccountId: this.fromAccountId,
      toAccountId: this.toAccountId,
      amount: this.amount,
      currency: this.currency,
      note: this.note,
    });

    if (!validated.success) {
      this.errorMessage.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.submitting.set(true);
    const result = await this.api.createTransfer(validated.data!);
    this.submitting.set(false);

    if (result.ok) {
      this.successMessage.set(`Transfer submitted. Ref: ${result.data?.transferId ?? 'pending'}`);
      return;
    }

    this.errorMessage.set(result.message);
    this.traceId.set(result.traceId);
  }
}
