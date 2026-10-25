import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../product';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private service = inject(ProductService);
  private route = inject(ActivatedRoute);

  product = signal<Product | undefined>(undefined);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getProduct(id).subscribe({
      next: (product) => this.product.set(product),
      error: () => this.error.set('Product not found.'),
    });
  }

  price(value: number | string): string {
    return Number(value).toFixed(2);
  }
}
