import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent } from '@poc/ui-components';
import { approveTransferActionSchema, validate } from '@poc/validators';
import { AdminPortalApiService, type ApprovalQueueItem } from '../admin-portal-api.service';

@Component({
  standalone: true,
  selector: 'app-approvals-page',
  imports: [CommonModule, FormsModule, CurrencyPipe, CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="Approvals" subtitle="Approve or reject transfer queue" [bordered]="true">
      <poc-data-table [columns]="columns" *ngIf="queue().length; else emptyState">
        <tr *ngFor="let item of queue()">
          <td>{{ item.transferId.slice(0, 8) }}</td>
          <td>{{ item.userId.slice(0, 8) }}</td>
          <td>{{ item.amount | currency:item.currency:'symbol':'1.0-0' }}</td>
          <td>{{ item.requestedAt | date:'short' }}</td>
          <td>
            <div class="action-buttons">
              <poc-shared-button variant="secondary" size="sm" (click)="decide(item, 'APPROVE')" [attr.disabled]="submitting() ? '' : null">Approve</poc-shared-button>
              <poc-shared-button variant="danger" size="sm" (click)="decide(item, 'REJECT')" [attr.disabled]="submitting() ? '' : null">Reject</poc-shared-button>
            </div>
          </td>
        </tr>
      </poc-data-table>

      <poc-error-state *ngIf="errorMessage()" title="Approval action failed" [message]="errorMessage()!" [traceId]="traceId()"></poc-error-state>
      <div *ngIf="successMessage()" class="success">{{ successMessage() }}</div>
    </poc-card>

    <ng-template #emptyState>
      <poc-empty-state icon="✅" title="No pending approvals" message="Transfer queue is currently empty"></poc-empty-state>
    </ng-template>
  `,
  styles: [`
    .action-buttons { display: flex; gap: 0.5rem; }
    .success { margin-top: 0.75rem; color: #22c55e; font-weight: 600; font-size: 0.85rem; }
  `],
})
export class ApprovalsPageComponent implements OnInit {
  readonly columns = [
    { key: 'transferId', label: 'Transfer' },
    { key: 'userId', label: 'User' },
    { key: 'amount', label: 'Amount' },
    { key: 'requestedAt', label: 'Requested' },
    { key: 'actions', label: 'Actions' },
  ];

  readonly queue = signal<ApprovalQueueItem[]>([]);
  readonly submitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  constructor(private readonly api: AdminPortalApiService) {}

  async ngOnInit(): Promise<void> {
    this.queue.set(await this.api.getApprovalQueue());
  }

  async decide(item: ApprovalQueueItem, decision: 'APPROVE' | 'REJECT'): Promise<void> {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const validated = validate(approveTransferActionSchema, {
      transferId: item.transferId,
      decision,
      reason: decision === 'APPROVE' ? 'Approved by admin review' : 'Rejected by admin review',
    });

    if (!validated.success) {
      this.errorMessage.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.submitting.set(true);
    const result = await this.api.decideTransfer(validated.data!);
    this.submitting.set(false);

    if (!result.ok) {
      this.errorMessage.set(result.message);
      this.traceId.set(result.traceId);
      return;
    }

    this.queue.set(this.queue().filter((entry) => entry.transferId !== item.transferId));
    this.successMessage.set(`Transfer ${item.transferId.slice(0, 8)} marked as ${decision}.`);
  }
}
