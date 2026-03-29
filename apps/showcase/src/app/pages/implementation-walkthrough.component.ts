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
        <h1>Operational Q&A for Our Teams</h1>
        <p class="subtitle">
          Practical questions raised in meetings, with direct answers for build scope,
          app-only changes, permissions, and release safety.
        </p>
      </header>

      <section class="section quick-commands">
        <h2>Most used commands</h2>
        <div class="cmd-grid">
          <pre>npx nx affected -t lint build test</pre>
          <pre>npm run dev:user</pre>
          <pre>npm run dev:admin</pre>
          <pre>npm run dev:backend</pre>
        </div>
      </section>

      <section class="section">
        <h2>Q&A</h2>
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
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1240px; margin: 0 auto; }
    .hero { margin-bottom: 2rem; }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    h1 { font-size: 1.9rem; color: #0f172a; margin-bottom: 0.75rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 760px; }
    .section { margin-top: 2rem; }
    h2 { font-size: 1rem; color: #1e293b; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .steps { display: grid; gap: 0.85rem; }
    .step-card { display: grid; grid-template-columns: 2.2rem 1fr; gap: 0.8rem; background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04); }
    .step-index { width: 2.1rem; height: 2.1rem; border-radius: 9999px; border: 1px solid #c8daf7; color: #2563eb; display: grid; place-items: center; font-weight: 700; }
    h3 { color: #0f172a; margin-bottom: 0.45rem; font-size: 0.95rem; }
    .cmd-grid { display: grid; gap: 0.65rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    pre { background: #eff5ff; border: 1px solid #dbe3ef; border-radius: 0.55rem; padding: 0.55rem 0.65rem; color: #1d4ed8; font-size: 0.76rem; overflow-x: auto; margin: 0; }
    p { color: #334155; font-size: 0.82rem; line-height: 1.6; }
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
