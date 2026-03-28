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
import { CatService, NotificationService } from '../../core/service';
import { CatApiResponse } from '../../shared/models/cat.model';

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
  private readonly notify = inject(NotificationService);

  cat = signal<CatApiResponse | null>(null);
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
      next: (response: any) => {
        // API returns { data: cat } or { data: [cat] } — normalise both
        const raw: CatApiResponse = Array.isArray(response?.data)
          ? response.data[0]
          : (response?.data ?? response);

        if (!raw?.info) {
          this.notify.show('Cat data is missing');
          this.isLoading.set(false);
          return;
        }

        this.cat.set(raw);
        this.updateForm.patchValue({
          name: raw.info.name,
          age: raw.info.age,
          description: raw.info.description
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.show('Failed to load cat');
        this.isLoading.set(false);
      }
    });
  }

  onUpdateCat(): void {
    const catId = this.cat()?.id;
    if (!this.updateForm.valid || !catId) return;

    this.isUpdating.set(true);
    const { name, age, description } = this.updateForm.value;
    this.catService.updateCat(catId, { name: name!, age: age!, description: description! }).subscribe({
      next: (updatedCat: CatApiResponse) => {
        this.cat.set(updatedCat);
        this.isUpdating.set(false);
        this.notify.show('Cat updated successfully!');
      },
      error: () => {
        this.notify.show('Failed to update cat');
        this.isUpdating.set(false);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }
}
