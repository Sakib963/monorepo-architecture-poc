import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trade-offs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Pros & Cons</p>
        <h1>Monorepo: Benefits vs Risks</h1>
        <p class="subtitle">
          This is a balanced engineering view of expected gains and operational costs.
          Decision quality comes from evaluating both sides together.
        </p>
      </header>

      <section class="section verdict-grid">
        <article class="verdict-card">
          <h2>Pros of monorepo</h2>
          <ul class="rich-list">
            <li *ngFor="let item of pros">
              <span class="badge good">Benefit</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </article>
        <article class="verdict-card">
          <h2>Cons of monorepo</h2>
          <ul class="rich-list">
            <li *ngFor="let item of cons">
              <span class="badge risk">Risk</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="section note">
        <h2>Key takeaway</h2>
        <p>
          Monorepo is usually a strong fit when shared contracts are governed like public APIs.
          Without ownership and compatibility discipline, risk can exceed return.
        </p>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1240px; margin: 0 auto; }
    .hero { margin-bottom: 2rem; }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    h1 { font-size: 1.9rem; color: #0f172a; margin-bottom: 0.75rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 760px; }
    .section { margin-top: 1.6rem; }
    h2 { font-size: 1rem; color: #1e293b; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .verdict-grid { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .verdict-card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04); }
    .rich-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.6rem; }
    .rich-list li { display: grid; grid-template-columns: 76px 1fr; gap: 0.55rem; align-items: start; color: #334155; font-size: 0.82rem; line-height: 1.5; }
    .badge { display: inline-block; border-radius: 999px; padding: 0.15rem 0.45rem; font-size: 0.65rem; font-weight: 700; text-align: center; }
    .good { background: #dcfce7; color: #166534; }
    .risk { background: #fee2e2; color: #991b1b; }

    .note { background: linear-gradient(135deg, #eff6ff 0%, #ffffff 70%); border: 1px solid #cfe0ff; border-radius: 0.75rem; padding: 0.9rem; }
    .note p { color: #1e293b; font-size: 0.84rem; line-height: 1.55; }
  `],
})
export class TradeOffsComponent {
  pros = [
    'Single source of truth for shared types, validators, API contracts, and flags.',
    'Reduced duplication across portals, which improves consistency and maintainability.',
    'Safer refactoring because affected projects are discovered by dependency graph.',
    'Faster CI for day-to-day work through affected lint/build/test and caching.',
    'Easier cross-team visibility into impact before merging shared changes.',
  ];

  cons = [
    'Shared package changes can create blast radius across multiple apps.',
    'Governance overhead increases: ownership, review policy, and compatibility rules are required.',
    'Code visibility is broad in one repository; permission isolation needs process controls.',
    'Without boundary enforcement, architecture drifts into cross-app coupling quickly.',
    'If teams do not follow discipline, monorepo becomes a liability, not an accelerator.',
  ];
}
