// ─── Base event contract ──────────────────────────────────────────────────────

/**
 * Every event in the system must include these fields.
 * Services can rely on them for logging, tracing, and deduplication.
 */
export interface BaseEvent<TName extends string, TPayload> {
  eventId: string;          // UUID — for deduplication / idempotency
  eventName: TName;         // Discriminant — use in switch statements
  occurredAt: string;       // ISO-8601 timestamp
  version: number;          // Schema version — used for backward-compat migrations
  correlationId: string;    // Trace ID — link related events across services
  payload: TPayload;
}

// ─── User events ──────────────────────────────────────────────────────────────

export type UserCreatedEvent = BaseEvent<'user.created', {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}>;

export type UserUpdatedEvent = BaseEvent<'user.updated', {
  userId: string;
  changes: {
    firstName?: string;
    lastName?: string;
    role?: string;
    status?: string;
  };
  updatedBy: string;
}>;

export type UserSuspendedEvent = BaseEvent<'user.suspended', {
  userId: string;
  reason: string;
  suspendedBy: string;
}>;

// ─── Order events ─────────────────────────────────────────────────────────────

export type OrderPlacedEvent = BaseEvent<'order.placed', {
  orderId: string;
  userId: string;
  totalAmount: number;
  itemCount: number;
  shippingAddress: {
    city: string;
    country: string;
  };
}>;

export type OrderStatusChangedEvent = BaseEvent<'order.status_changed', {
  orderId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
}>;

// ─── Notification events ──────────────────────────────────────────────────────

export type NotificationRequestedEvent = BaseEvent<'notification.requested', {
  recipientUserId: string;
  recipientEmail: string;
  type: 'EMAIL' | 'IN_APP' | 'SMS';
  subject: string;
  body: string;
  metadata?: Record<string, string>;
}>;

export type NotificationDeliveredEvent = BaseEvent<'notification.delivered', {
  notificationId: string;
  recipientUserId: string;
  deliveredAt: string;
}>;

// ─── Union type — exhaustive switch without `default` needed ──────────────

export type DomainEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserSuspendedEvent
  | OrderPlacedEvent
  | OrderStatusChangedEvent
  | NotificationRequestedEvent
  | NotificationDeliveredEvent;

export type EventName = DomainEvent['eventName'];
