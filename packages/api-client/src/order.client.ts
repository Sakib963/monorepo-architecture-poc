import type { Order, CreateOrderDto, PaginatedResponse } from '@poc/types';
import { BaseApiClient } from './base.client';

export class OrderApiClient extends BaseApiClient {
  constructor(gatewayUrl: string) {
    super(gatewayUrl);
  }

  getOrders(userId?: string, page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (userId) params.set('userId', userId);
    return this.get<PaginatedResponse<Order>>(`/orders?${params}`);
  }

  getOrderById(orderId: string): Promise<Order> {
    return this.get<Order>(`/orders/${orderId}`);
  }

  placeOrder(dto: CreateOrderDto): Promise<Order> {
    return this.post<Order>('/orders', dto);
  }

  cancelOrder(orderId: string): Promise<Order> {
    return this.put<Order>(`/orders/${orderId}/cancel`, {});
  }
}
