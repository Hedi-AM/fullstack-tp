import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold">Fullstack shop</h1>
      <p className="mt-2 text-gray-600">
        Browse products, search by title, filter by category, and manage the catalogue from the
        admin page.
      </p>
      <div className="mt-4 flex gap-2">
        <Link href="/products" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go to products
        </Link>
        <Link href="/admin" className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
          Admin
        </Link>
      </div>
    </div>
  );
}
