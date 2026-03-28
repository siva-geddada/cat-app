import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { CatApiResponse, CatApiListResponse, CreateCatRequest } from '../../shared/models/cat.model';

@Injectable({ providedIn: 'root' })
export class CatService {
  private readonly httpService = inject(HttpService);
  private readonly baseUrl = '/api';

  assignImageUrl(cats: CatApiResponse[]): CatApiResponse[] {
    return cats.map((cat, index) => ({
      ...cat,
      imageUrl: cat.imageUrl || `https://cataas.com/cat?id=${cat.id || index}&width=600&height=400`
    }));
  }

  getAllCats() {
    return this.httpService.get<CatApiListResponse>(`${this.baseUrl}/list`);
  }

  getCatById(id: string) {
    return this.httpService.get<CatApiListResponse>(`${this.baseUrl}/list?id=${id}`);
  }

  getMultipleCats(ids: string[]) {
    return this.httpService.get<CatApiListResponse>(`${this.baseUrl}/list?id=${ids.join(',')}`);
  }

  createCat(cat: CreateCatRequest) {
    return this.httpService.post<CatApiResponse>(`${this.baseUrl}/create`, cat);
  }

  updateCat(id: string, cat: CreateCatRequest) {
    return this.httpService.put<CatApiResponse>(`${this.baseUrl}/update?id=${id}`, cat);
  }

  deleteCat(id: string) {
    return this.httpService.delete<void>(`${this.baseUrl}/delete?id=${id}`);
  }
}
