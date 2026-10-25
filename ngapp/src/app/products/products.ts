import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../product';
import { Category, Product } from '../models/product';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private service = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  total = signal(0);
  loading = signal(false);
  error = signal('');

  limit = 12;
  skip = 0;
  q = '';
  category = '';

  ngOnInit(): void {
    this.loadCategories();
    this.load();
  }

  loadCategories(): void {
    this.service.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getProducts(this.limit, this.skip, this.q, this.category).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load products.');
        this.loading.set(false);
      },
    });
  }

  onSearch(): void {
    this.skip = 0;
    this.load();
  }

  onCategoryChange(): void {
    this.skip = 0;
    this.load();
  }

  next(): void {
    if (this.skip + this.limit < this.total()) {
      this.skip += this.limit;
      this.load();
    }
  }

  prev(): void {
    if (this.skip > 0) {
      this.skip = Math.max(0, this.skip - this.limit);
      this.load();
    }
  }

  price(value: number | string): string {
    return Number(value).toFixed(2);
  }
}
