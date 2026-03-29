import { Router, Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@poc/types';
import type { User } from '@poc/types';
import { UserRepository } from '../user.repository';

export const readRoutes = Router();

readRoutes.get('/', (_req: Request, res: Response) => {
  const all = UserRepository.findAll();
  const body: ApiResponse<PaginatedResponse<User>> = {
    success: true,
    data: {
      items: all,
      total: all.length,
      page: 1,
      limit: all.length,
      totalPages: 1,
    },
  };
  res.json(body);
});

readRoutes.get('/:id', (req: Request, res: Response) => {
  const user = UserRepository.findById(req.params.id);
  if (!user) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    return;
  }
  const body: ApiResponse<User> = { success: true, data: user };
  res.json(body);
});
