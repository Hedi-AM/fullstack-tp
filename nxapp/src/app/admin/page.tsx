"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PUBLIC_API_URL } from "@/lib/api";
import { getToken, clearSession, authHeaders } from "@/lib/auth";
import type { Category, Product, ProductListResponse, ProductPayload } from "@/types/product";

const EMPTY_FORM: ProductPayload = {
  title: "",
  description: "",
  price: 0,
  thumbnail: "",
  stock: 0,
  category: "",
};

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductPayload>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [listRes, categoriesRes] = await Promise.all([
        fetch(`${PUBLIC_API_URL}/products?limit=100&skip=0`),
        fetch(`${PUBLIC_API_URL}/categories`),
      ]);
      if (!listRes.ok || !categoriesRes.ok) throw new Error("load failed");
      const data = (await listRes.json()) as ProductListResponse;
      setProducts(data.products);
      setCategories((await categoriesRes.json()) as Category[]);
    } catch {
      setError("Could not load products.");
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    void load();
  }, [load, router]);

  function reset(): void {
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  function edit(product: Product): void {
    setEditId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: Number(product.price),
      thumbnail: product.thumbnail,
      stock: product.stock,
      category: product.category.name,
    });
  }

  function handleAuthFail(status: number): boolean {
    if (status === 401) {
      clearSession();
      router.replace("/login");
      return true;
    }
    return false;
  }

  async function save(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    const url = editId
      ? `${PUBLIC_API_URL}/products/${editId}`
      : `${PUBLIC_API_URL}/products`;
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(form),
    });
    if (handleAuthFail(res.status)) return;
    if (!res.ok) {
      setError("Could not save product.");
      return;
    }
    reset();
    await load();
  }

  async function remove(id: number): Promise<void> {
    if (!window.confirm("Delete this product?")) return;
    setError("");
    const res = await fetch(`${PUBLIC_API_URL}/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (handleAuthFail(res.status)) return;
    if (!res.ok) {
      setError("Could not delete product.");
      return;
    }
    await load();
  }

  function update<K extends keyof ProductPayload>(key: K, value: ProductPayload[K]): void {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-3 text-2xl font-bold">Admin products</h1>

      {error ? <p className="mb-2 text-red-600">{error}</p> : null}

      <form onSubmit={save} className="mb-6 rounded border p-4">
        <h2 className="mb-2 text-lg font-semibold">
          {editId ? "Edit product" : "Create product"}
        </h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <input className="rounded border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)} />
          <input className="rounded border px-3 py-2" placeholder="Category name" value={form.category} onChange={(e) => update("category", e.target.value)} />
          <input className="rounded border px-3 py-2" type="number" placeholder="Price" value={form.price} onChange={(e) => update("price", Number(e.target.value))} />
          <input className="rounded border px-3 py-2" type="number" placeholder="Stock" value={form.stock} onChange={(e) => update("stock", Number(e.target.value))} />
          <input className="rounded border px-3 py-2 md:col-span-2" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => update("thumbnail", e.target.value)} />
          <textarea className="rounded border px-3 py-2 md:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="mt-2 flex gap-2">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
          <button type="button" onClick={reset} className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">Cancel</button>
        </div>
      </form>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-1">ID</th>
            <th className="py-1">Title</th>
            <th className="py-1">Category</th>
            <th className="py-1">Price</th>
            <th className="py-1">Stock</th>
            <th className="py-1" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-1">{product.id}</td>
              <td className="py-1">{product.title}</td>
              <td className="py-1">{product.category.name}</td>
              <td className="py-1">{Number(product.price).toFixed(2)}</td>
              <td className="py-1">{product.stock}</td>
              <td className="py-1 text-right">
                <button type="button" onClick={() => edit(product)} className="mr-1 rounded border border-blue-600 px-2 py-1 text-blue-600">Edit</button>
                <button type="button" onClick={() => void remove(product.id)} className="rounded border border-red-600 px-2 py-1 text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2 text-sm text-gray-500">{categories.length} categories</p>
    </div>
  );
}
