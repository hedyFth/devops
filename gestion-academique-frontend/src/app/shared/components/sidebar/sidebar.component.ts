import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <ul class="menu">
        <li *ngFor="let item of menuItems" [class.active]="isActive(item.route)">
          <a [routerLink]="item.route" routerLinkActive="active-link">
            {{ item.icon }} {{ item.label }}
          </a>
        </li>
      </ul>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #34495e;
      min-height: calc(100vh - 60px);
      padding: 1rem 0;
    }
    .menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .menu li {
      margin: 0;
    }
    .menu a {
      display: block;
      padding: 1rem 1.5rem;
      color: #ecf0f1;
      text-decoration: none;
      transition: background 0.3s;
    }
    .menu a:hover {
      background: #2c3e50;
    }
    .menu a.active-link {
      background: #3498db;
      font-weight: bold;
    }
  `]
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  isActive(route: string): boolean {
    // Simple check - could be improved with Router
    return false;
  }
}

