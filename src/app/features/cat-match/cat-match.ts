import { Component, ChangeDetectionStrategy, signal, inject, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { CatService, NotificationService } from '../../core/service';
import { CatApiResponse, CatApiListResponse } from '../../shared/models/cat.model';

@Component({
  selector: 'app-cat-match',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './cat-match.html',
  styleUrl: './cat-match.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatMatch {
  private readonly catService = inject(CatService);
  private readonly notify = inject(NotificationService);

  cats = signal<CatApiResponse[]>([]);
  currentIndex = signal(0);
  isLoading = signal(false);
  likedCats = signal<CatApiResponse[]>([]);
  passedCats = signal<CatApiResponse[]>([]);
  swipeDir = signal<'like' | 'pass' | null>(null);
  showMatches = signal(false);

  readonly currentCat = computed(() => this.cats()[this.currentIndex()] ?? null);
  readonly isDone = computed(() => !this.isLoading() && this.currentIndex() >= this.cats().length && this.cats().length > 0);
  readonly progress = computed(() =>
    this.cats().length ? Math.round((this.currentIndex() / this.cats().length) * 100) : 0
  );

  constructor() { this.loadCats(); }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.isDone() || !this.currentCat()) return;
    if (e.key === 'ArrowRight') this.onLike();
    if (e.key === 'ArrowLeft')  this.onPass();
  }

  loadCats(): void {
    this.isLoading.set(true);
    this.catService.getAllCats().subscribe({
      next: (response: CatApiListResponse) => {
        const shuffled = [...this.catService.assignImageUrl(response?.data ?? [])].sort(() => Math.random() - 0.5);
        this.cats.set(shuffled);
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.show('Failed to load cats');
        this.isLoading.set(false);
      }
    });
  }

  onLike(): void {
    const cat = this.currentCat();
    if (!cat) return;
    this.swipeDir.set('like');
    this.likedCats.update(list => [...list, cat]);
    this.saveFavourite(cat.id);
    setTimeout(() => { this.swipeDir.set(null); this.currentIndex.update(i => i + 1); }, 350);
  }

  onPass(): void {
    if (!this.currentCat()) return;
    this.swipeDir.set('pass');
    this.passedCats.update(list => [...list, this.currentCat()!]);
    setTimeout(() => { this.swipeDir.set(null); this.currentIndex.update(i => i + 1); }, 350);
  }

  restart(): void {
    this.currentIndex.set(0);
    this.likedCats.set([]);
    this.passedCats.set([]);
    this.showMatches.set(false);
    const shuffled = [...this.cats()].sort(() => Math.random() - 0.5);
    this.cats.set(shuffled);
  }

  private saveFavourite(id: string): void {
    const stored: string[] = JSON.parse(localStorage.getItem('favoriteCats') || '[]');
    if (!stored.includes(id)) {
      localStorage.setItem('favoriteCats', JSON.stringify([...stored, id]));
    }
  }
}
