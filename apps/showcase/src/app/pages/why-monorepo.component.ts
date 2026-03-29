import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-monorepo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Monorepo</p>
        <h1>What is a Monorepo?</h1>
        <p class="subtitle">
          A monorepo is a single repository that contains multiple applications, services,
          and shared packages with explicit dependency boundaries.
        </p>
        <div class="analogy">
          <strong>Important:</strong> monorepo is not just co-location. It requires contract ownership,
          boundary enforcement, and disciplined CI controls.
        </div>
      </header>

      <section class="section two-col">
        <article class="card">
          <h2>Core model</h2>
          <ul class="list">
            <li>One repository contains many apps, services, and shared packages.</li>
            <li>Shared packages define reusable contracts and implementation primitives.</li>
            <li>Tooling (Nx graph + affected) scopes build/test to impacted projects.</li>
          </ul>
        </article>

        <article class="card">
          <h2>Operational impact</h2>
          <ul class="list">
            <li>Contract drift is detected earlier through compile and affected checks.</li>
            <li>Cross-portal duplication decreases when shared logic is centralized.</li>
            <li>Teams keep app ownership while coordinating on shared APIs.</li>
          </ul>
        </article>
      </section>

      <section class="section">
        <h2>What monorepo is not</h2>
        <div class="glossary-grid">
          <article class="glossary-card"><strong>Not:</strong> a guarantee of faster delivery without process discipline.</article>
          <article class="glossary-card"><strong>Not:</strong> full code-visibility isolation between teams.</article>
          <article class="glossary-card"><strong>Not:</strong> a replacement for ownership, review, and release policy.</article>
        </div>
      </section>

      <section class="section">
        <h2>Quick glossary</h2>
        <div class="glossary-grid">
          <article class="glossary-card"><strong>App:</strong> user-facing portal (ex: user portal, admin portal).</article>
          <article class="glossary-card"><strong>Package:</strong> reusable shared code (types, validators, client).</article>
          <article class="glossary-card"><strong>Service:</strong> backend API process (gateway, user, notification).</article>
          <article class="glossary-card"><strong>Affected build:</strong> run checks only for changed/impacted projects.</article>
        </div>
      </section>

      <section class="section">
        <h2>Architecture view</h2>
        <pre class="diagram">monorepo/
├── apps/
│   ├── user-portal
│   ├── admin-portal
│   └── showcase
├── packages/
│   ├── types
│   ├── validators
│   ├── api-client
│   └── feature-flags
└── services/
    ├── api-gateway
    ├── user-service
    └── notification-service

Nx graph + affected tasks => build/test only impacted projects</pre>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1240px; margin: 0 auto; }
    .hero { margin-bottom: 2rem; }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    h1 { font-size: 1.9rem; color: #0f172a; margin-bottom: 0.75rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 760px; }
    .analogy {
      margin-top: 0.9rem;
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 70%);
      border: 1px solid #cfe0ff;
      border-radius: 0.75rem;
      padding: 0.7rem 0.8rem;
      color: #334155;
      font-size: 0.82rem;
      line-height: 1.5;
      max-width: 860px;
    }
    .section { margin-top: 1.6rem; }
    h2 { font-size: 1rem; color: #1e293b; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .two-col { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.6rem; padding: 1rem; }
    .list { margin: 0; padding-left: 1.2rem; color: #334155; display: grid; gap: 0.55rem; line-height: 1.6; }
    .glossary-grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .glossary-card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.7rem; padding: 0.75rem; color: #334155; font-size: 0.8rem; }
    .diagram {
      background: #ffffff;
      border: 1px solid #dbe3ef;
      border-radius: 0.75rem;
      padding: 1rem;
      color: #334155;
      font-size: 0.8rem;
      line-height: 1.55;
      overflow-x: auto;
    }
  `],
})
export class WhyMonorepoComponent {
  
}
