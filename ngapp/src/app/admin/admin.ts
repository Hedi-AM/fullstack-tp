import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product';
import { Category, Product, ProductPayload } from '../models/product';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private service = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  error = signal('');
  editId: number | null = null;

  form: ProductPayload = {
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
    stock: 0,
    category: '',
  };

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
    this.error.set('');
    this.service.getProducts(100, 0).subscribe({
      next: (res) => this.products.set(res.products),
      error: () => this.error.set('Could not load products.'),
    });
  }

  edit(product: Product): void {
    this.editId = product.id;
    this.form = {
      title: product.title,
      description: product.description,
      price: Number(product.price),
      thumbnail: product.thumbnail,
      stock: product.stock,
      category: product.category.name,
    };
  }

  reset(): void {
    this.editId = null;
    this.form = {
      title: '',
      description: '',
      price: 0,
      thumbnail: '',
      stock: 0,
      category: '',
    };
  }

  save(): void {
    const request = this.editId
      ? this.service.updateProduct(this.editId, this.form)
      : this.service.createProduct(this.form);

    request.subscribe({
      next: () => {
        this.reset();
        this.loadCategories();
        this.load();
      },
      error: () => this.error.set('Could not save product.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.service.deleteProduct(id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Could not delete product.'),
    });
  }
}
