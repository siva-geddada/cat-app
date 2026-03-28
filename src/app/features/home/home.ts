import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { CatService, Cat } from '../../core/service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly catService = inject(CatService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  cats = signal<Cat[]>([]);
  isLoading = signal(false);
  isCreating = signal(false);
  deletingIds = signal<Set<string>>(new Set());

  createForm = this.fb.group({
    name: ['', [Validators.required]],
    age: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  isDeleting = (catId: string) => this.deletingIds().has(catId);

  constructor() {
    this.loadCats();
  }

  loadCats(): void {
    this.isLoading.set(true);
    this.catService.getAllCats().subscribe({
      next: (cats) => {
        console.log('Home component received cats:', cats);
        this.cats.set(cats);
        console.log('Signal updated, cats():', this.cats());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Home load error:', error);
        this.snackBar.open('Failed to load cats', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  onCreateCat(): void {
    if (!this.createForm.valid) return;

    this.isCreating.set(true);
    this.catService.createCat(this.createForm.value as any).subscribe({
      next: (newCat) => {
        this.cats.update(cats => [...cats, newCat]);
        this.createForm.reset();
        this.isCreating.set(false);
        this.snackBar.open('Cat created successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to create cat', 'Close', { duration: 3000 });
        this.isCreating.set(false);
      }
    });
  }

  onDeleteCat(catId: string): void {
    const deletingIds = new Set(this.deletingIds());
    deletingIds.add(catId);
    this.deletingIds.set(deletingIds);

    this.catService.deleteCat(catId).subscribe({
      next: () => {
        this.cats.update(cats => cats.filter(c => c.id !== catId));
        this.snackBar.open('Cat deleted successfully!', 'Close', { duration: 3000 });
        const updatedIds = new Set(this.deletingIds());
        updatedIds.delete(catId);
        this.deletingIds.set(updatedIds);
      },
      error: () => {
        this.snackBar.open('Failed to delete cat', 'Close', { duration: 3000 });
        const updatedIds = new Set(this.deletingIds());
        updatedIds.delete(catId);
        this.deletingIds.set(updatedIds);
      }
    });
  }
}
