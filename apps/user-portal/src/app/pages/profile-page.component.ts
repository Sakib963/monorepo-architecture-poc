import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, ErrorStateComponent } from '@poc/ui-components';
import { updateProfileActionSchema, validate } from '@poc/validators';
import { PortalApiService } from '../portal-api.service';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  imports: [CommonModule, FormsModule, CardComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="Profile" subtitle="Update your personal details" [bordered]="true">
      <form (ngSubmit)="submit()" class="grid">
        <label>
          Full name
          <input [(ngModel)]="fullName" name="fullName" required />
        </label>
        <label>
          Phone
          <input [(ngModel)]="phone" name="phone" required />
        </label>
        <label class="full">
          Address
          <input [(ngModel)]="addressLine" name="addressLine" required />
        </label>

        <div class="actions full">
          <button type="submit" class="submit-btn" [disabled]="submitting()">
            {{ submitting() ? 'Saving...' : 'Save Profile' }}
          </button>
          <span *ngIf="success()" class="success">Profile updated successfully</span>
        </div>
      </form>

      <poc-error-state
        *ngIf="errorMessage()"
        title="Profile update failed"
        [message]="errorMessage()!"
        [traceId]="traceId()"
      ></poc-error-state>
    </poc-card>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 0.8rem; }
    .full { grid-column: 1 / -1; }
    label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: #475569; }
    input { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.7rem; font-size: 0.92rem; }
    input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.14); }
    .actions { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; }
    .submit-btn { border: 1px solid #1d4ed8; background: #2563eb; color: #fff; border-radius: 0.5rem; padding: 0.55rem 0.9rem; font-weight: 600; cursor: pointer; }
    .submit-btn[disabled] { opacity: 0.65; cursor: not-allowed; }
    .success { color: #166534; font-size: 0.85rem; font-weight: 600; }
  `],
})
export class ProfilePageComponent implements OnInit {
  fullName = '';
  phone = '';
  addressLine = '';

  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  constructor(private readonly api: PortalApiService) {}

  async ngOnInit(): Promise<void> {
    const user = await this.api.getCurrentUser('a0d88eb8-83a4-45fa-a9cd-7ee95f47d181');
    this.fullName = `${user?.firstName ?? 'Sakib'} ${user?.lastName ?? 'Ahmed'}`;
    this.phone = '+8801711122233';
    this.addressLine = 'Dhaka, Bangladesh';
  }

  async submit(): Promise<void> {
    this.success.set(false);
    this.errorMessage.set(null);
    this.traceId.set(undefined);

    const validated = validate(updateProfileActionSchema, {
      fullName: this.fullName,
      phone: this.phone,
      addressLine: this.addressLine,
    });

    if (!validated.success) {
      this.errorMessage.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.submitting.set(true);
    const result = await this.api.updateProfile('a0d88eb8-83a4-45fa-a9cd-7ee95f47d181', validated.data!);
    this.submitting.set(false);

    if (result.ok) {
      this.success.set(true);
      return;
    }

    this.errorMessage.set(result.message);
    this.traceId.set(result.traceId);
  }
}
