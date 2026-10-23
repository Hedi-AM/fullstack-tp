import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product } from "@/types/product";
import { API_URL } from "@/lib/api";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(`${API_URL}/products/${id}`);
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("HTTP " + response.status);
  const p: Product = await response.json();

  return (
    <main className="mx-auto max-w-5xl p-4">
      <Link
        href="/products"
        className="mb-4 inline-block rounded border border-gray-400 px-4 py-2 hover:bg-gray-200 hover:text-gray-900"
      >
        Back to catalogue
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="relative h-80 rounded border bg-white">
            <Image
              src={p.thumbnail}
              alt={p.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(p.images ?? []).map((img, i) => (
              <Image
                key={`${img}-${i}`}
                src={img}
                alt={p.title}
                width={80}
                height={80}
                className="rounded border bg-white object-contain"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{p.title}</h1>
          <p className="text-gray-500">
            {p.brand ? `${p.brand} - ` : ""}
            {p.category}
          </p>
          <p className="text-2xl font-bold">
            ${p.price.toFixed(2)}
            {p.discountPercentage ? (
              <span className="ml-2 rounded bg-green-600 px-2 py-1 text-sm text-white">
                -{p.discountPercentage}%
              </span>
            ) : null}
          </p>
          <p>{p.description}</p>

          <ul className="mt-2 space-y-1">
            {p.rating !== undefined && <li><strong>Rating:</strong> {p.rating} / 5</li>}
            {p.stock !== undefined && <li><strong>Stock:</strong> {p.stock}</li>}
            {p.availabilityStatus && <li><strong>Availability:</strong> {p.availabilityStatus}</li>}
            {p.sku && <li><strong>SKU:</strong> {p.sku}</li>}
            {p.shippingInformation && <li><strong>Shipping:</strong> {p.shippingInformation}</li>}
            {p.warrantyInformation && <li><strong>Warranty:</strong> {p.warrantyInformation}</li>}
            {p.returnPolicy && <li><strong>Return policy:</strong> {p.returnPolicy}</li>}
          </ul>

          <div className="mt-2 flex flex-wrap gap-2">
            {(p.tags ?? []).map((tag) => (
              <span key={tag} className="rounded bg-gray-600 px-2 py-1 text-sm text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
