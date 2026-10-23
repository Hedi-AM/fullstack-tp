"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { API_URL } from "@/lib/api";

export default function ProductsClient() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${API_URL}/products/1`);
        if (!response.ok) throw new Error("HTTP " + response.status);
        setProduct(await response.json());
      } catch {
        setError("Unable to load the product");
      }
    }
    fetchProduct();
  }, []); // [] = run once, after the first render

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading product...</p>;
  return (
    <p>
      {product.title} - {product.description}
    </p>
  );
}
