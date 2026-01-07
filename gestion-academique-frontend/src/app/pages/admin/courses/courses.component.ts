import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { Course } from '../../../core/models/course.model';
import { Teacher } from '../../../core/models/teacher.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestion des Cours</h1>
        <button class="btn btn-primary" (click)="openAddModal()">+ Ajouter un cours</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Crédits</th>
            <th>Enseignant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let course of courses">
            <td>{{ course.title }}</td>
            <td>{{ course.description }}</td>
            <td>{{ course.credits }}</td>
            <td>{{ getTeacherName(course.teacher) }}</td>
            <td>
              <button class="btn btn-sm btn-edit" (click)="openEditModal(course)">Modifier</button>
              <button class="btn btn-sm btn-delete" (click)="confirmDelete(course)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingCourse ? 'Modifier' : 'Ajouter' }} un cours</h2>
          <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Titre *</label>
              <input type="text" formControlName="title" class="form-control" />
            </div>
            <div class="form-group">
              <label>Description *</label>
              <textarea formControlName="description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Crédits *</label>
              <input type="number" formControlName="credits" class="form-control" min="1" />
            </div>
            <div class="form-group">
              <label>Enseignant *</label>
              <select formControlName="teacherId" class="form-control">
                <option value="">Sélectionner un enseignant</option>
                <option *ngFor="let t of teachers" [value]="t._id">
                  {{ t.firstName }} {{ t.lastName }} ({{ t.teacherCode }})
                </option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="courseForm.invalid">
                {{ editingCourse ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <app-confirm-dialog
        *ngIf="showConfirmDialog"
        (confirm)="onDelete()"
        (cancel)="showConfirmDialog = false">
      </app-confirm-dialog>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
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
      cursor: pointer;
    }
    .btn-primary {
      background: #3498db;
      color: white;
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      margin-right: 0.5rem;
    }
    .btn-edit {
      background: #f39c12;
      color: white;
    }
    .btn-delete {
      background: #e74c3c;
      color: white;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
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
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  teachers: Teacher[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showConfirmDialog = false;
  editingCourse: Course | null = null;
  courseToDelete: Course | null = null;
  courseForm: FormGroup;

  constructor(
    private courseService: CourseService,
    private teacherService: TeacherService,
    private fb: FormBuilder
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      credits: [1, [Validators.required, Validators.min(1)]],
      teacherId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadTeachers();
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

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (data: any) => {
        this.teachers = data.teachers || data;
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
      }
    });
  }

  getTeacherName(teacher: any): string {
    if (typeof teacher === 'object' && teacher.firstName) {
      return `${teacher.firstName} ${teacher.lastName}`;
    }
    const t = this.teachers.find(te => te._id === teacher);
    return t ? `${t.firstName} ${t.lastName}` : 'N/A';
  }

  openAddModal(): void {
    this.editingCourse = null;
    this.courseForm.reset({ credits: 1 });
    this.showModal = true;
  }

  openEditModal(course: Course): void {
    this.editingCourse = course;
    const teacherId = typeof course.teacher === 'object' ? (course.teacher as Teacher)._id : course.teacher;
    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      credits: course.credits,
      teacherId: teacherId
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCourse = null;
    this.courseForm.reset();
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;
      const courseData = {
        title: formData.title,
        description: formData.description,
        credits: formData.credits,
        teacher: formData.teacherId
      };
      if (this.editingCourse) {
        this.courseService.update(this.editingCourse._id!, courseData).subscribe({
          next: () => {
            this.loadCourses();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          }
        });
      } else {
        this.courseService.create(courseData).subscribe({
          next: () => {
            this.loadCourses();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout';
          }
        });
      }
    }
  }

  confirmDelete(course: Course): void {
    this.courseToDelete = course;
    this.showConfirmDialog = true;
  }

  onDelete(): void {
    if (this.courseToDelete) {
      this.courseService.delete(this.courseToDelete._id!).subscribe({
        next: () => {
          this.loadCourses();
          this.showConfirmDialog = false;
          this.courseToDelete = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          this.showConfirmDialog = false;
        }
      });
    }
  }
}

