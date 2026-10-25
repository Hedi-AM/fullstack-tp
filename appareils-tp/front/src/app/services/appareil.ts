import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppareilData, AppareilInput } from '../models/appareil.model';

@Injectable({ providedIn: 'root' })
export class AppareilService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAppareils(status?: 'On' | 'Off'): Observable<AppareilData[]> {
    return this.http.get<AppareilData[]>(this.apiUrl, {
      params: status ? { status } : {},
    });
  }

  getAppareil(id: string): Observable<AppareilData> {
    return this.http.get<AppareilData>(`${this.apiUrl}/${id}`);
  }

  addAppareil(appareil: AppareilInput): Observable<AppareilData> {
    return this.http.post<AppareilData>(this.apiUrl, appareil);
  }

  updateAppareil(id: string, appareil: AppareilInput): Observable<AppareilData> {
    return this.http.put<AppareilData>(`${this.apiUrl}/${id}`, appareil);
  }

  deleteAppareil(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  switchAll(status: 'On' | 'Off'): Observable<{ modified: number }> {
    return this.http.patch<{ modified: number }>(`${this.apiUrl}/switch-all`, { status });
  }
}
