import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CatService, Cat } from '../../core/service';

@Component({
  selector: 'app-cat-detail',
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
    MatSnackBarModule
  ],
  templateUrl: './cat-detail.html',
  styleUrl: './cat-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatDetailComponent {
  private readonly catService = inject(CatService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  cat = signal<Cat | null>(null);
  isLoading = signal(false);
  isUpdating = signal(false);

  updateForm = this.fb.group({
    name: ['', [Validators.required]],
    age: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  constructor() {
    this.loadCat();
  }

  loadCat(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isLoading.set(true);
    this.catService.getCatById(id).subscribe({
      next: (cat) => {
        this.cat.set(cat);
        this.updateForm.patchValue({
          name: cat.name,
          age: cat.age,
          description: cat.description
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load cat', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  onUpdateCat(): void {
    const catId = this.cat()?.id;
    if (!this.updateForm.valid || !catId) return;

    this.isUpdating.set(true);
    this.catService.updateCat(catId, this.updateForm.value as any).subscribe({
      next: (updatedCat) => {
        this.cat.set(updatedCat);
        this.isUpdating.set(false);
        this.snackBar.open('Cat updated successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to update cat', 'Close', { duration: 3000 });
        this.isUpdating.set(false);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }
}
