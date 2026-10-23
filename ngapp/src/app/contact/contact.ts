import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  id: string | null = null;
  ref: string | null = null; // Exercise 4
  private route = inject(ActivatedRoute);

  constructor() {
    // 'id' is the same name used in the route definition
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });

    // Exercise 4: read the query parameter (?ref=home)
    this.route.queryParamMap.subscribe((query) => {
      this.ref = query.get('ref');
    });
  }
}