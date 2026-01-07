import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <h1>Mes Cours</h1>
      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="courses-grid" *ngIf="!loading">
        <div class="course-card" *ngFor="let course of courses">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
          <div class="course-info">
            <span>Crédits: {{ course.credits }}</span>
            <span>Enseignant: {{ getTeacherName(course.teacher) }}</span>
          </div>
          <div class="course-actions">
            <a [routerLink]="['/teacher/course-students', course._id]" class="btn btn-primary">
              Voir les étudiants inscrits
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .course-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .course-card h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    .course-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
      color: #7f8c8d;
    }
    .course-actions {
      margin-top: 1rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
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
export class MyCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  errorMessage = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAll().subscribe({
      next: (data: any) => {
        this.courses = data.courses || data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
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

