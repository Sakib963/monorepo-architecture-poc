import { UserApiClient } from '@poc/api-client';
import type { CreateUserDto, PaginatedResponse, User } from '@poc/types';
import type { FeatureFlags } from '@poc/feature-flags';

// The api-gateway runs at /api (proxied by Vite devserver → localhost:3000)
const BASE = '/api';

const userClient = new UserApiClient(BASE);

export const api = {
  getUsers(): Promise<PaginatedResponse<User>> {
    return userClient.getUsers();
  },

  createUser(dto: CreateUserDto): Promise<User> {
    return userClient.createUser(dto);
  },

  async getFlags(): Promise<FeatureFlags> {
    const res = await fetch(`${BASE}/flags`);
    if (!res.ok) throw new Error('Failed to load feature flags');
    const json = await res.json() as { success: boolean; data: FeatureFlags };
    return json.data;
  },
};
