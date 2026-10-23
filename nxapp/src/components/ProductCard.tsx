import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const description =
    product.description.length > 80
      ? product.description.slice(0, 80) + "..."
      : product.description;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-white text-gray-900 shadow-sm">
      <div className="relative h-48 bg-gray-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-auto font-bold">${product.price.toFixed(2)}</p>
        <Link
          href={`/products/${product.id}`}
          className="rounded bg-blue-500 px-4 py-2 text-center font-bold text-white hover:bg-blue-700"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
