import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AntiPattern {
  situation: string;
  whyItFails: string;
}

@Component({
  selector: 'app-not-monorepo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Our Case — Ineffective</p>
        <h1>Where Monorepo Can Be Ineffective for Us</h1>
        <p class="subtitle">
          Monorepo is not always the right answer. In our context, it can fail when ownership,
          compatibility, and governance are weak.
        </p>
        <div class="warning">Important: without governance controls, monorepo centralizes failure impact as well as code.</div>
      </header>

      <section class="section">
        <h2>Failure modes in our case</h2>
        <div class="grid">
          <article class="card" *ngFor="let row of antiPatterns">
            <p><strong>Situation:</strong> {{ row.situation }}</p>
            <p><strong>Why ineffective:</strong> {{ row.whyItFails }}</p>
          </article>
        </div>
      </section>

      <section class="section callout">
        <h2>Reality check</h2>
        <p>
          If teams cannot treat shared code as a public API with strict review and compatibility rules,
          monorepo increases risk instead of reducing it.
        </p>
      </section>

      <section class="section">
        <h2>Indicators to pause adoption</h2>
        <ul class="list">
          <li *ngFor="let item of badFitCases">{{ item }}</li>
        </ul>
      </section>

      <section class="section callout">
        <h2>How to prevent this failure</h2>
        <ul class="list">
          <li>Make shared package owners explicit.</li>
          <li>Require compatibility checklist for shared changes.</li>
          <li>Fail CI on boundary violations, always.</li>
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
    .warning {
      margin-top: 0.8rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 0.7rem;
      padding: 0.6rem 0.75rem;
      color: #7f1d1d;
      font-size: 0.8rem;
      max-width: 860px;
    }
    .section { margin-top: 2rem; }
    h2 { font-size: 1rem; color: #1e293b; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .grid { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04); }
    h3 { color: #0f172a; margin-bottom: 0.65rem; font-size: 0.95rem; }
    p { color: #334155; font-size: 0.82rem; line-height: 1.55; margin: 0.3rem 0; }
    strong { color: #1e293b; }
    .callout { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.6rem; padding: 1rem; }
    .list { margin: 0; padding-left: 1.2rem; color: #334155; display: grid; gap: 0.55rem; line-height: 1.6; }
    .compact { gap: 0.45rem; }
  `],
})
export class NotMonorepoComponent {
  antiPatterns: AntiPattern[] = [
    {
      situation: 'Shared package contracts are changed without backward compatibility discipline.',
      whyItFails: 'Multiple portals break together and emergency coordination cost becomes high.',
    },
    {
      situation: 'Teams bypass module boundaries and import from app internals directly.',
      whyItFails: 'Architecture coupling grows quickly and independent delivery becomes impossible.',
    },
    {
      situation: 'CODEOWNERS and release controls are weak or ignored.',
      whyItFails: 'Visibility and permission become mixed, increasing compliance and audit risk.',
    },
  ];

  badFitCases = [
    'If teams are fully independent and never share code or contracts, a monorepo can add overhead without value.',
    'If your org cannot enforce boundaries and ownership, one repo can become a high-conflict code dumping ground.',
    'If tooling discipline is not possible yet, start with clearer package standards before scaling monorepo scope.',
  ];
}
