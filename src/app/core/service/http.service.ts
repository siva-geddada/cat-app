import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.getHeaders()
    });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.getHeaders()
    });
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(url, body, {
      headers: this.getHeaders()
    });
  }
}
