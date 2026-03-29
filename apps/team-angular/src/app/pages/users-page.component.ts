import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import type { User } from '@poc/types';
import { BadgeComponent, CardComponent, DataTableComponent, EmptyStateComponent, ErrorStateComponent, LoadingStateComponent } from '@poc/ui-components';
import { AdminPortalApiService } from '../admin-portal-api.service';

@Component({
  standalone: true,
  selector: 'app-users-page',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardComponent,
    DataTableComponent,
    BadgeComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
  ],
  template: `
    <poc-card title="Users" subtitle="Search, sort, and status-filter user list" [bordered]="true">
      <div class="toolbar">
        <input [(ngModel)]="search" placeholder="Search by name or email" />
        <select [(ngModel)]="statusFilter">
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>
        <select [(ngModel)]="sortBy">
          <option value="name">Sort: Name</option>
          <option value="createdAt">Sort: Created At</option>
        </select>
      </div>

      <poc-loading-state *ngIf="loading()" title="Loading users" message="Fetching user records"></poc-loading-state>
      <poc-error-state *ngIf="errorMessage()" title="Users load failed" [message]="errorMessage()!"></poc-error-state>

      <poc-data-table [columns]="columns" *ngIf="!loading() && filteredUsers().length">
        <tr *ngFor="let user of filteredUsers()">
          <td>
            <a [routerLink]="['/users', user.id]" class="detail-link">{{ user.firstName }} {{ user.lastName }}</a>
          </td>
          <td>{{ user.email }}</td>
          <td><poc-badge color="purple">{{ user.role }}</poc-badge></td>
          <td><poc-badge [color]="statusColor(user.status)">{{ user.status }}</poc-badge></td>
          <td>{{ user.createdAt | date:'medium' }}</td>
        </tr>
      </poc-data-table>

      <poc-empty-state
        *ngIf="!loading() && !filteredUsers().length"
        icon="👥"
        title="No users match filters"
        message="Try changing search or status filter"
      ></poc-empty-state>
    </poc-card>
  `,
  styles: [`
    .toolbar { display: grid; grid-template-columns: 1fr 180px 170px; gap: 0.6rem; margin-bottom: 0.8rem; }
    input, select { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.65rem; background: #ffffff; color: #0f172a; }
    .detail-link { color: #1d4ed8; text-decoration: none; }
    .detail-link:hover { text-decoration: underline; }
  `],
})
export class UsersPageComponent implements OnInit {
  readonly columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
  ];

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  search = '';
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' = 'ALL';
  sortBy: 'name' | 'createdAt' = 'name';

  constructor(private readonly api: AdminPortalApiService) {}

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      this.users.set(await this.api.getUsers());
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      this.loading.set(false);
    }
  }

  filteredUsers(): User[] {
    const searchTerm = this.search.trim().toLowerCase();

    const filtered = this.users().filter((user) => {
      const name = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch = !searchTerm || name.includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
      const matchesStatus = this.statusFilter === 'ALL' || user.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((left, right) => {
      if (this.sortBy === 'createdAt') {
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }
      const leftName = `${left.firstName} ${left.lastName}`.toLowerCase();
      const rightName = `${right.firstName} ${right.lastName}`.toLowerCase();
      return leftName.localeCompare(rightName);
    });
  }

  statusColor(status: string): 'green' | 'yellow' | 'red' | 'gray' {
    if (status === 'ACTIVE') {
      return 'green';
    }
    if (status === 'SUSPENDED') {
      return 'red';
    }
    if (status === 'INACTIVE') {
      return 'yellow';
    }
    return 'gray';
  }
}
