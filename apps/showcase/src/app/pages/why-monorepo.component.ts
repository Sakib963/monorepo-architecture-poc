import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-monorepo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Monorepo Fundamentals</p>
        <h1>What is a Monorepo?</h1>
        <p class="subtitle">
          A monorepo (monolithic repository) is a version control strategy where multiple logical projects
          coexist in a single repository. It's not about putting everything in one place—it's about managing
          interdependencies intelligently.
        </p>
      </header>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:lightbulb-on-outline"></span> The core idea</h2>
        <div class="content-block">
          <p>
            Instead of maintaining separate repositories for separate services/packages, a monorepo uses a single repository
            with clear boundaries between logical modules. Each module can be developed, tested, and deployed independently,
            but they share the same version control history and can reference shared packages directly.
          </p>
          <div class="example-visual">
            <div class="example-item">
              <strong>Polyrepo</strong><br/>
              user-service repo<br/>notification-service repo<br/>ui-library repo<br/>types repo
            </div>
            <span class="arrow-icon">
              <span class="iconify" data-icon="mdi:arrow-right-bold"></span>
            </span>
            <div class="example-item">
              <strong>Monorepo</strong><br/>
              ├── services/<br/>
              │   ├── user-service<br/>
              │   └── notification-service<br/>
              ├── packages/<br/>
              │   ├── ui-library<br/>
              │   └── types
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:earth"></span> Real-world examples</h2>
        <div class="examples-grid">
          <article class="example-card">
            <h3>Google</h3>
            <p>Billions of lines of code in one repository (Piper). Serves Android, Chrome, Google Cloud, and more.</p>
          </article>
          <article class="example-card">
            <h3>Meta (Facebook)</h3>
            <p>Monorepo for web, mobile, and backend. Millions of commits with sophisticated tooling (Watchman, Buck).</p>
          </article>
          <article class="example-card">
            <h3>Microsoft</h3>
            <p>Office, Windows, and other products in monorepos for coordinated delivery across platforms.</p>
          </article>
          <article class="example-card">
            <h3>Nx & Angular</h3>
            <p>Open-source projects using monorepo structure (nx.dev, angular in a monorepo). Good reference implementations.</p>
          </article>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:check-circle-outline"></span> When monorepo is effective</h2>
        <div class="effectiveness-grid">
          <article class="effectiveness-card good">
            <div class="card-indicator">✓</div>
            <h3>Shared code across projects</h3>
            <p>Multiple apps share domain logic, types, or utilities that change frequently together.</p>
          </article>
          <article class="effectiveness-card good">
            <div class="card-indicator">✓</div>
            <h3>Coordinated releases</h3>
            <p>APIs and consumers need to evolve together. Breaking changes can be applied atomically.</p>
          </article>
          <article class="effectiveness-card good">
            <div class="card-indicator">✓</div>
            <h3>Team coordination overhead</h3>
            <p>Multiple teams need to move fast without waiting for cross-repo coordination and version bumps.</p>
          </article>
          <article class="effectiveness-card good">
            <div class="card-indicator">✓</div>
            <h3>Visibility and consistency</h3>
            <p>Teams benefit from seeing how others solve problems and enforcing consistent standards.</p>
          </article>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:alert-circle-outline"></span> When monorepo is ineffective</h2>
        <div class="ineffectiveness-grid">
          <article class="ineffectiveness-card bad">
            <div class="card-indicator">✗</div>
            <h3>Independent projects</h3>
            <p>Projects are unrelated and rarely share code. They don't need coordinated releases.</p>
          </article>
          <article class="ineffectiveness-card bad">
            <div class="card-indicator">✗</div>
            <h3>Weak governance</h3>
            <p>Teams cannot agree on boundaries, naming conventions, or deployment discipline.</p>
          </article>
          <article class="ineffectiveness-card bad">
            <div class="card-indicator">✗</div>
            <h3>Scale and performance</h3>
            <p>Repository gets so large that cloning, searching, and CI/CD become bottlenecks.</p>
          </article>
          <article class="ineffectiveness-card bad">
            <div class="card-indicator">✗</div>
            <h3>Different tech stacks</h3>
            <p>Projects use completely different languages and build systems with no shared infrastructure.</p>
          </article>
        </div>
      </section>

      <section class="section insight">
        <h2><span class="iconify" data-icon="mdi:brain"></span> Key insight</h2>
        <div class="insight-box">
          Monorepo is not a tool choice; it's an organizational decision. It works when teams commit to
          shared standards and governance. Without that, a monorepo multiplies your complexity.
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
    
    .content-block { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.9rem; padding: 1.5rem; }
    .content-block p { color: #334155; font-size: 0.95rem; line-height: 1.8; margin: 0 0 1.2rem 0; }
    
    .example-visual { display: flex; align-items: center; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem; }
    .example-item {
      background: #f1f5fb;
      border: 1px solid #dbe3ef;
      border-radius: 0.75rem;
      padding: 1rem;
      font-size: 0.85rem;
      color: #334155;
      font-family: monospace;
      white-space: pre-wrap;
      flex: 1;
      min-width: 180px;
    }
    .example-item strong { color: #0f172a; font-weight: 700; display: block; margin-bottom: 0.5rem; }
    .arrow-icon { color: #2563eb; font-size: 1.5rem; }
    
    .examples-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
    .example-card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.9rem; padding: 1.3rem; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); }
    .example-card h3 { color: #0f172a; font-size: 1rem; margin: 0 0 0.6rem 0; font-weight: 700; }
    .example-card p { color: #334155; font-size: 0.85rem; line-height: 1.6; margin: 0; }
    
    .effectiveness-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .effectiveness-card { background: #ffffff; border: 1px solid #dbe3ef; border-left: 4px solid #16a34a; border-radius: 0.9rem; padding: 1.3rem; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); }
    .card-indicator { font-size: 1.6rem; color: #16a34a; font-weight: 700; margin-bottom: 0.5rem; }
    .effectiveness-card h3 { color: #0f172a; font-size: 0.95rem; margin: 0 0 0.6rem 0; font-weight: 700; }
    .effectiveness-card p { color: #334155; font-size: 0.85rem; line-height: 1.6; margin: 0; }
    
    .ineffectiveness-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .ineffectiveness-card { background: #ffffff; border: 1px solid #dbe3ef; border-left: 4px solid #dc2626; border-radius: 0.9rem; padding: 1.3rem; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); }
    .ineffectiveness-card h3 { color: #0f172a; font-size: 0.95rem; margin: 0 0 0.6rem 0; font-weight: 700; }
    .ineffectiveness-card p { color: #334155; font-size: 0.85rem; line-height: 1.6; margin: 0; }
    
    .insight { background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%); border: 1px solid #cfe0ff; border-radius: 1rem; padding: 1.5rem; }
    .insight-box { background: #ffffff; border: 1px solid #bfdbfe; border-radius: 0.75rem; padding: 1.2rem; color: #1e293b; font-size: 0.95rem; line-height: 1.7; font-weight: 500; }
    
    @media (max-width: 1024px) {
      .page { padding: 1.5rem; }
      h1 { font-size: 1.7rem; }
      .example-visual { gap: 1rem; }
      .effectiveness-grid, .ineffectiveness-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    }
  `],
})
export class WhyMonorepoComponent {}
