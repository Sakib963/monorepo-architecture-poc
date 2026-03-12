import { Injectable } from '@angular/core';
import { AuthClient } from '@monorepo/auth-client';
import { User, Role } from '@monorepo/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authClient: AuthClient;
  currentUser: User | null = null;

  constructor() {
    this.authClient = new AuthClient('http://localhost:3000');
  }

  async checkAuth(): Promise<void> {
    try {
      // Check for token passed via URL (from auth-gateway on a different port/origin)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      if (tokenFromUrl) {
        localStorage.setItem('authToken', tokenFromUrl);
        // Clean the token from the URL bar
        window.history.replaceState({}, '', window.location.pathname);
      }

      this.currentUser = await this.authClient.getCurrentUser();
      
      // Redirect if not admin
      if (!this.currentUser || this.currentUser.role !== Role.ADMIN) {
        window.location.href = 'http://localhost:3001';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      window.location.href = 'http://localhost:3001';
    }
  }

  async logout(): Promise<void> {
    this.authClient.logout();
    window.location.href = 'http://localhost:3001?logout=true';
  }

  getToken(): string | null {
    return this.authClient.getToken();
  }
}
