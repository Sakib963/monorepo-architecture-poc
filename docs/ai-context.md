# Monorepo Proof of Concept (POC) - Implementation Guide

## Overview

This repository is a **monorepo proof of concept** demonstrating how a banking organization can manage multiple frontend portals within a single repository while sharing code, UI components, validation logic, and business services.

### POC Objectives
- Explore multi-app architecture within a single monorepo
- Demonstrate shared package reuse across independent applications
- Validate Nx build orchestration (affected builds, incremental caching)
- Prove framework-neutral UI component pattern viability
- Establish governance boundaries and dependency isolation

### What This POC Is NOT
- Production-ready authentication or authorization
- Complete microservices architecture
- Enterprise CI/CD implementation
- Full compliance/security hardening

---

## Core Architecture

**Two Angular Portal Applications** (both standalone Angular 18):
1. **User Portal** (`apps/user-portal`) - serves regular/customer users
2. **Admin Portal** (`apps/team-angular`) - serves administrators
3. **Showcase App** (`apps/showcase`) - demonstrates shared components and features

**Backend Services** (shared API layer):
1. **API Gateway** (`services/api-gateway`) - request router and proxy
2. **User Service** (`services/user-service`) - user CRUD, event emission
3. **Notification Service** (`services/notification-service`) - notification delivery

**Shared Packages** (reusable domain code):
1. `@poc/types` - TypeScript interfaces, enums, DTOs
2. `@poc/validators` - Zod validation schemas
3. `@poc/api-client` - Typed HTTP client
4. `@poc/feature-flags` - Feature flag registry
5. `@poc/events` - Typed domain events
6. `@poc/ui-components` - Shared Angular + Web Components
7. `@poc/config` - TypeScript base configs

---

## Repository Structure

```
monorepo-poc/
├── apps/                          # Frontend applications
│   ├── user-portal/              # User portal
│   ├── team-angular/             # Admin portal
│   └── showcase/                 # UI + feature showcase app
│
├── services/                      # Backend services
│   ├── api-gateway/              # HTTP proxy + auth routing
│   ├── user-service/             # User management + events
│   └── notification-service/     # Notifications
│
├── packages/                      # Shared reusable code
│   ├── types/                    # Domain models (User, Order, etc.)
│   ├── validators/               # Zod form + API validation schemas
│   ├── api-client/               # Typed HTTP client layer
│   ├── feature-flags/            # Centralized feature toggles
│   ├── events/                   # Domain event definitions
│   ├── ui-components/            # Angular components + Web Components
│   └── config/                   # TypeScript base configs
│
├── docs/
│   ├── ai-context.md            # This file
│   ├── checkpoint.md            # Implementation phases (legacy)
│   └── summary.md               # Stakeholder decision document (legacy)
│
├── .nx/                          # Nx cache
├── nx.json                       # Nx config (tasks, dependency rules)
├── tsconfig.base.json           # Root TypeScript config + path aliases
├── package.json                 # Monorepo dependencies
└── start.sh / stop.sh           # Local dev orchestration
```

---

## Key Features Demonstrated

### 1) Shared Packages Without Duplication
- **@poc/types**: One User interface used by all apps + services
- **@poc/validators**: Zod schemas shared between frontend form validation and backend API validation
- **@poc/api-client**: All HTTP calls go through one typed client library

### 2) Nx Build Orchestration
- Dependency graph automatically computed from `tsconfig.base.json` path aliases
- `nx affected` builds only changed packages + dependents
- Cache invalidation avoids rebuilding when nothing changed
- Example: Change User Portal UI → rebuild only User Portal (not Admin Portal or services)

### 3) Shared UI Components (Framework-Neutral)
- Angular components in `packages/ui-components/src/` for Angular apps
- Web Components bridge for future React/Vue/Svelte adoption
- All apps consume `poc-shared-button`, `poc-badge`, `poc-card` consistently

### 4) Centralized Feature Flags
- Single source of truth: `packages/feature-flags/src/flags.ts`
- 14+ feature flags gate functionality across all apps + services
- Example: `FEATURE_ENABLE_BULK_CREATE` gates bulk user creation in admin portal

