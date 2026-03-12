import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GraphNode {
  id: string;
  type: 'app' | 'service' | 'package';
  label: string;
  deps: string[];
  description: string;
}

@Component({
  selector: 'app-graph-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="pkg-badge">nx graph</div>
        <h1>Dependency Graph & Affected Builds</h1>
        <p class="page-desc">
          NX tracks which projects depend on which packages. When you change a file,
          only the projects that (transitively) depend on it are rebuilt. The rest are
          served from cache — making CI dramatically faster in large repos.
        </p>
      </div>

      <section class="section">
        <h2 class="section-title">Project Dependency Map</h2>
        <div class="graph-container">
          <!-- Packages layer -->
          <div class="graph-layer">
            <div class="layer-label">packages (shared)</div>
            <div class="layer-nodes">
              <div *ngFor="let pkg of packages" class="node node-package" [class.selected]="selected === pkg.id"
                   (click)="select(pkg)">
                {{ pkg.label }}
              </div>
            </div>
          </div>
          <!-- Services layer -->
          <div class="graph-layer">
            <div class="layer-label">services</div>
            <div class="layer-nodes">
              <div *ngFor="let svc of services" class="node node-service" [class.selected]="selected === svc.id"
                   (click)="select(svc)">
                {{ svc.label }}
              </div>
            </div>
          </div>
          <!-- Apps layer -->
          <div class="graph-layer">
            <div class="layer-label">apps</div>
            <div class="layer-nodes">
              <div *ngFor="let app of apps" class="node node-app" [class.selected]="selected === app.id"
                   (click)="select(app)">
                {{ app.label }}
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedNode" class="detail-panel">
          <div class="detail-name">{{ selectedNode.label }}</div>
          <div class="detail-desc">{{ selectedNode.description }}</div>
          <div class="detail-deps" *ngIf="selectedNode.deps.length">
            <span class="deps-label">Imports from:</span>
            <span *ngFor="let d of selectedNode.deps" class="dep-tag">{{ d }}</span>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Affected Build Scenarios</h2>
        <div class="scenario-grid">
          <div *ngFor="let s of scenarios" class="scenario-card">
            <div class="scenario-change">📝 Changed: <code>{{ s.changed }}</code></div>
            <div class="scenario-label">NX rebuilds:</div>
            <div class="scenario-affected">
              <span *ngFor="let a of s.affected" class="affected-tag">{{ a }}</span>
            </div>
            <div class="scenario-skipped">
              Skipped (unchanged): <span *ngFor="let sk of s.skipped" class="skip-tag">{{ sk }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Running NX Commands</h2>
        <div class="commands">
          <div *ngFor="let cmd of commands" class="cmd-block">
            <div class="cmd-prompt">$</div>
            <pre class="cmd-text">{{ cmd.cmd }}</pre>
            <div class="cmd-desc">{{ cmd.desc }}</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; }
    .page-header { margin-bottom: 2.5rem; }
    .pkg-badge { display: inline-block; font-family: monospace; font-size: 0.75rem; font-weight: 700;
                 background: #1a1f35; color: #76e4f7; padding: 0.25rem 0.75rem; border-radius: 9999px; margin-bottom: 0.75rem; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #e2e8f0; margin-bottom: 0.75rem; }
    .page-desc { font-size: 0.9rem; color: #718096; max-width: 620px; line-height: 1.7; }

    .section { margin-bottom: 2.5rem; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: #a0aec0;
                     text-transform: uppercase; letter-spacing: 0.07em;
                     margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1e2535; }
    code { background: #1e2535; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.8rem; color: #a0aec0; }

    .graph-container { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem;
                       padding: 1.5rem; margin-bottom: 1rem; }
    .graph-layer { margin-bottom: 1.5rem; }
    .graph-layer:last-child { margin-bottom: 0; }
    .layer-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
                   color: #4a5568; margin-bottom: 0.5rem; }
    .layer-nodes { display: flex; flex-wrap: wrap; gap: 0.5rem; }

    .node { padding: 0.4rem 0.8rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600;
            cursor: pointer; border: 1px solid transparent; transition: all 0.15s;
            font-family: monospace; }
    .node-package { background: #1a1f35; color: #76e4f7; border-color: #1e2535; }
    .node-package:hover, .node-package.selected { border-color: #76e4f7; background: #1e2a3f; }
    .node-service { background: #1a2b1a; color: #68d391; border-color: #1e2535; }
    .node-service:hover, .node-service.selected { border-color: #68d391; }
    .node-app { background: #2d1f35; color: #b794f4; border-color: #1e2535; }
    .node-app:hover, .node-app.selected { border-color: #b794f4; }

    .detail-panel { background: #0f1117; border: 1px solid #1e2535; border-radius: 0.375rem;
                    padding: 0.875rem; }
    .detail-name { font-family: monospace; font-weight: 700; color: #e2e8f0; margin-bottom: 0.3rem; }
    .detail-desc { font-size: 0.8rem; color: #718096; margin-bottom: 0.6rem; line-height: 1.5; }
    .detail-deps { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
    .deps-label { font-size: 0.7rem; color: #4a5568; margin-right: 0.2rem; }
    .dep-tag { font-size: 0.7rem; background: #1e2535; color: #a0aec0;
               padding: 0.1rem 0.5rem; border-radius: 0.25rem; font-family: monospace; }

    .scenario-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .scenario-card { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem; padding: 0.875rem; }
    .scenario-change { font-size: 0.8rem; color: #e2e8f0; margin-bottom: 0.5rem; }
    .scenario-label { font-size: 0.7rem; color: #4a5568; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .scenario-affected { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.5rem; }
    .affected-tag { font-size: 0.7rem; background: #1a2b1a; color: #68d391;
                    padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
    .scenario-skipped { font-size: 0.72rem; color: #4a5568; }
    .skip-tag { font-family: monospace; color: #2d3748; }
    .skip-tag::after { content: ' '; }

    .commands { display: flex; flex-direction: column; gap: 0.75rem; }
    .cmd-block { background: #161b27; border: 1px solid #1e2535; border-radius: 0.375rem;
                 padding: 0.75rem 1rem; display: grid; grid-template-columns: auto 1fr auto;
                 gap: 0.75rem; align-items: center; }
    .cmd-prompt { color: #4a5568; font-family: monospace; }
    .cmd-text { font-family: monospace; font-size: 0.8rem; color: #63b3ed; margin: 0; }
    .cmd-desc { font-size: 0.75rem; color: #718096; }
  `],
})
export class GraphDemoComponent {
  selected: string | null = null;
  selectedNode: GraphNode | null = null;

  packages: GraphNode[] = [
    { id: 'config', type: 'package', label: '@poc/config', deps: [], description: 'Shared tsconfig and eslint base. No runtime deps — build-time only.' },
    { id: 'types', type: 'package', label: '@poc/types', deps: [], description: 'TypeScript interfaces and enums. No runtime deps — pure type definitions.' },
    { id: 'validators', type: 'package', label: '@poc/validators', deps: ['types'], description: 'Zod schemas. Depends on @poc/types for type inference.' },
    { id: 'events', type: 'package', label: '@poc/events', deps: ['types'], description: 'Typed event contracts and factory functions.' },
    { id: 'feature-flags', type: 'package', label: '@poc/feature-flags', deps: [], description: 'Feature flag registry and accessor utils. No external runtime deps.' },
    { id: 'api-client', type: 'package', label: '@poc/api-client', deps: ['types'], description: 'Typed fetch-based HTTP client using @poc/types for return types.' },
    { id: 'ui-components', type: 'package', label: '@poc/ui-components', deps: [], description: 'Angular 17 standalone components. PeerDep on @angular/core.' },
  ];

  services: GraphNode[] = [
    { id: 'user-service', type: 'service', label: 'user-service', deps: ['types', 'validators', 'events', 'feature-flags'], description: 'Express user CRUD service. Uses shared types for in-memory store, validators for request validation, events for emission, and feature-flags for route gating.' },
    { id: 'notification-service', type: 'service', label: 'notification-service', deps: ['types', 'events', 'feature-flags'], description: 'Notification delivery service. Consumes typed events, gates SMS via feature flag.' },
    { id: 'api-gateway', type: 'service', label: 'api-gateway', deps: ['feature-flags'], description: 'Proxies all API traffic. Exposes /flags endpoint from @poc/feature-flags.' },
  ];

  apps: GraphNode[] = [
    { id: 'team-react', type: 'app', label: 'team-react', deps: ['types', 'validators', 'api-client', 'feature-flags'], description: 'React 18 + Vite product app. Uses shared validators for form validation, api-client for typed HTTP calls, feature-flags to gate UI features.' },
    { id: 'team-angular', type: 'app', label: 'team-angular', deps: ['types', 'api-client', 'feature-flags', 'ui-components'], description: 'Angular 17 admin app. Uses @poc/ui-components for consistent UI, api-client for typed HTTP, feature-flags for route gating.' },
    { id: 'showcase', type: 'app', label: 'showcase', deps: ['types', 'validators', 'events', 'feature-flags', 'api-client', 'ui-components'], description: 'You are here. Imports ALL shared packages to demonstrate each one live.' },
  ];

  select(node: GraphNode): void {
    this.selected = node.id;
    this.selectedNode = node;
  }

  scenarios = [
    {
      changed: 'packages/validators/src/schemas.ts',
      affected: ['validators', 'team-react', 'team-angular', 'user-service', 'showcase'],
      skipped: ['types', 'events', 'feature-flags', 'api-client', 'ui-components', 'notification-service', 'api-gateway'],
    },
    {
      changed: 'packages/feature-flags/src/flags.ts',
      affected: ['feature-flags', 'team-react', 'team-angular', 'showcase', 'user-service', 'notification-service', 'api-gateway'],
      skipped: ['types', 'validators', 'events', 'api-client', 'ui-components'],
    },
    {
      changed: 'services/user-service/src/user.routes.ts',
      affected: ['user-service'],
      skipped: ['types', 'validators', 'events', 'feature-flags', 'api-client', 'ui-components', 'notification-service', 'api-gateway', 'team-react', 'team-angular', 'showcase'],
    },
    {
      changed: 'packages/types/src/user.types.ts',
      affected: ['types', 'validators', 'api-client', 'events', 'user-service', 'notification-service', 'team-react', 'team-angular', 'showcase'],
      skipped: ['feature-flags', 'ui-components', 'config', 'api-gateway'],
    },
  ];

  commands = [
    { cmd: 'npx nx graph', desc: 'Open interactive visual dependency graph in browser' },
    { cmd: 'npx nx affected --target=build --base=main', desc: 'Build only projects affected by changes since main branch' },
    { cmd: 'npx nx affected --target=lint --base=main', desc: 'Lint only affected projects' },
    { cmd: 'npx nx run-many --target=build --all', desc: 'Build all projects in dependency order' },
    { cmd: 'npx nx show project team-react', desc: 'Show full project config (executors, targets, tags)' },
  ];
}
