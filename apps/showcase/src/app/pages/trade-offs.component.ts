import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trade-offs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Development Scenarios</p>
        <h1>Monorepo Pros & Cons: Real Scenarios</h1>
        <p class="subtitle">
          Monorepo makes some things easier and other things hard. These aren't abstract trade-offs—
          they're real daily developer experience differences depending on your workflow.
        </p>
      </header>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:plus-circle-outline"></span> When monorepo helps (concrete advantages)</h2>
        
        <article class="scenario-card">
          <h3><span class="iconify scenario-icon" data-icon="mdi:code-braces"></span> Shared code changes</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> You update a utility that both a web app and mobile app depend on.</p>
          <p><strong>Polyrepo:</strong> Edit the utility repo → version bump → update both apps → test both → deploy in specific order.</p>
          <p><strong>Monorepo:</strong> Edit utility → CI tests all dependents → one PR, one merge. Done.</p>
        </article>

        <article class="scenario-card">
          <h3><span class="iconify scenario-icon" data-icon="mdi:folder-multiple"></span> Code discovery</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> A new team member needs to understand how similar problems are solved elsewhere.</p>
          <p><strong>Polyrepo:</strong> Search across 10 repos, check if they use the same patterns, coordinate with other teams.</p>
          <p><strong>Monorepo:</strong> Everything is visible in one place. See how others solved it, learn shared conventions.</p>
        </article>

        <article class="scenario-card">
          <h3><span class="iconify scenario-icon" data-icon="mdi:lightning-bolt"></span> Fast feedback loops</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> You change a shared library and want to know immediately if it breaks anything.</p>
          <p><strong>Polyrepo:</strong> Publish library → CD to registry → update app → run app's CI.</p>
          <p><strong>Monorepo:</strong> Push code → affected projects test instantly → know impact in seconds.</p>
        </article>

        <article class="scenario-card">
          <h3><span class="iconify scenario-icon" data-icon="mdi:sync"></span> Coordinated releases</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> API changes require synchronized updates across 3 frontend teams.</p>
          <p><strong>Polyrepo:</strong> Release API → coordinate with each team separately → handle partial rollouts → complex coordination.</p>
          <p><strong>Monorepo:</strong> Change API + consumers in one atomic commit. Test everything together. Release once.</p>
        </article>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:minus-circle-outline"></span> When monorepo adds friction (real costs)</h2>
        
        <article class="scenario-card bad">
          <h3><span class="iconify scenario-icon" data-icon="mdi:eye-off"></span> Reduced isolation</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> You only work on the deployment service, but CI tests the entire monorepo.</p>
          <p><strong>Benefit:</strong> You know you didn't break anything else. ✓</p>
          <p><strong>Cost:</strong> Longer CI pipelines, slower feedback, dependency on other teams' code quality. Build could fail for reasons outside your control.</p>
        </article>

        <article class="scenario-card bad">
          <h3><span class="iconify scenario-icon" data-icon="mdi:folder-lock"></span> Access control complexity</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> Mobile team should not see internal admin API code. Everyone has the same repo.</p>
          <p><strong>Benefit:</strong> Code reuse potential is maximized. ✓</p>
          <p><strong>Cost:</strong> File-level access control via CODEOWNERS, branch protection, or custom tooling. Harder to enforce.</p>
        </article>

        <article class="scenario-card bad">
          <h3><span class="iconify scenario-icon" data-icon="mdi:git"></span> Repository scale</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> Your monorepo has 500+ projects and gigabytes of history.</p>
          <p><strong>Benefit:</strong> Everything is coordinated and visible. ✓</p>
          <p><strong>Cost:</strong> Clone times, search speeds, and blame operations grow. Requires sophisticated tooling (sparse checkout, virtual file systems).</p>
        </article>

        <article class="scenario-card bad">
          <h3><span class="iconify scenario-icon" data-icon="mdi:merge-conflict"></span> Conflict resolution</h3>
          <p class="scenario-situation"><strong>Scenario:</strong> 4 teams merge competing changes to shared configuration or dependency versions.</p>
          <p><strong>Benefit:</strong> All teams see the same versions and dependencies. ✓</p>
          <p><strong>Cost:</strong> Merge conflicts increase. Requires clear convention on conflict resolution and dependency management.</p>
        </article>
      </section>

      <section class="section insight">
        <h2><span class="iconify" data-icon="mdi:brain"></span> The real pattern</h2>
        <div class="insight-box">
          <p>
            <strong>Monorepo reduces coordination friction at the cost of operational complexity.</strong>
          </p>
          <p style="margin-top: 0.8rem;">
            Choose monorepo if your teams have <strong>tight interdependencies</strong> (shared contracts, coordinated changes).
            <br/>
            Choose polyrepo if your teams are <strong>loosely coupled</strong> (independent releases, separate tech stacks).
          </p>
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
    
    .scenario-card { 
      background: #ffffff; 
      border: 1px solid #dbe3ef; 
      border-left: 4px solid #16a34a;
      border-radius: 0.9rem; 
      padding: 1.3rem;
      margin-bottom: 0.8rem;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    }
    .scenario-card.bad { border-left-color: #dc2626; }
    .scenario-card h3 { display: flex; align-items: center; gap: 0.6rem; color: #0f172a; font-size: 1rem; margin: 0 0 0.8rem 0; font-weight: 700; }
    .scenario-icon { font-size: 1.3rem; color: inherit; }
    .scenario-situation { color: #475569; font-size: 0.9rem; margin: 0 0 0.6rem 0; }
    .scenario-card p { color: #334155; font-size: 0.9rem; line-height: 1.7; margin: 0.5rem 0; }
    .scenario-card strong { color: #0f172a; font-weight: 700; }
    
    .insight { background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%); border: 1px solid #cfe0ff; border-radius: 1rem; padding: 1.5rem; }
    .insight-box { background: #ffffff; border: 1px solid #bfdbfe; border-radius: 0.75rem; padding: 1.3rem; color: #1e293b; font-size: 0.95rem; line-height: 1.8; }
    .insight-box p { margin: 0; }
    
    @media (max-width: 1024px) {
      .page { padding: 1.5rem; }
      h1 { font-size: 1.7rem; }
      .scenario-card h3 { font-size: 0.95rem; }
    }
  `],
})
export class TradeOffsComponent {}
