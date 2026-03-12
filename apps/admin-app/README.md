# Admin App

Admin portal for administrators with user management and system statistics.

## Purpose

- Admin dashboard with system overview
- User management interface
- Role-based access control (ADMIN only)
- Demonstrate shared package usage with TypeScript

## Technology Stack

- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Vanilla JS/TS** - No framework (lightweight POC)
- **@monorepo/auth-client** - Shared authentication client
- **@monorepo/types** - Shared TypeScript types

## Features

✅ Admin dashboard with system statistics  
✅ User management table  
✅ Role-based access (ADMIN only)  
✅ Admin profile display  
✅ Recent admin actions feed  
✅ Session validation  
✅ Logout functionality  

## Development

```bash
# Start development server (port 3003)
npm run dev --workspace=@monorepo/admin-app

# Build for production
npm run build --workspace=@monorepo/admin-app

# Preview production build
npm run preview --workspace=@monorepo/admin-app
```

## Access

1. Ensure Auth Service is running (port 3000)
2. Start the Admin App: `npm run dev --workspace=@monorepo/admin-app`
3. Login through Auth Gateway with admin credentials:
   - Username: `admin@example.com`
   - Password: `admin123`
4. You'll be redirected to http://localhost:3003

## Features Demonstrated

### Authentication & Authorization
- Checks for token in localStorage on load
- Validates token with auth service
- **Role verification**: Only ADMIN users can access
- Redirects non-admin users back to login
- Fetches admin profile from `/auth/me` endpoint

### Dashboard Components

#### Admin Profile Card
- Displays admin information (ID, username, email, role)
- Shows ADMIN badge

#### System Statistics
- Total Users: 156
- Admins: 12
- Active Sessions: 1,024

#### User Management Table
- Lists all users with details
- Shows user ID, username, email, role, status
- Action buttons (Edit, Deactivate - mock functionality)
- Color-coded role badges (USER = blue, ADMIN = purple)

#### Recent Admin Actions
- Activity feed showing admin operations
- Timestamped entries

### Role Protection
- Only allows ADMIN role access
- Regular users redirected to login with alert
- USER role users should use User Portal (port 3002)

## File Structure

```
apps/admin-app/
├── src/
│   ├── main.ts          # TypeScript entry point
│   └── style.css        # Admin portal styling
├── index.html           # HTML template with structure
├── vite.config.ts       # Vite configuration (port 3003)
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## API Integration

The app integrates with:

- **Auth Service** (http://localhost:3000)
  - `GET /auth/me` - Fetch current admin profile
  - Validates admin role from response

## User Management

The user management table displays:

| User | Details |
|------|----------|
| user@example.com | USER role, Active |
| admin@example.com | ADMIN role, Active |
| john@example.com | USER role, Active |

Action buttons are currently mock implementations for the POC.

## Architecture Choice

**Why Vanilla TS instead of Angular?**

For this POC, we opted for vanilla TypeScript with Vite instead of full Angular because:
- Faster build times
- Simpler setup
- Lighter weight
- Demonstrates TypeScript capability
- Still shows monorepo shared package usage

Full Angular can be added in future iterations if needed.

## Security

⚠️ **POC Implementation** - Not production ready:
- Tokens in localStorage (vulnerable to XSS)
- Basic role checking
- No CSRF protection
- Mock user management (no real API)
- No audit logging

For production:
- Use HttpOnly cookies
- Implement proper RBAC
- Add CSRF tokens
- Real API integration
- Comprehensive audit logs
- Rate limiting
- Security headers

## Testing

### Manual Testing Steps

1. Start all required services:
   ```bash
   npm run dev --workspace=@monorepo/auth-service   # Port 3000
   npm run dev --workspace=@monorepo/auth-gateway   # Port 3001
   npm run dev --workspace=@monorepo/admin-app      # Port 3003
   ```

2. **Test Admin Access:**
   - Open http://localhost:3001 (Auth Gateway)
   - Login with: `admin@example.com` / `admin123`
   - Verify redirect to Admin App (port 3003)
   - Check that admin dashboard loads
   - Verify all features display correctly

3. **Test Role Protection:**
   - Login with: `user@example.com` / `user123`
   - Should be redirected to port 3002 (User App)
   - If you manually visit port 3003, should see "Access denied" alert

4. **Test Logout:**
   - Click logout button
   - Verify redirect back to login
   - Check localStorage is cleared

## Build Output

Production build creates:
- Optimized TypeScript bundle (~3KB)
- CSS bundle (~3.3KB)
- Source maps for debugging
- Static HTML entry point

All in `dist/` directory.
