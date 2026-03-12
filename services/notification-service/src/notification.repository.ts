import { v4 as uuidv4 } from 'uuid';
import type { Notification, CreateNotificationDto } from '@poc/types';
import { NotificationType, NotificationStatus } from '@poc/types';

const notifications: Map<string, Notification> = new Map();

// Seed a couple of notifications
const seedItems: Omit<Notification, 'id' | 'createdAt'>[] = [
  {
    userId: 'system',
    type: NotificationType.IN_APP,
    status: NotificationStatus.SENT,
    title: 'Welcome to the POC',
    message: 'This notification was delivered via the shared @poc/types package — same model used by the frontend and this service.',
  },
];

seedItems.forEach(n => {
  const id = uuidv4();
  const now = new Date().toISOString();
  notifications.set(id, { ...n, id, createdAt: now });
});

export const NotificationRepository = {
  findAll(): Notification[] {
    return Array.from(notifications.values());
  },

  findByUser(userId: string): Notification[] {
    return Array.from(notifications.values()).filter(n => n.userId === userId);
  },

  findById(id: string): Notification | undefined {
    return notifications.get(id);
  },

  create(dto: CreateNotificationDto): Notification {
    const id = uuidv4();
    const now = new Date().toISOString();
    const notification: Notification = {
      id,
      userId: dto.userId,
      type: dto.type,
      status: NotificationStatus.QUEUED,
      title: dto.title,
      message: dto.message,
      createdAt: now,
    };
    notifications.set(id, notification);
    return notification;
  },

  markDelivered(id: string): Notification | undefined {
    const n = notifications.get(id);
    if (!n) return undefined;
    const updated: Notification = { ...n, status: NotificationStatus.SENT };
    notifications.set(id, updated);
    return updated;
  },

  markRead(id: string): Notification | undefined {
    const n = notifications.get(id);
    if (!n) return undefined;
    const updated: Notification = { ...n, status: NotificationStatus.READ };
    notifications.set(id, updated);
    return updated;
  },
};
