# Monorepo Architecture POC

A self-contained proof-of-concept demonstrating **NX 19** monorepo architecture with shared packages across **Angular**, **React**, and **Express** workspaces.

---

## Architecture Overview

```
monorepo-architecture-poc/
├── apps/
│   ├── showcase/         ← Angular 18 — interactive demo of all 7 packages (port 4200)
│   ├── team-angular/     ← Angular 18 — admin app using @poc/ui-components (port 4202)
│   └── team-react/       ← React 18 + Vite — product app with Zod validation (port 4201)
│
├── services/
│   ├── api-gateway/      ← Express — single entry point, proxies all routes (port 3000)
│   ├── user-service/     ← Express — User CRUD with validation + events (port 3001)
│   └── notification-service/ ← Express — Notifications with flag gating (port 3002)
│
└── packages/             ← Shared code — the heart of the monorepo
    ├── types/            ← TypeScript interfaces & enums      (@poc/types)
    ├── validators/       ← Zod schemas — browser + Node       (@poc/validators)
    ├── events/           ← Typed event contracts              (@poc/events)
    ├── feature-flags/    ← Runtime feature toggles            (@poc/feature-flags)
    ├── api-client/       ← Typed fetch-based HTTP client      (@poc/api-client)
    ├── ui-components/    ← Angular standalone component lib   (@poc/ui-components)
    └── config/           ← Shared tsconfig + eslint base      (@poc/config)
```

**Key principle**: every `@poc/*` package is consumed directly from source via TypeScript path aliases — no build step required during development.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend services (3 separate terminals)

```bash
# Terminal 1 — User Service (port 3001)
cd services/user-service
npx ts-node-dev --respawn --transpile-only src/main.ts

# Terminal 2 — Notification Service (port 3002)
cd services/notification-service
npx ts-node-dev --respawn --transpile-only src/main.ts

# Terminal 3 — API Gateway (port 3000)
cd services/api-gateway
npx ts-node-dev --respawn --transpile-only src/main.ts
```

### 3. Start the frontend apps (2 more terminals)

```bash
# Terminal 4 — Showcase (port 4200)
cd apps/showcase
npx ng serve --port 4200

# Terminal 5 — Team React (port 4201)
cd apps/team-react
npx vite --port 4201

# Terminal 6 — Team Angular (port 4202)
cd apps/team-angular
npx ng serve --port 4202
```

### 4. Verify services

```bash
curl http://localhost:3000/health     # API Gateway
curl http://localhost:3000/users      # Proxied to user-service
curl http://localhost:3000/flags      # Feature flags snapshot
```

---

## Shared Packages

| Package | Purpose | Used By |
|---------|---------|---------|
| `@poc/types` | Single source of truth for all TypeScript interfaces, enums, DTOs | All apps & services |
| `@poc/validators` | Zod schemas — identical in browser AND Node.js | team-react (forms), user-service (API), showcase (live demo) |
| `@poc/events` | Typed domain event contracts + `EventFactory` | user-service, notification-service |
| `@poc/feature-flags` | Central flag registry — change one value, all consumers react | All apps & services |
| `@poc/api-client` | Typed `fetch`-based HTTP clients (`UserApiClient`, etc.) | team-react, team-angular |
| `@poc/ui-components` | Angular 18 standalone components (Button, Card, Badge, StatusIndicator) | team-angular |
| `@poc/config` | Shared `tsconfig` + ESLint base — no runtime deps | All packages & apps |

---

## Services

| Service | Port | Key Features |
|---------|------|-------------|
| `api-gateway` | 3000 | Proxies `/users` → 3001, `/notifications` → 3002; exposes `GET /flags` |
| `user-service` | 3001 | Full CRUD, in-memory store, Zod validation, event emission, flag gating |
| `notification-service` | 3002 | Notifications, mark-as-read, SMS gated by `NOTIFY_SMS` flag |

---

## Apps

| App | Port | Stack | Demo Focus |
|-----|------|-------|-----------|
| `showcase` | 4200 | Angular 18 | Interactive explorer for all 7 packages — types, validators, flags, events, graph |
| `team-react` | 4201 | React 18 + Vite | CreateUser form with live Zod validation, UserList, FeatureFlags panel |
| `team-angular` | 4202 | Angular 18 | Admin dashboard — uses `@poc/ui-components`, typed API client, flag gating |

---

## NX Commands

```bash
# Run a specific app
npx nx serve showcase
npx nx serve team-react

# Build everything
npx nx run-many --target=build --all

# See the dependency graph
npx nx graph

# Only rebuild/test what changed
npx nx affected --target=test
npx nx affected --target=build

# Lint with module boundary enforcement
npx nx run-many --target=lint --all
```

---

## Feature Flags

All 14 flags are defined in `packages/feature-flags/src/flags.ts`. Change a value **once** and every app and service that imports `@poc/feature-flags` reflects the change immediately — no environment variables, no per-team config files.

| Flag | Default | Description |
|------|---------|-------------|
| `CORE_MAINTENANCE_MODE` | `false` | Puts all services into maintenance mode |
| `CORE_AUDIT_LOGGING` | `true` | Enables audit trail for all mutations |
| `USER_SELF_REGISTRATION` | `true` | Allows new user sign-ups |
| `USER_ROLE_MANAGER_ENABLED` | `true` | Shows manager role option in UI |
| `ORDER_BULK_OPERATIONS` | `true` | Enables bulk order processing |
| `NOTIFY_SMS` | `false` | Gates SMS notification sending |
| `UI_DARK_MODE` | `true` | Activates dark mode in Angular app |
| `UI_NEW_DASHBOARD_LAYOUT` | `false` | Feature-in-progress new layout |

---

## Tech Stack

- **NX 19.8** — task runner, dependency graph, affected builds
- **TypeScript 5.5** — strict mode, path aliases pointing directly to source
- **Angular 18.2** — standalone components, lazy-loaded routes
- **React 18.3 + Vite 5.4** — SPA with Vite path alias resolution
- **Express 4.19** — REST microservices
- **Zod 3.23** — schema validation (isomorphic)
- **npm workspaces** — monorepo package management
