# Monorepo POC Refactor Execution Plan

Status legend:
- [ ] Pending
- [~] In Progress
- [x] Done

This plan is designed to execute the full target state described in `docs/ai-context.md` by refactoring the current repo in controlled, testable steps.

**Hard scope constraint (locked): Angular-only implementation.**
- No new React code.
- No React router/pages/components in delivery scope.
- User Portal and Admin Portal must both run on Angular.
- Existing React app artifacts are treated as migration/decommission work, not feature work.

---

## Phase 0 - Baseline and Safety (No functional changes)

### 0.1 Baseline snapshot
- [x] Record current app/service/package inventory from workspace
- [x] Record current routes for User/Admin/Showcase apps
- [x] Record current shared package exports (`types`, `validators`, `api-client`, `feature-flags`, `events`, `ui-components`, `config`)
- [x] Capture baseline build status (`nx run-many -t build --all`)
- [x] Capture baseline lint status (`nx run-many -t lint --all`)

### 0.2 Refactor guardrails
- [x] Create branch naming convention for this refactor stream
- [x] Define merge strategy (small PRs, one bounded scope per PR)
- [x] Define rollback strategy (revert-by-phase and feature-flag fallback)
- [x] Confirm no breaking production data dependencies are introduced in POC scope

---

## Phase 1 - Workspace Alignment (Nx + app identity)

### 1.1 App identity cleanup (POC naming)
- [x] Decide naming strategy: keep physical folder names vs rename to `user-portal` / `admin-portal`
- [x] If keeping folders, add logical naming map in docs and scripts
- [x] If renaming folders, execute rename + update Nx project names *(N/A: keeping physical folders in Iteration 1)*
- [x] Update app display titles/navigation labels to User Portal/Admin Portal
- [x] Verify `nx graph` shows expected project relationships after alignment

### 1.4 Angular-only migration setup (mandatory)
- [x] Define migration target: `apps/user-portal` as Angular app (replace React implementation)
- [x] Create Angular user-portal app (or convert existing team-react project to Angular)
- [x] Rewire Nx project references from `@poc/team-react` to Angular user portal target
- [x] Remove React runtime dependencies from workspace scope (where no longer required)
- [x] Remove React-only entrypoints from shared package docs/usages (retain only if explicitly future scope)
- [x] Mark old React app as deprecated and excluded from delivery acceptance

### 1.2 Nx orchestration hardening
- [x] Confirm `nx.json` target defaults for build/test/lint/dev are correct
- [x] Verify `affected.defaultBase` is set and usable in CI mode
- [x] Confirm cacheable operations include build/test/lint
- [x] Verify `namedInputs` includes production-safe exclusions
- [x] Validate `nx affected --target=build` on sample app-only change
- [x] Validate `nx affected --target=build` on sample shared-package change

### 1.3 Dependency boundaries
- [x] Confirm ESLint `@nx/enforce-module-boundaries` rule is active
- [x] Confirm tags exist and are applied to all projects
- [x] Add/fix tag constraints: app->package/ui, service->package, package->package
- [x] Run lint to ensure no app-to-app imports
- [x] Run lint to ensure no service-to-app imports

---

## Phase 2 - Shared Contracts First (`@poc/types`)

### 2.1 Add action contracts from plan
- [x] Add `PortalActor`, `ActionMeta`, `ActionResult`
- [x] Add `CreateTransferAction`
- [x] Add `ApproveTransferAction`
- [x] Add `UpdateProfileAction`
- [x] Add `ChangeUserStatusAction`
- [x] Add `ToggleFeatureFlagAction`
- [x] Add remaining action DTOs from page requirements:
  - [x] `RequestStatementAction`
  - [x] `MarkNotificationReadAction`
  - [x] `ResetUserCredentialAction`
  - [x] `ExportAuditLogAction`
- [x] Export all new contracts in package barrel

