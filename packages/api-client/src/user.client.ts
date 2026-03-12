import type { User, CreateUserDto, UpdateUserDto, PaginatedResponse } from '@poc/types';
import { BaseApiClient } from './base.client';

export class UserApiClient extends BaseApiClient {
  constructor(gatewayUrl: string) {
    super(gatewayUrl);
  }

  getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
  }

  getUserById(userId: string): Promise<User> {
    return this.get<User>(`/users/${userId}`);
  }

  createUser(dto: CreateUserDto): Promise<User> {
    return this.post<User>('/users', dto);
  }

  updateUser(userId: string, dto: UpdateUserDto): Promise<User> {
    return this.put<User>(`/users/${userId}`, dto);
  }

  deleteUser(userId: string): Promise<void> {
    return this.delete<void>(`/users/${userId}`);
  }
}
