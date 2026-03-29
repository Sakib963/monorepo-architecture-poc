import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  BadgeComponent,
  CardComponent,
  DataTableComponent,
  EmptyStateComponent,
  ErrorStateComponent,
  LoadingStateComponent,
  NotificationItemComponent,
  StatusIndicatorComponent,
} from '@poc/ui-components';

@Component({
  selector: 'app-ui-library-demo',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    BadgeComponent,
    StatusIndicatorComponent,
    DataTableComponent,
    EmptyStateComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    NotificationItemComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="page">
      <h1>UI Library</h1>
      <p class="desc">Shared component proof surface for both Angular portals.</p>

      <poc-card title="Buttons" subtitle="Shared custom element variants" [bordered]="true">
        <div class="row">
          <poc-shared-button variant="primary">Primary</poc-shared-button>
          <poc-shared-button variant="secondary">Secondary</poc-shared-button>
          <poc-shared-button variant="danger">Danger</poc-shared-button>
          <poc-shared-button variant="ghost">Ghost</poc-shared-button>
          <poc-shared-button variant="secondary" loading>Loading</poc-shared-button>
        </div>
      </poc-card>

      <poc-card title="Badges and Status" [bordered]="true">
        <div class="row">
          <poc-badge color="green">ACTIVE</poc-badge>
          <poc-badge color="red">SUSPENDED</poc-badge>
          <poc-badge color="yellow">PENDING</poc-badge>
          <poc-status-indicator status="success" label="Healthy"></poc-status-indicator>
          <poc-status-indicator status="warning" label="Degraded"></poc-status-indicator>
          <poc-status-indicator status="error" label="Failed"></poc-status-indicator>
        </div>
      </poc-card>

      <poc-card title="Table + Notifications" [bordered]="true">
        <poc-data-table [columns]="columns">
          <tr>
            <td>a0d88eb8</td>
            <td>ACTIVE</td>
            <td>ADMIN</td>
          </tr>
          <tr>
            <td>b9327d98</td>
            <td>SUSPENDED</td>
            <td>CUSTOMER</td>
          </tr>
        </poc-data-table>

        <div class="notify-grid">
          <poc-notification-item title="Transfer Approved" message="Transfer 8eb1987c approved." timeLabel="2m ago" [read]="false"></poc-notification-item>
          <poc-notification-item title="Credential Reset" message="Password reset link sent." timeLabel="10m ago" [read]="true"></poc-notification-item>
        </div>
      </poc-card>

      <poc-card title="State Components" [bordered]="true">
        <div class="state-grid">
          <poc-loading-state title="Loading" message="Fetching page data"></poc-loading-state>
          <poc-empty-state icon="📭" title="No data" message="No records for selected filters"></poc-empty-state>
          <poc-error-state title="Action failed" message="Invalid payload submitted" traceId="demo-trace-001"></poc-error-state>
        </div>
      </poc-card>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1050px; }
    h1 { color: #e2e8f0; margin-bottom: 0.35rem; }
    .desc { color: #94a3b8; margin-bottom: 1rem; }
    .row { display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center; }
    .notify-grid { margin-top: 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
    .state-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem; }
  `],
})
export class UiLibraryDemoComponent {
  readonly columns = [
    { key: 'id', label: 'User ID' },
    { key: 'status', label: 'Status' },
    { key: 'role', label: 'Role' },
  ];
}
