import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Tableau de bord Enseignant</h1>
      <p>Bienvenue dans votre espace enseignant</p>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }
    .dashboard h1 {
      color: #2c3e50;
    }
  `]
})
export class TeacherDashboardComponent {}

