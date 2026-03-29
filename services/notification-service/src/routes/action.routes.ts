import { Router, Request, Response } from 'express';
import { NotificationType } from '@poc/types';
import { NotificationRepository } from '../notification.repository';
import { exportAuditLogActionSchema, markNotificationReadActionSchema, validate } from '@poc/validators';
import { actionError } from './helpers';

export const actionRoutes = Router();

actionRoutes.put('/:id/read', (req: Request, res: Response) => {
  const notification = NotificationRepository.markRead(req.params.id);
  if (!notification) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    return;
  }
  res.json({ success: true, data: notification });
});

actionRoutes.put('/read', (req: Request, res: Response) => {
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

actionRoutes.post('/audit-logs/export', (req: Request, res: Response) => {
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

actionRoutes.post('/events', (req: Request, res: Response) => {
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
