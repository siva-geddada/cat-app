import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Sidenav } from './layout/sidenav/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidenav, MatIconModule, MatRippleModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  @ViewChild(Sidenav) sidenav!: Sidenav;

  toggleSidenav() {
    this.sidenav.toggleSidenav();
  }
}
