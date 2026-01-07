import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AssessmentService } from '../../../core/services/assessment.service';
import { CourseService } from '../../../core/services/course.service';
import { Assessment } from '../../../core/models/assessment.model';
import { Course } from '../../../core/models/course.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <h1>Gestion des Évaluations</h1>
      <div class="form-group">
        <label>Sélectionner un cours</label>
        <select [(ngModel)]="selectedCourseId" (change)="loadAssessments()" class="form-control">
          <option value="">-- Sélectionner un cours --</option>
          <option *ngFor="let course of courses" [value]="course._id">{{ course.title }}</option>
        </select>
      </div>

      <div *ngIf="selectedCourseId" class="page-header">
        <h2>Évaluations</h2>
        <button class="btn btn-primary" (click)="openAddModal()">+ Ajouter une évaluation</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <table class="data-table" *ngIf="!loading && selectedCourseId">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Type</th>
            <th>Date</th>
            <th>Poids</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let assessment of assessments">
            <td>{{ assessment.title }}</td>
            <td>{{ assessment.type }}</td>
            <td>{{ assessment.date | date:'short' }}</td>
            <td>{{ assessment.weight }}</td>
            <td>
              <button class="btn btn-sm btn-edit" (click)="openEditModal(assessment)">Modifier</button>
              <button class="btn btn-sm btn-delete" (click)="confirmDelete(assessment)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingAssessment ? 'Modifier' : 'Ajouter' }} une évaluation</h2>
          <form [formGroup]="assessmentForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Titre *</label>
              <input type="text" formControlName="title" class="form-control" />
            </div>
            <div class="form-group">
              <label>Type *</label>
              <select formControlName="type" class="form-control">
                <option value="Examen">Examen</option>
                <option value="Contrôle">Contrôle</option>
                <option value="TP">TP</option>
                <option value="Projet">Projet</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date *</label>
              <input type="date" formControlName="date" class="form-control" />
            </div>
            <div class="form-group">
              <label>Poids *</label>
              <input type="number" formControlName="weight" class="form-control" min="0" max="100" step="0.1" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="assessmentForm.invalid">
                {{ editingAssessment ? 'Modifier' : 'Ajouter' }}
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
      margin: 1rem 0;
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
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
      box-sizing: border-box;
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
export class AssessmentsComponent implements OnInit {
  assessments: Assessment[] = [];
  courses: Course[] = [];
  selectedCourseId = '';
  loading = false;
  errorMessage = '';
  showModal = false;
  showConfirmDialog = false;
  editingAssessment: Assessment | null = null;
  assessmentToDelete: Assessment | null = null;
  assessmentForm: FormGroup;

  constructor(
    private assessmentService: AssessmentService,
    private courseService: CourseService,
    private fb: FormBuilder
  ) {
    this.assessmentForm = this.fb.group({
      title: ['', Validators.required],
      type: ['Examen', Validators.required],
      date: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data: any) => {
        this.courses = data.courses || data;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  loadAssessments(): void {
    if (!this.selectedCourseId) {
      this.assessments = [];
      return;
    }
    this.loading = true;
    this.assessmentService.getByCourse(this.selectedCourseId).subscribe({
      next: (data: any) => {
        this.assessments = data.assessments || data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.editingAssessment = null;
    this.assessmentForm.reset({ type: 'Examen', weight: 0 });
    this.showModal = true;
  }

  openEditModal(assessment: Assessment): void {
    this.editingAssessment = assessment;
    this.assessmentForm.patchValue({
      title: assessment.title,
      type: assessment.type,
      date: assessment.date.split('T')[0],
      weight: assessment.weight
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAssessment = null;
    this.assessmentForm.reset();
  }

  onSubmit(): void {
    if (this.assessmentForm.valid && this.selectedCourseId) {
      const formData = this.assessmentForm.value;
      const assessmentData = {
        courseId: this.selectedCourseId,
        title: formData.title,
        type: formData.type,
        date: formData.date,
        weight: formData.weight
      };
      if (this.editingAssessment) {
        this.assessmentService.update(this.editingAssessment._id!, assessmentData).subscribe({
          next: () => {
            this.loadAssessments();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          }
        });
      } else {
        this.assessmentService.create(assessmentData).subscribe({
          next: () => {
            this.loadAssessments();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout';
          }
        });
      }
    }
  }

  confirmDelete(assessment: Assessment): void {
    this.assessmentToDelete = assessment;
    this.showConfirmDialog = true;
  }

  onDelete(): void {
    if (this.assessmentToDelete) {
      this.assessmentService.delete(this.assessmentToDelete._id!).subscribe({
        next: () => {
          this.loadAssessments();
          this.showConfirmDialog = false;
          this.assessmentToDelete = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          this.showConfirmDialog = false;
        }
      });
    }
  }
}

