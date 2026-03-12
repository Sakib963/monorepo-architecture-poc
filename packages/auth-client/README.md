# Auth Client Package

Shared authentication client library for making auth-related API requests.

## Features

- `login()` - Authenticate user with credentials
- `logout()` - Clear authentication state
- `getCurrentUser()` - Fetch current user profile
- `getToken()` - Get stored auth token

## Usage

```typescript
import { AuthClient } from '@monorepo/auth-client';

const authClient = new AuthClient('http://localhost:3000');

const response = await authClient.login({
  username: 'user@example.com',
  password: 'password',
});

console.log(response.role); // USER or ADMIN
```
