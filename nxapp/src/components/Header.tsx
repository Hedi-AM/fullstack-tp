"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, clearSession, type AuthUser } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout(): void {
    clearSession();
    setUser(null);
    router.push("/login");
  }

  return (
    <nav className="flex items-center gap-4 bg-gray-900 p-3 text-white">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/about">About</Link>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-300">{user.email}</span>
            <button onClick={logout} className="rounded border border-white px-3 py-1 text-sm">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
