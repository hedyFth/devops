import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GradeService } from '../../../core/services/grade.service';
import { AssessmentService } from '../../../core/services/assessment.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { CourseService } from '../../../core/services/course.service';
import { Grade } from '../../../core/models/grade.model';
import { Assessment } from '../../../core/models/assessment.model';
import { Enrollment } from '../../../core/models/enrollment.model';
import { Course } from '../../../core/models/course.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <h1>Gestion des Notes</h1>
      
      <div class="selection-section">
        <div class="form-group">
          <label>Sélectionner un cours</label>
          <select [(ngModel)]="selectedCourseId" (change)="onCourseChange()" class="form-control">
            <option value="">-- Sélectionner un cours --</option>
            <option *ngFor="let course of courses" [value]="course._id">{{ course.title }}</option>
          </select>
        </div>
        
        <div class="form-group" *ngIf="selectedCourseId">
          <label>Sélectionner une évaluation</label>
          <select [(ngModel)]="selectedAssessmentId" (change)="loadGrades()" class="form-control">
            <option value="">-- Sélectionner une évaluation --</option>
            <option *ngFor="let assessment of assessments" [value]="assessment._id">
              {{ assessment.title }} ({{ assessment.type }})
            </option>
          </select>
        </div>
      </div>

      <div *ngIf="selectedAssessmentId && selectedCourseId" class="grades-section">
        <h2>Saisir les notes</h2>
        <div *ngIf="loading" class="loading">Chargement...</div>
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        
        <table class="data-table" *ngIf="!loading">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let enrollment of enrollments">
              <td>{{ getStudentName(enrollment.student) }}</td>
              <td>
                <input 
                  type="number" 
                  [(ngModel)]="gradesMap[getStudentId(enrollment.student)]"
                  (blur)="saveGrade(enrollment.student, $event)"
                  class="grade-input"
                  min="0"
                  max="20"
                  step="0.1" />
              </td>
              <td>
                <button 
                  *ngIf="getExistingGradeId(enrollment.student)"
                  class="btn btn-sm btn-delete" 
                  (click)="confirmDeleteGrade(enrollment.student)">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-confirm-dialog
        *ngIf="showConfirmDialog"
        (confirm)="onDeleteGrade()"
        (cancel)="showConfirmDialog = false">
      </app-confirm-dialog>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .selection-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    .grades-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .data-table {
      width: 100%;
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
    .grade-input {
      width: 100px;
      padding: 0.5rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
    .btn-delete {
      background: #e74c3c;
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
export class GradesComponent implements OnInit {
  courses: Course[] = [];
  assessments: Assessment[] = [];
  enrollments: Enrollment[] = [];
  grades: Grade[] = [];
  selectedCourseId = '';
  selectedAssessmentId = '';
  loading = false;
  errorMessage = '';
  showConfirmDialog = false;
  studentToDeleteGrade: any = null;
  gradesMap: { [key: string]: number } = {};
  existingGrades: { [key: string]: Grade } = {};

  constructor(
    private gradeService: GradeService,
    private assessmentService: AssessmentService,
    private enrollmentService: EnrollmentService,
    private courseService: CourseService,
    private fb: FormBuilder
  ) {}

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

  onCourseChange(): void {
    this.selectedAssessmentId = '';
    this.assessments = [];
    this.enrollments = [];
    this.grades = [];
    this.gradesMap = {};
    this.existingGrades = {};
    
    if (this.selectedCourseId) {
      this.loadAssessments();
      this.loadEnrollments();
    }
  }

  loadAssessments(): void {
    this.assessmentService.getByCourse(this.selectedCourseId).subscribe({
      next: (data: any) => {
        this.assessments = data.assessments || data;
      },
      error: (error) => {
        console.error('Error loading assessments:', error);
      }
    });
  }

  loadEnrollments(): void {
    this.enrollmentService.getByCourse(this.selectedCourseId).subscribe({
      next: (data: any) => {
        this.enrollments = data.enrollments || data;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
      }
    });
  }

  loadGrades(): void {
    if (!this.selectedAssessmentId) {
      this.grades = [];
      this.gradesMap = {};
      this.existingGrades = {};
      return;
    }
    this.loading = true;
    this.gradeService.getByAssessment(this.selectedAssessmentId).subscribe({
      next: (data: any) => {
        this.grades = data.grades || data;
        this.gradesMap = {};
        this.existingGrades = {};
        this.grades.forEach(grade => {
          const studentId = this.getStudentId(grade.student);
          this.gradesMap[studentId] = grade.value;
          this.existingGrades[studentId] = grade;
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  saveGrade(student: any, event: any): void {
    const value = parseFloat(event.target.value);
    if (isNaN(value) || value < 0 || value > 20) {
      return;
    }
    const studentId = this.getStudentId(student);
    const existingGrade = this.existingGrades[studentId];
    
    if (existingGrade) {
      // Update existing grade
      this.gradeService.update(existingGrade._id!, { value }).subscribe({
        next: () => {
          this.loadGrades();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la modification';
        }
      });
    } else {
      // Create new grade
      const gradeData = {
        student: studentId,
        assessment: this.selectedAssessmentId,
        value: value,
        attributionDate: new Date().toISOString()
      };
      this.gradeService.create(gradeData).subscribe({
        next: () => {
          this.loadGrades();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout';
        }
      });
    }
  }

  confirmDeleteGrade(student: any): void {
    this.studentToDeleteGrade = student;
    this.showConfirmDialog = true;
  }

  onDeleteGrade(): void {
    if (this.studentToDeleteGrade) {
      const studentId = this.getStudentId(this.studentToDeleteGrade);
      const existingGrade = this.existingGrades[studentId];
      if (existingGrade) {
        this.gradeService.delete(existingGrade._id!).subscribe({
          next: () => {
            this.loadGrades();
            this.showConfirmDialog = false;
            this.studentToDeleteGrade = null;
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
            this.showConfirmDialog = false;
          }
        });
      }
    }
  }

  getStudentId(student: any): string {
    if (typeof student === 'object' && student._id) {
      return student._id;
    }
    return student;
  }

  getStudentName(student: any): string {
    if (typeof student === 'object' && student.firstName) {
      return `${student.firstName} ${student.lastName}`;
    }
    return 'N/A';
  }

  getExistingGradeId(student: any): string | null {
    const studentId = this.getStudentId(student);
    return this.existingGrades[studentId]?._id || null;
  }
}

