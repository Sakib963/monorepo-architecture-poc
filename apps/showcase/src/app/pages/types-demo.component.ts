import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { User, Order, Notification, ApiResponse } from '@poc/types';
import { UserRole, UserStatus, NotificationType, NotificationStatus, OrderStatus } from '@poc/types';

@Component({
  selector: 'app-types-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="pkg-badge">&#64;poc/types</div>
        <h1>Shared Types</h1>
        <p class="page-desc">
          <strong>packages/types/src/</strong> is the single source of truth for every
          TypeScript interface, enum, and DTO in this system. Apps, services, and packages
          all import from here — when a field is added or renamed, TypeScript reports errors
          in every consumer immediately.
        </p>
      </div>

      <section class="section">
        <h2 class="section-title">User Domain</h2>
        <div class="demo-split">
          <div class="demo-code">
            <div class="code-label">packages/types/src/user.types.ts</div>
            <pre class="code">{{ userTypeCode }}</pre>
          </div>
          <div class="demo-live">
            <div class="code-label">Example value (conforms to the interface above)</div>
            <pre class="code">{{ exampleUser | json }}</pre>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Generic API Response Wrapper</h2>
        <p class="description">
          All services return <code>ApiResponse&lt;T&gt;</code>. The frontend client
          unwraps it automatically — consumers never write <code>(res as any).data.items</code>.
        </p>
        <div class="demo-split">
          <div class="demo-code">
            <div class="code-label">packages/types/src/api.types.ts</div>
            <pre class="code">{{ apiTypeCode }}</pre>
          </div>
          <div class="demo-live">
            <div class="code-label">Example: ApiResponse&lt;User&gt;</div>
            <pre class="code">{{ exampleApiResponse | json }}</pre>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Enum Guarantees</h2>
        <p class="description">
          Enums prevent magic strings. A switch statement over <code>UserRole</code> with no <code>default:</code>
          will cause a TypeScript error if a new role is added — forcing all switch sites to be updated.
        </p>
        <div class="enum-grid">
          <div class="enum-card">
            <div class="enum-name">UserRole</div>
            <div *ngFor="let v of userRoles" class="enum-value">{{ v }}</div>
          </div>
          <div class="enum-card">
            <div class="enum-name">UserStatus</div>
            <div *ngFor="let v of userStatuses" class="enum-value">{{ v }}</div>
          </div>
          <div class="enum-card">
            <div class="enum-name">NotificationType</div>
            <div *ngFor="let v of notificationTypes" class="enum-value">{{ v }}</div>
          </div>
          <div class="enum-card">
            <div class="enum-name">NotificationStatus</div>
            <div *ngFor="let v of notificationStatuses" class="enum-value">{{ v }}</div>
          </div>
          <div class="enum-card">
            <div class="enum-name">OrderStatus</div>
            <div *ngFor="let v of orderStatuses" class="enum-value">{{ v }}</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; }
    .page-header { margin-bottom: 2.5rem; }
    .pkg-badge { display: inline-block; font-family: monospace; font-size: 0.75rem; font-weight: 700;
                 background: #1e3a5f; color: #63b3ed; padding: 0.25rem 0.75rem; border-radius: 9999px;
                 margin-bottom: 0.75rem; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #e2e8f0; margin-bottom: 0.75rem; }
    .page-desc { font-size: 0.9rem; color: #718096; max-width: 620px; line-height: 1.7; }
    .page-desc strong { color: #a0aec0; font-family: monospace; font-size: 0.85rem; }
    
    .section { margin-bottom: 2.5rem; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: #a0aec0;
                     text-transform: uppercase; letter-spacing: 0.07em;
                     margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1e2535; }
    .description { font-size: 0.875rem; color: #718096; margin-bottom: 1rem; line-height: 1.6; }
    code { background: #1e2535; padding: 0.15rem 0.4rem; border-radius: 0.25rem;
           font-size: 0.8rem; color: #a0aec0; }

    .demo-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media(max-width:700px){ .demo-split { grid-template-columns:1fr; } }
    .code-label { font-size: 0.7rem; color: #4a5568; margin-bottom: 0.4rem; font-family: monospace; }
    .code { background: #161b27; border: 1px solid #1e2535; border-radius: 0.375rem;
            padding: 1rem; font-size: 0.75rem; color: #a0aec0; overflow-x: auto;
            white-space: pre; line-height: 1.6; }

    .enum-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
    .enum-card { background: #161b27; border: 1px solid #1e2535; border-radius: 0.375rem;
                 padding: 0.75rem 1rem; min-width: 160px; }
    .enum-name { font-family: monospace; font-size: 0.8rem; font-weight: 700;
                 color: #63b3ed; margin-bottom: 0.5rem; }
    .enum-value { font-family: monospace; font-size: 0.75rem; color: #68d391;
                  padding: 0.15rem 0; }
    .enum-value::before { content: "'"; color: #fc8181; }
    .enum-value::after  { content: "'"; color: #fc8181; }
  `],
})
export class TypesDemoComponent {
  userRoles = Object.values(UserRole);
  userStatuses = Object.values(UserStatus);
  notificationTypes = Object.values(NotificationType);
  notificationStatuses = Object.values(NotificationStatus);
  orderStatuses = Object.values(OrderStatus);

  exampleUser: User = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Chen',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  exampleApiResponse: ApiResponse<User> = {
    success: true,
    data: this.exampleUser,
  };

  userTypeCode = `export enum UserRole {
  ADMIN    = 'ADMIN',
  MANAGER  = 'MANAGER',
  CUSTOMER = 'CUSTOMER',
}

export interface User {
  id:         string;
  email:      string;
  firstName:  string;
  lastName:   string;
  role:       UserRole;
  status:     UserStatus;
  createdAt:  string;
  updatedAt:  string;
}

export interface CreateUserDto {
  email:      string;
  password:   string;
  firstName:  string;
  lastName:   string;
  role?:      UserRole;
}`;

  apiTypeCode = `export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items:      T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// Usage:
// GET /users → ApiResponse<PaginatedResponse<User>>
// GET /users/:id → ApiResponse<User>`;
}
