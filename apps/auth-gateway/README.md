# Auth Gateway

Login interface for authenticating users and routing them to the appropriate application based on their role.

## Purpose

- Authenticate users via login form
- Determine user role from auth service
- Redirect to React app (users) or Angular app (admins)
- Store authentication token for apps to use

## Technology Stack

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Vanilla JS** - No framework overhead
- **@monorepo/auth-client** - Shared authentication client
- **@monorepo/types** - Shared TypeScript types

## Features

✅ Modern, responsive login UI  
✅ Real-time form validation  
✅ Error handling with user feedback  
✅ Loading states during authentication  
✅ Role-based redirection (USER → React, ADMIN → Angular)  
✅ Token storage in localStorage  
✅ Session validation on page load

## Development

```bash
# Start development server (port 3001)
npm run dev --workspace=@monorepo/auth-gateway

# Build for production
npm run build --workspace=@monorepo/auth-gateway

# Preview production build
npm run preview --workspace=@monorepo/auth-gateway
```

## Usage

1. Open http://localhost:3001/
2. Enter credentials:
   - **User**: `user@example.com` / `user123`
   - **Admin**: `admin@example.com` / `admin123`
3. Click "Sign In"
4. Application will redirect based on role:
   - USER → http://localhost:3002 (React User App)
   - ADMIN → http://localhost:3003 (Angular Admin App)

## Architecture

### Authentication Flow

```
┌─────────────┐
│ User enters │
│ credentials │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Auth Gateway        │
│ (Vite Frontend)     │
└──────┬──────────────┘
       │ POST /auth/login
       ▼
┌─────────────────────┐
│ Auth Service        │
│ (Hapi.js Backend)   │
└──────┬──────────────┘
       │ Returns token + role
       ▼
┌─────────────────────┐
│ Store in localStorage│
│ - authToken         │
│ - userId            │
│ - userRole          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect based on   │
│ role:               │
│ USER → :3002        │
│ ADMIN → :3003       │
└─────────────────────┘
```

### Dependencies

- **@monorepo/auth-client** - API client for authentication
- **@monorepo/types** - Shared TypeScript interfaces

### File Structure

```
apps/auth-gateway/
├── src/
│   ├── main.ts          # Application logic and auth flow
│   └── style.css        # UI styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Configuration

The gateway connects to:

- **Auth Service**: `http://localhost:3000` (configured in main.ts)
- **User App**: `http://localhost:3002` (React)
- **Admin App**: `http://localhost:3003` (Angular)

To change these URLs, modify the constants in [src/main.ts](src/main.ts):

```typescript
const API_BASE_URL = 'http://localhost:3000';
const USER_APP_URL = 'http://localhost:3002';
const ADMIN_APP_URL = 'http://localhost:3003';
```

## Security Note

⚠️ This is a POC implementation. Not production-ready:
- Tokens stored in localStorage (vulnerable to XSS)
-  No HTTPS enforcement
- No CSRF protection
- No rate limiting
- Basic error handling

For production, implement:
- HttpOnly cookies for token storage
- HTTPS everywhere
- CSRF tokens
- Rate limiting
- Proper error handling and logging
- Security headers

## Testing

### Manual Testing

1. Ensure auth service is running: `npm run dev --workspace=@monorepo/auth-service`
2. Start auth gateway: `npm run dev --workspace=@monorepo/auth-gateway`
3. Open browser to http://localhost:3001/
4. Test login with provided credentials
5. Verify redirection (will show 404 until apps are built)

### Automated Testing

```bash
# Check if gateway is accessible
curl -I http://localhost:3001/

# Should return HTTP 200
```

## Next Steps

Once User App (React) and Admin App (Angular) are implemented:
1. Start all services
2. Login through Auth Gateway
3. Verify seamless redirection
4. Test that apps can access stored tokens