### 5) Independent Deployment
- Each app builds independently via `nx build <app>`
- Admin Portal can deploy while User Portal stays stable
- Backend services versioned separately from frontend

---

## Non-Dummy UI Scope: Real Pages Per App

This POC must include meaningful route-based pages in each portal, not a single demo screen.

### User Portal (Angular)
Minimum pages:
1. `/dashboard` - account overview + quick actions
2. `/profile` - customer profile read/update form
3. `/accounts` - list of accounts and balances
4. `/transactions` - paginated transaction history with filters
5. `/notifications` - user notifications list + read/unread state

### Admin Portal (Angular)
Minimum pages:
1. `/dashboard` - admin KPIs and system health cards
2. `/users` - user list with search, sort, and status
3. `/users/:id` - user details + role/status actions
4. `/approvals` - pending operations requiring admin approval
5. `/flags` - feature-flag management screen (controlled)
6. `/audit-logs` - operational audit list view

### Showcase App (Angular)
Minimum pages:
1. `/start-here` - meeting entry point and architecture context
2. `/not-monorepo` - anti-patterns and false-monorepo signals
3. `/why-monorepo` - rationale and expected outcomes
4. `/trade-offs` - operational costs and mitigation approach
5. `/repo-proof` - concrete evidence from this repository
6. `/implementation-walkthrough` - onboarding and execution runbook

### Shared UI Usage Rule
- Every page must use at least one shared element from `@poc/ui-components`.
- New UI patterns should be added in shared package first, then consumed by pages.

### Data Rule for POC
- Use realistic mock/seeded API responses through services.
- No static hardcoded-only page content except loading/empty/error placeholders.

### Action Rule for POC (Mandatory)
- Each page must support at least one **real user action** (submit/update/approve/reject/lock/toggle), not only read-only widgets.
- Every action should call typed APIs from `@poc/api-client` and use contracts from `@poc/types`.

### Required Action Scenarios

#### User Portal actions
1. `/profile` → **UpdateProfileAction** (name, phone, address)
2. `/accounts` → **RequestStatementAction** (account + date range)
3. `/transactions` → **CreateTransferAction** (from, to, amount, note)
4. `/notifications` → **MarkNotificationReadAction** (single + bulk)

#### Admin Portal actions
1. `/users/:id` → **ChangeUserStatusAction** (ACTIVE/SUSPENDED/BLOCKED)
2. `/users/:id` → **ResetUserCredentialAction**
3. `/approvals` → **ApproveTransferAction** / **RejectTransferAction**
4. `/flags` → **ToggleFeatureFlagAction**
5. `/audit-logs` → **ExportAuditLogAction** (CSV/PDF)

#### Shared action states (all apps)
- `idle` → `submitting` → `success` / `error`
- Show loading, success toast, and structured error response (`code`, `message`, `traceId`)

---

## Type Contracts for Real User/Admin Actions

These sample contracts should exist in `@poc/types` to keep UI and API behavior aligned.

```ts
// packages/types/src/actions.types.ts

export type PortalActor = 'USER' | 'ADMIN';

export interface ActionMeta {
    actorId: string;
    actorType: PortalActor;
    traceId: string;
    requestedAt: string; // ISO string
}

export interface CreateTransferAction {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    currency: 'BDT' | 'USD';
    note?: string;
}

export interface ApproveTransferAction {
    transferId: string;
    decision: 'APPROVE' | 'REJECT';
    reason?: string;
}

export interface UpdateProfileAction {
    fullName: string;
    phone: string;
    addressLine: string;
}

export interface ChangeUserStatusAction {
    userId: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
    reason: string;
}

export interface ToggleFeatureFlagAction {
    flagKey: string;
    enabled: boolean;
    reason: string;
}

export interface ActionResult<T = unknown> {
    ok: boolean;
    code: string;
    message: string;
    traceId: string;
    data?: T;
}
```

