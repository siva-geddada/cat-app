import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  @ViewChild(Sidenav) sidenav?: Sidenav;

  toggleSidenav() {
    this.sidenav?.toggleSidenav();
  }
}
