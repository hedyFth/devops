import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Grade } from '../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = `${environment.apiUrl}/grades`;

  constructor(private http: HttpClient) {}

  getMyGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/me`);
  }

  getByAssessment(assessmentId: string): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/assessment/${assessmentId}`);
  }

  getByCourse(courseId: string): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/course/${courseId}`);
  }

  create(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, grade);
  }

  update(id: string, grade: Partial<Grade>): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, grade);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

