import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../product';
import { Product } from '../models/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private service = inject(ProductService);

  readonly limit = 12;
  products = signal<Product[]>([]);
  total = signal(0);
  skip = signal(0);
  loading = signal(true);
  error = signal('');

  page = computed(() => this.skip() / this.limit + 1);
  pages = computed(() => Math.ceil(this.total() / this.limit));
  hasPrevious = computed(() => this.skip() > 0);
  hasNext = computed(() => this.skip() + this.limit < this.total());

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.service.getProducts(this.limit, this.skip()).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load the products');
        this.loading.set(false);
      },
    });
  }

  previous() {
    if (this.hasPrevious()) {
      this.skip.update((s) => s - this.limit);
      this.load();
    }
  }

  next() {
    if (this.hasNext()) {
      this.skip.update((s) => s + this.limit);
      this.load();
    }
  }
}