### 2.2 Contract validation pass
- [x] Add or align response envelopes with `code/message/traceId`
- [x] Ensure action types are reusable by both apps and services
- [x] Ensure no app-specific types leak into shared package
- [x] Build affected projects and fix compile regressions

### Iteration 1 notes (evidence + blockers)
- [x] Evidence captured: full build passed (`nx run-many -t build --all`)
- [x] Evidence captured: `nx affected --target=build` validated for app-local and shared-package file changes
- [x] Evidence captured: Nx graph artifact generated at `tmp/nx-graph-iteration1.html`
- [x] Blocker resolved: lint parsing and plugin issues fixed; full lint now passes (`nx run-many -t lint --all`)

---

## Phase 3 - Validation Layer (`@poc/validators`)

### 3.1 Schema implementation for actions
- [x] Implement Zod schema for transfer creation
- [x] Implement Zod schema for profile update
- [x] Implement Zod schema for statement request
- [x] Implement Zod schema for notification read actions
- [x] Implement Zod schema for user status change
- [x] Implement Zod schema for approval decision
- [x] Implement Zod schema for feature flag toggle
- [x] Implement Zod schema for audit export request

### 3.2 Shared validation behavior
- [x] Add helper mappers (Zod issues -> `ActionResult` error format)
- [x] Ensure frontend and backend use same schema imports
- [ ] Add sample invalid payload tests (unit-level)
- [ ] Run affected tests for validators consumers

---

## Phase 4 - API Client Consolidation (`@poc/api-client`)

### 4.1 Client surface by role
- [x] Add user-facing action methods:
  - [x] `updateProfile()`
  - [x] `requestStatement()`
  - [x] `createTransfer()`
  - [x] `markNotificationRead()`
- [x] Add admin-facing action methods:
  - [x] `changeUserStatus()`
  - [x] `resetUserCredential()`
  - [x] `approveTransfer()` / `rejectTransfer()`
  - [x] `toggleFeatureFlag()`
  - [x] `exportAuditLogs()`

### 4.2 Error/state consistency
- [x] Normalize API error parsing to `ActionResult`
- [x] Ensure traceId propagation support in client
- [x] Add typed paginated list helpers for list pages
- [x] Validate all client methods against `@poc/types`

---

## Phase 5 - Shared UI Components (`@poc/ui-components`)

### 5.1 Component readiness for action-driven pages
- [x] Confirm shared button supports loading/disabled/variant/size states
- [ ] Confirm input/form components are reusable for both portals
- [x] Add shared table/list primitives for users/transactions/audit rows
- [x] Add shared status badge/chip for `ACTIVE/SUSPENDED/BLOCKED`
- [x] Add shared notification list item component
- [x] Add shared empty/loading/error state components

### 5.2 Action UX standards
- [ ] Add standard submit state visuals (idle/submitting/success/error)
- [ ] Add standard toast component or shared feedback API
- [x] Ensure every page can show structured error (code/message/traceId)
- [ ] Verify components are consumed by User/Admin pages (not duplicated)

### Iteration 2 notes (evidence + pending)
- [x] Evidence captured: target package lint passed (`@poc/validators`, `@poc/api-client`, `@poc/ui-components`)
- [x] Evidence captured: target package builds passed
- [x] Evidence captured: full workspace lint passed (`nx run-many -t lint --all`)
- [x] Evidence captured: full workspace build passed (`nx run-many -t build --all`)
- [ ] Pending intentionally: validators test tasks remain because no test targets are configured for these libraries yet

---

## Phase 6 - User Portal Routes and Actions

Framework requirement: **Angular only**

Required routes: `/dashboard`, `/profile`, `/accounts`, `/transactions`, `/notifications`

### 6.1 Route skeleton and navigation
- [x] Create/verify route config for all required pages
- [x] Add route guards/layout shell as needed
- [x] Add navigation links and active-state behavior

