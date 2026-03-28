import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly http = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(url, body);
  }
}
