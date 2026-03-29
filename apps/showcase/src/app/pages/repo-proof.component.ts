import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repo-proof',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Our Implementation</p>
        <h1>Our Monorepo POC</h1>
        <p class="subtitle">
          This is what monorepo looks like in practice. We've implemented a working example with multiple apps,
          services, and shared packages. Here's what we learned from building it.
        </p>
      </header>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:chart-box-outline"></span> Architecture snapshot</h2>
        <div class="architecture">
          <div class="arch-column">
            <h3>Apps</h3>
            <ul>
              <li>User Portal (Angular)</li>
              <li>Admin Portal (Angular)</li>
              <li>Showcase (Angular)</li>
            </ul>
          </div>
          <div class="arch-column">
            <h3>Services</h3>
            <ul>
              <li>API Gateway</li>
              <li>User Service</li>
              <li>Notification Service</li>
            </ul>
          </div>
          <div class="arch-column">
            <h3>Shared Packages</h3>
            <ul>
              <li>Types</li>
              <li>Validators</li>
              <li>API Client</li>
              <li>Feature Flags</li>
              <li>UI Components</li>
              <li>Events</li>
              <li>Config</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:tools"></span> Tooling choices</h2>
        <div class="tooling-grid">
          <article class="tool-card">
            <h3>Nx</h3>
            <p>Monorepo management with dependency graph visualization, affected task orchestration, and code generation.</p>
          </article>
          <article class="tool-card">
            <h3>Angular</h3>
            <p>Used for all frontend projects. Standalone components and lazy-loaded routes scale well in monorepo.</p>
          </article>
          <article class="tool-card">
            <h3>TypeScript</h3>
            <p>Shared types across apps and services eliminate contract drift and provide IDE support everywhere.</p>
          </article>
          <article class="tool-card">
            <h3>Standardized npm scripts</h3>
            <p>dev:user, dev:admin, dev:backend shortcuts reduce cognitive load and make local setup consistent.</p>
          </article>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:check-decagram-outline"></span> What worked well</h2>
        <div class="wins-grid">
          <article class="win-card">
            <div class="win-icon">✓</div>
            <h3>Shared type definitions</h3>
            <p>Types defined once, used everywhere. This eliminated entire categories of bugs and inconsistencies.</p>
          </article>
          <article class="win-card">
            <div class="win-icon">✓</div>
            <h3>Fast feedback on shared changes</h3>
            <p>Change a shared package, affected projects test immediately. Know impact in seconds, not hours.</p>
          </article>
          <article class="win-card">
            <div class="win-icon">✓</div>
            <h3>Code reuse and patterns</h3>
            <p>Teams see how others solved similar problems. Reduces duplicate code and accelerates new feature development.</p>
          </article>
          <article class="win-card">
            <div class="win-icon">✓</div>
            <h3>Consistent tooling</h3>
            <p>One lint config, one test runner, one build system. No "but it works on my machine" surprises across teams.</p>
          </article>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:alert-circle-outline"></span> Challenges we faced</h2>
        <div class="challenges-grid">
          <article class="challenge-card">
            <div class="challenge-icon">⚠</div>
            <h3>CI/CD complexity</h3>
            <p>Testing everything on every change is slow. Affected task optimization is essential to keep feedback loops fast.</p>
          </article>
          <article class="challenge-card">
            <div class="challenge-icon">⚠</div>
            <h3>Shared package discipline</h3>
            <p>Breaking changes to shared packages impact multiple teams. This requires review discipline and compatibility mindset.</p>
          </article>
          <article class="challenge-card">
            <div class="challenge-icon">⚠</div>
            <h3>Repository permissions</h3>
            <p>File-level access control is harder in one repository. CODEOWNERS helps but is not foolproof.</p>
          </article>
          <article class="challenge-card">
            <div class="challenge-icon">⚠</div>
            <h3>Onboarding complexity</h3>
            <p>New developers need to understand the monorepo structure, boundary rules, and shared package APIs.</p>
          </article>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:layers-outline"></span> Key implementation rules</h2>
        <ul class="rules-list">
          <li><strong>Module boundaries:</strong> Apps import from packages and services only, never from other apps.</li>
          <li><strong>Shared packages are APIs:</strong> Treat them with the same care as external libraries. Version changes need review.</li>
          <li><strong>Ownership:</strong> Each package has an explicit owner. Shared changes need owner approval.</li>
          <li><strong>Affected validation:</strong> Run lint/build/test only on projects that are actually affected by changes.</li>
          <li><strong>Standardized scripts:</strong> npm run dev:user, npm run dev:admin for consistent developer experience.</li>
        </ul>
      </section>

      <section class="section insight">
        <h2><span class="iconify" data-icon="mdi:lightbulb-on-outline"></span> Key lesson</h2>
        <div class="insight-box">
          Monorepo is <strong>not about putting everything in one place</strong>. It's about managing interdependencies
          intelligently. The tool (Nx) handles the mechanics. Your organization and discipline handle success.
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page { padding: 2rem 1.5rem; max-width: 1440px; margin: 0 auto; }
    
    .hero { margin-bottom: 1.5rem; padding: 1.5rem; border-radius: 1rem; border: 1px solid #d7e3f7; background: linear-gradient(135deg, #eef4ff 0%, #ffffff 70%); }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    h1 { font-size: 2rem; color: #0f172a; margin-bottom: 0.75rem; }
    .subtitle { color: #334155; line-height: 1.7; max-width: 920px; font-size: 0.95rem; }
    
    .section { margin-top: 2rem; }
    h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #0f172a; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
    
    .architecture { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.2rem; }
    .arch-column { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.9rem; padding: 1.2rem; }
    .arch-column h3 { color: #0f172a; font-size: 0.95rem; margin: 0 0 0.8rem 0; font-weight: 700; }
    .arch-column ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.5rem; }
    .arch-column li { color: #334155; font-size: 0.85rem; padding-left: 1.2rem; position: relative; }
    .arch-column li::before { content: "→"; position: absolute; left: 0; color: #2563eb; font-weight: 700; }
    
    .tooling-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
    .tool-card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.9rem; padding: 1.2rem; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); }
    .tool-card h3 { color: #0f172a; font-size: 0.95rem; margin: 0 0 0.6rem 0; font-weight: 700; }
    .tool-card p { color: #334155; font-size: 0.85rem; line-height: 1.6; margin: 0; }
    
    .wins-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .win-card { background: #ffffff; border: 1px solid #dbe3ef; border-left: 4px solid #16a34a; border-radius: 0.9rem; padding: 1.2rem; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); }
    .win-icon { font-size: 1.8rem; color: #16a34a; font-weight: 700; margin-bottom: 0.5rem; }
    .win-card h3 { color: #0f172a; font-size: 0.95rem; margin: 0 0 0.6rem 0; font-weight: 700; }
    .win-card p { color: #334155; font-size: 0.85rem; line-height: 1.6; margin: 0; }
    
    .challenges-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .challenge-card { background: #ffffff; border: 1px solid #dbe3ef; border-left: 4px solid #dc2626; border-radius: 0.9rem; padding: 1.2rem; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); }
    .challenge-icon { font-size: 1.6rem; margin-bottom: 0.5rem; }
    .challenge-card h3 { color: #0f172a; font-size: 0.95rem; margin: 0 0 0.6rem 0; font-weight: 700; }
    .challenge-card p { color: #334155; font-size: 0.85rem; line-height: 1.6; margin: 0; }
    
    .rules-list { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.9rem; padding: 1.3rem; margin: 0; list-style: none; display: grid; gap: 0.8rem; }
    .rules-list li { color: #334155; font-size: 0.9rem; line-height: 1.7; }
    .rules-list strong { color: #0f172a; font-weight: 700; }
    
    .insight { background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%); border: 1px solid #cfe0ff; border-radius: 1rem; padding: 1.5rem; }
    .insight-box { background: #ffffff; border: 1px solid #bfdbfe; border-radius: 0.75rem; padding: 1.2rem; color: #1e293b; font-size: 0.95rem; line-height: 1.8; }
    .insight-box strong { font-weight: 700; color: #0f172a; }
    
    @media (max-width: 1024px) {
      .page { padding: 1.5rem; }
      h1 { font-size: 1.7rem; }
      .architecture, .tooling-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class RepoProofComponent {}
