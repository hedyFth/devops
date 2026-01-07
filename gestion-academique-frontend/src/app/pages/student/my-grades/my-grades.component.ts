import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeService } from '../../../core/services/grade.service';
import { Grade } from '../../../core/models/grade.model';

@Component({
  selector: 'app-my-grades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Mes Notes</h1>
      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <div *ngIf="!loading" class="grades-container">
        <div *ngFor="let courseGroup of gradesByCourse" class="course-grades">
          <h2>{{ courseGroup.courseTitle }}</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>Évaluation</th>
                <th>Type</th>
                <th>Date</th>
                <th>Note</th>
                <th>Poids</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let grade of courseGroup.grades">
                <td>{{ getAssessmentTitle(grade.assessment) }}</td>
                <td>{{ getAssessmentType(grade.assessment) }}</td>
                <td>{{ getAssessmentDate(grade.assessment) | date:'short' }}</td>
                <td class="grade-value">{{ grade.value }}/20</td>
                <td>{{ getAssessmentWeight(grade.assessment) }}%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"><strong>Moyenne pondérée</strong></td>
                <td colspan="2"><strong>{{ courseGroup.average.toFixed(2) }}/20</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p *ngIf="gradesByCourse.length === 0">Aucune note disponible</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .grades-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .course-grades {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .course-grades h2 {
      margin-top: 0;
      color: #2c3e50;
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
    .data-table tfoot {
      background: #ecf0f1;
      font-weight: bold;
    }
    .grade-value {
      font-weight: bold;
      color: #2c3e50;
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
export class MyGradesComponent implements OnInit {
  grades: Grade[] = [];
  gradesByCourse: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private gradeService: GradeService) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.loading = true;
    this.gradeService.getMyGrades().subscribe({
      next: (data: any) => {
        this.grades = data.grades || data;
        this.organizeGradesByCourse();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  organizeGradesByCourse(): void {
    const courseMap: { [key: string]: any } = {};
    
    this.grades.forEach(grade => {
      const course = grade.assessment as any;
      const courseId = typeof course?.course === 'object' ? (course.course as any)._id : course?.course;
      const courseTitle = typeof course?.course === 'object' ? (course.course as any).title : 'Cours inconnu';
      
      if (!courseMap[courseId]) {
        courseMap[courseId] = {
          courseId,
          courseTitle,
          grades: []
        };
      }
      
      courseMap[courseId].grades.push(grade);
    });

    // Calculate weighted average for each course
    this.gradesByCourse = Object.values(courseMap).map((courseGroup: any) => {
      let totalWeighted = 0;
      let totalWeight = 0;
      
      courseGroup.grades.forEach((grade: Grade) => {
        const assessment = grade.assessment as any;
        const weight = assessment?.weight || 0;
        totalWeighted += grade.value * weight;
        totalWeight += weight;
      });
      
      courseGroup.average = totalWeight > 0 ? totalWeighted / totalWeight : 0;
      return courseGroup;
    });
  }

  getAssessmentTitle(assessment: any): string {
    if (typeof assessment === 'object' && assessment.title) {
      return assessment.title;
    }
    return 'N/A';
  }

  getAssessmentType(assessment: any): string {
    if (typeof assessment === 'object' && assessment.type) {
      return assessment.type;
    }
    return 'N/A';
  }

  getAssessmentDate(assessment: any): string {
    if (typeof assessment === 'object' && assessment.date) {
      return assessment.date;
    }
    return '';
  }

  getAssessmentWeight(assessment: any): number {
    if (typeof assessment === 'object' && assessment.weight) {
      return assessment.weight;
    }
    return 0;
  }
}

