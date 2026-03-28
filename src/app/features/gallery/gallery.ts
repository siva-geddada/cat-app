import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CatService, NotificationService } from '../../core/service';
import { CatApiResponse } from '../../shared/models/cat.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Gallery {
  private readonly catService = inject(CatService);
  private readonly notify = inject(NotificationService);

  cats = signal<CatApiResponse[]>([]);
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
        this.cats.set(this.catService.assignImageUrl(cats?.data));
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.show('Failed to load gallery');
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