### Page-to-Type Mapping (POC acceptance)
- User `/transactions` must submit `CreateTransferAction`
- Admin `/approvals` must submit `ApproveTransferAction`
- User `/profile` must submit `UpdateProfileAction`
- Admin `/users/:id` must submit `ChangeUserStatusAction`
- Admin `/flags` must submit `ToggleFeatureFlagAction`

---

## Architecture & Dependency Boundaries

### Nx Tagging Rules (Enforced via ESLint)
```
- Apps can import from packages only
- Services can import from packages only
- Packages can import from other packages only
- NO app-to-app imports
- NO service-to-app imports
```

### Path Aliases (tsconfig.base.json)
```json
"@poc/types": "packages/types/src"
"@poc/validators": "packages/validators/src"
"@poc/api-client": "packages/api-client/src"
"@poc/feature-flags": "packages/feature-flags/src"
"@poc/events": "packages/events/src"
"@poc/ui-components": "packages/ui-components/src/index.ts"
"@poc/ui-components/shared-elements": "packages/ui-components/src/shared-elements.ts"
```

---

## Data Flow Example

### User Creation Flow (Demonstrates Shared Packages)

1. **User Portal Form** → User enters form (tags: `@poc/ui-components`)
2. **Frontend Validation** → Validates using `@poc/validators/user.schema.ts`
3. **API Call** → Sends via `@poc/api-client/UserClient`
4. **API Gateway** → Routes to User Service using feature flag `FEATURE_USER_SELF_REGISTRATION`
5. **User Service** → Validates again using same `@poc/validators` (sync guarantee)
6. **Emits Event** → Emit `UserCreatedEvent` from `@poc/events`
7. **Notification Service** → Subscribes to event, sends notification
8. **Admin Portal Sees** → New user appears in admin dashboard via polling/realtime

---

## Technology Stack

### Frontend
- **Angular 18** (both portals)
- **TypeScript 5.5**
- **Web Components** (Custom Elements API for framework-neutral UI)
- **Tailwind CSS** (styling)
- **ng-zorro** (optional UI framework components)

### Backend
- **Node.js** (services)
- **Express/Hapi** (HTTP framework)
- **TypeScript** (type safety)

### Build & Orchestration
- **Nx 19** (monorepo orchestration, caching, affected builds)
- **Angular CLI** (Angular compiler)

### Scope Clarification
- Current POC scope is **Angular-only portals**.
- Cross-framework support via Web Components remains a future extension, not current delivery scope.

### Dev Tools
- **ESLint** (lint, enforce module boundaries)
- **Prettier** (code formatting)
- **Zod** (runtime validation)

---

## Monorepo Workflow: Day-to-Day

### Starting Development
```bash
npm install                # Install all deps
npm run dev               # Start all apps + services locally

# Locally available:
# User Portal: http://localhost:4201
# Admin Portal: http://localhost:4202
# API Gateway: http://localhost:3000
```

### Building for Affected Changes
```bash
# Rebuild only affected by your changes
nx affected --target=build

# Example: If you touch packages/types/src/user.ts
# Nx rebuilds: types package + user-portal + team-angular + showcase + user-service + notification-service
```

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/bulk-user-import

# 2. Changes stay local to one app or package
# Example: Add BulkImportComponent to admin portal

# 3. Push and PR
# CI runs: affected build/lint/test
# Code review checks: did you break shared contracts?

# 4. Merge
# Product decides which portal to deploy

# 5. Deploy
npx nx build user-portal          # User portal artifact
npx nx build @poc/team-angular    # Admin portal artifact
```

### Shared Package Change (Higher Stakes)
```bash
# 1. Update shared schema in packages/validators
# Example: Add "department" field to User creation validator

# 2. All consumers break immediately (TypeScript compilation error)
# Example: Both portals need to handle department field

# 3. PR must fix all consumers in single commit
# Reviewers see: validator change + 2 app updates + 1 service update

# 4. Merge only after testing passes for all 5 projects
# Nx forced this verification automatically

