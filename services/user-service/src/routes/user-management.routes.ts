import { Router, Request, Response } from 'express';
import type { ApiResponse, CreateUserDto, UpdateUserDto } from '@poc/types';
import type { User } from '@poc/types';
import { EventFactory } from '@poc/events';
import { getFlag } from '@poc/feature-flags';
import { createUserSchema, updateUserSchema, validate } from '@poc/validators';
import { UserRepository } from '../user.repository';

export const userManagementRoutes = Router();

userManagementRoutes.post('/', (req: Request, res: Response) => {
  if (!getFlag('USER_SELF_REGISTRATION')) {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Self-registration is disabled' } });
    return;
  }

  const result = validate(createUserSchema, req.body);
  if (!result.success) {
    res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed' }, details: result.errors });
    return;
  }

  const existing = UserRepository.findByEmail(result.data!.email);
  if (existing) {
    res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Email already registered' } });
    return;
  }

  const user = UserRepository.create(result.data as CreateUserDto);

  const event = EventFactory.userCreated({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
  console.log('[user-service] Event emitted:', event.eventName, event.eventId);

  const body: ApiResponse<User> = { success: true, data: user };
  res.status(201).json(body);
});

userManagementRoutes.put('/:id', (req: Request, res: Response) => {
  const result = validate(updateUserSchema, req.body);
  if (!result.success) {
    res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed' }, details: result.errors });
    return;
  }

  const user = UserRepository.update(req.params.id, result.data as UpdateUserDto);
  if (!user) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    return;
  }

  const event = EventFactory.userUpdated({ userId: user.id, changes: result.data!, updatedBy: 'system' });
  console.log('[user-service] Event emitted:', event.eventName, event.eventId);

  res.json({ success: true, data: user } as ApiResponse<User>);
});

userManagementRoutes.delete('/:id', (req: Request, res: Response) => {
  const deleted = UserRepository.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    return;
  }
  res.status(204).send();
});
