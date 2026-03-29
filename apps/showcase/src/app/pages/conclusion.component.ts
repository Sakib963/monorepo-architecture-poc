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
        <h1>Final Recommendation</h1>
        <p class="subtitle">
          Monorepo is a strong fit for our multi-portal environment when we pair it with strict governance.
          Without governance, the same model increases shared operational risk.
        </p>
      </header>

      <section class="section two-col">
        <article class="card">
          <h2>Adopt monorepo when</h2>
          <ul>
            <li>Multiple portals share contracts and domain logic.</li>
            <li>Teams commit to boundary rules and shared API discipline.</li>
            <li>CI/CD maturity supports affected checks and release controls.</li>
          </ul>
        </article>

        <article class="card">
          <h2>Do not adopt yet when</h2>
          <ul>
            <li>Ownership and review accountability are unclear.</li>
            <li>Shared package changes are unmanaged.</li>
            <li>Release governance and rollback readiness are missing.</li>
          </ul>
        </article>
      </section>

      <section class="section summary">
        <h2>One-line executive summary</h2>
        <p>
          Monorepo is not only a code-organization decision; it is an organizational commitment
          to shared ownership, controlled collaboration, and disciplined engineering.
        </p>
      </section>

      <section class="section next-steps">
        <h2>Suggested next steps</h2>
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
    .hero { margin-bottom: 1.6rem; }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.45rem; }
    h1 { font-size: 2rem; color: #0f172a; margin-bottom: 0.7rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 780px; }

    .section { margin-top: 1.6rem; }
    h2 { font-size: 0.95rem; color: #1e293b; margin-bottom: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .two-col { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 1rem; }
    ul { margin: 0; padding-left: 1.2rem; color: #334155; display: grid; gap: 0.45rem; line-height: 1.6; }

    .summary { background: linear-gradient(135deg, #eff6ff 0%, #ffffff 65%); border: 1px solid #cfe0ff; border-radius: 0.8rem; padding: 1rem; }
    .summary p { color: #1e293b; font-size: 0.86rem; line-height: 1.6; max-width: 920px; }
    .next-steps { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.8rem; padding: 1rem; }
    ol { margin: 0; padding-left: 1.2rem; color: #334155; display: grid; gap: 0.45rem; line-height: 1.6; font-size: 0.82rem; }
  `],
})
export class ConclusionComponent {}
