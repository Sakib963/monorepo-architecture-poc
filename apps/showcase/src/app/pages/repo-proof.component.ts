import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CaseItem {
  problem: string;
  monorepoHandling: string;
}

@Component({
  selector: 'app-repo-proof',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Our Case — Effective</p>
        <h1>Problems We Face and How Monorepo Helps</h1>
        <p class="subtitle">
          In our banking portal landscape, several recurring pains become easier to control
          when shared logic and boundaries are managed in one workspace.
        </p>
        <div class="story-note"><strong>Analysis model:</strong> Problem → Shared Layer → Operational Outcome</div>
      </header>

      <section class="section">
        <h2>Before vs After</h2>
        <div class="stack">
          <article class="card" *ngFor="let item of caseItems">
            <p class="problem"><strong>Before:</strong> {{ item.problem }}</p>
            <p class="solution"><strong>After (with monorepo):</strong> {{ item.monorepoHandling }}</p>
          </article>
        </div>
      </section>

      <section class="section outcomes-card">
        <h3>Result in our POC</h3>
        <ul>
          <li>Shared contracts reduced repeated portal-specific reimplementation.</li>
          <li>Affected build strategy improved feedback speed for scoped changes.</li>
          <li>Cross-portal impact became visible before deployment through one graph.</li>
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1240px; margin: 0 auto; }
    .hero { margin-bottom: 2rem; }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    h1 { font-size: 1.9rem; color: #0f172a; margin-bottom: 0.75rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 760px; }
    .story-note {
      margin-top: 0.8rem;
      display: inline-block;
      background: #eef4ff;
      border: 1px solid #d2ddf5;
      border-radius: 0.65rem;
      padding: 0.45rem 0.6rem;
      color: #334155;
      font-size: 0.78rem;
    }
    .section { margin-top: 1.6rem; }
    h2 { font-size: 0.95rem; color: #1e293b; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .stack { display: grid; gap: 0.8rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04); }
    h3 { color: #0f172a; margin-bottom: 0.65rem; font-size: 0.95rem; }
    p { color: #334155; font-size: 0.82rem; line-height: 1.6; margin: 0.35rem 0; }
    .problem { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 0.55rem; padding: 0.45rem 0.55rem; }
    .solution { background: #ecfeff; border: 1px solid #a5f3fc; border-radius: 0.55rem; padding: 0.45rem 0.55rem; }
    strong { color: #1e293b; }
    .outcomes-card { margin-top: 1.2rem; background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 1rem; }
    .outcomes-card h3 { color: #0f172a; font-size: 0.95rem; margin-bottom: 0.65rem; }
    .outcomes-card ul { margin: 0; padding-left: 1.2rem; color: #334155; display: grid; gap: 0.45rem; }
  `],
})
export class RepoProofComponent {
  caseItems: CaseItem[] = [
    {
      problem: 'Same DTOs and validation rules were repeated across multiple portals.',
      monorepoHandling: 'Shared packages centralize contracts so schema changes are implemented once and validated across consumers.',
    },
    {
      problem: 'Feature rollout behavior drifted between apps and services.',
      monorepoHandling: 'A common feature-flag package provides one source of truth for rollout decisions.',
    },
    {
      problem: 'Shared contract changes were risky and hard to track.',
      monorepoHandling: 'Nx affected graph identifies impacted apps/services so validation scope is explicit.',
    },
    {
      problem: 'Developer setup differed by team role and caused friction.',
      monorepoHandling: 'Role-specific root scripts standardize startup and reduce local orchestration variability.',
    },
  ];
}
