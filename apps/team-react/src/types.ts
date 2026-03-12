// Re-export shared types so app code imports from one place.
// If @poc/types adds fields, this file needs no changes.
export type {
  User,
  UserRole,
  UserStatus,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
  ApiResponse,
} from '@poc/types';

export type { FeatureFlags } from '@poc/feature-flags';
