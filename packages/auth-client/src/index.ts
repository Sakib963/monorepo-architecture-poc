import { LoginRequest, AuthResponse, User } from '@monorepo/types';

export class AuthClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Try to load token from localStorage on initialization
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;
    // Store token in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  async getCurrentUser(): Promise<User | null> {
    // Try to get token from localStorage if not in memory
    if (!this.token && typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
    
    if (!this.token) {
      return null;
    }

    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  logout(): void {
    this.token = null;
    // Clear token from localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    }
  }

  getToken(): string | null {
    // Try to get token from localStorage if not in memory
    if (!this.token && typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }
}
