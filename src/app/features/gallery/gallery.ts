import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { CatService, Cat } from '../../core/service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Gallery {
  private readonly catService = inject(CatService);
  private readonly snackBar = inject(MatSnackBar);

  cats = signal<Cat[]>([]);
  isLoading = signal(false);
  favoritedIds = signal<Set<string>>(new Set());

  constructor() {
    this.loadAllCats();
    this.loadFavorites();
  }

  loadAllCats(): void {
    this.isLoading.set(true);
    this.catService.getAllCats().subscribe({
      next: (cats) => {
        this.cats.set(cats);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load gallery', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favoriteCats');
    if (storedFavorites) {
      const ids = JSON.parse(storedFavorites) as string[];
      this.favoritedIds.set(new Set(ids));
    }
  }

  toggleFavorite(catId: string): void {
    const favorited = new Set(this.favoritedIds());
    if (favorited.has(catId)) {
      favorited.delete(catId);
    } else {
      favorited.add(catId);
    }
    this.favoritedIds.set(favorited);
    localStorage.setItem('favoriteCats', JSON.stringify(Array.from(favorited)));
  }

  isFavorited(catId: string): boolean {
    return this.favoritedIds().has(catId);
  }
}
