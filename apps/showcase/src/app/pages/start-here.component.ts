import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-start-here',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Monorepo POC</p>
        <h1>Understanding Monorepo Architecture</h1>
        <p class="subtitle">
          Learn whether monorepo is right for your engineering team. We'll explore the concept,
          trade-offs, practical scenarios, and showcase a working POC implementation.
        </p>
      </header>

      <section class="section">
        <h2><span class="iconify" data-icon="mdi:layers-outline"></span> Choose your path</h2>
        <div class="journey-cards">
          <article class="journey-card clickable" routerLink="/monorepo">
            <div class="card-header">
              <span class="iconify card-icon" data-icon="mdi:source-repository"></span>
              <h3>1. Monorepo Concept</h3>
            </div>
            <p class="card-desc">What monorepo is, real-world examples, and when it's effective.</p>
            <p class="card-cta">→ Learn the fundamentals</p>
          </article>

          <article class="journey-card clickable" routerLink="/pros-cons">
            <div class="card-header">
              <span class="iconify card-icon" data-icon="mdi:scale-balance"></span>
              <h3>2. Pros & Cons</h3>
            </div>
            <p class="card-desc">Real development scenarios: team dynamics, deployment speed, visibility.</p>
            <p class="card-cta">→ Explore trade-offs</p>
          </article>

          <article class="journey-card clickable" routerLink="/poc">
            <div class="card-header">
              <span class="iconify card-icon" data-icon="mdi:check-decagram-outline"></span>
              <h3>3. Our POC</h3>
            </div>
            <p class="card-desc">Concrete example: what we built, what worked, and what we learned.</p>
            <p class="card-cta">→ See the implementation</p>
          </article>

          <article class="journey-card clickable" routerLink="/common-questions">
            <div class="card-header">
              <span class="iconify card-icon" data-icon="mdi:help-circle-outline"></span>
              <h3>4. Common Questions</h3>
            </div>
            <p class="card-desc">Practical answers: building, testing, deployment, and access control.</p>
            <p class="card-cta">→ Get quick answers</p>
          </article>

          <article class="journey-card clickable" routerLink="/why-polyrepo">
            <div class="card-header">
              <span class="iconify card-icon" data-icon="mdi:source-branch-remove"></span>
              <h3>5. Why Polyrepo?</h3>
            </div>
            <p class="card-desc">Not all teams need monorepo. When multiple repos are the better choice.</p>
            <p class="card-cta">→ Understand alternatives</p>
          </article>

          <article class="journey-card clickable" routerLink="/conclusion">
            <div class="card-header">
              <span class="iconify card-icon" data-icon="mdi:flag-checkered"></span>
              <h3>6. Conclusion</h3>
            </div>
            <p class="card-desc">Decision framework: is monorepo right for your team right now?</p>
            <p class="card-cta">→ Make an informed decision</p>
          </article>
        </div>
      </section>

      <section class="section info-block">
        <h2><span class="iconify" data-icon="mdi:lightbulb-on-outline"></span> What you'll understand</h2>
        <ul class="insight-list">
          <li><strong>The concept:</strong> What monorepo is and how it differs from polyrepo.</li>
          <li><strong>Real trade-offs:</strong> Speed, complexity, team dynamics, and governance trade-offs in development.</li>
          <li><strong>Practical evidence:</strong> A real POC implementation showing what's possible.</li>
          <li><strong>Decision criteria:</strong> How to evaluate whether monorepo fits your organization.</li>
        </ul>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page { padding: 2rem 1.5rem; max-width: 1440px; margin: 0 auto; }
    .hero { margin-bottom: 1rem; padding: 1.5rem; border-radius: 1rem; border: 1px solid #d7e3f7; background: linear-gradient(135deg, #eef4ff 0%, #ffffff 70%); }
    .eyebrow { font-size: 0.8rem; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    h1 { font-size: 2.1rem; color: #0f172a; margin-bottom: 0.75rem; }
    .subtitle { color: #334155; line-height: 1.7; max-width: 920px; font-size: 0.95rem; }
    
    .section { margin-top: 2rem; }
    h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #0f172a; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
    
    .journey-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .journey-card { 
      background: #ffffff; 
      border: 1.5px solid #dbe3ef; 
      border-radius: 0.9rem; 
      padding: 1.3rem; 
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
      transition: all 0.2s ease;
    }
    .journey-card.clickable { cursor: pointer; }
    .journey-card.clickable:hover { 
      border-color: #2563eb; 
      box-shadow: 0 12px 28px rgba(37, 99, 235, 0.15);
      transform: translateY(-2px);
    }
    .card-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.8rem; }
    .card-icon { font-size: 1.8rem; color: #2563eb; flex-shrink: 0; }
    h3 { color: #0f172a; font-size: 1rem; margin: 0; font-weight: 700; }
    .card-desc { color: #334155; font-size: 0.85rem; line-height: 1.6; margin: 0.6rem 0 0 0; }
    .card-cta { color: #2563eb; font-size: 0.8rem; font-weight: 600; margin: 0.8rem 0 0 0; }
    
    .info-block { background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%); border: 1px solid #cfe0ff; border-radius: 1rem; padding: 1.5rem; }
    .insight-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.8rem; }
    .insight-list li { color: #334155; font-size: 0.9rem; line-height: 1.7; }
    .insight-list strong { color: #0f172a; font-weight: 700; }
    
    @media (max-width: 1024px) {
      .page { padding: 1.5rem; }
      h1 { font-size: 1.8rem; }
      .journey-cards { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.8rem; }
    }
  `],
})
export class StartHereComponent {}
