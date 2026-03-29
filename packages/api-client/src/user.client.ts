import type {
  ActionResult,
  ChangeUserStatusAction,
  CreateTransferAction,
  CreateUserDto,
  PaginatedResponse,
  RequestStatementAction,
  ResetUserCredentialAction,
  UpdateProfileAction,
  UpdateUserDto,
  User,
} from '@poc/types';
import { BaseApiClient } from './base.client';

export class UserApiClient extends BaseApiClient {
  constructor(gatewayUrl: string) {
    super(gatewayUrl);
  }

  getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>(`/users?${this.buildPaginationQuery(page, limit)}`);
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

  updateProfile(userId: string, payload: UpdateProfileAction): Promise<ActionResult<User>> {
    return this.put<ActionResult<User>>(`/users/${userId}/profile`, payload);
  }

  requestStatement(payload: RequestStatementAction): Promise<ActionResult<{ downloadUrl: string }>> {
    return this.post<ActionResult<{ downloadUrl: string }>>('/accounts/statement', payload);
  }

  createTransfer(payload: CreateTransferAction): Promise<ActionResult<{ transferId: string; status: string }>> {
    return this.post<ActionResult<{ transferId: string; status: string }>>('/transfers', payload);
  }

  changeUserStatus(payload: ChangeUserStatusAction): Promise<ActionResult<User>> {
    return this.put<ActionResult<User>>(`/users/${payload.userId}/status`, payload);
  }

  resetUserCredential(payload: ResetUserCredentialAction): Promise<ActionResult<{ resetRequested: boolean }>> {
    return this.post<ActionResult<{ resetRequested: boolean }>>(`/users/${payload.userId}/credentials/reset`, payload);
  }
}
