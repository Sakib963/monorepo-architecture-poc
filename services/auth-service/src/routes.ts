import { ServerRoute } from '@hapi/hapi';
import { LoginRequest, AuthResponse } from '@monorepo/types';
import { findUserByCredentials, findUserById } from './database';
import { generateToken, verifyToken } from './auth';

export const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/',
    handler: () => {
      return {
        service: 'auth-service',
        version: '1.0.0',
        status: 'running',
      };
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: (request, h) => {
      const credentials = request.payload as LoginRequest;

      if (!credentials.username || !credentials.password) {
        return h
          .response({ error: 'Username and password required' })
          .code(400);
      }

      const user = findUserByCredentials(
        credentials.username,
        credentials.password
      );

      if (!user) {
        return h
          .response({ error: 'Invalid credentials' })
          .code(401);
      }

      const token = generateToken(user);

      const response: AuthResponse = {
        userId: user.userId,
        role: user.role,
        token,
      };

      return h.response(response).code(200);
    },
  },
  {
    method: 'GET',
    path: '/auth/me',
    handler: (request, h) => {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return h
          .response({ error: 'Authorization header required' })
          .code(401);
      }

      // Handle both string and string array
      const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

      if (!headerValue.startsWith('Bearer ')) {
        return h
          .response({ error: 'Invalid authorization format' })
          .code(401);
      }

      const token = headerValue.substring(7);
      const payload = verifyToken(token);

      if (!payload) {
        return h
          .response({ error: 'Invalid token' })
          .code(401);
      }

      const user = findUserById(payload.userId);

      if (!user) {
        return h
          .response({ error: 'User not found' })
          .code(404);
      }

      return h.response(user).code(200);
    },
  },
];
