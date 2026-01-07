import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AssessmentService } from '../../../core/services/assessment.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Course } from '../../../core/models/course.model';
import { Assessment } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <a routerLink="/student/courses" class="btn btn-secondary">← Retour</a>
      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <div *ngIf="course && !loading" class="course-details">
        <h1>{{ course.title }}</h1>
        <p>{{ course.description }}</p>
        <div class="course-info">
          <p><strong>Crédits:</strong> {{ course.credits }}</p>
          <p><strong>Enseignant:</strong> {{ getTeacherName(course.teacher) }}</p>
        </div>

        <div *ngIf="!isEnrolled" class="enroll-section">
          <button type="button" class="btn btn-primary enroll-btn" (click)="enroll()" [disabled]="enrolling">
            S'inscrire
          </button>
        </div>
        <div *ngIf="isEnrolled" class="enrolled-badge">
          ✓ Inscrit
        </div>

        <div class="assessments-section">
          <h2>Évaluations</h2>
          <table class="data-table" *ngIf="assessments.length > 0">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Date</th>
                <th>Poids</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let assessment of assessments">
                <td>{{ assessment.title }}</td>
                <td>{{ assessment.type }}</td>
                <td>{{ assessment.date | date:'short' }}</td>
                <td>{{ assessment.weight }}</td>
              </tr>
            </tbody>
          </table>
          <p *ngIf="assessments.length === 0">Aucune évaluation disponible</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .course-details {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
    .course-info {
      margin: 1rem 0;
    }
    .enroll-section {
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
    }
    .enroll-btn {
      font-size: 1rem;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      min-width: 200px;
      transition: all 0.3s ease;
      display: inline-block;
      text-align: center;
    }
    .enrolled-badge {
      background: #2ecc71;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      display: inline-block;
      margin: 1rem 0;
      font-weight: 500;
    }
    .assessments-section {
      margin-top: 2rem;
    }
    .data-table {
      width: 100%;
      margin-top: 1rem;
      border-radius: 8px;
      overflow: hidden;
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
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background: #3498db;
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
    }
    .btn-secondary {
      background: #95a5a6;
      color: white;
    }
    .btn-secondary:hover {
      background: #7f8c8d;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  assessments: Assessment[] = [];
  courseId = '';
  loading = false;
  enrolling = false;
  isEnrolled = false;
  errorMessage = '';

  constructor(
    private courseService: CourseService,
    private assessmentService: AssessmentService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    if (this.courseId) {
      this.loadCourse();
      this.loadAssessments();
      this.checkEnrollment();
    }
  }

  loadCourse(): void {
    this.loading = true;
    this.courseService.getById(this.courseId).subscribe({
      next: (data: any) => {
        this.course = data.course || data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  loadAssessments(): void {
    this.assessmentService.getByCourse(this.courseId).subscribe({
      next: (data: any) => {
        this.assessments = data.assessments || data;
      },
      error: (error) => {
        console.error('Error loading assessments:', error);
      }
    });
  }

  checkEnrollment(): void {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (data: any) => {
        const enrollments = data.enrollments || data;
        this.isEnrolled = enrollments.some((e: any) => {
          const courseId = typeof e.course === 'object' ? (e.course as Course)._id : e.course;
          return courseId === this.courseId;
        });
      },
      error: (error) => {
        console.error('Error checking enrollment:', error);
      }
    });
  }

  enroll(): void {
    this.enrolling = true;
    this.enrollmentService.enroll(this.courseId).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.enrolling = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription';
        this.enrolling = false;
      }
    });
  }

  getTeacherName(teacher: any): string {
    if (typeof teacher === 'object' && teacher.firstName) {
      return `${teacher.firstName} ${teacher.lastName}`;
    }
    return 'N/A';
  }
}

