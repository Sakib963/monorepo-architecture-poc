import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface QuestionItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-implementation-walkthrough',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Common Questions</p>
        <h1>Operational Questions We Needed to Resolve</h1>
        <p class="subtitle">
          Practical questions raised in meetings, with direct answers for build scope,
          app-only changes, permissions, and release safety.
        </p>
      </header>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:alert-decagram-outline"></span> Problem (real situation)</h2>
        <div class="card">Teams were unsure when to run full builds, when app-only deploys are safe, and how permissions should work in one repo.</div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:timeline-alert-outline"></span> Why it matters</h2>
        <div class="card">Operational ambiguity slows delivery, increases review cycles, and creates release risk under pressure.</div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:source-branch"></span> What we did (monorepo approach)</h2>
        <div class="card">Defined affected-task workflow, role-based local commands, owner approvals, and shared-package compatibility policy.</div>
      </section>

      <section class="section quick-commands">
        <h2><span class="iconify" data-icon="mdi:terminal"></span> What improved</h2>
        <div class="cmd-grid">
          <pre>npx nx affected -t lint build test</pre>
          <pre>npm run dev:user</pre>
          <pre>npm run dev:admin</pre>
          <pre>npm run dev:backend</pre>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:alert-outline"></span> Trade-offs</h2>
        <div class="card warning">Operational consistency requires process compliance. Bypassing affected flow or owner review reintroduces risk quickly.</div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:help-circle-outline"></span> Practical Q&A</h2>
        <div class="steps">
          <article class="step-card" *ngFor="let item of questions; let idx = index">
            <div class="step-index">Q{{ idx + 1 }}</div>
            <div class="step-content">
              <h3>{{ item.question }}</h3>
              <p>{{ item.answer }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:lightbulb-on-outline"></span> Key insight</h2>
        <div class="card insight">Monorepo becomes developer-friendly only when operational questions are standardized into repeatable workflow rules.</div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1240px; margin: 0 auto; }
    .hero { margin-bottom: 1rem; padding: 1.2rem; border-radius: 1rem; border: 1px solid #d7e3f7; background: linear-gradient(135deg, #eef4ff 0%, #ffffff 70%); }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    h1 { font-size: 1.9rem; color: #0f172a; margin-bottom: 0.75rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 760px; }
    .section { margin-top: 1rem; }
    h2 { display: flex; align-items: center; gap: 0.45rem; font-size: 0.9rem; color: #1e293b; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.8rem; padding: 0.9rem; color: #334155; font-size: 0.84rem; line-height: 1.55; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04); }
    .steps { display: grid; gap: 0.85rem; }
    .step-card { display: grid; grid-template-columns: 2.2rem 1fr; gap: 0.8rem; background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04); }
    .step-index { width: 2.1rem; height: 2.1rem; border-radius: 9999px; border: 1px solid #c8daf7; color: #2563eb; display: grid; place-items: center; font-weight: 700; }
    h3 { color: #0f172a; margin-bottom: 0.45rem; font-size: 0.95rem; }
    .cmd-grid { display: grid; gap: 0.65rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    pre { background: #eff5ff; border: 1px solid #dbe3ef; border-radius: 0.55rem; padding: 0.55rem 0.65rem; color: #1d4ed8; font-size: 0.76rem; overflow-x: auto; margin: 0; }
    p { color: #334155; font-size: 0.82rem; line-height: 1.6; }
    .warning { border-left: 4px solid #d97706; }
    .insight { border-left: 4px solid #2563eb; background: #f8fbff; }
  `],
})
export class ImplementationWalkthroughComponent {
  questions: QuestionItem[] = [
    {
      question: 'If someone changes only ib-web (one portal), do we need to build everything?',
      answer: 'No. Use affected tasks so only dependent projects are linted, built, and tested.',
    },
    {
      question: 'Do developers need to run every app locally?',
      answer: 'No. Run only the app/service relevant to your role (`dev:user`, `dev:admin`, or `dev:backend`).',
    },
    {
      question: 'How do we manage permissions in one repo if everyone can see code?',
      answer: 'Use CODEOWNERS, branch protection, CI approval policy, and deploy-role separation. Visibility and permission are different controls.',
    },
    {
      question: 'What happens when a shared package changes?',
      answer: 'Treat shared packages as public APIs: enforce compatibility review and run affected checks for all consumers.',
    },
    {
      question: 'How do we keep deployments safe?',
      answer: 'Deploy impacted artifacts only, use feature flags for gradual rollout, and keep rollback playbooks current.',
    },
  ];
}
