import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // inject() gets services from Angular (dependency injection)
  private router = inject(Router);
  private location = inject(Location);

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  gotoContact() {
    this.router.navigate(['/contact']);
  }

  // Exercise 3: go back to the previous page
  goBack() {
    this.location.back();
  }
}