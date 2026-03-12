# Monorepo Proof of Concept (POC)

## Overview

This repository is a **monorepo proof of concept** designed to explore how multiple applications, built with different frontend frameworks, can coexist within a single repository while sharing common infrastructure and code.

The POC demonstrates:

* Multi-framework frontend architecture
* Shared authentication flow
* Shared packages across applications
* Monorepo build orchestration
* Code sharing between frontend and backend

The goal is **architectural exploration**, not production readiness.

---

# Core Idea

The system contains **three main applications**:

1. **Auth Gateway**

   * A login interface responsible for authenticating users.
   * Determines the user role.
   * Redirects the user to the correct application.

2. **User Application**

   * Built with **React**.
   * Used by normal users.

3. **Admin Application**

   * Built with **Angular**.
   * Used by administrators.

After login, the system routes the user to the correct application based on their role.

---

# High-Level Architecture

```
                +----------------------+
                |     Auth Gateway     |
                |    (Login Page)      |
                +----------+-----------+
                           |
                 Authentication API
                           |
                 +---------+---------+
                 |                   |
            React App           Angular App
          (User Portal)        (Admin Portal)
```

Authentication happens once through the gateway.

Based on the returned user role, the gateway redirects the user to the appropriate application.

---

# Monorepo Goals

This POC aims to explore the following monorepo concepts:

* Multiple applications inside a single repository
* Shared code packages
* Shared TypeScript types
* Shared API client libraries
* Build orchestration using monorepo tooling
* Dependency boundaries between applications and packages

---

# Repository Structure

```
repo/
│
├ apps/
│   ├ auth-gateway/      # login UI
│   ├ user-app/          # React application
│   └ admin-app/         # Angular application
│
├ services/
│   └ auth-service/      # authentication API
│
├ packages/
│   ├ types/             # shared TypeScript types
│   ├ auth-client/       # shared authentication client
│   └ config/            # shared tooling config
│
├ docs/
│   └ monorepo-poc.md
│
├ turbo.json
├ pnpm-workspace.yaml
└ package.json
```

### Folder Responsibilities

**apps/**

* Contains deployable frontend applications.

**services/**

* Contains backend services.

**packages/**

* Contains shared reusable code.

---

# Authentication Flow

1. User opens the **Auth Gateway**.
2. User enters login credentials.
3. Auth Gateway calls the **Auth Service API**.
4. API validates credentials.
5. API returns a role and token.

Example response:

```json
{
  "userId": "123",
  "role": "ADMIN",
  "token": "jwt-token"
}
```

---

# Role-Based Routing

After authentication, the gateway decides which application the user should access.

Example logic:

```
if role === "USER"
  redirect to user-app

if role === "ADMIN"
  redirect to admin-app
```

---

# Shared Packages

Shared packages demonstrate the core benefit of a monorepo.

## packages/types

Contains shared TypeScript models used by multiple applications.

Examples:

* User
* LoginRequest
* AuthResponse
* Role

These types are used by:

* auth-service
* auth-gateway
* user-app
* admin-app

---

## packages/auth-client

Provides a shared API client for authentication-related requests.

Example functions:

* login()
* logout()
* getCurrentUser()

This client will be used by all frontend applications.

---

# Technology Stack

Frontend:

* React (User App)
* Angular (Admin App)

Backend:

* Node.js
* Hapi.js

Infrastructure:

* TypeScript
* pnpm workspaces
* Turborepo

Database (optional):

* PostgreSQL or in-memory storage

---

# Monorepo Tooling

## pnpm Workspaces

Used to manage dependencies across applications and packages.

Benefits:

* local package linking
* faster dependency installs
* consistent dependency management

---

## Turborepo

Used for:

* task orchestration
* caching
* parallel builds
* incremental builds

Example tasks:

* build
* dev
* lint
* test

---

# Dependency Rules

To maintain a clean architecture, the following rules apply:

1. Applications may depend on packages.
2. Services may depend on packages.
3. Packages must not depend on applications.
4. Packages should remain framework-agnostic where possible.
5. Avoid circular dependencies between packages.

---

# Scope of the POC

This POC intentionally limits its scope to keep the project manageable.

Included:

* Login gateway
* React user application
* Angular admin application
* Shared packages
* Basic authentication API
* Role-based routing

Not included:

* Full production authentication
* OAuth providers
* CI/CD pipelines
* Deployment infrastructure
* Advanced authorization logic
* Complex microservices architecture

The goal is to explore **monorepo architecture**, not build a production system.

---

# Task Plan

## Phase 1 — Monorepo Setup

Tasks:

* Initialize repository
* Configure pnpm workspace
* Configure turborepo
* Create base folder structure

---

## Phase 2 — Shared Packages

Tasks:

* Create `packages/types`
* Create `packages/auth-client`

---

## Phase 3 — Authentication Service

Tasks:

* Implement login endpoint
* Create mock user database
* Return role-based authentication response

---

## Phase 4 — Auth Gateway

Tasks:

* Build login page
* Integrate auth client
* Redirect user based on role

---

## Phase 5 — React User Application

Tasks:

* Create basic dashboard
* Fetch user profile
* Demonstrate shared packages

---

## Phase 6 — Angular Admin Application

Tasks:

* Create admin dashboard
* Implement role-protected pages
* Demonstrate shared packages

---

# Success Criteria

The POC is successful if:

* All applications run from a single monorepo
* Shared packages are reused across applications
* Authentication works
* Role-based routing works
* Turborepo caching works

---

# Key Monorepo Concepts Demonstrated

This repository demonstrates:

* multi-application monorepos
* cross-framework architecture
* shared package management
* centralized authentication
* dependency boundaries
* build orchestration
