import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { CatService, Cat } from '../../core/service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Favorites {
  private readonly catService = inject(CatService);
  private readonly snackBar = inject(MatSnackBar);

  cats = signal<Cat[]>([]);

  constructor() {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favoriteCats');
    if (storedFavorites) {
      const ids = JSON.parse(storedFavorites) as string[];
      if (ids.length > 0) {
        this.catService.getMultipleCats(ids).subscribe({
          next: (cats) => this.cats.set(cats),
          error: () => this.snackBar.open('Failed to load favorites', 'Close', { duration: 3000 })
        });
      }
    }
  }

  onRemoveFavorite(catId: string): void {
    const currentFavorites = JSON.parse(localStorage.getItem('favoriteCats') || '[]') as string[];
    const updated = currentFavorites.filter(id => id !== catId);
    localStorage.setItem('favoriteCats', JSON.stringify(updated));
    this.cats.update(cats => cats.filter(c => c.id !== catId));
    this.snackBar.open('Removed from favorites', 'Close', { duration: 2000 });
  }
}
