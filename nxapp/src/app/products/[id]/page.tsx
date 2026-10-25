import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { API_URL } from "@/lib/api";
import type { Product } from "@/types/product";

type Params = Promise<{ id: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });

  if (res.status === 404) notFound();
  if (!res.ok) return <p className="p-4 text-red-600">Could not load product.</p>;

  const product = (await res.json()) as Product;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link
        href="/products"
        className="mb-4 inline-block rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
      >
        Back to catalogue
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative h-80 rounded border p-4">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="400px"
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-500">{product.category.name}</p>
          <p className="mt-2">{product.description}</p>
          <p className="mt-3 text-xl font-bold">
            {Number(product.price).toFixed(2)} €
          </p>
          <p>Stock: {product.stock}</p>
        </div>
      </div>

      {product.reviews?.length ? (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Reviews</h2>
          <div className="space-y-2">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded border p-3">
                <strong>{review.reviewerName}</strong> — {review.rating}/5
                <p className="mb-0">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
