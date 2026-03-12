# Auth Service

Backend authentication API service built with Hapi.js.

## Purpose

- Validate user credentials
- Return authentication tokens
- Provide role information (USER/ADMIN)
- Mock user database for POC

## Technology

- Node.js
- Hapi.js
- TypeScript

## API Endpoints

### GET /
Service health check

**Response:**
```json
{
  "service": "auth-service",
  "version": "1.0.0",
  "status": "running"
}
```

### POST /auth/login
Authenticate user with credentials

**Request:**
```json
{
  "username": "user@example.com",
  "password": "user123"
}
```

**Response (200):**
```json
{
  "userId": "1",
  "role": "USER",
  "token": "eyJ1c2VySWQiOiIxIiwicm9sZSI6IlVTRVIiLCJ0aW1lc3RhbXAiOjE3NzMyMTc5MzUwMTh9"
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

### GET /auth/me
Get current user information (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "userId": "1",
  "username": "user@example.com",
  "email": "user@example.com",
  "role": "USER"
}
```

**Response (401):**
```json
{
  "error": "Invalid token"
}
```

## Test Credentials

### Regular User
- **Username:** `user@example.com`
- **Password:** `user123`
- **Role:** USER

### Administrator
- **Username:** `admin@example.com`
- **Password:** `admin123`
- **Role:** ADMIN

### Additional User
- **Username:** `john@example.com`
- **Password:** `password`
- **Role:** USER

## Development

```bash
# Start development server
npm run dev --workspace=@monorepo/auth-service

# Build
npm run build --workspace=@monorepo/auth-service

# Start production server
npm run start --workspace=@monorepo/auth-service

# Run tests
./services/auth-service/test-service.sh
```

## Testing

Run the automated test script:

```bash
./services/auth-service/test-service.sh
```

Or test manually with curl:

```bash
# Login as user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"user123"}'

# Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"admin123"}'

# Get current user (use token from login response)
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Note

⚠️ This is a POC implementation. The authentication mechanism is NOT production-ready:
- Tokens are simple Base64-encoded JSON (no JWT signatures)
- No token expiry
- Passwords stored in plain text
- No rate limiting
- No HTTPS enforcement

For production, use proper JWT libraries, password hashing (bcrypt), and security best practices.

