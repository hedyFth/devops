import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h2>Gestion Académique</h2>
      </div>
      <div class="navbar-user" *ngIf="authService.isLoggedIn()">
        <span class="user-info">
          {{ authService.getCurrentUser()?.email }} 
          <span class="badge">{{ authService.getCurrentUser()?.role }}</span>
        </span>
        <button class="btn-logout" (click)="logout()">Déconnexion</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .navbar-brand h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .badge {
      background: #3498db;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }
    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-logout:hover {
      background: #c0392b;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