### 6.2 Page implementation
- [x] `/dashboard`: overview widgets + quick actions (real data)
- [x] `/profile`: update profile form + submit action
- [x] `/accounts`: account list + statement request action
- [x] `/transactions`: transaction list + transfer creation action
- [x] `/notifications`: list + mark read (single/bulk) action

### 6.3 User portal acceptance checks
- [x] Each page uses at least one shared UI component
- [x] Each action calls `@poc/api-client` with `@poc/types` contracts
- [x] Each page implements loading/success/error states
- [x] No hardcoded-only data except placeholder states

### Iteration 3 notes (evidence + pending)
- [x] Evidence captured: Angular `user-portal` app generated and tagged (`type:app`)
- [x] Evidence captured: `nx lint user-portal` passed
- [x] Evidence captured: `nx build user-portal` passed with required route chunks
- [x] Evidence captured: required user routes implemented (`/dashboard`, `/profile`, `/accounts`, `/transactions`, `/notifications`)
- [x] Evidence captured: showcase and workspace references retargeted from `team-react` to `user-portal`
- [x] Evidence captured: old React app marked deprecated (`apps/team-react/project.json` targets cleared)
- [x] Evidence captured: root React-only config/dependencies removed (`package.json`, `.eslintrc.json`, `nx.json`, `tsconfig.base.json`)
- [x] Evidence captured: full workspace lint passed after Angular-only migration (`nx run-many -t lint --all`)
- [x] Evidence captured: full workspace build passed after Angular-only migration (`nx run-many -t build --all`)

---

## Phase 7 - Admin Portal Routes and Actions

Required routes: `/dashboard`, `/users`, `/users/:id`, `/approvals`, `/flags`, `/audit-logs`

### 7.1 Route skeleton and navigation
- [x] Create/verify route config for all required pages
- [x] Add admin shell and navigation sections

### 7.2 Page implementation
- [x] `/dashboard`: KPI cards + system health summaries
- [x] `/users`: search/sort/filter/status list
- [x] `/users/:id`: user detail + status change + credential reset actions
- [x] `/approvals`: queue + approve/reject transfer actions
- [x] `/flags`: feature flag toggle action
- [x] `/audit-logs`: list + export CSV/PDF action

### 7.3 Admin portal acceptance checks
- [x] Each page uses at least one shared UI component
- [x] Each action calls `@poc/api-client` with `@poc/types` contracts
- [x] Each page implements loading/success/error states
- [x] No hardcoded-only data except placeholder states

### Iteration 4 notes (evidence + pending)
- [x] Evidence captured: admin route set implemented (`/dashboard`, `/users`, `/users/:id`, `/approvals`, `/flags`, `/audit-logs`)
- [x] Evidence captured: `nx lint @poc/team-angular` passed
- [x] Evidence captured: `nx build @poc/team-angular` passed with lazy route chunks
- [x] Evidence captured: full workspace lint/build passed after Phase 7 changes (`nx run-many -t lint --all`, `nx run-many -t build --all`)

---

## Phase 8 - Showcase App as Proof Surface

Required routes: `/ui-library`, `/forms`, `/flags`, `/api-scenarios`

- [x] `/ui-library`: interactive showcase for shared components
- [x] `/forms`: validator-driven forms with valid/invalid flows
- [x] `/flags`: feature-flag matrix and visibility outcomes
- [x] `/api-scenarios`: success/error/timeout/retry demo screens
- [x] Add links from showcase home to all proof routes
- [x] Validate showcase reflects latest shared package behavior

---

## Phase 9 - Services and Realistic Data Behaviors

### 9.1 API gateway
- [x] Validate routing to user/notification services for new actions
- [x] Add/verify traceId forwarding
- [x] Add feature-flag gated behavior where required

### 9.2 User service
- [x] Implement handlers for profile update, transfer create, statement request
- [x] Implement admin handlers for status/credential operations
- [x] Validate payloads using shared validators
- [x] Emit events via `@poc/events` where needed

