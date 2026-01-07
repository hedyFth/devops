import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Tableau de bord Administrateur</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Groupes</h3>
          <p>Gérer les groupes d'étudiants</p>
        </div>
        <div class="stat-card">
          <h3>Étudiants</h3>
          <p>Gérer les étudiants</p>
        </div>
        <div class="stat-card">
          <h3>Enseignants</h3>
          <p>Gérer les enseignants</p>
        </div>
        <div class="stat-card">
          <h3>Cours</h3>
          <p>Gérer les cours</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }
    .dashboard h1 {
      color: #2c3e50;
      margin-bottom: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      margin-top: 0;
      color: #3498db;
    }
  `]
})
export class AdminDashboardComponent {}

