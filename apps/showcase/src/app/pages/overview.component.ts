import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PackageCard {
  name: string;
  description: string;
  usedBy: string[];
  color: string;
  files: string[];
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="hero">
        <h1 class="hero-title">Monorepo Architecture POC</h1>
        <p class="hero-sub">
          A living example of how a single repository hosts multiple teams, frameworks, and services —
          while sharing types, validation, event contracts, feature flags, and UI components safely.
        </p>
        <div class="tech-pills">
          <span class="pill">NX 19</span>
          <span class="pill">npm workspaces</span>
          <span class="pill">Angular 17</span>
          <span class="pill">React 18</span>
          <span class="pill">Express</span>
          <span class="pill">Zod</span>
          <span class="pill">TypeScript 5.5</span>
        </div>
      </div>

      <!-- Architecture diagram (ASCII-style) -->
      <section class="section">
        <h2 class="section-title">Repository Structure</h2>
        <div class="diagram">
<pre class="ascii-diagram">monorepo-architecture-poc/
├── apps/
│   ├── showcase/       ← This app (Angular 17) — you're looking at it
│   ├── team-angular/   ← Team B's admin app  (Angular 17 + &#64;poc/ui-components)
│   └── team-react/     ← Team A's product app (React 18 + Vite)
│
├── services/
│   ├── api-gateway/    ← Single entry, proxies all routes
│   ├── user-service/   ← User CRUD, port 3001
│   └── notification-service/ ← Notifications, port 3002
│
└── packages/           ← Shared code — the heart of the monorepo
    ├── types/          ← TypeScript interfaces & enums  (&#64;poc/types)
    ├── validators/     ← Zod schemas — browser + Node  (&#64;poc/validators)
    ├── events/         ← Typed event contracts          (&#64;poc/events)
    ├── feature-flags/  ← Runtime feature toggles       (&#64;poc/feature-flags)
    ├── api-client/     ← Typed HTTP client              (&#64;poc/api-client)
    ├── ui-components/  ← Angular component library     (&#64;poc/ui-components)
    └── config/         ← Shared tooling config          (&#64;poc/config)</pre>
        </div>
      </section>

      <!-- Package cards -->
      <section class="section">
        <h2 class="section-title">Shared Packages</h2>
        <div class="package-grid">
          <div *ngFor="let pkg of packages" class="pkg-card" [style.border-top-color]="pkg.color">
            <div class="pkg-name">{{ pkg.name }}</div>
            <div class="pkg-desc">{{ pkg.description }}</div>
            <div class="pkg-files">
              <span *ngFor="let f of pkg.files" class="file-tag">{{ f }}</span>
            </div>
            <div class="pkg-consumers">
              <span class="consumers-label">Used by:</span>
              <span *ngFor="let c of pkg.usedBy" class="consumer-tag">{{ c }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Key benefits -->
      <section class="section">
        <h2 class="section-title">Why This Architecture?</h2>
        <div class="benefit-grid">
          <div class="benefit-card" *ngFor="let b of benefits">
            <div class="benefit-icon">{{ b.icon }}</div>
            <div class="benefit-title">{{ b.title }}</div>
            <div class="benefit-desc">{{ b.desc }}</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; }

    .hero { margin-bottom: 3rem; }
    .hero-title { font-size: 2rem; font-weight: 800; color: #e2e8f0; line-height: 1.2; margin-bottom: 0.75rem; }
    .hero-sub { font-size: 1rem; color: #718096; max-width: 620px; line-height: 1.7; margin-bottom: 1.25rem; }
    .tech-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pill { background: #1e2535; color: #63b3ed; font-size: 0.75rem; font-weight: 600;
            padding: 0.25rem 0.75rem; border-radius: 9999px; font-family: monospace; }

    .section { margin-bottom: 3rem; }
    .section-title { font-size: 1.1rem; font-weight: 700; color: #a0aec0;
                     text-transform: uppercase; letter-spacing: 0.07em;
                     margin-bottom: 1.25rem; padding-bottom: 0.5rem;
                     border-bottom: 1px solid #1e2535; }

    .ascii-diagram { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem;
                     padding: 1.25rem; overflow-x: auto; color: #a0aec0;
                     font-size: 0.8rem; line-height: 1.7; }

    .package-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .pkg-card { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem;
                border-top: 3px solid; padding: 1.1rem; }
    .pkg-name { font-family: monospace; font-size: 0.85rem; font-weight: 700; color: #63b3ed; margin-bottom: 0.4rem; }
    .pkg-desc { font-size: 0.8rem; color: #718096; margin-bottom: 0.75rem; line-height: 1.5; }
    .pkg-files { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.6rem; }
    .file-tag { font-size: 0.65rem; background: #0f1117; color: #4a5568;
                padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
    .pkg-consumers { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: center; }
    .consumers-label { font-size: 0.65rem; color: #4a5568; margin-right: 0.2rem; }
    .consumer-tag { font-size: 0.65rem; background: #1e2535; color: #a0aec0;
                    padding: 0.1rem 0.4rem; border-radius: 0.25rem; }

    .benefit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
    .benefit-card { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem; padding: 1.1rem; }
    .benefit-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .benefit-title { font-size: 0.875rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.4rem; }
    .benefit-desc { font-size: 0.8rem; color: #718096; line-height: 1.5; }
  `],
})
export class OverviewComponent {
  packages: PackageCard[] = [
    {
      name: '@poc/types',
      description: 'Single source of truth for all TypeScript interfaces, enums, and DTOs. If a shape changes here, TypeScript errors appear in every consumer immediately.',
      color: '#63b3ed',
      files: ['user.types.ts', 'api.types.ts', 'order.types.ts', 'notification.types.ts'],
      usedBy: ['showcase', 'team-angular', 'team-react', 'user-service', 'notification-service', 'api-client'],
    },
    {
      name: '@poc/validators',
      description: 'Zod schemas that run identically in browser and Node.js. One schema definition, zero duplication between frontend forms and backend API.',
      color: '#68d391',
      files: ['schemas.ts', 'validate.ts'],
      usedBy: ['team-react', 'team-angular', 'user-service', 'showcase'],
    },
    {
      name: '@poc/events',
      description: 'Typed event contracts (interfaces + factory functions). When a producer changes an event shape, TypeScript shows errors in all consumers.',
      color: '#f6ad55',
      files: ['events.ts', 'factories.ts'],
      usedBy: ['user-service', 'notification-service', 'showcase'],
    },
    {
      name: '@poc/feature-flags',
      description: 'Central feature flag registry. Edit one value → all apps and services pick up the change. No environment variables, no per-team sync.',
      color: '#fc8181',
      files: ['flags.ts', 'utils.ts'],
      usedBy: ['showcase', 'team-angular', 'team-react', 'user-service', 'notification-service', 'api-gateway'],
    },
    {
      name: '@poc/api-client',
      description: 'Typed HTTP client shared by both frontend apps. No duplicated fetch logic, no type assertions — return types come directly from @poc/types.',
      color: '#b794f4',
      files: ['base.client.ts', 'user.client.ts', 'order.client.ts', 'notification.client.ts'],
      usedBy: ['team-react', 'team-angular', 'showcase'],
    },
    {
      name: '@poc/ui-components',
      description: 'Angular 17 standalone component library. Both Angular apps import ButtonComponent, CardComponent, BadgeComponent — same markup, same styles.',
      color: '#76e4f7',
      files: ['button.component.ts', 'card.component.ts', 'badge.component.ts', 'status-indicator.component.ts'],
      usedBy: ['team-angular', 'showcase'],
    },
  ];

  benefits = [
    { icon: '🔒', title: 'Type Safety Across Boundaries', desc: 'A single `User` interface is used by React forms, Angular tables, and Express controllers. Shape mismatch = compile error.' },
    { icon: '⚡', title: 'NX Affected Builds', desc: 'Change `@poc/validators` → NX rebuilds only user-service, team-react, and team-angular. The rest are untouched.' },
    { icon: '🧩', title: 'Zero Duplication', desc: 'Validation rules, API call logic, and feature flag checks are written once and imported everywhere.' },
    { icon: '🚩', title: 'Coordinated Feature Rollouts', desc: 'Toggle NOTIFY_SMS in one file. Every service and every app reacts — no PR in 4 different repos.' },
    { icon: '🗂', title: 'One CI Pipeline', desc: 'A single `npm run build` builds everything in dependency order. NX caches unchanged projects.' },
    { icon: '👥', title: 'Team Autonomy', desc: 'Module boundary rules prevent React team from depending on Angular internals. Each team owns their boundary.' },
  ];
}