### 9.3 Notification service
- [x] Consume relevant events and produce notification records
- [x] Implement read/unread mutation endpoints
- [x] Return realistic seeded responses for POC scenarios

---

## Phase 10 - Feature Flags Integration

- [x] Map portal actions/pages to feature flags
- [x] Wire flag checks in UI routes/components
- [x] Wire flag checks in services for server-side safety
- [x] Add fallback behavior when a flag is off
- [x] Verify at least one user action and one admin action are gated

### Iteration 5 notes (evidence + pending)
- [x] Evidence captured: showcase proof routes complete (`/ui-library`, `/forms`, `/flags`, `/api-scenarios`) with sidebar navigation updates
- [x] Evidence captured: gateway routing expanded for `/accounts`, `/transfers`, `/audit-logs` and trace-id forwarding
- [x] Evidence captured: user-service and notification-service action endpoints implemented with shared validator contracts
- [x] Evidence captured: runtime feature-flag mutation added in `@poc/feature-flags` and consumed by gateway flag toggle endpoint
- [x] Evidence captured: targeted lint passed (`nx run-many -t lint -p @poc/showcase,@poc/api-gateway,@poc/user-service,@poc/notification-service,@poc/feature-flags`)
- [x] Evidence captured: targeted build passed (`nx run-many -t build -p @poc/showcase,@poc/api-gateway,@poc/user-service,@poc/notification-service,@poc/feature-flags`)

---

## Phase 11 - Quality Gates and Test Strategy

### 11.1 Route and action testing
- [x] Add route-level smoke tests for User portal
- [x] Add route-level smoke tests for Admin portal
- [x] Add action-flow tests (submit -> result) for key pages

### 11.4 Angular-only compliance checks
- [x] Confirm no React app is included in final deliverable build matrix
- [x] Confirm no React runtime dependency is required for user/admin portal delivery
- [x] Confirm user/admin routes are implemented only in Angular projects

### 11.2 Shared package tests
- [x] Add/verify contract tests for `@poc/types` exports
- [x] Add/verify schema tests for `@poc/validators`
- [x] Add/verify client tests for `@poc/api-client` error handling

### 11.3 Build verification
- [x] Run `nx affected --target=lint` on representative changes
- [x] Run `nx affected --target=test` on representative changes
- [x] Run `nx affected --target=build` for app-local change
- [x] Run `nx affected --target=build` for shared-package change
- [x] Run full monorepo build before sign-off

### Iteration 6 notes (evidence + pending)
- [x] Evidence captured: lightweight smoke test suite added under `tests/smoke` for user routes, admin routes, and key action flows
- [x] Evidence captured: Nx `test` targets added for `user-portal` and `@poc/team-angular`
- [x] Evidence captured: portal smoke tests pass (`nx run-many -t test -p user-portal,@poc/team-angular`)
- [x] Evidence captured: affected checks pass for representative app-local and shared-package changes
- [x] Evidence captured: full monorepo build passes (`nx run-many -t build --all`)
- [x] Follow-up complete: shared-package contract/schema/client tests added with dedicated library `test` targets

### Iteration 7 notes (evidence + pending)
- [x] Evidence captured: shared package smoke tests added (`tests/shared/types-contracts.test.js`, `tests/shared/validators-schemas.test.js`, `tests/shared/api-client-error-handling.test.js`)
- [x] Evidence captured: `test` targets added for `@poc/types`, `@poc/validators`, and `@poc/api-client`
- [x] Evidence captured: shared-library test run passed (`nx run-many -t test -p @poc/types,@poc/validators,@poc/api-client`)
- [x] Evidence captured: representative shared-package affected test passed (`nx affected --target=test --files=packages/validators/src/schemas.ts`)

---

## Phase 12 - POC Sign-off Checklist

