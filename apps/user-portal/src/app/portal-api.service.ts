import { Injectable } from '@angular/core';
import { NotificationApiClient, UserApiClient, mapApiErrorToActionResult } from '@poc/api-client';
import type {
  ActionResult,
  CreateTransferAction,
  MarkNotificationReadAction,
  Notification,
  RequestStatementAction,
  UpdateProfileAction,
  User,
} from '@poc/types';
import { NotificationStatus, NotificationType } from '@poc/types';

export interface DashboardSummary {
  totalAccounts: number;
  totalBalance: number;
  pendingTransfers: number;
  unreadNotifications: number;
}

export interface AccountSummary {
  id: string;
  accountNo: string;
  type: 'SAVINGS' | 'CURRENT';
  currency: 'BDT' | 'USD';
  balance: number;
  status: 'ACTIVE' | 'DORMANT';
}

export interface TransactionSummary {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

@Injectable({ providedIn: 'root' })
export class PortalApiService {
  private readonly userClient = new UserApiClient('http://localhost:3000');
  private readonly notificationClient = new NotificationApiClient('http://localhost:3000');

  private readonly seededAccounts: AccountSummary[] = [
    { id: '3f4b4f7e-9304-4955-aaf7-0fe7451e8ff1', accountNo: '0123-4567-8901', type: 'SAVINGS', currency: 'BDT', balance: 275000, status: 'ACTIVE' },
    { id: '77d0bb6b-3b5f-4457-b5ae-c07c84f4f9bd', accountNo: '9876-1002-3301', type: 'CURRENT', currency: 'USD', balance: 4300, status: 'ACTIVE' },
  ];

  private readonly seededTransactions: TransactionSummary[] = [
    { id: 'a2f447f2-9385-4896-b48d-f75ed1304c64', date: '2026-03-26T09:30:00Z', description: 'Salary Credit', debit: 0, credit: 85000, balance: 275000 },
    { id: '62b2f4a7-215e-40d4-8e88-8f86b36ab1d8', date: '2026-03-25T18:10:00Z', description: 'Utility Bill Payment', debit: 5600, credit: 0, balance: 190000 },
    { id: '24884a4c-8c8d-423d-95f4-feb2f729f82f', date: '2026-03-24T11:12:00Z', description: 'Card Settlement', debit: 13000, credit: 0, balance: 195600 },
  ];

  async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    try {
      const [accounts, notifications] = await Promise.all([
        this.getAccounts(userId),
        this.getNotifications(userId),
      ]);

      return {
        totalAccounts: accounts.length,
        totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
        pendingTransfers: 2,
        unreadNotifications: notifications.filter((notification) => !notification.readAt).length,
      };
    } catch {
      return {
        totalAccounts: this.seededAccounts.length,
        totalBalance: this.seededAccounts.reduce((sum, account) => sum + account.balance, 0),
        pendingTransfers: 1,
        unreadNotifications: 3,
      };
    }
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      return await this.userClient.getUserById(userId);
    } catch {
      return null;
    }
  }

  async getAccounts(_userId: string): Promise<AccountSummary[]> {
    return this.seededAccounts;
  }

  async getTransactions(_userId: string): Promise<TransactionSummary[]> {
    return this.seededTransactions;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const result = await this.notificationClient.getNotifications(userId, 1, 20);
      return result.items;
    } catch {
      return [
        {
          id: 'ab59311f-0415-45b2-8db0-8ff05f43598f',
          userId,
          type: NotificationType.IN_APP,
          title: 'KYC Reminder',
          message: 'Please update your KYC details before April 2, 2026.',
          status: NotificationStatus.QUEUED,
          createdAt: '2026-03-28T10:00:00Z',
        },
        {
          id: 'fcb64c4d-764c-4f3a-8f2e-b85d2f772916',
          userId,
          type: NotificationType.EMAIL,
          title: 'Transfer Approved',
          message: 'Your recent transfer request has been approved.',
          status: NotificationStatus.READ,
          createdAt: '2026-03-27T08:15:00Z',
          readAt: '2026-03-27T09:00:00Z',
        },
      ];
    }
  }

  async updateProfile(userId: string, payload: UpdateProfileAction): Promise<ActionResult<User>> {
    try {
      return await this.userClient.updateProfile(userId, payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }

  async requestStatement(payload: RequestStatementAction): Promise<ActionResult<{ downloadUrl: string }>> {
    try {
      return await this.userClient.requestStatement(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }

  async createTransfer(payload: CreateTransferAction): Promise<ActionResult<{ transferId: string; status: string }>> {
    try {
      return await this.userClient.createTransfer(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }

  async markNotificationsRead(payload: MarkNotificationReadAction): Promise<ActionResult<{ updatedCount: number }>> {
    try {
      return await this.notificationClient.markManyAsRead(payload);
    } catch (error) {
      return mapApiErrorToActionResult(error, crypto.randomUUID());
    }
  }
}
