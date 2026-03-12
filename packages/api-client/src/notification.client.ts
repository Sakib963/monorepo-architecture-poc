import type { Notification, CreateNotificationDto, PaginatedResponse } from '@poc/types';
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
}
