import { Router, Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse, Notification } from '@poc/types';
import { NotificationRepository } from '../notification.repository';

export const readRoutes = Router();

readRoutes.get('/', (req: Request, res: Response) => {
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

readRoutes.get('/:id', (req: Request, res: Response) => {
  const n = NotificationRepository.findById(req.params.id);
  if (!n) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    return;
  }
  res.json({ success: true, data: n } as ApiResponse<Notification>);
});
