export interface Category {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | string;
  thumbnail: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  reviews?: Review[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
}

export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
}
