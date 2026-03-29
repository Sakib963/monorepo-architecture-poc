import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { BadgeComponent, CardComponent, ErrorStateComponent, LoadingStateComponent } from '@poc/ui-components';
import { AdminPortalApiService, type AdminDashboardSummary } from '../admin-portal-api.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, CardComponent, BadgeComponent, ErrorStateComponent, LoadingStateComponent],
  template: `
    <poc-card title="Admin Dashboard" subtitle="KPI and system health summary" [bordered]="true">
      <poc-loading-state *ngIf="loading()" title="Loading dashboard" message="Fetching admin KPI summary"></poc-loading-state>

      <div *ngIf="!loading() && summary()" class="kpi-grid">
        <div class="kpi-item">
          <span>Total Users</span>
          <strong>{{ summary()!.totalUsers }}</strong>
        </div>
        <div class="kpi-item">
          <span>Active Users</span>
          <strong>{{ summary()!.activeUsers }}</strong>
        </div>
        <div class="kpi-item">
          <span>Pending Approvals</span>
          <strong>{{ summary()!.pendingApprovals }}</strong>
        </div>
        <div class="kpi-item">
          <span>Active Flags</span>
          <strong>{{ summary()!.activeFlags }}</strong>
        </div>
      </div>

      <div *ngIf="!loading() && summary()" class="health-row">
        <span>System health:</span>
        <poc-badge [color]="summary()!.systemHealth === 'HEALTHY' ? 'green' : 'yellow'">
          {{ summary()!.systemHealth }}
        </poc-badge>
      </div>

      <poc-error-state
        *ngIf="errorMessage()"
        title="Dashboard load failed"
        [message]="errorMessage()!"
      ></poc-error-state>
    </poc-card>
  `,
  styles: [`
    .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(160px, 1fr)); gap: 0.75rem; }
    .kpi-item { background: #f8fafc; border: 1px solid #dbe3ef; border-radius: 0.65rem; padding: 0.8rem; }
    .kpi-item span { display: block; color: #64748b; font-size: 0.8rem; }
    .kpi-item strong { color: #0f172a; font-size: 1.15rem; }
    .health-row { margin-top: 0.8rem; display: flex; align-items: center; gap: 0.5rem; color: #334155; }
  `],
})
export class DashboardPageComponent implements OnInit {
  readonly loading = signal(true);
  readonly summary = signal<AdminDashboardSummary | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor(private readonly api: AdminPortalApiService) {}

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      this.summary.set(await this.api.getDashboardSummary());
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to load dashboard summary');
    } finally {
      this.loading.set(false);
    }
  }
}
