import { CommonModule, DatePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { CardComponent, EmptyStateComponent, ErrorStateComponent, NotificationItemComponent } from '@poc/ui-components';
import { markNotificationReadActionSchema, validate } from '@poc/validators';
import type { Notification } from '@poc/types';
import { PortalApiService } from '../portal-api.service';

@Component({
  standalone: true,
  selector: 'app-notifications-page',
  imports: [CommonModule, DatePipe, CardComponent, EmptyStateComponent, ErrorStateComponent, NotificationItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <poc-card title="Notifications" subtitle="In-app and email alerts" [bordered]="true">
      <div class="toolbar" *ngIf="notifications().length">
        <poc-shared-button variant="ghost" size="sm" (click)="markAllRead()" [attr.disabled]="submitting() ? '' : null" [attr.loading]="submitting() ? '' : null">
          Mark all as read
        </poc-shared-button>
        <span class="meta">{{ unreadCount() }} unread</span>
      </div>

      <div class="list" *ngIf="notifications().length; else emptyTpl">
        <div *ngFor="let notification of notifications()" class="row">
          <poc-notification-item
            [title]="notification.title"
            [message]="notification.message"
            [timeLabel]="(notification.createdAt | date:'short') ?? ''"
            [read]="!!notification.readAt"
          ></poc-notification-item>
          <poc-shared-button
            *ngIf="!notification.readAt"
            size="sm"
            variant="secondary"
            (click)="markOneRead(notification.id)">
            Mark read
          </poc-shared-button>
        </div>
      </div>

      <poc-error-state *ngIf="errorMessage()" title="Notification action failed" [message]="errorMessage()!" [traceId]="traceId()"></poc-error-state>
    </poc-card>

    <ng-template #emptyTpl>
      <poc-empty-state icon="🔔" title="No notifications" message="You're all caught up."></poc-empty-state>
    </ng-template>
  `,
  styles: [`
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .meta { color: #64748b; font-size: 0.82rem; }
    .list { display: flex; flex-direction: column; gap: 0.65rem; }
    .row { display: grid; grid-template-columns: 1fr auto; gap: 0.65rem; align-items: center; }
  `],
})
export class NotificationsPageComponent implements OnInit {
  readonly notifications = signal<Notification[]>([]);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  constructor(private readonly api: PortalApiService) {}

  unreadCount = () => this.notifications().filter((notification) => !notification.readAt).length;

  async ngOnInit(): Promise<void> {
    const notifications = await this.api.getNotifications('a0d88eb8-83a4-45fa-a9cd-7ee95f47d181');
    this.notifications.set(notifications);
  }

  async markOneRead(id: string): Promise<void> {
    await this.markRead([id]);
  }

  async markAllRead(): Promise<void> {
    const ids = this.notifications().filter((notification) => !notification.readAt).map((notification) => notification.id);
    if (!ids.length) return;
    await this.markRead(ids);
  }

  private async markRead(ids: string[]): Promise<void> {
    this.errorMessage.set(null);

    const validated = validate(markNotificationReadActionSchema, {
      notificationIds: ids,
      read: true,
    });

    if (!validated.success) {
      this.errorMessage.set(validated.errors.map((error) => error.message).join(' | '));
      return;
    }

    this.submitting.set(true);
    const result = await this.api.markNotificationsRead(validated.data!);
    this.submitting.set(false);

    if (result.ok) {
      const now = new Date().toISOString();
      this.notifications.set(
        this.notifications().map((notification) =>
          ids.includes(notification.id)
            ? { ...notification, readAt: notification.readAt ?? now }
            : notification,
        ),
      );
      return;
    }

    this.errorMessage.set(result.message);
    this.traceId.set(result.traceId);
  }
}
