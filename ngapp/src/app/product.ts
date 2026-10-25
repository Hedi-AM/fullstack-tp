import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  Category,
  Product,
  ProductListResponse,
  ProductPayload,
} from './models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getProducts(
    limit = 12,
    skip = 0,
    q = '',
    category = '',
  ): Observable<ProductListResponse> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);
    if (q) params = params.set('q', q);
    if (category) params = params.set('category', category);
    return this.http.get<ProductListResponse>(`${this.base}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, payload);
  }

  updateProduct(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/products/${id}`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${id}`);
  }
}
