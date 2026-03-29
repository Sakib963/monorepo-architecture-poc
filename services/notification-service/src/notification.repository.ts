import { v4 as uuidv4 } from 'uuid';
import type { Notification, CreateNotificationDto } from '@poc/types';
import { NotificationType, NotificationStatus } from '@poc/types';
import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.resolve(__dirname, './data/notifications.json');

const fallbackSeed: Notification[] = [
  {
    id: '9e2ab2b8-e1de-4d60-9689-87e94f6a9451',
    userId: 'system',
    type: NotificationType.IN_APP,
    title: 'Welcome to the POC',
    message: 'This notification was delivered via persisted JSON storage in notification-service.',
    status: NotificationStatus.SENT,
    createdAt: '2026-03-20T07:00:00.000Z',
  },
];

function ensureStorage(): void {
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(fallbackSeed, null, 2), 'utf8');
  }
}

function readNotifications(): Notification[] {
  ensureStorage();
  const raw = fs.readFileSync(STORAGE_PATH, 'utf8');
  try {
    return JSON.parse(raw) as Notification[];
  } catch {
    return fallbackSeed;
  }
}

function writeNotifications(items: Notification[]): void {
  ensureStorage();
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(items, null, 2), 'utf8');
}

export const NotificationRepository = {
  findAll(): Notification[] {
    return readNotifications();
  },

  findByUser(userId: string): Notification[] {
    return readNotifications().filter((notification) => notification.userId === userId);
  },

  findById(id: string): Notification | undefined {
    return readNotifications().find((notification) => notification.id === id);
  },

  create(dto: CreateNotificationDto): Notification {
    const notifications = readNotifications();
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
    notifications.push(notification);
    writeNotifications(notifications);
    return notification;
  },

  markDelivered(id: string): Notification | undefined {
    const notifications = readNotifications();
    const index = notifications.findIndex((notification) => notification.id === id);
    if (index === -1) return undefined;
    const updated: Notification = { ...notifications[index], status: NotificationStatus.SENT };
    notifications[index] = updated;
    writeNotifications(notifications);
    return updated;
  },

  markRead(id: string): Notification | undefined {
    const notifications = readNotifications();
    const index = notifications.findIndex((notification) => notification.id === id);
    if (index === -1) return undefined;
    const updated: Notification = {
      ...notifications[index],
      status: NotificationStatus.READ,
      readAt: notifications[index].readAt ?? new Date().toISOString(),
    };
    notifications[index] = updated;
    writeNotifications(notifications);
    return updated;
  },
};
