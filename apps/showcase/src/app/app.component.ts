import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <!-- Sidebar nav -->
      <nav class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">⬡</span>
          <div>
            <div class="brand-title">Monorepo Guide</div>
            <div class="brand-sub">Stakeholder Presentation Flow</div>
          </div>
        </div>

        <ul class="nav-list">
          <li *ngFor="let item of navItems">
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              class="nav-item"
              [title]="item.description"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          </li>
        </ul>

        <div class="sidebar-footer">
          <div class="footer-links">
            <a href="http://localhost:4201" target="_blank">↗ user-portal :4201</a>
            <a href="http://localhost:4202" target="_blank">↗ admin-portal :4202</a>
          </div>
        </div>
      </nav>

      <!-- Main content -->
      <main class="main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }

    .shell { display: flex; height: 100vh; overflow: hidden; }

    /* Sidebar */
    .sidebar {
      width: 272px; flex-shrink: 0;
      background: #ffffff;
      border-right: 1px solid #dbe3ef;
      display: flex; flex-direction: column;
      overflow-y: auto;
    }
    .sidebar-brand {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 1.25rem 1.1rem;
      border-bottom: 1px solid #dbe3ef;
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      z-index: 1;
    }
    .brand-icon { font-size: 1.75rem; line-height: 1; }
    .brand-title { font-weight: 800; font-size: 0.95rem; color: #0f172a; }
    .brand-sub { font-size: 0.72rem; color: #475569; margin-top: 0.1rem; }

    .nav-list { list-style: none; padding: 0.8rem 0; flex: 1; }
    .nav-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.66rem 1.05rem;
      text-decoration: none; color: #334155;
      font-size: 0.87rem; font-weight: 600;
      border-left: 3px solid transparent;
      transition: color 0.15s, background 0.15s, border-color 0.15s;
    }
    .nav-item:hover { color: #0f172a; background: #edf3ff; }
    .nav-item.active {
      color: #1d4ed8;
      border-left-color: #2563eb;
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.08) 70%, rgba(59, 130, 246, 0) 100%);
    }
    .nav-icon { font-size: 1rem; width: 1.25rem; text-align: center; }
    .nav-label {}

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #dbe3ef;
      background: #f8fbff;
    }
    .footer-links { display: flex; flex-direction: column; gap: 0.3rem; }
    .footer-links a { font-size: 0.75rem; color: #475569; text-decoration: none; }
    .footer-links a:hover { color: #1d4ed8; }

    /* Main */
    .main {
      flex: 1;
      overflow-y: auto;
      background: linear-gradient(180deg, #f6f8fc 0%, #f1f5fb 100%);
      padding: 1.25rem 1.5rem;
    }

    @media (max-width: 980px) {
      .sidebar { width: 248px; }
      .main { padding: 1rem; }
    }
  `],
})
export class AppComponent {
  navItems: NavItem[] = [
    { path: 'overview', icon: '📋', label: 'Overview', description: 'What this discussion will cover' },
    { path: 'monorepo', icon: '🧱', label: 'Monorepo', description: 'What monorepo means with architecture diagram' },
    { path: 'pros-cons', icon: '⚖️', label: 'Pros & Cons', description: 'Balanced advantages and trade-offs' },
    { path: 'case-effective', icon: '✅', label: 'Our Case: Effective', description: 'Problems in our case and how monorepo helps' },
    { path: 'case-ineffective', icon: '⚠️', label: 'Our Case: Ineffective', description: 'Where monorepo can fail in our context' },
    { path: 'common-questions', icon: '❓', label: 'Common Questions', description: 'Build, deploy, permissions, and workflow Q&A' },
    { path: 'conclusion', icon: '🏁', label: 'Conclusion', description: 'Decision summary and adoption conditions' },
  ];
}
