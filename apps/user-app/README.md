# User App

React application for regular users with a modern dashboard interface.

## Purpose

- User dashboard with profile information
- Display user data fetched from auth service
- Demonstrate shared package usage with React
- Protected routes requiring authentication

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **@monorepo/auth-client** - Shared authentication client
- **@monorepo/types** - Shared TypeScript types

## Features

✅ Modern, responsive dashboard UI  
✅ Real-time user profile display  
✅ Session validation  
✅ Protected routes (redirects to login if not authenticated)  
✅ Role checking (USER role required)  
✅ Account statistics display  
✅ Recent activity feed  
✅ Logout functionality  

## Development

```bash
# Start development server (port 3002)
npm run dev --workspace=@monorepo/user-app

# Build for production
npm run build --workspace=@monorepo/user-app

# Preview production build
npm run preview --workspace=@monorepo/user-app
```

## Access

1. Ensure Auth Service is running (port 3000)
2. Start the User App: `npm run dev --workspace=@monorepo/user-app`
3. Login through Auth Gateway with user credentials:
   - Username: `user@example.com`
   - Password: `user123`
4. You'll be redirected to http://localhost:3002

## Features Demonstrated

### Authentication Flow
- Checks for token in localStorage on load
- Validates token with auth service
- Redirects to login if invalid/missing
- Fetches user profile from `/auth/me` endpoint

### Dashboard Components
- **Profile Card**: Displays user information (ID, username, email, role)
- **Stats Cards**: Shows account statistics
- **Activity Feed**: Recent user activities
- **Info Card**: Application details and tech stack

### Role Protection
- Only allows USER role access
- ADMIN users should use Admin Portal (port 3003)

## File Structure

```
apps/user-app/
├── src/
│   ├── App.tsx          # Main React component with dashboard
│   ├── App.css          # Styling for the app
│   ├── main.tsx         # React entry point
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration (port 3002)
├── tsconfig.json        # TypeScript config for app
├── tsconfig.node.json   # TypeScript config for Vite
└── package.json         # Dependencies and scripts
```

## API Integration

The app integrates with:

- **Auth Service** (http://localhost:3000)
  - `GET /auth/me` - Fetch current user profile

## State Management

- Uses React hooks (useState, useEffect)
- localStorage for token persistence
- No external state management library (simple POC)

## Security

⚠️ **POC Implementation** - Not production ready:
- Tokens in localStorage (vulnerable to XSS)
- No token refresh mechanism
- Basic error handling
- No HTTPS

For production:
- Use HttpOnly cookies
- Implement token refresh
- Add comprehensive error handling
- Enable HTTPS
- Add security headers

## Testing

### Manual Testing Steps

1. Start all required services:
   ```bash
   npm run dev --workspace=@monorepo/auth-service   # Port 3000
   npm run dev --workspace=@monorepo/auth-gateway   # Port 3001
   npm run dev --workspace=@monorepo/user-app       # Port 3002
   ```

2. Open http://localhost:3001 (Auth Gateway)
3. Login with: `user@example.com` / `user123`
4. Verify redirect to User App (port 3002)
5. Check that profile displays correctly
6. Test logout button
7. Verify redirect back to login

## Build Output

Production build creates:
- Optimized React bundle (~147KB)
- CSS bundle (~2.7KB)
- Source maps for debugging
- Static HTML entry point

All in `dist/` directory.
