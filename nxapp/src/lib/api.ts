// Server Components read API_URL (works inside the Docker network: http://api:4000/api)
// Client Components read NEXT_PUBLIC_API_URL (must be reachable from the browser)
export const API_URL = process.env.API_URL ?? "http://localhost:4000/api";
export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
