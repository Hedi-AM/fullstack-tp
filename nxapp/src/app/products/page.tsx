import Link from "next/link";
import { API_URL } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import type { Category, ProductListResponse } from "@/types/product";

const LIMIT = 12;

type SearchParams = Promise<{ q?: string; category?: string; skip?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const category = sp.category ?? "";
  const skip = Math.max(0, Number(sp.skip ?? 0) || 0);

  const params = new URLSearchParams({
    limit: String(LIMIT),
    skip: String(skip),
  });
  if (q) params.set("q", q);
  if (category) params.set("category", category);

  const [listRes, categoriesRes] = await Promise.all([
    fetch(`${API_URL}/products?${params.toString()}`, { cache: "no-store" }),
    fetch(`${API_URL}/categories`, { cache: "no-store" }),
  ]);

  if (!listRes.ok || !categoriesRes.ok) {
    return <p className="p-4 text-red-600">Could not load products.</p>;
  }

  const data = (await listRes.json()) as ProductListResponse;
  const categories = (await categoriesRes.json()) as Category[];

  function pageHref(nextSkip: number): string {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (nextSkip > 0) p.set("skip", String(nextSkip));
    return `/products${p.toString() ? `?${p.toString()}` : ""}`;
  }

  const from = data.products.length ? skip + 1 : 0;
  const to = skip + data.products.length;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-3 text-2xl font-bold">Products</h1>

      <SearchBar initialQ={q} initialCategory={category} categories={categories} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href={pageHref(Math.max(0, skip - LIMIT))}
          aria-disabled={skip === 0}
          className={`rounded px-4 py-2 text-white ${
            skip === 0 ? "pointer-events-none bg-gray-300" : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Previous
        </Link>
        <span>
          {from} - {to} of {data.total}
        </span>
        <Link
          href={pageHref(skip + LIMIT)}
          aria-disabled={skip + LIMIT >= data.total}
          className={`rounded px-4 py-2 text-white ${
            skip + LIMIT >= data.total
              ? "pointer-events-none bg-gray-300"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
