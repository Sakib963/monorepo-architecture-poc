import { Role } from './user';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  role: Role;
  token: string;
}
