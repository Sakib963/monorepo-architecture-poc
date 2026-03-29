import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, CardComponent, LoadingStateComponent, StatusIndicatorComponent } from '@poc/ui-components';
import { PortalApiService } from '../portal-api.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, CurrencyPipe, RouterLink, CardComponent, BadgeComponent, StatusIndicatorComponent, LoadingStateComponent],
  template: `
    <section class="header-row">
      <div>
        <h2>Welcome back</h2>
        <p>Your account and activity snapshot for today.</p>
      </div>
      <poc-badge color="blue">Live Snapshot</poc-badge>
    </section>

    <div class="kpi-grid" *ngIf="!loading(); else loadingTpl">
      <poc-card title="Accounts" subtitle="Active linked accounts" [bordered]="true">
        <div class="kpi">{{ summary().totalAccounts }}</div>
        <poc-status-indicator status="success" label="Healthy" [showLabel]="true"></poc-status-indicator>
      </poc-card>

      <poc-card title="Total Balance" subtitle="Across all accounts" [bordered]="true">
        <div class="kpi">{{ summary().totalBalance | currency:'BDT':'symbol':'1.0-0' }}</div>
        <small>Includes BDT + USD converted view</small>
      </poc-card>

      <poc-card title="Pending Transfers" subtitle="Awaiting settlement" [bordered]="true">
        <div class="kpi">{{ summary().pendingTransfers }}</div>
        <poc-status-indicator status="warning" label="Needs review"></poc-status-indicator>
      </poc-card>

      <poc-card title="Unread Alerts" subtitle="Notifications pending" [bordered]="true">
        <div class="kpi">{{ summary().unreadNotifications }}</div>
        <poc-status-indicator [status]="summary().unreadNotifications ? 'info' : 'neutral'" label="Attention"></poc-status-indicator>
      </poc-card>
    </div>

    <poc-card title="Quick Actions" subtitle="Most-used actions" [bordered]="true">
      <div class="actions">
        <a routerLink="/transactions" class="action-link">Initiate Transfer</a>
        <a routerLink="/accounts" class="action-link">Request Statement</a>
        <a routerLink="/profile" class="action-link">Update Profile</a>
        <a routerLink="/notifications" class="action-link">Review Notifications</a>
      </div>
    </poc-card>

    <ng-template #loadingTpl>
      <poc-loading-state message="Loading dashboard metrics..."></poc-loading-state>
    </ng-template>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
    h2 { margin: 0; font-size: 1.5rem; }
    p { margin: 0.35rem 0 0; color: #64748b; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .kpi { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin-bottom: 0.6rem; }
    small { color: #64748b; }
    .actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
    .action-link { text-decoration: none; color: #0f172a; padding: 0.75rem; border-radius: 0.6rem; border: 1px solid #e2e8f0; background: linear-gradient(180deg, #fff, #f8fafc); font-weight: 600; }
    .action-link:hover { border-color: #93c5fd; background: #eff6ff; }
  `],
})
export class DashboardPageComponent implements OnInit {
  readonly loading = signal(true);
  readonly summary = signal({ totalAccounts: 0, totalBalance: 0, pendingTransfers: 0, unreadNotifications: 0 });
  readonly hasUnread = computed(() => this.summary().unreadNotifications > 0);

  constructor(private readonly api: PortalApiService) {}

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    const result = await this.api.getDashboardSummary('a0d88eb8-83a4-45fa-a9cd-7ee95f47d181');
    this.summary.set(result);
    this.loading.set(false);
  }
}
