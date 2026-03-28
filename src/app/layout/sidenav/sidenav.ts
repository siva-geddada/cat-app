import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidenav {
  isOpen = signal(false);

  toggleSidenav() {
    this.isOpen.update(open => !open);
  }

  closeSidenav() {
    this.isOpen.set(false);
  }
}
