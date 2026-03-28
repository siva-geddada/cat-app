import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { CatService, NotificationService } from '../../core/service';
import { CatApiResponse, CatApiListResponse } from '../../shared/models/cat.model';

@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './breeds.html',
  styleUrl: './breeds.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Breeds {
  private readonly catService = inject(CatService);
  private readonly notify = inject(NotificationService);

  cats = signal<CatApiResponse[]>([]);
  isLoading = signal(false);
  query = signal('');

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.cats();
    return this.cats().filter(c =>
      c.info.name.toLowerCase().includes(q) ||
      c.info.age.toLowerCase().includes(q) ||
      c.info.description.toLowerCase().includes(q)
    );
  });

  constructor() { this.loadCats(); }

  loadCats(): void {
    this.isLoading.set(true);
    this.catService.getAllCats().subscribe({
      next: (response: CatApiListResponse) => {
        this.cats.set(this.catService.assignImageUrl(response?.data ?? []));
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.show('Failed to load breeds');
        this.isLoading.set(false);
      }
    });
  }
}
