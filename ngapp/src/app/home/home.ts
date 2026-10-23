import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Child } from '../child/child';

@Component({
  selector: 'app-home',
  imports: [Child],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);
  private location = inject(Location);

  content = 'Content from Parent';
  states = ['Tozeur', 'Tunis', 'Nabeul'];
  chosen = '';

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  gotoContact() {
    this.router.navigate(['/contact']);
  }

  goBack() {
    this.location.back();
  }

  onSelected(state: string) {
    this.chosen = state;
  }

  addState(name: string) {
    const value = name.trim();
    if (value) {
      this.states = [...this.states, value];
    }
  }
}
