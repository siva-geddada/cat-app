import { CatApiResponse, CreateCatRequest } from './../../shared/models/cat.model';
import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { CatImageService } from './cat-image.service';




@Injectable({ providedIn: 'root' })
export class CatService {
  private readonly httpService = inject(HttpService);
  private readonly catImageService = inject(CatImageService);
  private readonly baseUrl = '/api';

  assignImageUrl(cats: CatApiResponse[]): CatApiResponse[] {
    return cats.map((cat, index) => ({
      ...cat,
      imageUrl: cat.imageUrl || `https://cataas.com/cat?id=${cat.id || index}&width=600&height=400`
    }));
  }


  getAllCats() {
    return this.httpService.get<any>(`${this.baseUrl}/list`);
  }

  getCatById(id: string) {
    return this.httpService.get<any>(`${this.baseUrl}/list?id=${id}`);
  }

  getMultipleCats(ids: string[]) {
    const idString = ids.join(',');
    return this.httpService.get<any>(`${this.baseUrl}/list?id=${idString}`);
  }

  createCat(cat: CreateCatRequest) {
    return this.httpService.post<any>(`${this.baseUrl}/create`, cat);
  }

  updateCat(id: string, cat: CreateCatRequest) {
    return this.httpService.put<any>(`${this.baseUrl}/update?id=${id}`, cat);
  }

  deleteCat(id: string) {
    return this.httpService.delete<any>(`${this.baseUrl}/delete?id=${id}`);
  }
}
