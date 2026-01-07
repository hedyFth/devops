import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { GroupeService } from '../../../core/services/groupe.service';
import { Student } from '../../../core/models/student.model';
import { Groupe } from '../../../core/models/groupe.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestion des Étudiants</h1>
        <button class="btn btn-primary" (click)="openAddModal()">+ Ajouter un étudiant</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Numéro étudiant</th>
            <th>Groupe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let student of students">
            <td>{{ student.lastName }}</td>
            <td>{{ student.firstName }}</td>
            <td>{{ student.studentNumber }}</td>
            <td>{{ getGroupeName(student.groupe) }}</td>
            <td>
              <button class="btn btn-sm btn-edit" (click)="openEditModal(student)">Modifier</button>
              <button class="btn btn-sm btn-delete" (click)="confirmDelete(student)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Add/Edit -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingStudent ? 'Modifier' : 'Ajouter' }} un étudiant</h2>
          <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" formControlName="email" class="form-control" [readonly]="!!editingStudent" />
            </div>
            <div class="form-group" *ngIf="!editingStudent">
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
              <label>Numéro étudiant *</label>
              <input type="text" formControlName="studentNumber" class="form-control" [readonly]="!!editingStudent" />
            </div>
            <div class="form-group">
              <label>Groupe *</label>
              <select formControlName="groupeId" class="form-control">
                <option value="">Sélectionner un groupe</option>
                <option *ngFor="let g of groupes" [value]="g._id">{{ g.name }}</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="studentForm.invalid">
                {{ editingStudent ? 'Modifier' : 'Ajouter' }}
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
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  groupes: Groupe[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showConfirmDialog = false;
  editingStudent: Student | null = null;
  studentToDelete: Student | null = null;
  studentForm: FormGroup;

  constructor(
    private studentService: StudentService,
    private groupeService: GroupeService,
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      studentNumber: ['', Validators.required],
      groupeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadGroupes();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (data: any) => {
        this.students = data.students || data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  loadGroupes(): void {
    this.groupeService.getAll().subscribe({
      next: (data) => {
        this.groupes = data;
      },
      error: (error) => {
        console.error('Error loading groupes:', error);
      }
    });
  }

  getGroupeName(groupe: any): string {
    if (typeof groupe === 'object' && groupe.name) {
      return groupe.name;
    }
    const g = this.groupes.find(gr => gr._id === groupe);
    return g ? g.name : 'N/A';
  }

  openAddModal(): void {
    this.editingStudent = null;
    this.studentForm.reset();
    this.studentForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.studentForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  openEditModal(student: Student): void {
    this.editingStudent = student;
    const groupeId = typeof student.groupe === 'object' ? (student.groupe as Groupe)._id : student.groupe;
    this.studentForm.patchValue({
      email: typeof student.user === 'object' ? (student.user as any).email : '',
      firstName: student.firstName,
      lastName: student.lastName,
      studentNumber: student.studentNumber,
      groupeId: groupeId
    });
    this.studentForm.get('password')?.clearValidators();
    this.studentForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingStudent = null;
    this.studentForm.reset();
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      if (this.editingStudent) {
        // Update: only firstName, lastName, groupeId
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          groupeId: formData.groupeId
        };
        this.studentService.update(this.editingStudent._id!, updateData).subscribe({
          next: () => {
            this.loadStudents();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          }
        });
      } else {
        // Create: all fields including email and password
        this.studentService.create(formData).subscribe({
          next: () => {
            this.loadStudents();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout';
          }
        });
      }
    }
  }

  confirmDelete(student: Student): void {
    this.studentToDelete = student;
    this.showConfirmDialog = true;
  }

  onDelete(): void {
    if (this.studentToDelete) {
      this.studentService.delete(this.studentToDelete._id!).subscribe({
        next: () => {
          this.loadStudents();
          this.showConfirmDialog = false;
          this.studentToDelete = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          this.showConfirmDialog = false;
        }
      });
    }
  }
}

