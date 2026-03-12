import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFactory } from '@poc/events';
import type { DomainEvent } from '@poc/events';

@Component({
  selector: 'app-events-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="pkg-badge">&#64;poc/events</div>
        <h1>Event Contracts</h1>
        <p class="page-desc">
          <strong>packages/events/src/events.ts</strong> defines typed interfaces for every
          domain event. Services use factory functions to create events — TypeScript prevents
          a producer from emitting a shape that consumers can't handle.
        </p>
      </div>

      <section class="section">
        <h2 class="section-title">Live Event Generation</h2>
        <div class="event-grid">
          <div *ngFor="let ev of eventTypes" class="event-type-card" (click)="generate(ev.factory)" [class.selected]="generatedEvent?.eventName === ev.name">
            <div class="ev-name">{{ ev.name }}</div>
            <div class="ev-desc">{{ ev.description }}</div>
            <div class="ev-producer">Produced by: <strong>{{ ev.producer }}</strong></div>
          </div>
        </div>
        <div *ngIf="generatedEvent" class="event-output">
          <div class="code-label">Generated event (from EventFactory.{{ generatedEvent.eventName.replace('.', '_') | lowercase }}())</div>
          <pre class="code">{{ generatedEvent | json }}</pre>
        </div>
        <div *ngIf="!generatedEvent" class="hint">Click an event type to generate a live example</div>
      </section>

      <section class="section">
        <h2 class="section-title">Why Typed Events?</h2>
        <div class="reason-grid">
          <div *ngFor="let r of reasons" class="reason-card">
            <div class="reason-icon">{{ r.icon }}</div>
            <div class="reason-title">{{ r.title }}</div>
            <div class="reason-body">{{ r.body }}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">DomainEvent Union Type</h2>
        <p class="description">
          All events are collected into a <code>DomainEvent</code> union. A consumer that
          <code>switch</code>es on <code>eventName</code> without a <code>default:</code> will
          fail to compile if a new event is added to the union — every handler site is forced to deal with it.
        </p>
        <pre class="code">{{ unionCode }}</pre>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; }
    .page-header { margin-bottom: 2.5rem; }
    .pkg-badge { display: inline-block; font-family: monospace; font-size: 0.75rem; font-weight: 700;
                 background: #2d2010; color: #f6ad55; padding: 0.25rem 0.75rem; border-radius: 9999px; margin-bottom: 0.75rem; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #e2e8f0; margin-bottom: 0.75rem; }
    .page-desc { font-size: 0.9rem; color: #718096; max-width: 620px; line-height: 1.7; }
    .page-desc strong { color: #a0aec0; font-family: monospace; font-size: 0.85rem; }

    .section { margin-bottom: 2.5rem; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: #a0aec0;
                     text-transform: uppercase; letter-spacing: 0.07em;
                     margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1e2535; }
    .description { font-size: 0.875rem; color: #718096; margin-bottom: 1rem; line-height: 1.6; }
    code { background: #1e2535; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.8rem; color: #a0aec0; }
    .code-label { font-size: 0.7rem; color: #4a5568; margin-bottom: 0.4rem; font-family: monospace; }
    .code { background: #161b27; border: 1px solid #1e2535; border-radius: 0.375rem;
            padding: 1rem; font-size: 0.75rem; color: #a0aec0; overflow-x: auto;
            white-space: pre; line-height: 1.6; }
    .hint { font-size: 0.8rem; color: #4a5568; padding: 1rem; }

    .event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
    .event-type-card { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem;
                       padding: 0.75rem; cursor: pointer; transition: border-color 0.15s; }
    .event-type-card:hover { border-color: #f6ad55; }
    .event-type-card.selected { border-color: #f6ad55; background: #1e1608; }
    .ev-name { font-family: monospace; font-size: 0.78rem; font-weight: 700; color: #f6ad55; margin-bottom: 0.3rem; }
    .ev-desc { font-size: 0.75rem; color: #718096; line-height: 1.4; margin-bottom: 0.4rem; }
    .ev-producer { font-size: 0.7rem; color: #4a5568; }
    .ev-producer strong { color: #a0aec0; }
    .event-output { margin-top: 1rem; }

    .reason-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1rem; }
    .reason-card { background: #161b27; border: 1px solid #1e2535; border-radius: 0.5rem; padding: 1rem; }
    .reason-icon { font-size: 1.25rem; margin-bottom: 0.4rem; }
    .reason-title { font-size: 0.85rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.3rem; }
    .reason-body { font-size: 0.8rem; color: #718096; line-height: 1.5; }
  `],
})
export class EventsDemoComponent {
  generatedEvent: DomainEvent | null = null;

  eventTypes = [
    {
      name: 'user.created',
      description: 'Emitted when a new user registers. notification-service listens to send a welcome email.',
      producer: 'user-service',
      factory: () => EventFactory.userCreated({ userId: 'usr-123', email: 'alice@example.com', firstName: 'Alice', lastName: 'Chen', role: 'ADMIN' }),
    },
    {
      name: 'order.placed',
      description: 'Emitted after a successful checkout. notification-service sends order confirmation.',
      producer: 'order-service',
      factory: () => EventFactory.orderPlaced({ orderId: 'ord-456', userId: 'usr-123', totalAmount: 149.99, itemCount: 3, shippingAddress: { city: 'Amsterdam', country: 'NL' } }),
    },
    {
      name: 'notification.delivered',
      description: 'Emitted after a notification is successfully sent. Used for delivery tracking.',
      producer: 'notification-service',
      factory: () => EventFactory.notificationDelivered({ notificationId: 'ntf-789', recipientUserId: 'usr-123', deliveredAt: new Date().toISOString() }),
    },
    {
      name: 'user.suspended',
      description: 'Emitted when an admin suspends a user. Downstream services revoke sessions.',
      producer: 'user-service',
      factory: () => EventFactory.userSuspended({ userId: 'usr-456', reason: 'Policy violation', suspendedBy: 'usr-001' }),
    },
  ];

  reasons = [
    { icon: '🔎', title: 'Compile-time Shape Safety', body: 'If user-service changes OrderPlacedEvent.totalAmount to totalCost, every consumer gets a TypeScript error immediately — before CI.' },
    { icon: '🔢', title: 'Schema Versioning', body: 'Every event includes a version field. Consumers can handle migrations explicitly instead of silently ignoring unexpected shapes.' },
    { icon: '🔗', title: 'Correlation IDs', body: 'Every event carries a correlationId that links related events across services — without a distributed tracing system.' },
    { icon: '🏭', title: 'Factory Functions', body: 'EventFactory.userCreated() auto-fills eventId (UUID), occurredAt (ISO timestamp), and version. No producer forgets required fields.' },
  ];

  generate(factoryFn: () => DomainEvent): void {
    this.generatedEvent = factoryFn();
  }

  unionCode = `export type DomainEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserSuspendedEvent
  | OrderPlacedEvent
  | OrderStatusChangedEvent
  | NotificationRequestedEvent
  | NotificationDeliveredEvent;

// Exhaustive consumer — TypeScript error if new event is added to union
function handleEvent(event: DomainEvent): void {
  switch (event.eventName) {
    case 'user.created':           return onUserCreated(event);
    case 'user.updated':           return onUserUpdated(event);
    case 'user.suspended':         return onUserSuspended(event);
    case 'order.placed':           return onOrderPlaced(event);
    case 'order.status_changed':   return onOrderStatusChanged(event);
    case 'notification.requested': return onNotificationRequested(event);
    case 'notification.delivered': return onNotificationDelivered(event);
    // No default: needed — TypeScript verifies exhaustiveness above
  }
}`;
}
