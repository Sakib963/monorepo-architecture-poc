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
            <div class="brand-title">Monorepo POC</div>
            <div class="brand-sub">NX 19 · npm workspaces</div>
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
            <a href="http://localhost:4201" target="_blank">↗ team-react :4201</a>
            <a href="http://localhost:4202" target="_blank">↗ team-angular :4202</a>
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
      width: 240px; flex-shrink: 0;
      background: #161b27;
      border-right: 1px solid #1e2535;
      display: flex; flex-direction: column;
      overflow-y: auto;
    }
    .sidebar-brand {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 1.25rem 1rem;
      border-bottom: 1px solid #1e2535;
    }
    .brand-icon { font-size: 1.75rem; line-height: 1; }
    .brand-title { font-weight: 700; font-size: 0.95rem; color: #e2e8f0; }
    .brand-sub { font-size: 0.7rem; color: #4a5568; margin-top: 0.1rem; }

    .nav-list { list-style: none; padding: 0.75rem 0; flex: 1; }
    .nav-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.6rem 1rem;
      text-decoration: none; color: #718096;
      font-size: 0.875rem; font-weight: 500;
      border-left: 3px solid transparent;
      transition: color 0.15s, background 0.15s;
    }
    .nav-item:hover { color: #e2e8f0; background: rgba(255,255,255,.03); }
    .nav-item.active { color: #63b3ed; border-left-color: #63b3ed; background: rgba(99,179,237,.07); }
    .nav-icon { font-size: 1rem; width: 1.25rem; text-align: center; }
    .nav-label {}

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #1e2535;
    }
    .footer-links { display: flex; flex-direction: column; gap: 0.3rem; }
    .footer-links a { font-size: 0.75rem; color: #4a5568; text-decoration: none; }
    .footer-links a:hover { color: #63b3ed; }

    /* Main */
    .main {
      flex: 1;
      overflow-y: auto;
      background: #0f1117;
    }
  `],
})
export class AppComponent {
  navItems: NavItem[] = [
    { path: 'overview',   icon: '🗺',  label: 'Overview',       description: 'Architecture overview and package map' },
    { path: 'types',      icon: '📐',  label: 'Shared Types',   description: 'Single TypeScript source of truth for all apps and services' },
    { path: 'validators', icon: '✅',  label: 'Shared Validators', description: 'Zod schemas running identically in browser and Node.js' },
    { path: 'flags',      icon: '🚩',  label: 'Feature Flags',  description: 'Toggle features across all apps and services from one file' },
    { path: 'events',     icon: '⚡',  label: 'Event Contracts', description: 'Typed event shapes that catch cross-service shape mismatches at compile time' },
    { path: 'graph',      icon: '📊',  label: 'Dependency Graph', description: 'NX affected builds — only rebuild what changed' },
  ];
}
