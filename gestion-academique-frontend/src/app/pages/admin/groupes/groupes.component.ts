import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GroupeService } from '../../../core/services/groupe.service';
import { Groupe } from '../../../core/models/groupe.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-groupes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestion des Groupes</h1>
        <button class="btn btn-primary" (click)="openAddModal()">+ Ajouter un groupe</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Année</th>
            <th>Département</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let groupe of groupes">
            <td>{{ groupe.name }}</td>
            <td>{{ groupe.level }}</td>
            <td>{{ groupe.year }}</td>
            <td>{{ groupe.department }}</td>
            <td>
              <button class="btn btn-sm btn-edit" (click)="openEditModal(groupe)">Modifier</button>
              <button class="btn btn-sm btn-delete" (click)="confirmDelete(groupe)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Add/Edit -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingGroupe ? 'Modifier' : 'Ajouter' }} un groupe</h2>
          <form [formGroup]="groupeForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" formControlName="name" class="form-control" />
            </div>
            <div class="form-group">
              <label>Niveau *</label>
              <input type="text" formControlName="level" class="form-control" />
            </div>
            <div class="form-group">
              <label>Année *</label>
              <input type="number" formControlName="year" class="form-control" />
            </div>
            <div class="form-group">
              <label>Département *</label>
              <input type="text" formControlName="department" class="form-control" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="groupeForm.invalid">
                {{ editingGroupe ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Confirm Dialog -->
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
    .data-table tr:hover {
      background: #f8f9fa;
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
export class GroupesComponent implements OnInit {
  groupes: Groupe[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showConfirmDialog = false;
  editingGroupe: Groupe | null = null;
  groupeToDelete: Groupe | null = null;
  groupeForm: FormGroup;

  constructor(
    private groupeService: GroupeService,
    private fb: FormBuilder
  ) {
    this.groupeForm = this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGroupes();
  }

  loadGroupes(): void {
    this.loading = true;
    this.groupeService.getAll().subscribe({
      next: (data) => {
        this.groupes = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.editingGroupe = null;
    this.groupeForm.reset({
      year: new Date().getFullYear()
    });
    this.showModal = true;
  }

  openEditModal(groupe: Groupe): void {
    this.editingGroupe = groupe;
    this.groupeForm.patchValue({
      name: groupe.name,
      level: groupe.level,
      year: groupe.year,
      department: groupe.department
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingGroupe = null;
    this.groupeForm.reset();
  }

  onSubmit(): void {
    if (this.groupeForm.valid) {
      const groupeData = this.groupeForm.value;
      if (this.editingGroupe) {
        this.groupeService.update(this.editingGroupe._id!, groupeData).subscribe({
          next: () => {
            this.loadGroupes();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          }
        });
      } else {
        this.groupeService.create(groupeData).subscribe({
          next: () => {
            this.loadGroupes();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout';
          }
        });
      }
    }
  }

  confirmDelete(groupe: Groupe): void {
    this.groupeToDelete = groupe;
    this.showConfirmDialog = true;
  }

  onDelete(): void {
    if (this.groupeToDelete) {
      this.groupeService.delete(this.groupeToDelete._id!).subscribe({
        next: () => {
          this.loadGroupes();
          this.showConfirmDialog = false;
          this.groupeToDelete = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          this.showConfirmDialog = false;
        }
      });
    }
  }
}

