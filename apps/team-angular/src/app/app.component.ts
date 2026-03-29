import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadgeComponent } from '@poc/ui-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <h1>Admin Portal</h1>
          <poc-badge color="purple">Angular</poc-badge>
        </div>

        <nav>
          <a *ngFor="let item of nav" [routerLink]="item.path" routerLinkActive="active" class="nav-link">
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </aside>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .shell { min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; background: radial-gradient(circle at top left, #e0f2fe 0%, #f8fafc 55%); }
    .sidebar { border-right: 1px solid #e2e8f0; padding: 1rem; background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(6px); }
    .brand { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .brand h1 { margin: 0; color: #0f172a; font-size: 1rem; font-weight: 700; }
    nav { display: grid; gap: 0.4rem; }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #334155;
      text-decoration: none;
      padding: 0.55rem 0.65rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      border: 1px solid transparent;
    }
    .nav-link:hover { background: #eef2ff; border-color: #c7d2fe; }
    .nav-link.active { background: linear-gradient(180deg, #dbeafe, #eff6ff); border-color: #93c5fd; color: #1e3a8a; }
    .content { padding: 1.25rem; }
    @media (max-width: 960px) {
      .shell { grid-template-columns: 1fr; }
      .sidebar { position: sticky; top: 0; z-index: 5; }
      nav { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .nav-link { justify-content: center; }
      .nav-link span:last-child { display: none; }
    }
  `],
})
export class AppComponent {
  readonly nav = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/approvals', label: 'Approvals', icon: '✅' },
    { path: '/flags', label: 'Flags', icon: '🚩' },
    { path: '/audit-logs', label: 'Audit Logs', icon: '📁' },
  ];
}
