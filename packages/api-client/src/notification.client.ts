import type {
  ActionResult,
  CreateNotificationDto,
  ExportAuditLogAction,
  MarkNotificationReadAction,
  Notification,
  PaginatedResponse,
} from '@poc/types';
import { BaseApiClient } from './base.client';

export class NotificationApiClient extends BaseApiClient {
  constructor(gatewayUrl: string) {
    super(gatewayUrl);
  }

  getNotifications(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<Notification>> {
    return this.get<PaginatedResponse<Notification>>(`/notifications?userId=${userId}&page=${page}&limit=${limit}`);
  }

  sendNotification(dto: CreateNotificationDto): Promise<Notification> {
    return this.post<Notification>('/notifications', dto);
  }

  markAsRead(notificationId: string): Promise<Notification> {
    return this.put<Notification>(`/notifications/${notificationId}/read`, {});
  }

  markManyAsRead(payload: MarkNotificationReadAction): Promise<ActionResult<{ updatedCount: number }>> {
    return this.put<ActionResult<{ updatedCount: number }>>('/notifications/read', payload);
  }

  exportAuditLogs(payload: ExportAuditLogAction): Promise<ActionResult<{ downloadUrl: string }>> {
    return this.post<ActionResult<{ downloadUrl: string }>>('/audit-logs/export', payload);
  }
}
