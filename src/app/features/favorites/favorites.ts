import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { CatService, NotificationService } from '../../core/service';
import { Cat, CatApiResponse } from '../../shared/models/cat.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
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
          next: (cats) => {
            this.cats.set(this.catService.assignImageUrl(cats?.data));
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
