import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatImageService {
  private readonly cataasUrl = 'https://cataas.com/cat';

  getRandomCatImage() {
    const randomId = Math.random().toString(36).substring(7);
    return of(`${this.cataasUrl}?id=${randomId}&width=600&height=400`);
  }

  getMultipleCatImages(count: number = 1) {
    const images = Array.from({ length: count }, (_, index) => {
      const randomId = Math.random().toString(36).substring(7);
      return `${this.cataasUrl}?id=${randomId}_${index}&width=600&height=400`;
    });
    return of(images);
  }
}
