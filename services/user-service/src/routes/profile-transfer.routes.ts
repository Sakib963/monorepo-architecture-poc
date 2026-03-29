import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { EventFactory } from '@poc/events';
import { getFlag } from '@poc/feature-flags';
import {
  approveTransferActionSchema,
  createTransferActionSchema,
  requestStatementActionSchema,
  updateProfileActionSchema,
  validate,
} from '@poc/validators';
import { UserRepository } from '../user.repository';
import { actionError } from './helpers';

export const profileTransferRoutes = Router();

profileTransferRoutes.put('/:id/profile', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';

  if (getFlag('CORE_MAINTENANCE_MODE')) {
    res.status(503).json({ success: true, data: actionError('MAINTENANCE_MODE', 'Profile updates are disabled during maintenance', traceId) });
    return;
  }

  const validation = validate(updateProfileActionSchema, req.body);
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  const [firstName, ...rest] = validation.data!.fullName.trim().split(' ');
  const user = UserRepository.update(req.params.id, {
    firstName,
    lastName: rest.join(' ') || 'User',
  });

  if (!user) {
    res.status(404).json({ success: true, data: actionError('NOT_FOUND', 'User not found', traceId) });
    return;
  }

  res.json({
    success: true,
    data: {
      ok: true,
      code: 'PROFILE_UPDATED',
      message: 'Profile updated successfully',
      traceId,
      data: user,
    },
  });
});

profileTransferRoutes.post('/accounts/statement', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';

  const validation = validate(requestStatementActionSchema, req.body);
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  const { accountId, format } = validation.data!;
  res.json({
    success: true,
    data: {
      ok: true,
      code: 'STATEMENT_REQUESTED',
      message: 'Statement request accepted',
      traceId,
      data: { downloadUrl: `https://poc.local/statements/${accountId}.${format.toLowerCase()}` },
    },
  });
});

profileTransferRoutes.post('/transfers', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';

  if (getFlag('CORE_MAINTENANCE_MODE')) {
    res.status(503).json({ success: true, data: actionError('MAINTENANCE_MODE', 'Transfers are disabled during maintenance', traceId) });
    return;
  }

  const validation = validate(createTransferActionSchema, req.body);
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  const transferId = randomUUID();
  const event = EventFactory.orderPlaced({
    orderId: transferId,
    userId: 'transfer-user',
    totalAmount: validation.data!.amount,
    itemCount: 1,
    shippingAddress: {
      city: 'N/A',
      country: 'N/A',
    },
  });
  console.log('[user-service] Event emitted:', event.eventName, event.eventId);

  res.status(201).json({
    success: true,
    data: {
      ok: true,
      code: 'TRANSFER_CREATED',
      message: 'Transfer request created',
      traceId,
      data: { transferId, status: 'PENDING' },
    },
  });
});

profileTransferRoutes.post('/transfers/decision', (req: Request, res: Response) => {
  const traceId = req.header('x-trace-id') ?? 'N/A';

  const validation = validate(approveTransferActionSchema, req.body);
  if (!validation.success) {
    res.status(422).json({
      success: true,
      data: actionError('VALIDATION_ERROR', validation.errors.map((error) => error.message).join(' | '), traceId),
    });
    return;
  }

  res.json({
    success: true,
    data: {
      ok: true,
      code: 'TRANSFER_DECISION_RECORDED',
      message: `Transfer ${validation.data!.decision.toLowerCase()} recorded`,
      traceId,
      data: {
        transferId: validation.data!.transferId,
        decision: validation.data!.decision,
      },
    },
  });
});
