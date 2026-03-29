import { Router, Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse, Notification } from '@poc/types';
import { NotificationType } from '@poc/types';
import { EventFactory } from '@poc/events';
import { getFlag } from '@poc/feature-flags';
import { NotificationRepository } from './notification.repository';
import { exportAuditLogActionSchema, markNotificationReadActionSchema, validate } from '@poc/validators';

export const notificationRouter = Router();

function actionError(code: string, message: string, traceId: string) {
  return { ok: false, code, message, traceId };
}

// GET /notifications?userId=<id>
notificationRouter.get('/', (req: Request, res: Response) => {
  const userId = req.query['userId'] as string | undefined;
  const all = userId
    ? NotificationRepository.findByUser(userId)
    : NotificationRepository.findAll();

  const body: ApiResponse<PaginatedResponse<Notification>> = {
    success: true,
    data: { items: all, total: all.length, page: 1, limit: all.length, totalPages: 1 },
  };
  res.json(body);
});

// GET /notifications/:id
notificationRouter.get('/:id', (req: Request, res: Response) => {
  const n = NotificationRepository.findById(req.params.id);
  if (!n) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    return;
  }
  res.json({ success: true, data: n } as ApiResponse<Notification>);
});

// POST /notifications
notificationRouter.post('/', (req: Request, res: Response) => {
  const dto = req.body;
  if (!dto?.userId || !dto?.type || !dto?.title || !dto?.message) {
    res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: userId, type, title, message' } });
    return;
  }

  // Check SMS flag if type is SMS
  if (dto.type === 'SMS' && !getFlag('NOTIFY_SMS')) {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'SMS notifications are not enabled' } });
    return;
  }

  const notification = NotificationRepository.create(dto);

  // Simulate async delivery — mark as delivered immediately for POC
  const delivered = NotificationRepository.markDelivered(notification.id);

  // Emit event
  const event = EventFactory.notificationDelivered({
    notificationId: notification.id,
    recipientUserId: notification.userId,
    deliveredAt: new Date().toISOString(),
  });
  console.log('[notification-service] Event emitted:', event.eventName, event.eventId);

  res.status(201).json({ success: true, data: delivered ?? notification } as ApiResponse<Notification>);
});

// PUT /notifications/:id/read
notificationRouter.put('/:id/read', (req: Request, res: Response) => {
  const n = NotificationRepository.markRead(req.params.id);
  if (!n) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    return;
  }
  res.json({ success: true, data: n } as ApiResponse<Notification>);
});

// PUT /notifications/read
notificationRouter.put('/read', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';
  const validation = validate(markNotificationReadActionSchema, req.body);
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  let updatedCount = 0;
  for (const notificationId of validation.data!.notificationIds) {
    const updated = NotificationRepository.markRead(notificationId);
    if (updated) {
      updatedCount += 1;
    }
  }

  res.json({
    success: true,
    data: {
      ok: true,
      code: 'NOTIFICATIONS_UPDATED',
      message: `${updatedCount} notification(s) marked as read`,
      traceId,
      data: { updatedCount },
    },
  });
});

// POST /notifications/audit-logs/export
notificationRouter.post('/audit-logs/export', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';
  const validation = validate(exportAuditLogActionSchema, req.body);
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  const { format } = validation.data!;
  res.json({
    success: true,
    data: {
      ok: true,
      code: 'AUDIT_EXPORT_REQUESTED',
      message: `Audit log export requested in ${format} format`,
      traceId,
      data: {
        downloadUrl: `https://poc.local/audit-logs/export.${format.toLowerCase()}`,
      },
    },
  });
});

// POST /notifications/events
notificationRouter.post('/events', (req: Request, res: Response) => {
  const eventName = String(req.body?.eventName ?? 'UNKNOWN_EVENT');
  const payload = req.body?.payload ?? {};

  if (eventName === 'USER_UPDATED') {
    NotificationRepository.create({
      userId: String((payload as { userId?: string }).userId ?? 'system'),
      type: NotificationType.IN_APP,
      title: 'Account Updated',
      message: 'Your account information was updated by an administrator.',
    });
  }

  res.status(202).json({ success: true, data: { accepted: true } });
});
