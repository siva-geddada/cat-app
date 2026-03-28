import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { CatService, Cat } from '../../core/service';

@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './breeds.html',
  styleUrl: './breeds.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Breeds {
  private readonly catService = inject(CatService);
  private readonly snackBar = inject(MatSnackBar);

  cats = signal<Cat[]>([]);
  isLoading = signal(false);

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
        this.snackBar.open('Failed to load breeds', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }
}