# 5. Deploy all affected apps + services together
```

---

## Dependency Resolution Example

### "We have 7 projects, what happens when we change types?"

```
packages/types
    ↓
    Used by: @poc/validators, @poc/api-client, @poc/events, @poc/ui-components
    ↓
    Consumers of validators: apps/user-portal, apps/team-angular, services/user-service
    Consumers of api-client: apps/user-portal, apps/team-angular, apps/showcase, services/api-gateway
    ↓
    Result: Change types → 7 projects affected → nx affected rebuilds all 7
    Build time: ~15 seconds (with cache, ~1 second if unchanged)
```

---

## Delivery Governance (POC)

### Team Responsibilities
- Portal teams maintain page routes and UX actions
- Platform/shared team maintains reusable packages (`types`, `validators`, `ui-components`, `api-client`)
- Service team maintains API contracts and action handlers

### Review Requirements
- App-local change: smoke test affected app routes
- Shared-package change: validate all affected apps/services via `nx affected`
- Breaking contract change: include migration note and update all impacted consumers in same PR

---

## Success Criteria for POC

✅ All apps/services/packages build successfully in monorepo
✅ User and Admin portals each implement the minimum required page set
✅ Each page consumes shared UI components (not isolated per-app UI copies)
✅ Each page implements at least one typed action flow (submit/update/approve/toggle)
✅ Shared types prevent runtime contract drift (TypeScript enforcement)
✅ Feature flags gate behavior across apps and services
✅ Nx affected detects impact correctly for app-local and shared-package changes
✅ Independent deployment possible (single portal in isolation)
✅ Shared package changes ripple safely and are validated before merge

---

## Scaling from POC to Production

### Phase 1: Prove (Current)
- Validate 5-7 projects coexist
- Test shared package benefits
- Demonstrate build automation

### Phase 2: Governance
- Formalize review and release checklist
- Document shared package lifecycle
- Establish rollback procedures

### Phase 3: Migrate
- Integrate real portals one by one
- Consolidate duplicated code
- Set up production CI/CD

### Phase 4: Operate
- Monitor build times
- Track team velocity
- Adjust boundaries as needed

---

## Quick Command Reference

```bash
npm run dev                              # Start all apps + services
npm run build                            # Build all projects
npx nx build @poc/team-angular           # Build only admin portal
npx nx affected --target=build           # Build only affected projects
npx nx graph                             # Visualize dependency graph
npx nx lint                              # Lint all projects
npx nx test                              # Test all projects
npx nx affected --target=test            # Test only affected projects
```

---

## Key Learnings from This POC

1. **Shared types enable safety**: One User interface prevents versioning mismatches
2. **Validators sync frontend/backend**: Same Zod schema removes validation drift
3. **Shared UI stays consistent**: one component system reused across multiple Angular portals
4. **Nx handles complexity**: Task graph + caching reduce CI/CD friction
5. **Governance matters more than tooling**: Architecture works only with discipline
6. **Independent deployment is possible**: Affected-only builds support per-app release
7. **Documentation is critical**: Onboarding and knowledge transfer require investment

---

## Next Steps (After POC Approval)

1. Review `docs/summary.md` decision document with leadership
2. Define review/release checklist and PR quality gates
3. Identify legacy portal to migrate first (highest ROI target)
4. Establish CI/CD pipeline with affected-only builds
5. Create onboarding guide for 25+ developers
6. Set metrics: code duplication %, build time, deploy frequency

---

## Execution Notes (2026-03-29)

- Angular-only delivery is finalized: `user-portal` and `@poc/team-angular` are the active portal apps.
- Deprecated React placeholder (`@poc/team-react-deprecated`) is excluded from Nx task targets (`targets: {}`) and no longer appears in `build --all` execution.
- Required portal and showcase routes are complete and covered by smoke tests under `tests/smoke`.
- Shared package quality gates are active for `@poc/types`, `@poc/validators`, and `@poc/api-client` via dedicated Nx `test` targets and `tests/shared`.
- Full verification suite has been exercised with successful lint/build/test and representative affected checks.
