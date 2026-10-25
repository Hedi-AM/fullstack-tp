import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex h-full flex-col rounded border p-3">
      <div className="relative h-40 w-full">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="300px"
          className="object-contain"
        />
      </div>
      <h2 className="mt-2 font-semibold">{product.title}</h2>
      <p className="text-sm text-gray-500">{product.category.name}</p>
      <p className="font-bold">{Number(product.price).toFixed(2)} €</p>
      <Link
        href={`/products/${product.id}`}
        className="mt-auto rounded bg-blue-600 px-3 py-1 text-center text-white hover:bg-blue-700"
      >
        Details
      </Link>
    </div>
  );
}
