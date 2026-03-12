import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div *ngIf="loading" class="loading">
      Loading...
    </div>
    <router-outlet *ngIf="!loading"></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  loading = true;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.authService.checkAuth();
    this.loading = false;
  }
}
