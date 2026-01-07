import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Enrollment } from '../../../core/models/enrollment.model';

@Component({
  selector: 'app-course-students',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <h1>Étudiants inscrits au cours</h1>
      <a routerLink="/teacher/my-courses" class="btn btn-secondary">← Retour</a>
      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Numéro étudiant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let enrollment of enrollments">
            <td>{{ getStudentLastName(enrollment.student) }}</td>
            <td>{{ getStudentFirstName(enrollment.student) }}</td>
            <td>{{ getStudentNumber(enrollment.student) }}</td>
            <td>{{ enrollment.status }}</td>
          </tr>
        </tbody>
      </table>
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
      margin-top: 1rem;
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
      margin-bottom: 1rem;
    }
    .btn-secondary {
      background: #95a5a6;
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
export class CourseStudentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  loading = false;
  errorMessage = '';
  courseId = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    if (this.courseId) {
      this.loadEnrollments();
    }
  }

  loadEnrollments(): void {
    this.loading = true;
    this.enrollmentService.getByCourse(this.courseId).subscribe({
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

  getStudentFirstName(student: any): string {
    if (typeof student === 'object' && student.firstName) {
      return student.firstName;
    }
    return 'N/A';
  }

  getStudentLastName(student: any): string {
    if (typeof student === 'object' && student.lastName) {
      return student.lastName;
    }
    return 'N/A';
  }

  getStudentNumber(student: any): string {
    if (typeof student === 'object' && student.studentNumber) {
      return student.studentNumber;
    }
    return 'N/A';
  }
}

