import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Tableau de bord Étudiant</h1>
      <p>Bienvenue dans votre espace étudiant</p>
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
export class StudentDashboardComponent {}

