import { Injectable, inject } from '@angular/core';
import { HttpService, ApiResponse } from './http.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Cat {
  id: string;
  name: string;
  age: string;
  description: string;
}

export interface CreateCatRequest {
  name: string;
  age: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CatService {
  private readonly httpService = inject(HttpService);
  private readonly baseUrl = '/api';

  getAllCats() {
    return this.httpService.get<any>(`${this.baseUrl}/list`)
      .pipe(
        map(response => {
          console.log('API Response:', response);
          // Handle both wrapped and direct responses
          if (response?.data) {
            const data = Array.isArray(response.data) ? response.data : [];
            console.log('Extracted data:', data);
            return data;
          } else if (Array.isArray(response)) {
            console.log('Direct array:', response);
            return response;
          }
          console.log('Empty array returned');
          return [];
        }),
        catchError(error => {
          console.error('API Error:', error);
          return of([]);
        })
      );
  }

  getCatById(id: string) {
    return this.httpService.get<any>(`${this.baseUrl}/list?id=${id}`)
      .pipe(
        map(response => {
          if (response?.data) {
            return response.data;
          }
          return response;
        })
      );
  }

  getMultipleCats(ids: string[]) {
    const idString = ids.join(',');
    return this.httpService.get<any>(`${this.baseUrl}/list?id=${idString}`)
      .pipe(
        map(response => {
          if (response?.data) {
            return Array.isArray(response.data) ? response.data : [];
          } else if (Array.isArray(response)) {
            return response;
          }
          return [];
        }),
        catchError(() => of([]))
      );
  }

  createCat(cat: CreateCatRequest) {
    return this.httpService.post<any>(`${this.baseUrl}/create`, cat)
      .pipe(
        map(response => {
          if (response?.data) {
            return response.data;
          }
          return response;
        })
      );
  }

  updateCat(id: string, cat: CreateCatRequest) {
    return this.httpService.put<any>(`${this.baseUrl}/update?id=${id}`, cat)
      .pipe(
        map(response => {
          if (response?.data) {
            return response.data;
          }
          return response;
        })
      );
  }

  deleteCat(id: string) {
    return this.httpService.delete<any>(`${this.baseUrl}/delete?id=${id}`);
  }
}
