# Monorepo Architecture POC

A proof of concept demonstrating monorepo architecture with multi-framework applications, shared packages, and centralized authentication.

## Architecture Overview

This monorepo contains:

- **3 Frontend Applications**: Auth Gateway, React User App, Angular Admin App
- **1 Backend Service**: Authentication API
- **3 Shared Packages**: Types, Auth Client, Config

### Structure

```
repo/
├── apps/
│   ├── auth-gateway/      # Login UI (framework TBD)
│   ├── user-app/          # React application for users
│   └── admin-app/         # Angular application for admins
├── services/
│   └── auth-service/      # Node.js authentication API
├── packages/
│   ├── types/             # Shared TypeScript types
│   ├── auth-client/       # Shared authentication client
│   └── config/            # Shared tooling configuration
├── docs/
│   └── ai-context.md      # Detailed architecture documentation
├── turbo.json             # Turborepo configuration
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── package.json           # Root package.json
```

## Technology Stack

- **Package Manager**: pnpm
- **Build Orchestration**: Turborepo
- **Frontend Frameworks**: React, Angular
- **Backend**: Node.js with Hapi.js
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
# Install dependencies
npm install

# Build all packages
npm run build
```

### Running the Complete System

Start all services in separate terminals or use the background method:

```bash
# Terminal 1: Auth Service (Backend API)
npm run dev --workspace=@monorepo/auth-service

# Terminal 2: Auth Gateway (Login UI)
npm run dev --workspace=@monorepo/auth-gateway

# Terminal 3: User App (React)
npm run dev --workspace=@monorepo/user-app

# Terminal 4: Admin App (Angular)
npm run dev --workspace=@monorepo/admin-app
```

Or use the automated test script:

```bash
./test-full-flow.sh
```

### Access the Applications

| Application | URL | Purpose |
|------------|-----|---------|
| **Auth Gateway** | http://localhost:3001 | Login interface |
| **User App** | http://localhost:3002 | React dashboard for users |
| **Admin App** | http://localhost:3003 | Admin portal |
| **Auth Service API** | http://localhost:3000 | Backend API |

### Test Credentials

| Role | Username | Password | Redirects To |
|------|----------|----------|--------------|
| User | user@example.com | user123 | User App (port 3002) |
| Admin | admin@example.com | admin123 | Admin App (port 3003) |

### Complete Authentication Flow

1. Open **http://localhost:3001** (Auth Gateway)
2. Enter credentials
3. System authenticates via Auth Service
4. Based on role, redirects to:
   - **USER** → React User App (port 3002)
   - **ADMIN** → Admin Portal (port 3003)
5. Dashboard loads with user profile from API
6. Logout returns to Auth Gateway

## Key Features

✅ Multi-framework support (React + Angular)  
✅ Shared TypeScript types across all apps  
✅ Shared authentication client library  
✅ Centralized authentication flow  
✅ Role-based routing (USER → React, ADMIN → Angular)  
✅ Turborepo for caching and parallel builds  
✅ pnpm workspaces for dependency management

## Authentication Flow

1. User accesses **Auth Gateway**
2. User logs in with credentials
3. **Auth Service** validates credentials and returns role + token
4. Gateway redirects based on role:
   - `USER` → React User App
   - `ADMIN` → Angular Admin App

## Workspace Commands

```bash
# Build all packages and applications
npm run build

# Build with Turborepo (with caching)
npx turbo build

# Start individual services
npm run dev --workspace=@monorepo/auth-service
npm run dev --workspace=@monorepo/auth-gateway
npm run dev --workspace=@monorepo/user-app
npm run dev --workspace=@monorepo/admin-app

# Clean build artifacts
npm run clean --workspace=@monorepo/types
npm run clean --workspace=@monorepo/auth-client

# Run tests
./test-full-flow.sh
./services/auth-service/test-service.sh
```

## Package Dependencies

Apps and services can depend on shared packages:

- All apps depend on `@monorepo/types` and `@monorepo/auth-client`
- Backend service depends on `@monorepo/types`
- Packages remain framework-agnostic

## Next Steps

See [docs/ai-context.md](docs/ai-context.md) for the complete POC roadmap and implementation phases.

## License

This is a proof of concept for architectural exploration.
