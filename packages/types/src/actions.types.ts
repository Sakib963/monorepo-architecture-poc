// ─────────────────────────────────────────────────────────
// ACTION contracts (User/Admin portal operations)
// ─────────────────────────────────────────────────────────

export type PortalActor = 'USER' | 'ADMIN';

export interface ActionMeta {
  actorId: string;
  actorType: PortalActor;
  traceId: string;
  requestedAt: string;
}

export interface CreateTransferAction {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: 'BDT' | 'USD';
  note?: string;
}

export interface ApproveTransferAction {
  transferId: string;
  decision: 'APPROVE' | 'REJECT';
  reason?: string;
}

export interface UpdateProfileAction {
  fullName: string;
  phone: string;
  addressLine: string;
}

export interface ChangeUserStatusAction {
  userId: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  reason: string;
}

export interface ToggleFeatureFlagAction {
  flagKey: string;
  enabled: boolean;
  reason: string;
}

export interface RequestStatementAction {
  accountId: string;
  fromDate: string;
  toDate: string;
  format: 'PDF' | 'CSV';
}

export interface MarkNotificationReadAction {
  notificationIds: string[];
  read: true;
}

export interface ResetUserCredentialAction {
  userId: string;
  channel: 'EMAIL' | 'SMS';
  reason: string;
}

export interface ExportAuditLogAction {
  fromDate: string;
  toDate: string;
  format: 'CSV' | 'PDF';
  requestedBy: string;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  code: string;
  message: string;
  traceId: string;
  data?: T;
}
