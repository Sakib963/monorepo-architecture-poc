import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { User } from '@poc/types';
import { CardComponent, ErrorStateComponent } from '@poc/ui-components';
import {
  changeUserStatusActionSchema,
  resetUserCredentialActionSchema,
  validate,
} from '@poc/validators';
import { AdminPortalApiService } from '../admin-portal-api.service';

@Component({
  standalone: true,
  selector: 'app-user-detail-page',
  imports: [CommonModule, FormsModule, CardComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="User Details" subtitle="Status and credential actions" [bordered]="true">
      <div *ngIf="loading()" class="loading">Loading user details...</div>
      <div *ngIf="!loading() && user()" class="profile">
        <div><strong>Name:</strong> {{ user()!.firstName }} {{ user()!.lastName }}</div>
        <div><strong>Email:</strong> {{ user()!.email }}</div>
        <div><strong>Current Status:</strong> {{ user()!.status }}</div>
      </div>
    </poc-card>

    <poc-card title="Change User Status" subtitle="ACTIVE/SUSPENDED/BLOCKED action" [bordered]="true">
      <form (ngSubmit)="submitStatusChange()" class="grid">
        <label>
          Status
          <select [(ngModel)]="status" name="status" required>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </label>

        <label>
          Reason
          <input [(ngModel)]="statusReason" name="statusReason" required />
        </label>

        <div class="actions">
          <button type="submit" class="submit-btn" [disabled]="statusSubmitting()">{{ statusSubmitting() ? 'Applying...' : 'Apply Status' }}</button>
          <span *ngIf="statusSuccess()" class="success">Status updated</span>
        </div>
      </form>

      <poc-error-state *ngIf="statusError()" title="Status update failed" [message]="statusError()!" [traceId]="statusTraceId()"></poc-error-state>
    </poc-card>

    <poc-card title="Reset Credential" subtitle="EMAIL/SMS reset request action" [bordered]="true">
      <form (ngSubmit)="submitCredentialReset()" class="grid">
        <label>
          Channel
          <select [(ngModel)]="resetChannel" name="resetChannel" required>
            <option value="EMAIL">EMAIL</option>
            <option value="SMS">SMS</option>
          </select>
        </label>

        <label>
          Reason
          <input [(ngModel)]="resetReason" name="resetReason" required />
        </label>

        <div class="actions">
          <button type="submit" class="submit-btn danger" [disabled]="resetSubmitting()">{{ resetSubmitting() ? 'Submitting...' : 'Reset Credential' }}</button>
          <span *ngIf="resetSuccess()" class="success">Reset requested</span>
        </div>
      </form>

      <poc-error-state *ngIf="resetError()" title="Credential reset failed" [message]="resetError()!" [traceId]="resetTraceId()"></poc-error-state>
    </poc-card>
  `,
  styles: [`
    .loading { color: #64748b; }
    .profile { display: grid; gap: 0.35rem; color: #334155; font-size: 0.9rem; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 0.7rem; }
    label { display: flex; flex-direction: column; gap: 0.35rem; color: #334155; font-size: 0.85rem; }
    input, select { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.65rem; background: #ffffff; color: #0f172a; }
    .actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 0.75rem; }
    .submit-btn { border: 1px solid #475569; background: #64748b; color: #fff; border-radius: 0.5rem; padding: 0.55rem 0.9rem; font-weight: 600; cursor: pointer; }
    .submit-btn.danger { border-color: #b91c1c; background: #dc2626; }
    .submit-btn[disabled] { opacity: 0.65; cursor: not-allowed; }
    .success { color: #166534; font-size: 0.85rem; font-weight: 600; }
  `],
})
export class UserDetailPageComponent implements OnInit {
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);

  userId = '';

  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' = 'ACTIVE';
  statusReason = 'Administrative review completed';
  readonly statusSubmitting = signal(false);
  readonly statusSuccess = signal(false);
  readonly statusError = signal<string | null>(null);
  readonly statusTraceId = signal<string | undefined>(undefined);

  resetChannel: 'EMAIL' | 'SMS' = 'EMAIL';
  resetReason = 'Credential reset requested by admin';
  readonly resetSubmitting = signal(false);
  readonly resetSuccess = signal(false);
  readonly resetError = signal<string | null>(null);
  readonly resetTraceId = signal<string | undefined>(undefined);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: AdminPortalApiService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
    this.user.set(await this.api.getUserById(this.userId));
    this.status = this.user()?.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE';
    this.loading.set(false);
  }

  async submitStatusChange(): Promise<void> {
    this.statusSuccess.set(false);
    this.statusError.set(null);

    const validated = validate(changeUserStatusActionSchema, {
      userId: this.userId,
      status: this.status,
      reason: this.statusReason,
    });

    if (!validated.success) {
      this.statusError.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.statusSubmitting.set(true);
    const result = await this.api.changeUserStatus(validated.data!);
    this.statusSubmitting.set(false);

    if (result.ok) {
      this.statusSuccess.set(true);
      return;
    }

    this.statusError.set(result.message);
    this.statusTraceId.set(result.traceId);
  }

  async submitCredentialReset(): Promise<void> {
    this.resetSuccess.set(false);
    this.resetError.set(null);

    const validated = validate(resetUserCredentialActionSchema, {
      userId: this.userId,
      channel: this.resetChannel,
      reason: this.resetReason,
    });

    if (!validated.success) {
      this.resetError.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.resetSubmitting.set(true);
    const result = await this.api.resetUserCredential(validated.data!);
    this.resetSubmitting.set(false);

    if (result.ok) {
      this.resetSuccess.set(true);
      return;
    }

    this.resetError.set(result.message);
    this.resetTraceId.set(result.traceId);
  }
}
