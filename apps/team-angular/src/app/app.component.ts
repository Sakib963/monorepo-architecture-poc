import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import type { User, PaginatedResponse, ApiResponse } from '@poc/types';
import { UserRole, UserStatus } from '@poc/types';
import { getFlag } from '@poc/feature-flags';
import type { FeatureFlags } from '@poc/feature-flags';
import {
  ButtonComponent,
  CardComponent,
  BadgeComponent,
  StatusIndicatorComponent,
} from '@poc/ui-components';
import type { BadgeColor, StatusLevel } from '@poc/ui-components';

// ─── API service ──────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, CardComponent, BadgeComponent, StatusIndicatorComponent],
  template: `
    <div class="app" [class.dark]="darkMode">
      <header class="app-header">
        <h1>Team Angular App</h1>
        <poc-badge color="purple">Angular 18</poc-badge>
        <poc-badge color="blue">Standalone</poc-badge>
        <poc-badge *ngIf="darkMode" color="blue">🌙 Dark Mode ON</poc-badge>
        <poc-badge *ngIf="maintenanceMode" color="red">🔧 Maintenance</poc-badge>
      </header>

      <div class="tag-row">
        <span class="tag">&#64;poc/types</span>
        <span class="tag">&#64;poc/ui-components</span>
        <span class="tag">&#64;poc/api-client</span>
        <span class="tag">&#64;poc/feature-flags</span>
      </div>

      <!-- CORE_MAINTENANCE_MODE banner ───────────────────────────────────── -->
      <div *ngIf="maintenanceMode" class="maintenance-banner">
        <span class="maint-icon">🔧</span>
        <div>
          <strong>Platform under maintenance — CORE_MAINTENANCE_MODE: true</strong>
          <p>Write operations are disabled. Set <code>CORE_MAINTENANCE_MODE: false</code> in
             <code>packages/feature-flags/src/flags.ts</code> to restore.</p>
        </div>
      </div>

      <!-- Feature flag status panel ──────────────────────────────────────── -->
      <poc-card title="Feature Flags — Live from @poc/feature-flags" subtitle="These flags are fetched from the api-gateway on startup and gate real UI sections below" [bordered]="true">
        <div class="flag-status-grid">
          <div *ngFor="let entry of flagEntries" class="flag-status-item" [class.flag-item-on]="entry.value">
            <span class="flag-name">{{ entry.key }}</span>
            <span [class]="entry.value ? 'flag-on' : 'flag-off'">{{ entry.value ? 'ON' : 'OFF' }}</span>
            <span *ngIf="flagEffects[entry.key]" class="flag-effect">
              {{ entry.value ? '↳ ' : '✗ ' }}{{ flagEffects[entry.key] }}
            </span>
          </div>
        </div>
      </poc-card>

      <!-- Users section ──────────────────────────────────────────────────── -->
      <poc-card
        [title]="'Order Admins' + (!managerRoleEnabled ? ' (MANAGER rows hidden — USER_ROLE_MANAGER_ENABLED: OFF)' : '')"
        subtitle="Typed with @poc/types · User.role, User.status from packages/types/src/user.types.ts"
        [bordered]="true" [elevated]="true">

        <div *ngIf="loading" class="loading">Loading users…</div>
        <div *ngIf="error" class="alert-error">{{ error }}</div>

        <table *ngIf="!loading && filteredUsers.length" class="user-table">
          <thead>
            <tr>
              <th *ngIf="showAvatars" style="width:2.5rem"></th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td *ngIf="showAvatars">
                <div class="avatar">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
              </td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>
                <poc-badge [color]="roleBadgeColor(user.role)">{{ user.role }}</poc-badge>
              </td>
              <td>
                <poc-status-indicator [status]="statusLevel(user.status)" [label]="user.status"></poc-status-indicator>
              </td>
              <td style="color: #718096; font-size: 0.875rem">{{ user.email }}</td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!managerRoleEnabled && !loading" class="flag-note">
          🚫 <strong>USER_ROLE_MANAGER_ENABLED: OFF</strong> — {{ hiddenManagerCount }} MANAGER row(s) are hidden.
          Set it to <code>true</code> to show them.
        </div>

        <div [attr.slot]="'footer'" *ngIf="!loading">
          <poc-button variant="ghost" (click)="loadUsers()">↻ Refresh</poc-button>
          <span style="margin-left:1rem; font-size:0.8rem; color:#a0aec0">
            {{ filteredUsers.length }} / {{ users.length }} user(s) shown via &#64;poc/api-client
          </span>
        </div>
      </poc-card>

      <!-- UI_QUICK_ACTIONS_BAR ───────────────────────────────────────────── -->
      <div *ngIf="quickActionsBar" class="quick-actions-bar">
        <span class="qa-label">⚡ Quick Actions</span>
        <button class="qa-btn" [disabled]="maintenanceMode">+ User</button>
        <button class="qa-btn">📋 Export</button>
        <button class="qa-btn">🔔 Notify</button>
        <span class="qa-flag">UI_QUICK_ACTIONS_BAR: ON</span>
      </div>

      <!-- Components showcase ─────────────────────────────────────────────── -->
      <poc-card title="Shared UI Components — @poc/ui-components" subtitle="ButtonComponent, CardComponent, BadgeComponent, StatusIndicatorComponent" [bordered]="true">
        <div class="component-row">
          <poc-button variant="primary">Primary</poc-button>
          <poc-button variant="secondary">Secondary</poc-button>
          <poc-button variant="danger">Danger</poc-button>
          <poc-button variant="ghost">Ghost</poc-button>
          <poc-button variant="primary" [loading]="true">Loading</poc-button>
          <poc-button variant="primary" [disabled]="true">Disabled</poc-button>
        </div>
        <div class="component-row" style="margin-top:1rem">
          <poc-badge color="blue">ADMIN</poc-badge>
          <poc-badge color="green">ACTIVE</poc-badge>
          <poc-badge color="red">SUSPENDED</poc-badge>
          <poc-badge color="yellow">PENDING</poc-badge>
          <poc-badge color="purple">MANAGER</poc-badge>
          <poc-badge color="gray">INACTIVE</poc-badge>
        </div>
        <div class="component-row" style="margin-top:1rem">
          <poc-status-indicator status="success" label="Service healthy" [pulse]="true"></poc-status-indicator>
          <poc-status-indicator status="warning" label="High latency"></poc-status-indicator>
          <poc-status-indicator status="error" label="Service down"></poc-status-indicator>
          <poc-status-indicator status="info" label="Updating"></poc-status-indicator>
        </div>
      </poc-card>
    </div>
  `,
  styles: [`
    .app { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
    .app.dark { background: #1a202c; color: #e2e8f0; min-height: 100vh; }
    .app.dark poc-card { --card-bg: #2d3748; --card-border: #4a5568; }
    .app-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
                  padding-bottom: 1.5rem; border-bottom: 2px solid #e2e8f0; flex-wrap: wrap; }
    .app-header h1 { font-size: 1.5rem; font-weight: 700; margin-right: 0.25rem; }
    .dark .app-header { border-color: #4a5568; }
    .tag-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .tag { background: #edf2f7; color: #4a5568; font-size: 0.75rem; font-weight: 600;
           padding: 0.2rem 0.6rem; border-radius: 0.25rem; font-family: monospace; }
    poc-card { display: block; margin-bottom: 1.5rem; }
    .loading { padding: 1rem; color: #a0aec0; }
    .alert-error { padding: 0.75rem; background: #fff5f5; color: #c53030;
                   border-radius: 0.375rem; border: 1px solid #fed7d7; }
    .user-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .user-table th { text-align: left; font-size: 0.7rem; font-weight: 700;
                     text-transform: uppercase; letter-spacing: 0.05em; color: #718096;
                     padding: 0.5rem 0.75rem; border-bottom: 2px solid #e2e8f0; }
    .user-table td { padding: 0.6rem 0.75rem; border-bottom: 1px solid #f7fafc; }
    .component-row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }

    /* maintenance banner */
    .maintenance-banner { display: flex; gap: 1rem; align-items: flex-start;
      background: #fff5f5; border: 1px solid #fc8181; border-left: 4px solid #e53e3e;
      border-radius: 0.375rem; padding: 1rem 1.25rem; margin-bottom: 1.5rem; color: #742a2a; }
    .maintenance-banner p { margin: 0.25rem 0 0; font-size: 0.85rem; }
    .maint-icon { font-size: 1.5rem; flex-shrink: 0; }

    /* flag status grid */
    .flag-status-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 0.5rem; }
    .flag-status-item { display: flex; flex-direction: column; padding: 0.5rem 0.75rem;
                        background: #f7fafc; border-radius: 0.375rem; font-size: 0.8rem; }
    .flag-item-on { background: #f0fff4 !important; border: 1px solid #c6f6d5; }
    .flag-name { font-family: monospace; font-weight: 600; }
    .flag-on { color: #276749; font-weight: 700; font-size: 0.75rem; }
    .flag-off { color: #a0aec0; font-size: 0.75rem; }
    .flag-effect { font-size: 0.7rem; color: #718096; margin-top: 0.1rem; }
    .flag-note { padding: 0.75rem; background: #fffff0; border: 1px dashed #d69e2e;
                 border-radius: 0.375rem; color: #744210; font-size: 0.85rem; margin-top: 0.75rem; }

    /* avatar */
    .avatar { width: 1.75rem; height: 1.75rem; border-radius: 50%;
      background: linear-gradient(135deg, #4299e1, #667eea); color: #fff;
      font-weight: 700; font-size: 0.65rem; display: flex; align-items: center;
      justify-content: center; text-transform: uppercase; }

    /* quick actions bar */
    .quick-actions-bar { position: fixed; bottom: 1.5rem; right: 1.5rem;
      display: flex; align-items: center; gap: 0.5rem;
      background: #2d3748; color: #e2e8f0; border-radius: 9999px;
      padding: 0.5rem 1.25rem; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 1000; font-size: 0.85rem; }
    .qa-label { font-weight: 700; margin-right: 0.25rem; }
    .qa-btn { background: rgba(255,255,255,0.1); border: none; color: #e2e8f0;
      padding: 0.25rem 0.75rem; border-radius: 9999px; cursor: pointer; font-size: 0.8rem; }
    .qa-btn:hover:not(:disabled) { background: rgba(255,255,255,0.2); }
    .qa-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .qa-flag { font-size: 0.65rem; opacity: 0.6; margin-left: 0.5rem; }
  `],
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  users: User[] = [];
  loading = true;
  error: string | null = null;

  // ── Flag-driven state ─────────────────────────────────────────────────────
  flags: Partial<FeatureFlags> = {};
  darkMode          = getFlag('UI_DARK_MODE');
  maintenanceMode   = getFlag('CORE_MAINTENANCE_MODE');
  managerRoleEnabled = getFlag('USER_ROLE_MANAGER_ENABLED');
  quickActionsBar   = getFlag('UI_QUICK_ACTIONS_BAR');
  showAvatars       = getFlag('USER_PROFILE_PICTURE');

  readonly flagEffects: Partial<Record<keyof FeatureFlags, string>> = {
    CORE_MAINTENANCE_MODE:     'Red banner, disables write ops',
    USER_SELF_REGISTRATION:    'Show/hide Create User form (React)',
    USER_ROLE_MANAGER_ENABLED: 'Show/hide MANAGER rows in table',
    USER_PROFILE_PICTURE:      'Avatar initials in user rows',
    ORDER_BULK_OPERATIONS:     'Bulk-select column (React)',
    UI_DARK_MODE:              'Apply dark theme to root element',
    UI_NEW_DASHBOARD_LAYOUT:   'Card grid layout (React)',
    UI_QUICK_ACTIONS_BAR:      'Floating quick-actions toolbar',
  };

  get flagEntries(): { key: keyof FeatureFlags; value: boolean }[] {
    return (Object.entries(this.flags) as [keyof FeatureFlags, boolean][])
      .map(([key, value]) => ({ key, value }));
  }

  get filteredUsers(): User[] {
    return this.managerRoleEnabled
      ? this.users
      : this.users.filter(u => u.role !== UserRole.MANAGER);
  }

  get hiddenManagerCount(): number {
    return this.users.filter(u => u.role === UserRole.MANAGER).length;
  }

  ngOnInit(): void {
    this.loadFlags();
    this.loadUsers();
  }

  /** Fetch live flag values from api-gateway; fall through to static defaults on error. */
  loadFlags(): void {
    this.http.get<ApiResponse<FeatureFlags>>(`${API_BASE}/flags`).subscribe({
      next: res => {
        this.flags             = res.data;
        this.darkMode          = !!res.data.UI_DARK_MODE;
        this.maintenanceMode   = !!res.data.CORE_MAINTENANCE_MODE;
        this.managerRoleEnabled = res.data.USER_ROLE_MANAGER_ENABLED !== false;
        this.quickActionsBar   = !!res.data.UI_QUICK_ACTIONS_BAR;
        this.showAvatars       = !!res.data.USER_PROFILE_PICTURE;
      },
      error: () => {
        // Static compile-time fallback when gateway is unreachable
        this.flags = {};
      },
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.http.get<ApiResponse<PaginatedResponse<User>>>(`${API_BASE}/users`).subscribe({
      next: res => {
        this.users = res.data.items;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not reach user-service (is api-gateway running on :3000?)';
        this.loading = false;
      },
    });
  }

  roleBadgeColor(role: UserRole): BadgeColor {
    const map: Record<UserRole, BadgeColor> = {
      [UserRole.ADMIN]:    'purple',
      [UserRole.MANAGER]:  'blue',
      [UserRole.CUSTOMER]: 'green',
    };
    return map[role] ?? 'gray';
  }

  statusLevel(status: UserStatus): StatusLevel {
    const map: Record<UserStatus, StatusLevel> = {
      [UserStatus.ACTIVE]:    'success',
      [UserStatus.SUSPENDED]: 'error',
      [UserStatus.INACTIVE]:  'neutral',
    };
    return map[status] ?? 'neutral';
  }
}
