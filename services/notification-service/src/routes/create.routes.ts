import { Router, Request, Response } from 'express';
import type { ApiResponse, Notification } from '@poc/types';
import { EventFactory } from '@poc/events';
import { getFlag } from '@poc/feature-flags';
import { NotificationRepository } from '../notification.repository';

export const createRoutes = Router();

createRoutes.post('/', (req: Request, res: Response) => {
  const dto = req.body;
  if (!dto?.userId || !dto?.type || !dto?.title || !dto?.message) {
    res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: userId, type, title, message' } });
    return;
  }

  if (dto.type === 'SMS' && !getFlag('NOTIFY_SMS')) {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'SMS notifications are not enabled' } });
    return;
  }

  const notification = NotificationRepository.create(dto);
  const delivered = NotificationRepository.markDelivered(notification.id);

  const event = EventFactory.notificationDelivered({
    notificationId: notification.id,
    recipientUserId: notification.userId,
    deliveredAt: new Date().toISOString(),
  });
  console.log('[notification-service] Event emitted:', event.eventName, event.eventId);

  res.status(201).json({ success: true, data: delivered ?? notification } as ApiResponse<Notification>);
});
