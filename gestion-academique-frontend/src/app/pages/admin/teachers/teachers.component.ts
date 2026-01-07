import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';
import { Teacher } from '../../../core/models/teacher.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestion des Enseignants</h1>
        <button class="btn btn-primary" (click)="openAddModal()">+ Ajouter un enseignant</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Code enseignant</th>
            <th>Spécialité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let teacher of teachers">
            <td>{{ teacher.lastName }}</td>
            <td>{{ teacher.firstName }}</td>
            <td>{{ teacher.teacherCode }}</td>
            <td>{{ teacher.specialty }}</td>
            <td>
              <button class="btn btn-sm btn-edit" (click)="openEditModal(teacher)">Modifier</button>
              <button class="btn btn-sm btn-delete" (click)="confirmDelete(teacher)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingTeacher ? 'Modifier' : 'Ajouter' }} un enseignant</h2>
          <form [formGroup]="teacherForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" formControlName="email" class="form-control" [readonly]="!!editingTeacher" />
            </div>
            <div class="form-group" *ngIf="!editingTeacher">
              <label>Mot de passe *</label>
              <input type="password" formControlName="password" class="form-control" />
            </div>
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" formControlName="firstName" class="form-control" />
            </div>
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" formControlName="lastName" class="form-control" />
            </div>
            <div class="form-group">
              <label>Code enseignant *</label>
              <input type="text" formControlName="teacherCode" class="form-control" [readonly]="!!editingTeacher" />
            </div>
            <div class="form-group">
              <label>Spécialité *</label>
              <input type="text" formControlName="specialty" class="form-control" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="teacherForm.invalid">
                {{ editingTeacher ? 'Modifier' : 'Ajouter' }}
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
    .page-header h1 {
      margin: 0;
      color: #2c3e50;
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
      font-size: 0.9rem;
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
      max-height: 90vh;
      overflow-y: auto;
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
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showConfirmDialog = false;
  editingTeacher: Teacher | null = null;
  teacherToDelete: Teacher | null = null;
  teacherForm: FormGroup;

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder
  ) {
    this.teacherForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      teacherCode: ['', Validators.required],
      specialty: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading = true;
    this.teacherService.getAll().subscribe({
      next: (data: any) => {
        this.teachers = data.teachers || data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.editingTeacher = null;
    this.teacherForm.reset();
    this.teacherForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.showModal = true;
  }

  openEditModal(teacher: Teacher): void {
    this.editingTeacher = teacher;
    this.teacherForm.patchValue({
      email: typeof teacher.user === 'object' ? (teacher.user as any).email : '',
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      teacherCode: teacher.teacherCode,
      specialty: teacher.specialty
    });
    this.teacherForm.get('password')?.clearValidators();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingTeacher = null;
    this.teacherForm.reset();
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const formData = this.teacherForm.value;
      if (this.editingTeacher) {
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          specialty: formData.specialty
        };
        this.teacherService.update(this.editingTeacher._id!, updateData).subscribe({
          next: () => {
            this.loadTeachers();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          }
        });
      } else {
        this.teacherService.create(formData).subscribe({
          next: () => {
            this.loadTeachers();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout';
          }
        });
      }
    }
  }

  confirmDelete(teacher: Teacher): void {
    this.teacherToDelete = teacher;
    this.showConfirmDialog = true;
  }

  onDelete(): void {
    if (this.teacherToDelete) {
      this.teacherService.delete(this.teacherToDelete._id!).subscribe({
        next: () => {
          this.loadTeachers();
          this.showConfirmDialog = false;
          this.teacherToDelete = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          this.showConfirmDialog = false;
        }
      });
    }
  }
}

