import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductsResponse } from "@/types/product";
import { API_URL } from "@/lib/api";

const LIMIT = 12;

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ skip?: string }>;
}) {
  const { skip: skipParam } = await searchParams;
  const parsed = Number(skipParam);
  const skip = Number.isInteger(parsed) && parsed > 0 ? parsed : 0;

  const response = await fetch(`${API_URL}/products?limit=${LIMIT}&skip=${skip}`);
  if (!response.ok) throw new Error("HTTP " + response.status);
  const data: ProductsResponse = await response.json();

  const hasPrevious = skip > 0;
  const hasNext = skip + LIMIT < data.total;
  const page = Math.floor(skip / LIMIT) + 1;
  const pages = Math.ceil(data.total / LIMIT);

  const buttonClass =
    "rounded border border-blue-500 px-4 py-2 font-bold text-blue-500 hover:bg-blue-500 hover:text-white";
  const disabledClass =
    "rounded border border-gray-400 px-4 py-2 font-bold text-gray-400 cursor-not-allowed";

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-3xl font-bold">Product Catalogue</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        {hasPrevious ? (
          <Link
            href={`/products?skip=${Math.max(skip - LIMIT, 0)}`}
            className={buttonClass}
          >
            Previous
          </Link>
        ) : (
          <span className={disabledClass}>Previous</span>
        )}
        <span>
          Page {page} of {pages}
        </span>
        {hasNext ? (
          <Link href={`/products?skip=${skip + LIMIT}`} className={buttonClass}>
            Next
          </Link>
        ) : (
          <span className={disabledClass}>Next</span>
        )}
      </div>
    </main>
  );
}
