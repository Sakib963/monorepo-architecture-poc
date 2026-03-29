import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CardComponent, ErrorStateComponent } from '@poc/ui-components';

interface ScenarioResult {
  status: 'idle' | 'running' | 'success' | 'error';
  message: string;
  traceId?: string;
}

@Component({
  selector: 'app-api-scenarios-demo',
  standalone: true,
  imports: [CommonModule, CardComponent, ErrorStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="page">
      <h1>API Scenarios</h1>
      <p class="desc">Interactive success/error/timeout/retry behavior proof route.</p>

      <poc-card title="Success scenario" subtitle="GET /flags through api-gateway" [bordered]="true">
        <poc-shared-button variant="secondary" (click)="runSuccess()" [attr.disabled]="success().status === 'running' ? '' : null">Run Success</poc-shared-button>
        <div class="result" [class.ok]="success().status === 'success'">{{ success().message }}</div>
      </poc-card>

      <poc-card title="Error scenario" subtitle="Expected 404 from unknown route" [bordered]="true">
        <poc-shared-button variant="danger" (click)="runError()" [attr.disabled]="error().status === 'running' ? '' : null">Run Error</poc-shared-button>
        <div class="result">{{ error().message }}</div>
        <poc-error-state *ngIf="error().status === 'error'" title="Error response captured" [message]="error().message" [traceId]="error().traceId"></poc-error-state>
      </poc-card>

      <poc-card title="Timeout + Retry" subtitle="First call timeout, second call succeeds" [bordered]="true">
        <poc-shared-button variant="ghost" (click)="runRetry()" [attr.disabled]="retry().status === 'running' ? '' : null">Run Timeout + Retry</poc-shared-button>
        <div class="result" [class.ok]="retry().status === 'success'">{{ retry().message }}</div>
      </poc-card>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; }
    h1 { color: #e2e8f0; margin-bottom: 0.35rem; }
    .desc { color: #94a3b8; margin-bottom: 1rem; }
    .result { margin-top: 0.7rem; color: #cbd5e1; font-size: 0.85rem; }
    .ok { color: #22c55e; }
  `],
})
export class ApiScenariosDemoComponent {
  readonly success = signal<ScenarioResult>({ status: 'idle', message: 'Not run yet' });
  readonly error = signal<ScenarioResult>({ status: 'idle', message: 'Not run yet' });
  readonly retry = signal<ScenarioResult>({ status: 'idle', message: 'Not run yet' });

  async runSuccess(): Promise<void> {
    this.success.set({ status: 'running', message: 'Calling /flags...' });
    try {
      const res = await fetch('http://localhost:3000/flags');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.success.set({ status: 'success', message: 'Success response received from /flags' });
    } catch (error) {
      this.success.set({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async runError(): Promise<void> {
    this.error.set({ status: 'running', message: 'Calling unknown route...' });
    try {
      const res = await fetch('http://localhost:3000/unknown-endpoint');
      if (res.ok) {
        this.error.set({ status: 'success', message: 'Unexpected success from unknown route' });
        return;
      }
      const traceId = res.headers.get('x-trace-id') ?? undefined;
      this.error.set({ status: 'error', message: `Expected failure captured (HTTP ${res.status})`, traceId });
    } catch (error) {
      this.error.set({ status: 'error', message: error instanceof Error ? error.message : 'Network error' });
    }
  }

  async runRetry(): Promise<void> {
    this.retry.set({ status: 'running', message: 'Simulating timeout and retry...' });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout on first attempt')), 500);
    });

    try {
      await timeoutPromise;
      this.retry.set({ status: 'success', message: 'Unexpected: first attempt succeeded' });
    } catch {
      try {
        const res = await fetch('http://localhost:3000/health');
        if (!res.ok) throw new Error(`Retry failed: HTTP ${res.status}`);
        this.retry.set({ status: 'success', message: 'Retry succeeded against /health endpoint' });
      } catch (error) {
        this.retry.set({ status: 'error', message: error instanceof Error ? error.message : 'Retry failed' });
      }
    }
  }
}
