import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conclusion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Conclusion</p>
        <h1>Final Stance: Adopt with Governance, Not by Default</h1>
        <p class="subtitle">
          Monorepo is a strong fit for our multi-portal environment when we pair it with strict governance.
          Without governance, the same model increases shared operational risk.
        </p>
      </header>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:alert-decagram-outline"></span> Problem (real situation)</h2>
        <div class="card">We had duplicated contracts, inconsistent portal behavior, and expensive coordination across separate codebases.</div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:timeline-alert-outline"></span> Why it matters</h2>
        <div class="card">In banking workflows, inconsistency is not only technical debt; it is operational and compliance risk.</div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:source-branch"></span> What we did (monorepo approach)</h2>
        <div class="card">Centralized shared domain packages, enforced boundaries, and used affected validation/deployment strategy.</div>
      </section>

      <section class="section two-col">
        <article class="card">
          <h2><span class="iconify" data-icon="mdi:chart-line"></span> What improved</h2>
          <ul>
            <li>Shared contract updates became safer and more visible.</li>
            <li>CI workload reduced for app-local changes.</li>
            <li>Portal behavior consistency improved.</li>
          </ul>
        </article>

        <article class="card">
          <h2><span class="iconify" data-icon="mdi:alert-outline"></span> Trade-offs</h2>
          <ul>
            <li>Shared packages require strict owner review and compatibility policy.</li>
            <li>Visibility isolation is limited; permission policy must compensate.</li>
            <li>Governance overhead is continuous, not one-time setup.</li>
          </ul>
        </article>
      </section>

      <section class="section summary">
        <h2><span class="iconify" data-icon="mdi:lightbulb-on-outline"></span> Key insight</h2>
        <p>
          Monorepo is a force multiplier for teams that already practice ownership discipline.
          It is a force multiplier for risk when that discipline is absent.
        </p>
      </section>

      <section class="section next-steps">
        <h2><span class="iconify" data-icon="mdi:arrow-right-bold-circle-outline"></span> Suggested next steps</h2>
        <ol>
          <li>Define owners for each shared package.</li>
          <li>Enforce compatibility checklist in pull requests.</li>
          <li>Track lead time, failed deploy rate, and rollback frequency for 4-6 weeks.</li>
        </ol>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1240px; margin: 0 auto; }
    .hero { margin-bottom: 1rem; padding: 1.2rem; border-radius: 1rem; border: 1px solid #d7e3f7; background: linear-gradient(135deg, #eef4ff 0%, #ffffff 70%); }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.45rem; }
    h1 { font-size: 2rem; color: #0f172a; margin-bottom: 0.7rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 780px; }

    .section { margin-top: 1rem; }
    h2 { display: flex; align-items: center; gap: 0.45rem; font-size: 0.9rem; color: #1e293b; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .two-col { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.8rem; padding: 0.9rem; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04); }
    ul { margin: 0; padding-left: 1.2rem; color: #334155; display: grid; gap: 0.45rem; line-height: 1.6; }

    .summary { background: linear-gradient(135deg, #eff6ff 0%, #ffffff 65%); border: 1px solid #cfe0ff; border-radius: 0.8rem; padding: 0.9rem; }
    .summary p { color: #1e293b; font-size: 0.86rem; line-height: 1.6; max-width: 920px; }
    .next-steps { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.8rem; padding: 0.9rem; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04); }
    ol { margin: 0; padding-left: 1.2rem; color: #334155; display: grid; gap: 0.45rem; line-height: 1.6; font-size: 0.82rem; }
  `],
})
export class ConclusionComponent {}
