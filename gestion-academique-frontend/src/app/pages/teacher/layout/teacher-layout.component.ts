import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="layout-container">
      <app-sidebar [menuItems]="menuItems"></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      min-height: calc(100vh - 60px);
    }
    .main-content {
      flex: 1;
      padding: 2rem;
      background: #ecf0f1;
    }
  `]
})
export class TeacherLayoutComponent {
  menuItems = [
    { label: 'Dashboard', route: '/teacher/dashboard', icon: '📊' },
    { label: 'Mes Cours', route: '/teacher/my-courses', icon: '📚' },
    { label: 'Évaluations', route: '/teacher/assessments', icon: '📝' },
    { label: 'Notes', route: '/teacher/grades', icon: '📊' }
  ];
}

