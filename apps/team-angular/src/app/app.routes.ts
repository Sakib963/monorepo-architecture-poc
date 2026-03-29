import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-page.component').then((module) => module.DashboardPageComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users-page.component').then((module) => module.UsersPageComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./pages/user-detail-page.component').then((module) => module.UserDetailPageComponent),
  },
  {
    path: 'approvals',
    loadComponent: () => import('./pages/approvals-page.component').then((module) => module.ApprovalsPageComponent),
  },
  {
    path: 'flags',
    loadComponent: () => import('./pages/flags-page.component').then((module) => module.FlagsPageComponent),
  },
  {
    path: 'audit-logs',
    loadComponent: () => import('./pages/audit-logs-page.component').then((module) => module.AuditLogsPageComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
