import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TopicCard {
  title: string;
  summary: string;
  icon: string;
  outcome: string;
}

@Component({
  selector: 'app-start-here',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Overview</p>
        <h1>Monorepo POC — Architecture Walkthrough</h1>
        <p class="subtitle">
          This walkthrough is designed for developers who are new to multi-application repositories.
          It covers architecture, trade-offs, operational workflow, and evidence from our banking portal POC.
        </p>
        <div class="hero-note">
          <span>Learning objective:</span>
          understand how monorepo works in practice, when it is effective, and which governance controls are mandatory.
        </div>
      </header>

      <section class="section">
        <h2>What we will discuss</h2>
        <div class="topic-grid">
          <article class="topic-card" *ngFor="let item of topics">
            <p class="topic-icon">{{ item.icon }}</p>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <p class="topic-outcome">Outcome: {{ item.outcome }}</p>
          </article>
        </div>
      </section>

      <section class="section">
        <h2>POC Snapshot</h2>
        <div class="metrics">
          <article class="metric-card" *ngFor="let m of metrics">
            <p class="metric-value">{{ m.value }}</p>
            <p class="metric-label">{{ m.label }}</p>
            <p class="metric-note">{{ m.note }}</p>
          </article>
        </div>
      </section>

      <section class="section">
        <h2>How to consume this presentation</h2>
        <div class="steps">
          <article class="step">1. Start with architecture and boundaries on the Monorepo page.</article>
          <article class="step">2. Review benefits and risks together on the Pros & Cons page.</article>
          <article class="step">3. Validate theory against our real case (effective and ineffective scenarios).</article>
          <article class="step">4. Use the Q&A page for day-to-day build, deploy, and permission decisions.</article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1240px; margin: 0 auto; }
    .hero { margin-bottom: 1.5rem; }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.45rem; }
    h1 { font-size: 2rem; color: #0f172a; margin-bottom: 0.7rem; }
    .subtitle { color: #334155; line-height: 1.65; max-width: 820px; }
    .hero-note {
      margin-top: 0.9rem;
      max-width: 880px;
      background: linear-gradient(135deg, #eef4ff 0%, #ffffff 70%);
      border: 1px solid #cfdcf7;
      border-radius: 0.75rem;
      padding: 0.75rem 0.85rem;
      color: #334155;
      font-size: 0.82rem;
      line-height: 1.5;
    }
    .hero-note span { color: #1d4ed8; font-weight: 700; }
    .section { margin-top: 1.6rem; }
    h2 { font-size: 0.95rem; color: #1e293b; margin-bottom: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; }

    .topic-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.8rem; }
    .topic-card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 0.95rem; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04); }
    .topic-icon { font-size: 1.2rem; margin-bottom: 0.35rem; }
    .topic-card h3 { color: #0f172a; font-size: 0.9rem; margin-bottom: 0.3rem; }
    .topic-card p { color: #334155; font-size: 0.8rem; line-height: 1.5; }
    .topic-outcome { margin-top: 0.5rem; color: #1d4ed8 !important; font-size: 0.75rem !important; font-weight: 600; }

    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.8rem; }
    .metric-card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 0.75rem; padding: 0.95rem; }
    .metric-value { color: #2563eb; font-size: 1.35rem; font-weight: 800; }
    .metric-label { color: #0f172a; font-size: 0.83rem; font-weight: 700; margin-top: 0.15rem; }
    .metric-note { color: #475569; font-size: 0.76rem; line-height: 1.45; margin-top: 0.3rem; }

    .steps { display: grid; gap: 0.65rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .step { background: #ffffff; border: 1px dashed #c6d4ef; border-radius: 0.65rem; padding: 0.75rem; color: #334155; font-size: 0.8rem; line-height: 1.45; }
  `],
})
export class StartHereComponent {
  topics: TopicCard[] = [
    { title: 'Monorepo Model', summary: 'Definition, structure, and dependency boundaries.', icon: '01', outcome: 'Understand the architecture and vocabulary.' },
    { title: 'Benefits', summary: 'Where delivery speed and consistency improve.', icon: '02', outcome: 'Identify concrete engineering advantages.' },
    { title: 'Risks', summary: 'Blast radius, governance overhead, and access concerns.', icon: '03', outcome: 'Recognize failure modes and controls.' },
    { title: 'POC Evidence', summary: 'What worked, what failed, and why.', icon: '04', outcome: 'Map architecture decisions to real outcomes.' },
  ];

  metrics = [
    { label: 'Portal Apps', value: '3', note: 'User, Admin, and Showcase applications in one workspace.' },
    { label: 'Backend Services', value: '3', note: 'Gateway plus domain services for user and notification flows.' },
    { label: 'Shared Packages', value: '7', note: 'Types, validators, API client, flags, events, UI, and config.' },
    { label: 'Main Decision', value: 'Governance', note: 'Monorepo success depends more on discipline than tools.' },
  ];
}
