import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex justify-center gap-4 bg-gray-900 p-3 text-white">
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/admin">Admin</Link>
      <Link href="/login">Login</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}
