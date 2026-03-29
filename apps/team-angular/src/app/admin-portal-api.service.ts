import { Injectable } from '@angular/core';
import {
  NotificationApiClient,
  OrderApiClient,
  UserApiClient,
  mapApiErrorToActionResult,
} from '@poc/api-client';
import type {
  ActionResult,
  ApproveTransferAction,
  ChangeUserStatusAction,
  ExportAuditLogAction,
  ResetUserCredentialAction,
  ToggleFeatureFlagAction,
  User,
} from '@poc/types';

const API_BASE = 'http://localhost:3000';

export interface AdminDashboardSummary {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  activeFlags: number;
  systemHealth: 'HEALTHY' | 'DEGRADED';
}

export interface ApprovalQueueItem {
  transferId: string;
  userId: string;
  amount: number;
  currency: 'BDT' | 'USD';
  requestedAt: string;
}

export interface FlagStateItem {
  key: string;
  enabled: boolean;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminPortalApiService {
  private readonly userClient = new UserApiClient(API_BASE);
  private readonly orderClient = new OrderApiClient(API_BASE);
  private readonly notificationClient = new NotificationApiClient(API_BASE);

  private readonly seededApprovals: ApprovalQueueItem[] = [
    {
      transferId: '8eb1987c-e7a0-4102-8517-6e995cfec65e',
      userId: 'a0d88eb8-83a4-45fa-a9cd-7ee95f47d181',
      amount: 120000,
      currency: 'BDT',
      requestedAt: '2026-03-28T08:30:00Z',
    },
    {
      transferId: '14f7ecf5-f634-44ea-a7eb-3774d9451f8e',
      userId: 'b9327d98-72c2-4f70-9c7a-15521fda69e8',
      amount: 2500,
      currency: 'USD',
      requestedAt: '2026-03-28T10:10:00Z',
    },
  ];

  private readonly seededAuditLogs: AuditLogItem[] = [
    {
      id: 'e06d6317-4029-4e1b-a6f1-ecfdb6c7ddb1',
      actor: 'admin.sakib',
      action: 'CHANGE_USER_STATUS',
      target: 'user:a0d88eb8',
      createdAt: '2026-03-28T11:45:00Z',
    },
    {
      id: 'e72f6cd4-452f-4904-a767-2daa0f473f33',
      actor: 'admin.sakib',
      action: 'TOGGLE_FEATURE_FLAG',
      target: 'flag:UI_QUICK_ACTIONS_BAR',
      createdAt: '2026-03-28T10:12:00Z',
    },
  ];

  async getUsers(): Promise<User[]> {
    try {
      const response = await this.userClient.getUsers(1, 30);
      return response.items;
    } catch {
      return [];
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.userClient.getUserById(userId);
    } catch {
      return null;
    }
  }

  async getApprovalQueue(): Promise<ApprovalQueueItem[]> {
    return this.seededApprovals;
  }

  async getFeatureFlags(): Promise<FlagStateItem[]> {
    try {
      const response = await fetch(`${API_BASE}/flags`);
      if (!response.ok) {
        return [];
      }

      const body = (await response.json()) as {
        data: Record<string, boolean>;
      };

      return Object.entries(body.data).map(([key, enabled]) => ({ key, enabled }));
    } catch {
      return [];
    }
  }

  async getAuditLogs(): Promise<AuditLogItem[]> {
    return this.seededAuditLogs;
  }

  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    const [users, approvals, flags] = await Promise.all([
      this.getUsers(),
      this.getApprovalQueue(),
      this.getFeatureFlags(),
    ]);

    return {
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.status === 'ACTIVE').length,
      pendingApprovals: approvals.length,
      activeFlags: flags.filter((flag) => flag.enabled).length,
      systemHealth: approvals.length > 5 ? 'DEGRADED' : 'HEALTHY',
    };
  }

  async changeUserStatus(payload: ChangeUserStatusAction): Promise<ActionResult<User>> {
    try {
      return await this.userClient.changeUserStatus(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }

  async resetUserCredential(payload: ResetUserCredentialAction): Promise<ActionResult<{ resetRequested: boolean }>> {
    try {
      return await this.userClient.resetUserCredential(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }

  async decideTransfer(payload: ApproveTransferAction): Promise<ActionResult<{ transferId: string; decision: string }>> {
    try {
      return await this.orderClient.decideTransfer(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }

  async toggleFeatureFlag(payload: ToggleFeatureFlagAction): Promise<ActionResult<{ flagKey: string; enabled: boolean }>> {
    try {
      return await this.orderClient.toggleFeatureFlag(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }

  async exportAuditLogs(payload: ExportAuditLogAction): Promise<ActionResult<{ downloadUrl: string }>> {
    try {
      return await this.notificationClient.exportAuditLogs(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }
}
