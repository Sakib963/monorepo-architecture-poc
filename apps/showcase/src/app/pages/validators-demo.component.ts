import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { validate, createUserSchema, getFieldError } from '@poc/validators';
import type { ValidationResult } from '@poc/validators';

@Component({
  selector: 'app-validators-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="pkg-badge">&#64;poc/validators</div>
        <h1>Shared Validators</h1>
        <p class="page-desc">
          Zod schemas defined in <strong>packages/validators/src/schemas.ts</strong> run
          identically in the browser (this form) and in <strong>user-service</strong> (the Express API).
          One schema — zero duplication.
        </p>
      </div>

      <section class="section">
        <h2 class="section-title">Live Demo — Browser-side Validation</h2>
        <div class="demo-split">
          <!-- Live form -->
          <div class="form-panel">
            <div class="form-note">
              Type invalid values to see Zod errors rendered directly from <code>&#64;poc/validators</code>
            </div>
            <div class="field">
              <label>First Name</label>
              <input [(ngModel)]="fields.firstName" (input)="runValidation()" [class.has-error]="fieldError('firstName')" placeholder="Alice" />
              <span class="err" *ngIf="fieldError('firstName')">{{ fieldError('firstName') }}</span>
            </div>
            <div class="field">
              <label>Last Name</label>
              <input [(ngModel)]="fields.lastName" (input)="runValidation()" [class.has-error]="fieldError('lastName')" placeholder="Chen" />
              <span class="err" *ngIf="fieldError('lastName')">{{ fieldError('lastName') }}</span>
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" [(ngModel)]="fields.email" (input)="runValidation()" [class.has-error]="fieldError('email')" placeholder="alice@example.com" />
              <span class="err" *ngIf="fieldError('email')">{{ fieldError('email') }}</span>
            </div>
            <div class="field">
              <label>Password</label>
              <input type="password" [(ngModel)]="fields.password" (input)="runValidation()" [class.has-error]="fieldError('password')" placeholder="Min 8 chars, upper, number, symbol" />
              <span class="err" *ngIf="fieldError('password')">{{ fieldError('password') }}</span>
            </div>
            <div class="result-indicator" [class.valid]="validResult?.success" [class.invalid]="validResult && !validResult.success">
              <span *ngIf="validResult?.success">✅ All fields valid — same result the server will get</span>
              <span *ngIf="validResult && !validResult.success">❌ {{ validResult.errors.length }} error(s) — server would also reject this</span>
              <span *ngIf="!validResult">ℹ Type above to validate</span>
            </div>
          </div>

          <!-- Schema code -->
          <div>
            <div class="code-label">packages/validators/src/schemas.ts (condensed)</div>
            <pre class="code">{{ schemaCode }}</pre>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">How It Works</h2>
        <div class="flow">
          <div class="flow-step">
            <div class="flow-num">1</div>
            <div>
              <strong>Schema defined once</strong><br />
              <code>createUserSchema</code> in <code>packages/validators/</code>
            </div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <div class="flow-num">2</div>
            <div>
              <strong>Frontend calls</strong><br />
              <code>validate(createUserSchema, formData)</code><br />
              Returns field-level errors for form display
            </div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <div class="flow-num">3</div>
            <div>
              <strong>Backend calls</strong><br />
              <code>validate(createUserSchema, req.body)</code><br />
              Returns 422 with identical error format
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; }
    .page-header { margin-bottom: 2.5rem; }
    .pkg-badge { display: inline-block; font-family: monospace; font-size: 0.75rem; font-weight: 700;
                 background: #1a3324; color: #68d391; padding: 0.25rem 0.75rem; border-radius: 9999px; margin-bottom: 0.75rem; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #e2e8f0; margin-bottom: 0.75rem; }
    .page-desc { font-size: 0.9rem; color: #718096; max-width: 620px; line-height: 1.7; }
    .page-desc strong { color: #a0aec0; font-family: monospace; font-size: 0.85rem; }
    
    .section { margin-bottom: 2.5rem; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: #a0aec0;
                     text-transform: uppercase; letter-spacing: 0.07em;
                     margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1e2535; }
    code { background: #1e2535; padding: 0.15rem 0.4rem; border-radius: 0.25rem;
           font-size: 0.8rem; color: #a0aec0; }

    .demo-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media(max-width:700px){ .demo-split { grid-template-columns:1fr; } }
    .code-label { font-size: 0.7rem; color: #4a5568; margin-bottom: 0.4rem; font-family: monospace; }
    .code { background: #161b27; border: 1px solid #1e2535; border-radius: 0.375rem;
            padding: 1rem; font-size: 0.75rem; color: #a0aec0; overflow-x: auto;
            white-space: pre; line-height: 1.6; }
    
    .form-panel { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem; padding: 1.25rem; }
    .form-note { font-size: 0.78rem; color: #718096; margin-bottom: 1rem; line-height: 1.5; }
    .field { margin-bottom: 0.75rem; }
    .field label { display: block; font-size: 0.75rem; font-weight: 600; color: #718096; margin-bottom: 0.3rem; }
    .field input {
      width: 100%; padding: 0.5rem 0.75rem; background: #0f1117; border: 1px solid #2d3748;
      border-radius: 0.375rem; color: #e2e8f0; font-size: 0.875rem; outline: none;
      transition: border 0.15s;
    }
    .field input:focus { border-color: #63b3ed; }
    .field input.has-error { border-color: #fc8181; }
    .err { font-size: 0.75rem; color: #fc8181; margin-top: 0.2rem; display: block; }
    .result-indicator { margin-top: 1rem; padding: 0.6rem 0.75rem; border-radius: 0.375rem;
                        font-size: 0.8rem; background: #0f1117; color: #718096;
                        border: 1px solid #1e2535; }
    .result-indicator.valid { background: #1a3324; color: #68d391; border-color: #276749; }
    .result-indicator.invalid { background: #2d1515; color: #fc8181; border-color: #c53030; }

    .flow { display: flex; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap; }
    .flow-step { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem;
                 padding: 0.75rem 1rem; font-size: 0.8rem; color: #a0aec0; flex: 1; min-width: 180px; }
    .flow-step strong { color: #e2e8f0; display: block; margin-bottom: 0.3rem; }
    .flow-num { width: 1.5rem; height: 1.5rem; background: #68d391; color: #0f1117;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-weight: 800; font-size: 0.75rem; margin-bottom: 0.5rem; }
    .flow-arrow { color: #4a5568; font-size: 1.25rem; padding-top: 1.5rem; }
  `],
})
export class ValidatorsDemoComponent {
  fields = { email: '', password: '', firstName: '', lastName: '' };
  validResult: ValidationResult<unknown> | null = null;

  runValidation(): void {
    if (!this.fields.email && !this.fields.firstName && !this.fields.password && !this.fields.lastName) {
      this.validResult = null;
      return;
    }
    this.validResult = validate(createUserSchema, this.fields);
  }

  fieldError(field: string): string | null {
    if (!this.validResult) return null;
    return getFieldError(this.validResult, field);
  }

  schemaCode = `import { z } from 'zod';

export const createUserSchema = z.object({
  email:     z.string().email('Must be a valid email'),
  password:  z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a symbol'),
  firstName: z.string().min(1, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
});

// The same schema runs here (browser) AND in user-service
export function validate<T>(schema, data): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data, errors: [] };
  return { success: false, errors: flattenZodErrors(result.error) };
}`;
}