- [x] User Portal has all 5 required routes and real actions
- [x] Admin Portal has all 6 required routes and real actions
- [x] Showcase has all 4 proof routes
- [x] Angular-only rule satisfied (no React implementation in delivery scope)
- [x] Shared components used on every page
- [x] Shared types and validators used by both UI and services
- [x] Structured error model (`code/message/traceId`) visible in UI
- [x] Feature flags verified across UI and API layers
- [x] Independent app build/deploy flow validated
- [x] Documentation updated (`ai-context.md`, execution notes)

### Iteration 8 notes (final compliance + sign-off)
- [x] Evidence captured: deprecated React app fully excluded from task targets (`@poc/team-react-deprecated` now has `targets: {}`)
- [x] Evidence captured: full build matrix no longer includes React app (`nx run-many -t build --all` now runs 13 projects)
- [x] Evidence captured: Angular route sets validated in `apps/user-portal/src/app/app.routes.ts` and `apps/team-angular/src/app/app.routes.ts`
- [x] Evidence captured: showcase proof routes validated in `apps/showcase/src/app/app.routes.ts`
- [x] Evidence captured: shared UI usage confirmed across all user/admin page components (`@poc/ui-components` imports)
- [x] Evidence captured: shared `@poc/types` and `@poc/validators` consumed by both portal apps and backend services
- [x] Evidence captured: structured error model (`poc-error-state` + `traceId`) visible in user/admin action pages
- [x] Evidence captured: feature-flag checks present in UI and API/service layers (`getFlag` / `setFlag` / toggle flows)
- [x] Evidence captured: independent app builds validated (`nx run-many -t build -p user-portal,@poc/team-angular,@poc/showcase`)
- [x] Evidence captured: startup scripts aligned with Angular-only Nx workspace (`start.sh` uses `nx serve` from workspace root)
- [x] Evidence captured: startup/shutdown reliability hardened for multi-PID ports (`start.sh` / `stop.sh` now kill all bound PIDs)

---

## Coverage Verification Against `docs/ai-context.md`

| ai-context requirement area | Covered by plan phase(s) | Coverage status |
|---|---|---|
| Multi-app Nx monorepo architecture | 0, 1, 11, 12 | [x] Covered in plan |
| Shared packages reuse (`types`, `validators`, `api-client`, `feature-flags`, `events`, `ui-components`, `config`) | 2, 3, 4, 5, 10, 11, 12 | [x] Covered in plan |
| Non-dummy page scope (User/Admin/Showcase required routes) | 6, 7, 8, 12 | [x] Covered in plan |
| Mandatory real user/admin actions per page | 2, 3, 4, 6, 7, 9, 12 | [x] Covered in plan |
| Typed action contracts and action states | 2, 4, 5, 6, 7, 12 | [x] Covered in plan |
| Angular-only delivery scope (no React implementation) | 1.4, 6, 11.4, 12 | [x] Covered in plan |
| Dependency boundaries and lint enforcement | 1, 11 | [x] Covered in plan |
| Affected builds and cache behavior validation | 1, 11, 12 | [x] Covered in plan |
| Data realism (seeded/mock service responses, not static UI) | 6, 7, 9, 12 | [x] Covered in plan |
| Independent deployment capability | 1, 11, 12 | [x] Covered in plan |
| Delivery governance without CODEOWNERS | 0, 11, 12 | [x] Covered in plan |

Verification rule:
- Planning verification is complete when every row above is `[x] Covered in plan`.
- Implementation verification is complete when corresponding phase tasks are marked `[x] Done` with evidence (command output, route demo, or test results).

---

## Execution Rhythm (Recommended)

- Iteration 1: Phases 0-2
- Iteration 2: Phases 3-5
- Iteration 3: Phase 6
- Iteration 4: Phase 7
- Iteration 5: Phases 8-10
- Iteration 6: Phases 11-12 (final hardening and sign-off)

At the end of each iteration:
- Update task statuses
- Run affected checks
- Record blockers and decisions
