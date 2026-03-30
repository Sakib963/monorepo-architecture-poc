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
          This is not a theoretical choice. In our banking environment, polyrepo
          aligns better with our security constraints, team maturity, and
          operational model.
        </p>
        <div class="hero-badge">
          Decision Context: Real Production Constraints
        </div>
      </header>

      <section class="section">
        <h2>
          <span class="iconify" data-icon="mdi:account-group-outline"></span>
          Our Reality
        </h2>
        <div class="grid">
          <div class="card neutral">
            <h3>Team Structure</h3>
            <p>Small team (3–5 developers), working across all applications.</p>
          </div>
          <div class="card neutral">
            <h3>System Type</h3>
            <p>
              Banking system with multiple portals (admin, customer,
              registration).
            </p>
          </div>
          <div class="card neutral">
            <h3>Infrastructure</h3>
            <p>
              Manual deployment, limited CI/CD maturity, government-controlled
              environment.
            </p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>
          <span class="iconify" data-icon="mdi:shield-lock-outline"></span>
          Security & Access Isolation
        </h2>
        <div class="card highlight">
          <p class="strong">
            In a banking system, not every developer should see every part of
            the codebase.
          </p>
          <p class="security-note">
            Monorepo does not inherently create security vulnerabilities, but it
            increases the scope of internal visibility. In environments where
            knowledge exposure is a concern, polyrepo provides a more controlled
            and limited access model.
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
        <h2>
          <span class="iconify" data-icon="mdi:cog-outline"></span>
          Organizational & Operational Fit
        </h2>

        <div class="card highlight">
          <p class="strong">
            We are already optimized for polyrepo — changing the model
            introduces disruption, not immediate value.
          </p>
        </div>

        <div class="grid">
          <div class="card">
            <h3>No Tooling Culture Yet</h3>
            <p>No Nx, no CI/CD pipelines, no shared package governance.</p>
          </div>
          <div class="card">
            <h3>No Dedicated Ownership</h3>
            <p>
              Monorepo requires active maintenance and governance ownership.
            </p>
          </div>
          <div class="card">
            <h3>Stable Workflow</h3>
            <p>Existing dev + deploy flow already aligned with polyrepo.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>
          <span class="iconify" data-icon="mdi:bomb-outline"></span> Risk
          Containment & Failure Isolation
        </h2>

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
        <h2>
          <span class="iconify" data-icon="mdi:rocket-launch-outline"></span>
          Deployment & Release Simplicity
        </h2>

        <div class="card highlight">
          <p class="strong">
            Our deployment is manual. Simplicity is not optional — it is
            required.
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
        <h2>
          <span class="iconify" data-icon="mdi:brain"></span> Developer
          Experience & Onboarding
        </h2>

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
        <h2>
          <span class="iconify" data-icon="mdi:puzzle-outline"></span> Shared
          Logic Reality
        </h2>

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

      <section class="section sharing-focus">
        <h2>
          <span class="iconify" data-icon="mdi:share-variant-outline"></span>
          Sharing Code in Polyrepo (Without Going Monorepo)
        </h2>

        <div class="focus-ribbon">
          <span class="iconify" data-icon="mdi:star-four-points-outline"></span>
          Key Takeaway: Polyrepo and code reuse are compatible by design.
        </div>

        <div class="card highlight">
          <p class="strong">
            Choosing polyrepo does not mean giving up code reuse. It means
            sharing code in a controlled, intentional way instead of implicit
            coupling.
          </p>
          <div class="reuse-pill-row">
            <span class="reuse-pill">Explicit adoption</span>
            <span class="reuse-pill">Versioned sharing</span>
            <span class="reuse-pill">Controlled blast radius</span>
            <span class="reuse-pill">Independent releases</span>
          </div>
        </div>

        <article class="card sharing-spotlight">
          <h3>1. Shared Library Repository (Git-Based)</h3>

          <p class="method-desc">
            Create a dedicated repository for shared logic and consume it
            across applications.
          </p>

          <div class="spotlight-body">
            <div>
              <p class="label">Repository shape</p>
              <pre class="code-block">bank-shared/
