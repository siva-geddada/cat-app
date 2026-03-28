import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CatService, NotificationService } from '../../core/service';
import { Cat } from '../../shared/models/cat.model';

@Component({
  selector: 'app-cat-match',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  templateUrl: './cat-match.html',
  styleUrl: './cat-match.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatMatch {
  private readonly catService = inject(CatService);
  private readonly notify = inject(NotificationService);

  cats = signal<Cat[]>([]);
  currentIndex = signal(0);
  isLoading = signal(false);
  matchedCats = signal<Cat[]>([]);

  constructor() {
    this.loadCats();
  }

  loadCats(): void {
    this.isLoading.set(true);
    this.catService.getAllCats().subscribe({
      next: (cats) => {
        this.cats.set(cats);
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.show('Failed to load cats');
        this.isLoading.set(false);
      }
    });
  }

  onLike(): void {
    const currentCat = this.cats()[this.currentIndex()];
    this.matchedCats.update(cats => [...cats, currentCat]);
    this.nextCat();
    this.notify.show(`You liked ${currentCat.name}! 💕`, 2000);
  }

  onDislike(): void {
    this.nextCat();
  }

  nextCat(): void {
    const next = this.currentIndex() + 1;
    if (next >= this.cats().length) {
      this.notify.show('No more cats! Check your matches.');
    } else {
      this.currentIndex.set(next);
    }
  }

  get currentCat(): Cat | undefined {
    return this.cats()[this.currentIndex()];
  }

  get progress(): number {
    return (this.currentIndex() / this.cats().length) * 100;
  }
}
