"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types/product";

export default function SearchBar({
  initialQ,
  initialCategory,
  categories,
}: {
  initialQ: string;
  initialCategory: string;
  categories: Category[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="mb-4 flex flex-col gap-2 md:flex-row">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title"
        className="flex-1 rounded border px-3 py-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded border px-3 py-2"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Search
      </button>
    </form>
  );
}
