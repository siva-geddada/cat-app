import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CatApiResponse, CatApiListResponse } from '../../shared/models/cat.model';
import { CatService } from '../../core/service/cat.service';
import { NotificationService } from '../../core/service/notification.service';

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
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly catService = inject(CatService);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);

  cats = signal<CatApiResponse[]>([]);
  isLoading = signal(false);
  isCreating = signal(false);
  showForm = signal(false);
  deletingIds = signal<Set<string>>(new Set());

  createForm = this.fb.group({
    name: ['', [Validators.required]],
    age: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  isDeleting = (catId: string) => this.deletingIds().has(catId);

  constructor() {
    this.loadCats();
  }

  loadCats(): void {
    this.isLoading.set(true);
    this.catService.getAllCats().subscribe({
      next: (response: CatApiListResponse) => {
        this.cats.set(this.catService.assignImageUrl(response.data ?? []));
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.show('Failed to load cats');
        this.isLoading.set(false);
      },
    });
  }

  onCreateCat(): void {
    if (!this.createForm.valid) return;

    this.isCreating.set(true);
    const { name, age, description } = this.createForm.value;
    this.catService.createCat({ name: name!, age: age!, description: description! }).subscribe({
      next: (newCat: CatApiResponse) => {
        this.cats.update((cats) => [...cats, newCat]);
        this.createForm.reset();
        this.isCreating.set(false);
        this.showForm.set(false);
        this.notify.show('Cat created successfully!');
      },
      error: () => {
        this.notify.show('Failed to create cat');
        this.isCreating.set(false);
      },
    });
  }

  onDeleteCat(catId: string): void {
    const deletingIds = new Set(this.deletingIds());
    deletingIds.add(catId);
    this.deletingIds.set(deletingIds);

    this.catService.deleteCat(catId).subscribe({
      next: () => {
        this.cats.update((cats) => cats.filter((c) => c.id !== catId));
        this.notify.show('Cat deleted successfully!');
        const updatedIds = new Set(this.deletingIds());
        updatedIds.delete(catId);
        this.deletingIds.set(updatedIds);
      },
      error: () => {
        this.notify.show('Failed to delete cat');
        const updatedIds = new Set(this.deletingIds());
        updatedIds.delete(catId);
        this.deletingIds.set(updatedIds);
      },
    });
  }
}
