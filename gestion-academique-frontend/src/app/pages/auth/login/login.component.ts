import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Connexion</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control" />
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error">
              Email requis
            </div>
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" formControlName="password" class="form-control" />
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error">
              Mot de passe requis
            </div>
          </div>
          <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          <button type="submit" [disabled]="loginForm.invalid || loading" class="btn btn-primary">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        <p class="auth-link">
          Pas de compte ? <a routerLink="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #ecf0f1;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .auth-card h2 {
      margin-top: 0;
      text-align: center;
      color: #2c3e50;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }
    .error {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .error-message {
      background: #fee;
      color: #c33;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    .btn-primary {
      background: #3498db;
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-link {
      text-align: center;
      margin-top: 1rem;
    }
    .auth-link a {
      color: #3498db;
      text-decoration: none;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            const user = response.user;
            if (user.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else if (user.role === 'TEACHER') {
              this.router.navigate(['/teacher/dashboard']);
            } else if (user.role === 'STUDENT') {
              this.router.navigate(['/student/dashboard']);
            }
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erreur de connexion';
        }
      });
    }
  }
}

