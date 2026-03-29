import { Router, Request, Response } from 'express';
import type { User } from '@poc/types';
import { getFlag } from '@poc/feature-flags';
import {
  changeUserStatusActionSchema,
  resetUserCredentialActionSchema,
  validate,
} from '@poc/validators';
import { UserRepository } from '../user.repository';
import { actionError } from './helpers';

export const adminActionRoutes = Router();

adminActionRoutes.put('/:id/status', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';

  if (getFlag('CORE_MAINTENANCE_MODE')) {
    res.status(503).json({ success: true, data: actionError('MAINTENANCE_MODE', 'Status changes are disabled during maintenance', traceId) });
    return;
  }

  const validation = validate(changeUserStatusActionSchema, {
    ...req.body,
    userId: req.params.id,
  });
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  const mappedStatus = validation.data!.status === 'BLOCKED' ? 'SUSPENDED' : validation.data!.status;
  const updated = UserRepository.update(req.params.id, { status: mappedStatus as User['status'] });
  if (!updated) {
    res.status(404).json({ success: true, data: actionError('NOT_FOUND', 'User not found', traceId) });
    return;
  }

  res.json({
    success: true,
    data: {
      ok: true,
      code: 'USER_STATUS_UPDATED',
      message: `User status changed to ${validation.data!.status}`,
      traceId,
      data: updated,
    },
  });
});

adminActionRoutes.post('/:id/credentials/reset', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';

  if (getFlag('CORE_MAINTENANCE_MODE')) {
    res.status(503).json({ success: true, data: actionError('MAINTENANCE_MODE', 'Credential resets are disabled during maintenance', traceId) });
    return;
  }

  const validation = validate(resetUserCredentialActionSchema, {
    ...req.body,
    userId: req.params.id,
  });
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  const user = UserRepository.findById(req.params.id);
  if (!user) {
    res.status(404).json({ success: true, data: actionError('NOT_FOUND', 'User not found', traceId) });
    return;
  }

  res.json({
    success: true,
    data: {
      ok: true,
      code: 'CREDENTIAL_RESET_REQUESTED',
      message: `Credential reset requested via ${validation.data!.channel}`,
      traceId,
      data: { resetRequested: true },
    },
  });
});