├── validators
├── types
├── utils
├── api-contracts</pre>
            </div>

            <div class="usage">
              <p class="label">How to consume</p>
              <pre class="code-block small">npm install git+ssh://your-repo/bank-shared.git</pre>

              <p class="alt">
                Or via:
                <span>private Git</span> ·
                <span>tarball</span> ·
                <span>internal registry (later)</span>
              </p>
            </div>
          </div>

          <div class="pros-cons">
            <div class="mini good">
              <strong>Benefits</strong>
              <ul>
                <li>No duplication</li>
                <li>Centralized shared logic</li>
                <li>Fully compatible with polyrepo</li>
              </ul>
            </div>

            <div class="mini bad">
              <strong>Trade-off</strong>
              <ul>
                <li>Versioning required (basic is sufficient)</li>
              </ul>
            </div>
          </div>
        </article>

        <div class="sharing-grid">
          <article class="card sharing-card">
            <h3>2. Copy with Discipline</h3>
            <p class="method-desc">
              Maintain a reference implementation and reuse it manually when needed.
            </p>
            <ul class="compact-points">
              <li><strong>Best for:</strong> small teams with low change frequency.</li>
              <li><strong>Benefit:</strong> zero tooling overhead and complete independence.</li>
              <li><strong>Trade-off:</strong> manual synchronization and drift risk.</li>
            </ul>
          </article>

          <article class="card sharing-card">
            <h3>3. API-Driven Sharing</h3>
            <p class="method-desc">
              Move business rules into backend services instead of sharing frontend implementations.
            </p>
            <ul class="compact-points">
              <li><strong>Best for:</strong> consistency-critical rules.</li>
              <li><strong>Benefit:</strong> single source of truth across clients.</li>
              <li><strong>Trade-off:</strong> tighter backend dependency.</li>
            </ul>
          </article>

          <article class="card sharing-card">
            <h3>4. Contract-Based Generation</h3>
            <p class="method-desc">
              Share API contracts (OpenAPI) and generate clients/types in each repository.
            </p>
            <ul class="compact-points">
              <li><strong>Best for:</strong> multi-team API ecosystems.</li>
              <li><strong>Benefit:</strong> typed synchronization without runtime coupling.</li>
              <li><strong>Trade-off:</strong> higher initial setup effort.</li>
            </ul>
          </article>
        </div>

        <div class="card insight">
          <p>
            <strong>Key Insight:</strong>
            Polyrepo does not eliminate reuse — it forces reuse to be explicit,
            versioned, and intentionally adopted instead of implicitly shared.
          </p>
        </div>
      </section>

      <section class="section">
        <h2>
          <span class="iconify" data-icon="mdi:scale-balance"></span> Trade-offs
          We Accept
        </h2>

        <div class="card warning">
          <ul>
            <li>Some level of code duplication</li>
            <li>Manual synchronization of shared logic</li>
            <li>Less optimized developer experience</li>
          </ul>
        </div>
      </section>

      <section class="section">
        <h2>
          <span class="iconify" data-icon="mdi:message-alert-outline"></span>
          Solid Arguments for Polyrepo
        </h2>

        <div class="argument-grid">
          <article class="card argument-card">
            <h3>Monorepo Makes Small Mistakes More Expensive</h3>
            <div class="arg-example">
              <p><strong>Example:</strong> change one shared validator.</p>
              <ul>
                <li>
                  <strong>In monorepo:</strong> impacts all apps instantly.
                </li>
                <li>
                  <strong>In polyrepo:</strong> impacts only when each app
                  explicitly adopts it.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo localizes mistakes, monorepo amplifies them.
            </p>
          </article>

          <article class="card argument-card">
            <h3>Polyrepo Matches How Systems Actually Evolve</h3>
            <div class="arg-example">
              <p>
                <strong>Real systems:</strong> evolve unevenly. Different apps
                move at different speeds.
              </p>
              <ul>
                <li>
                  <strong>Monorepo:</strong> tends to synchronize evolution
                  across teams.
                </li>
                <li>
                  <strong>Polyrepo:</strong> allows slow apps to stay stable
                  while fast apps evolve.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo aligns with natural system evolution, not
              forced synchronization.
            </p>
          </article>

          <article class="card argument-card">
            <h3>Monorepo Assumes Perfect Tooling - Reality Isn't</h3>
            <div class="arg-example">
              <p>
                <strong>Monorepo depends on:</strong> accurate dependency graph,
                correct build config, and reliable tooling.
              </p>
              <ul>
                <li>
                  If any of these drift, failures propagate across the system.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo reduces reliance on tooling correctness.
            </p>
          </article>

          <article class="card argument-card">
            <h3>You Can Introduce Monorepo Later - Harder to Go Back</h3>
            <div class="arg-example">
              <ul>
                <li>
                  <strong>Polyrepo to monorepo:</strong> possible when maturity
                  grows.
                </li>
                <li>
                  <strong>Monorepo to polyrepo:</strong> painful split with high
                  migration cost.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo keeps future options open, monorepo commits
              early.
            </p>
          </article>

          <article class="card argument-card">
            <h3>Independent Release Calendars Are Operationally Safer</h3>
            <div class="arg-example">
              <p>
                <strong>Reality:</strong> teams rarely release on the same day,
                with the same urgency, and the same risk profile.
              </p>
              <ul>
                <li>
                  <strong>In monorepo:</strong> shared release pressure
                  increases cross-team coordination cost.
                </li>
                <li>
                  <strong>In polyrepo:</strong> each app/service can release on
                  its own schedule.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo supports asynchronous delivery without forcing
              synchronization overhead.
            </p>
          </article>

          <article class="card argument-card">
            <h3>Rollback Is Simpler When Blast Radius Is Small</h3>
            <div class="arg-example">
              <p>
                <strong>Example:</strong> a production bug appears in one
                service after deploy.
              </p>
              <ul>
                <li>
                  <strong>In monorepo:</strong> rollback can involve shared
                  artifacts and dependency coordination.
                </li>
                <li>
                  <strong>In polyrepo:</strong> revert one repository and
                  redeploy one unit.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo makes incident response more targeted and
              predictable.
            </p>
          </article>

          <article class="card argument-card">
            <h3>Dependency Upgrades Can Be Phased, Not Forced</h3>
            <div class="arg-example">
              <p>
                <strong>Reality:</strong> framework and runtime upgrades have
                different urgency across systems.
              </p>
              <ul>
                <li>
                  <strong>In monorepo:</strong> central upgrade waves can
                  disrupt teams that are not ready.
                </li>
                <li>
                  <strong>In polyrepo:</strong> critical systems can stay stable
                  while others modernize first.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo enables controlled modernization instead of
              forced uniform upgrades.
            </p>
          </article>

          <article class="card argument-card">
            <h3>Audit and Compliance Boundaries Are Clearer</h3>
            <div class="arg-example">
              <p>
                <strong>Reality:</strong> regulated domains often need precise
                ownership, access logs, and change scopes.
              </p>
              <ul>
                <li>
                  <strong>In monorepo:</strong> proving narrow change scope can
                  require extra tooling and policy layering.
                </li>
                <li>
                  <strong>In polyrepo:</strong> repository boundaries naturally
                  map to ownership and audit boundaries.
                </li>
              </ul>
            </div>
            <p class="arg-claim">
              Argument: Polyrepo provides cleaner governance boundaries for
              regulated environments.
            </p>
          </article>
        </div>
      </section>

      <section class="section final">
        <h2>
          <span class="iconify" data-icon="mdi:bullseye-arrow"></span> Final
          Position
        </h2>
        <p>
          Polyrepo is not chosen for convenience. It is chosen because it aligns
          with our
          <strong
            >security model, operational maturity, and risk tolerance</strong
          >.
        </p>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

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
        background: #ffffff;
        border: 1px solid #dbe3ef;
        border-radius: 1rem;
        padding: 1.15rem;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
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
        margin-bottom: 16px;
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

      .sharing-focus {
        background: linear-gradient(135deg, #eff6ff 0%, #ffffff 72%);
        border: 1px solid #cfe0ff;
        border-radius: 1rem;
        padding: 1.15rem;
      }

      .focus-ribbon {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: #1d4ed8;
        color: #ffffff;
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
        font-size: 0.78rem;
        font-weight: 700;
        margin-bottom: 0.9rem;
      }

      .reuse-pill-row {
        margin-top: 0.75rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }

      .reuse-pill {
        background: #dbeafe;
        color: #1e40af;
        border: 1px solid #bfdbfe;
        border-radius: 999px;
        padding: 0.2rem 0.55rem;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .argument-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }

      .argument-card {
        border-left: 4px solid #2563eb;
        background: #ffffff;
      }

      .arg-example {
        margin-top: 0.4rem;
        display: grid;
        gap: 0.5rem;
      }

      .arg-claim {
        margin-top: 0.8rem !important;
        padding-top: 0.75rem;
        border-top: 1px dashed #cbd5e1;
        color: #1d4ed8 !important;
        font-size: 0.86rem !important;
        font-weight: 700;
        line-height: 1.5;
      }

      .strong {
        font-weight: 600;
        color: #0f172a;
        font-size: 0.92rem;
        line-height: 1.6;
        margin: 0;
      }

      .security-note {
        margin-top: 0.65rem !important;
        color: #334155 !important;
        font-size: 0.86rem !important;
        line-height: 1.6 !important;
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
        .page {
          padding: 1.5rem;
        }
        h1 {
          font-size: 1.7rem;
        }
        .hero {
          padding: 1.2rem;
        }
      }

      .sharing-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        align-items: start;
      }

      .sharing-spotlight {
        border: 1px solid #bfdbfe;
        border-left: 4px solid #2563eb;
        margin-bottom: 1rem;
      }

      .spotlight-body {
        display: grid;
        gap: 0.9rem;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      }

      .label {
        margin-bottom: 0.4rem !important;
        color: #1e293b !important;
        font-size: 0.8rem !important;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .sharing-card h3 {
        margin-bottom: 0.4rem;
      }

      .compact-points {
        margin: 0;
        padding-left: 1rem;
        display: grid;
        gap: 0.45rem;
      }

      .compact-points li {
        color: #334155;
        font-size: 0.84rem;
        line-height: 1.5;
      }

      .method-desc {
        font-size: 0.85rem;
        color: #475569;
        margin-bottom: 0.8rem;
      }

      .code-block {
        margin: 0.5rem 0 0.75rem;
        background: #f8fafc;
        border: 1px solid #dbe3ef;
        border-radius: 0.6rem;
        padding: 0.65rem 0.75rem;
        color: #1e293b;
        font-size: 0.78rem;
        line-height: 1.45;
        overflow-x: auto;
      }

      .code-block.small {
        font-size: 0.75rem;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .usage {
        margin: 0.45rem 0 0.8rem;
      }

      .alt {
        margin-top: 0.35rem !important;
        color: #475569 !important;
        font-size: 0.8rem !important;
      }

      .alt span {
        color: #1d4ed8;
        font-weight: 600;
      }

      .pros-cons {
        display: grid;
        gap: 0.6rem;
      }

      .mini {
        border-radius: 0.6rem;
        padding: 0.6rem 0.7rem;
        font-size: 0.8rem;
      }

      .mini ul {
        margin-top: 0.3rem;
        padding-left: 1rem;
      }

      .insight {
        background: #eef2ff;
        border-color: #c7d2fe;
        margin-top: 1rem;
      }
    `,
  ],
})
export class WhyPolyrepoComponent {}
