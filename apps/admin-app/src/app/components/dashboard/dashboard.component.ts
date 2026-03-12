import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User, Role } from '@monorepo/types';

interface MockUser extends User {
  lastActivity: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  users: MockUser[] = [];
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    systemUptime: '99.9%'
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadMockData();
  }

  loadMockData(): void {
    // Mock user data for demonstration
    this.users = [
      {
        userId: '1',
        username: 'admin',
        role: Role.ADMIN,
        email: 'admin@example.com',
        lastActivity: '2024-01-15 10:30 AM'
      },
      {
        userId: '2',
        username: 'john_doe',
        role: Role.USER,
        email: 'john@example.com',
        lastActivity: '2024-01-15 09:45 AM'
      },
      {
        userId: '3',
        username: 'jane_smith',
        role: Role.USER,
        email: 'jane@example.com',
        lastActivity: '2024-01-15 08:20 AM'
      },
      {
        userId: '4',
        username: 'mike_wilson',
        role: Role.USER,
        email: 'mike@example.com',
        lastActivity: '2024-01-14 04:15 PM'
      }
    ];

    this.stats = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.role === Role.USER).length,
      totalAdmins: this.users.filter(u => u.role === Role.ADMIN).length,
      systemUptime: '99.9%'
    };
  }

  handleLogout(): void {
    this.authService.logout();
  }

  getRoleBadgeClass(role: Role): string {
    return role === Role.ADMIN ? 'badge badge-admin' : 'badge badge-user';
  }
}
