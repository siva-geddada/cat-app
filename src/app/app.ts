import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layout/navbar/navbar";
import { Sidenav } from "./layout/sidenav/sidenav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cat-app');
}
