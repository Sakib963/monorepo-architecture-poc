import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-polyrepo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Architecture Decision</p>
        <h1>Why Polyrepo Fits Our Reality</h1>
        <p class="subtitle">
          This is not a theoretical choice. In our banking environment, polyrepo aligns better with our
          security constraints, team maturity, and operational model.
        </p>
        <div class="hero-badge">Decision Context: Real Production Constraints</div>
      </header>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:account-group-outline"></span> Our Reality</h2>
        <div class="grid">
          <div class="card neutral">
            <h3>Team Structure</h3>
            <p>Small team (3–5 developers), working across all applications.</p>
          </div>
          <div class="card neutral">
            <h3>System Type</h3>
            <p>Banking system with multiple portals (admin, customer, registration).</p>
          </div>
          <div class="card neutral">
            <h3>Infrastructure</h3>
            <p>Manual deployment, limited CI/CD maturity, government-controlled environment.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:shield-lock-outline"></span> Security & Access Isolation</h2>
        <div class="card highlight">
          <p class="strong">
            In a banking system, not every developer should see every part of the codebase.
          </p>
        </div>

        <div class="two-col">
          <div class="card bad">
            <h3>Monorepo Risk</h3>
            <ul>
              <li>Full codebase visibility</li>
              <li>Hard to enforce strict access boundaries</li>
              <li>Increased exposure surface</li>
            </ul>
          </div>

          <div class="card good">
            <h3>Polyrepo Advantage</h3>
            <ul>
              <li>Repo-level access control</li>
              <li>Principle of least privilege</li>
              <li>Clear separation of domains</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:cog-outline"></span> Organizational & Operational Fit</h2>

        <div class="card highlight">
          <p class="strong">
            We are already optimized for polyrepo — changing the model introduces disruption, not immediate value.
          </p>
        </div>

        <div class="grid">
          <div class="card">
            <h3>No Tooling Culture Yet</h3>
            <p>No Nx, no CI/CD pipelines, no shared package governance.</p>
          </div>
          <div class="card">
            <h3>No Dedicated Ownership</h3>
            <p>Monorepo requires active maintenance and governance ownership.</p>
          </div>
          <div class="card">
            <h3>Stable Workflow</h3>
            <p>Existing dev + deploy flow already aligned with polyrepo.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:bomb-outline"></span> Risk Containment & Failure Isolation</h2>

        <div class="two-col">
          <div class="card bad">
            <h3>Monorepo</h3>
            <ul>
              <li>Shared change can break multiple apps</li>
              <li>Hidden dependencies</li>
              <li>Wider blast radius</li>
            </ul>
          </div>

          <div class="card good">
            <h3>Polyrepo</h3>
            <ul>
              <li>Failures isolated per app</li>
              <li>Explicit integration</li>
              <li>Controlled adoption of changes</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:rocket-launch-outline"></span> Deployment & Release Simplicity</h2>

        <div class="card highlight">
          <p class="strong">
            Our deployment is manual. Simplicity is not optional — it is required.
          </p>
        </div>

        <div class="two-col">
          <div class="card bad">
            <h3>Monorepo Complexity</h3>
            <ul>
              <li>Selective builds required</li>
              <li>Release orchestration needed</li>
              <li>Feature flags required for control</li>
            </ul>
          </div>

          <div class="card good">
            <h3>Polyrepo Simplicity</h3>
            <ul>
              <li>Each repo = deployable unit</li>
              <li>No orchestration needed</li>
              <li>Clear release control</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:brain"></span> Developer Experience & Onboarding</h2>

        <div class="two-col">
          <div class="card bad">
            <h3>Monorepo</h3>
            <ul>
              <li>High cognitive load</li>
              <li>Must understand full system</li>
              <li>Complex dependency graph</li>
            </ul>
          </div>

          <div class="card good">
            <h3>Polyrepo</h3>
            <ul>
              <li>Focused learning scope</li>
              <li>One repo = one context</li>
              <li>Faster onboarding</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:puzzle-outline"></span> Shared Logic Reality</h2>

        <div class="card highlight">
          <p class="strong">
            Shared logic in our system is stable and changes infrequently.
          </p>
        </div>

        <div class="grid">
          <div class="card">
            <h3>Low Change Frequency</h3>
            <p>Validation rules and DTOs rarely change.</p>
          </div>
          <div class="card">
            <h3>Backend Driven</h3>
            <p>Most logic lives in backend services.</p>
          </div>
          <div class="card">
            <h3>Acceptable Duplication</h3>
            <p>Duplication cost is lower than coupling risk.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:scale-balance"></span> Trade-offs We Accept</h2>

        <div class="card warning">
          <ul>
            <li>Some level of code duplication</li>
            <li>Manual synchronization of shared logic</li>
            <li>Less optimized developer experience</li>
          </ul>
        </div>
      </section>

      <section class="section final">
        <h2><span class="iconify" data-icon="mdi:bullseye-arrow"></span> Final Position</h2>
        <p>
          Polyrepo is not chosen for convenience. It is chosen because it aligns with our
          <strong>security model, operational maturity, and risk tolerance</strong>.
        </p>
      </section>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .page {
      padding: 2rem 1.5rem;
      max-width: 1440px;
      margin: 0 auto;
    }

    .hero {
      margin-bottom: 1.25rem;
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid #d7e3f7;
      background: linear-gradient(135deg, #eef4ff 0%, #ffffff 70%);
    }

    .eyebrow {
      color: #2563eb;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-size: 2rem;
      color: #0f172a;
      margin-bottom: 0.75rem;
    }

    .subtitle {
      color: #334155;
      max-width: 920px;
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .hero-badge {
      margin-top: 1rem;
      display: inline-block;
      background: #ffffff;
      border: 1px solid #dbe3ef;
      padding: 0.45rem 0.65rem;
      border-radius: 0.6rem;
      font-size: 0.78rem;
      color: #334155;
    }

    .section {
      margin-top: 2rem;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      margin-bottom: 1.2rem;
      text-transform: uppercase;
      color: #0f172a;
      letter-spacing: 0.05em;
      font-weight: 700;
    }

    .grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .two-col {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .card {
      background: white;
      border: 1px solid #dbe3ef;
      border-radius: 0.9rem;
      padding: 1.2rem;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    }

    .card h3 {
      margin: 0 0 0.6rem 0;
      color: #0f172a;
      font-size: 0.95rem;
    }

    .card p {
      margin: 0;
      color: #334155;
      font-size: 0.88rem;
      line-height: 1.6;
    }

    .card ul {
      padding-left: 1.2rem;
      margin: 0;
      display: grid;
      gap: 0.45rem;
      color: #334155;
      font-size: 0.86rem;
      line-height: 1.55;
    }

    .highlight {
      background: #f8fbff;
      border-color: #cfe0ff;
    }

    .good {
      background: #f0fdf4;
      border-color: #bbf7d0;
      border-left: 4px solid #16a34a;
    }

    .bad {
      background: #fef2f2;
      border-color: #fecaca;
      border-left: 4px solid #dc2626;
    }

    .warning {
      background: #fff7ed;
      border-color: #fed7aa;
      border-left: 4px solid #d97706;
    }

    .neutral {
      background: #f8fafc;
    }

    .strong {
      font-weight: 600;
      color: #0f172a;
      font-size: 0.92rem;
      line-height: 1.6;
      margin: 0;
    }

    .final {
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
      border: 1px solid #cfe0ff;
      border-radius: 1rem;
      padding: 1.3rem;
    }

    .final p {
      margin: 0;
      color: #1e293b;
      font-size: 0.95rem;
      line-height: 1.7;
    }

    @media (max-width: 1024px) {
      .page { padding: 1.5rem; }
      h1 { font-size: 1.7rem; }
      .hero { padding: 1.2rem; }
    }
  `]
})
export class WhyPolyrepoComponent {}