import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Enrollment } from '../../../core/models/enrollment.model';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <h1>Mes Inscriptions</h1>
      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>Cours</th>
            <th>Description</th>
            <th>Crédits</th>
            <th>Statut</th>
            <th>Date d'inscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let enrollment of enrollments">
            <td>{{ getCourseTitle(enrollment.course) }}</td>
            <td>{{ getCourseDescription(enrollment.course) }}</td>
            <td>{{ getCourseCredits(enrollment.course) }}</td>
            <td>{{ enrollment.status }}</td>
            <td>{{ enrollment.enrollmentDate | date:'short' }}</td>
            <td>
              <a [routerLink]="['/student/course-details', getCourseId(enrollment.course)]" class="btn btn-sm btn-primary">
                Voir détails
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="!loading && enrollments.length === 0">Aucune inscription</p>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .data-table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .data-table th {
      background: #34495e;
      color: white;
      padding: 1rem;
      text-align: left;
    }
    .data-table td {
      padding: 1rem;
      border-top: 1px solid #ecf0f1;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
    .btn-primary {
      background: #3498db;
      color: white;
    }
    .error-message {
      background: #fee;
      color: #c33;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
export class MyEnrollmentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  loading = false;
  errorMessage = '';

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading = true;
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (data: any) => {
        this.enrollments = data.enrollments || data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  getCourseId(course: any): string {
    if (typeof course === 'object' && course._id) {
      return course._id;
    }
    return course;
  }

  getCourseTitle(course: any): string {
    if (typeof course === 'object' && course.title) {
      return course.title;
    }
    return 'N/A';
  }

  getCourseDescription(course: any): string {
    if (typeof course === 'object' && course.description) {
      return course.description;
    }
    return 'N/A';
  }

  getCourseCredits(course: any): number {
    if (typeof course === 'object' && course.credits) {
      return course.credits;
    }
    return 0;
  }
}

