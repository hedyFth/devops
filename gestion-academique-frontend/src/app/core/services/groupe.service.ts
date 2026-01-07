import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Groupe } from '../models/groupe.model';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  private apiUrl = `${environment.apiUrl}/groupes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Groupe[]> {
    return this.http.get<Groupe[]>(this.apiUrl);
  }

  getById(id: string): Observable<Groupe> {
    return this.http.get<Groupe>(`${this.apiUrl}/${id}`);
  }

  create(groupe: Partial<Groupe>): Observable<Groupe> {
    return this.http.post<Groupe>(this.apiUrl, groupe);
  }

  update(id: string, groupe: Partial<Groupe>): Observable<Groupe> {
    return this.http.put<Groupe>(`${this.apiUrl}/${id}`, groupe);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

