import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FEATURE_FLAGS, getFlag, getEnabledFlags } from '@poc/feature-flags';
import type { FeatureFlags } from '@poc/feature-flags';

type FlagEntry = { key: keyof FeatureFlags; value: boolean; scope: string };

@Component({
  selector: 'app-flags-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="pkg-badge">&#64;poc/feature-flags</div>
        <h1>Feature Flags</h1>
        <p class="page-desc">
          All flags are defined in <strong>packages/feature-flags/src/flags.ts</strong>.
          Change one value → every app and service that imports <code>&#64;poc/feature-flags</code>
          reflects the change immediately. No environment variables. No per-team config files to sync.
        </p>
      </div>

      <section class="section">
        <h2 class="section-title">Currently Active Flags ({{ enabledCount }} / {{ totalCount }} enabled)</h2>
        <div class="flag-grid">
          <div *ngFor="let entry of flagEntries" class="flag-row" [class.on]="entry.value" [class.off]="!entry.value">
            <div class="flag-status">{{ entry.value ? '●' : '○' }}</div>
            <div class="flag-key">{{ entry.key }}</div>
            <div class="flag-scope">{{ entry.scope }}</div>
            <div class="flag-val" [class.val-on]="entry.value" [class.val-off]="!entry.value">
              {{ entry.value ? 'ENABLED' : 'DISABLED' }}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Gate Demo — USER_SELF_REGISTRATION</h2>
        <p class="description">
          The create-user route in <code>user-service</code> checks this flag before processing.
          The React app also hides the create form when it's off.
        </p>
        <div class="gate-demo">
          <div class="gate-value">
            <code>getFlag('USER_SELF_REGISTRATION')</code> →
            <strong [class.on-text]="selfRegFlag" [class.off-text]="!selfRegFlag">
              {{ selfRegFlag }}
            </strong>
          </div>
          <div class="gate-result" [class.gate-pass]="selfRegFlag" [class.gate-block]="!selfRegFlag">
            <div *ngIf="selfRegFlag">✅ Registration is open — POST /users returns 201</div>
            <div *ngIf="!selfRegFlag">🚫 Registration blocked — POST /users returns 403</div>
          </div>
          <p class="hint">
            To toggle: open <code>packages/feature-flags/src/flags.ts</code> and change
            <code>USER_SELF_REGISTRATION</code> to <code>false</code>. All apps rebuild automatically.
          </p>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Where Each Flag Is Used</h2>
        <div class="usage-table">
          <div class="usage-header">
            <span>Flag</span><span>Frontend Gate</span><span>Service Gate</span>
          </div>
          <div *ngFor="let u of usageExamples" class="usage-row">
            <code class="usage-flag">{{ u.flag }}</code>
            <span class="usage-loc">{{ u.frontend }}</span>
            <span class="usage-loc">{{ u.service }}</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; }
    .page-header { margin-bottom: 2.5rem; }
    .pkg-badge { display: inline-block; font-family: monospace; font-size: 0.75rem; font-weight: 700;
                 background: #2d1515; color: #fc8181; padding: 0.25rem 0.75rem; border-radius: 9999px; margin-bottom: 0.75rem; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #e2e8f0; margin-bottom: 0.75rem; }
    .page-desc { font-size: 0.9rem; color: #718096; max-width: 620px; line-height: 1.7; }
    .page-desc strong { color: #a0aec0; font-family: monospace; font-size: 0.85rem; }

    .section { margin-bottom: 2.5rem; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: #a0aec0;
                     text-transform: uppercase; letter-spacing: 0.07em;
                     margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1e2535; }
    .description { font-size: 0.875rem; color: #718096; margin-bottom: 1rem; line-height: 1.6; }
    code { background: #1e2535; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.8rem; color: #a0aec0; }

    .flag-grid { display: flex; flex-direction: column; gap: 0.3rem; }
    .flag-row { display: grid; grid-template-columns: 1.5rem 1fr auto auto;
                align-items: center; gap: 1rem;
                padding: 0.5rem 0.75rem; border-radius: 0.375rem;
                background: #161b27; border: 1px solid #1e2535;
                font-size: 0.8rem; }
    .flag-row.on { border-left: 3px solid #68d391; }
    .flag-row.off { border-left: 3px solid #2d3748; opacity: 0.6; }
    .flag-status { color: #68d391; font-size: 0.6rem; }
    .flag-row.off .flag-status { color: #4a5568; }
    .flag-key { font-family: monospace; color: #e2e8f0; }
    .flag-scope { font-size: 0.7rem; color: #4a5568; }
    .val-on { color: #68d391; font-weight: 700; font-size: 0.7rem; }
    .val-off { color: #4a5568; font-size: 0.7rem; }

    .gate-demo { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem; padding: 1.25rem; }
    .gate-value { font-size: 0.875rem; color: #a0aec0; margin-bottom: 0.75rem; }
    .on-text { color: #68d391; font-family: monospace; }
    .off-text { color: #fc8181; font-family: monospace; }
    .gate-result { padding: 0.6rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; margin-bottom: 0.75rem; }
    .gate-pass { background: #1a3324; color: #68d391; }
    .gate-block { background: #2d1515; color: #fc8181; }
    .hint { font-size: 0.78rem; color: #4a5568; line-height: 1.5; }

    .usage-table { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem; overflow: hidden; }
    .usage-header { display: grid; grid-template-columns: 2fr 1fr 1fr;
                    gap: 1rem; padding: 0.6rem 1rem;
                    font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.05em; color: #4a5568; background: #0f1117; }
    .usage-row { display: grid; grid-template-columns: 2fr 1fr 1fr;
                 gap: 1rem; padding: 0.6rem 1rem; border-top: 1px solid #1e2535;
                 font-size: 0.8rem; align-items: center; }
    .usage-flag { font-size: 0.72rem; }
    .usage-loc { color: #718096; font-size: 0.75rem; }
  `],
})
export class FlagsDemoComponent {
  selfRegFlag = getFlag('USER_SELF_REGISTRATION');
  enabledFlags = getEnabledFlags();

  flagEntries: FlagEntry[] = (Object.entries(FEATURE_FLAGS) as [keyof FeatureFlags, boolean][]).map(([key, value]) => ({
    key,
    value,
    scope: key.split('_')[0],
  }));

  get enabledCount() { return this.flagEntries.filter(f => f.value).length; }
  get totalCount() { return this.flagEntries.length; }

  usageExamples = [
    { flag: 'USER_SELF_REGISTRATION', frontend: 'Hide create-user form', service: 'user-service POST /users → 403' },
    { flag: 'USER_ROLE_MANAGER_ENABLED', frontend: 'Hide MANAGER option in role select', service: 'Not gated — UI-only' },
    { flag: 'NOTIFY_SMS', frontend: 'Hide SMS channel option', service: 'notification-service → 403 if type=SMS' },
    { flag: 'ORDER_PROMO_CODES', frontend: 'Hide promo code input field', service: 'order-service rejects promo payload' },
    { flag: 'CORE_MAINTENANCE_MODE', frontend: 'Show maintenance banner', service: 'All services return 503' },
  ];
}
