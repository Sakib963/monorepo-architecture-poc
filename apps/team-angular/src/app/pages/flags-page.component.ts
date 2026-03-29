import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent } from '@poc/ui-components';
import { toggleFeatureFlagActionSchema, validate } from '@poc/validators';
import { AdminPortalApiService, type FlagStateItem } from '../admin-portal-api.service';

@Component({
  standalone: true,
  selector: 'app-flags-page',
  imports: [CommonModule, FormsModule, CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="Feature Flags" subtitle="Toggle runtime flags with audit reason" [bordered]="true">
      <div class="reason-row">
        <label>
          Toggle reason
          <input [(ngModel)]="reason" name="reason" placeholder="Reason for changing flag state" />
        </label>
      </div>

      <poc-data-table [columns]="columns" *ngIf="flags().length; else emptyTpl">
        <tr *ngFor="let flag of flags()">
          <td>{{ flag.key }}</td>
          <td>{{ flag.enabled ? 'ON' : 'OFF' }}</td>
          <td>
            <poc-shared-button size="sm" variant="secondary" (click)="toggle(flag)" [attr.disabled]="submitting() ? '' : null">
              Set {{ flag.enabled ? 'OFF' : 'ON' }}
            </poc-shared-button>
          </td>
        </tr>
      </poc-data-table>

      <div *ngIf="successMessage()" class="success">{{ successMessage() }}</div>
      <poc-error-state *ngIf="errorMessage()" title="Flag toggle failed" [message]="errorMessage()!" [traceId]="traceId()"></poc-error-state>
    </poc-card>

    <ng-template #emptyTpl>
      <poc-empty-state icon="🚩" title="No flags loaded" message="Flag endpoint returned no active entries"></poc-empty-state>
    </ng-template>
  `,
  styles: [`
    .reason-row { margin-bottom: 0.75rem; }
    label { display: flex; flex-direction: column; gap: 0.35rem; color: #334155; font-size: 0.85rem; }
    input { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.65rem; background: #ffffff; color: #0f172a; }
    .success { margin-top: 0.7rem; color: #166534; font-weight: 600; font-size: 0.85rem; }
  `],
})
export class FlagsPageComponent implements OnInit {
  readonly columns = [
    { key: 'key', label: 'Flag Key' },
    { key: 'enabled', label: 'State' },
    { key: 'action', label: 'Action' },
  ];

  readonly flags = signal<FlagStateItem[]>([]);
  readonly submitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  reason = 'Admin flag operation';

  constructor(private readonly api: AdminPortalApiService) {}

  async ngOnInit(): Promise<void> {
    this.flags.set(await this.api.getFeatureFlags());
  }

  async toggle(flag: FlagStateItem): Promise<void> {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const validated = validate(toggleFeatureFlagActionSchema, {
      flagKey: flag.key,
      enabled: !flag.enabled,
      reason: this.reason,
    });

    if (!validated.success) {
      this.errorMessage.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.submitting.set(true);
    const result = await this.api.toggleFeatureFlag(validated.data!);
    this.submitting.set(false);

    if (!result.ok) {
      this.errorMessage.set(result.message);
      this.traceId.set(result.traceId);
      return;
    }

    this.flags.set(this.flags().map((entry) => entry.key === flag.key ? { ...entry, enabled: !entry.enabled } : entry));
    this.successMessage.set(`Flag ${flag.key} updated.`);
  }
}
