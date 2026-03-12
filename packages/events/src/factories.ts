import { v4 as uuidv4 } from 'uuid';
import type {
  UserCreatedEvent,
  UserUpdatedEvent,
  UserSuspendedEvent,
  OrderPlacedEvent,
  OrderStatusChangedEvent,
  NotificationRequestedEvent,
  NotificationDeliveredEvent,
} from './events';

// ─── Factory helpers ──────────────────────────────────────────────────────────
// These factory functions ensure every event is created with the correct
// structure — no missed fields, no mismatched versions.

function makeEvent<TEvent extends { eventId: string; occurredAt: string; version: number; correlationId: string }>(
  partial: Omit<TEvent, 'eventId' | 'occurredAt' | 'version' | 'correlationId'> & Partial<Pick<TEvent, 'correlationId' | 'version'>>,
  version = 1,
): TEvent {
  return {
    ...partial,
    eventId: uuidv4(),
    occurredAt: new Date().toISOString(),
    version,
    correlationId: (partial as { correlationId?: string }).correlationId ?? uuidv4(),
  } as TEvent;
}

export const EventFactory = {
  userCreated(payload: UserCreatedEvent['payload'], correlationId?: string): UserCreatedEvent {
    return makeEvent<UserCreatedEvent>({ eventName: 'user.created', payload, correlationId });
  },

  userUpdated(payload: UserUpdatedEvent['payload'], correlationId?: string): UserUpdatedEvent {
    return makeEvent<UserUpdatedEvent>({ eventName: 'user.updated', payload, correlationId });
  },

  userSuspended(payload: UserSuspendedEvent['payload'], correlationId?: string): UserSuspendedEvent {
    return makeEvent<UserSuspendedEvent>({ eventName: 'user.suspended', payload, correlationId });
  },

  orderPlaced(payload: OrderPlacedEvent['payload'], correlationId?: string): OrderPlacedEvent {
    return makeEvent<OrderPlacedEvent>({ eventName: 'order.placed', payload, correlationId });
  },

  orderStatusChanged(payload: OrderStatusChangedEvent['payload'], correlationId?: string): OrderStatusChangedEvent {
    return makeEvent<OrderStatusChangedEvent>({ eventName: 'order.status_changed', payload, correlationId });
  },

  notificationRequested(payload: NotificationRequestedEvent['payload'], correlationId?: string): NotificationRequestedEvent {
    return makeEvent<NotificationRequestedEvent>({ eventName: 'notification.requested', payload, correlationId });
  },

  notificationDelivered(payload: NotificationDeliveredEvent['payload'], correlationId?: string): NotificationDeliveredEvent {
    return makeEvent<NotificationDeliveredEvent>({ eventName: 'notification.delivered', payload, correlationId });
  },
} as const;
