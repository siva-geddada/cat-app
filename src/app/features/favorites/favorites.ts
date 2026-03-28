import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CatService, NotificationService } from '../../core/service';
import { CatApiResponse, CatApiListResponse } from '../../shared/models/cat.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  private readonly catService = inject(CatService);
  private readonly notify = inject(NotificationService);

  cats = signal<CatApiResponse[]>([]);
  isLoading = signal(false);

  constructor() {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favoriteCats');
    if (storedFavorites) {
      const ids = JSON.parse(storedFavorites) as string[];
      if (ids.length > 0) {
        this.isLoading.set(true);
        this.catService.getMultipleCats(ids).subscribe({
          next: (response: CatApiListResponse) => {
            this.cats.set(this.catService.assignImageUrl(response?.data ?? []));
            this.isLoading.set(false);
          },
          error: () => {
            this.notify.show('Failed to load favorites');
            this.isLoading.set(false);
          },
        });
      }
    }
  }

  onRemoveFavorite(catId: string): void {
    const currentFavorites = JSON.parse(localStorage.getItem('favoriteCats') || '[]') as string[];
    const updated = currentFavorites.filter((id) => id !== catId);
    localStorage.setItem('favoriteCats', JSON.stringify(updated));
    this.cats.update((cats) => cats.filter((c) => c.id !== catId));
    this.notify.show('Removed from favorites', 2000);
  }
}
