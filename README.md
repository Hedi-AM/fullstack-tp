# Full Stack Web Application — TP1 / TP2

Monorepo containing two front-ends (Angular, Next.js) and an Express + Prisma + PostgreSQL API.

## Layout

- `api/`     — Express 5 + TypeScript + Prisma 7 + PostgreSQL
- `ngapp/`   — Angular (standalone components, Bootstrap)
- `nxapp/`   — Next.js 16 (App Router, Tailwind CSS)
- `docker-compose.yml` — full stack (db, api, ngapp, nxapp)

## Features

- Product catalogue with search (`q`), category filter, and pagination
- Product detail page with reviews and "Back to catalogue"
- Admin page to create / edit / delete products (Angular + Next.js)
- Reviews model (`Review`) — extra model required by the Challenge
- Categories endpoint returning product counts (Exercise 8)

## Prerequisites

- Node 24 LTS
- Docker + Docker Compose (only inside the Alpine VM in this setup)
- PostgreSQL 17 (via Docker)

## Run with Docker (VM)

    cp .env.example .env       # edit PUBLIC_API_URL / CORS_ORIGINS if needed
    docker compose up -d --build

Public URLs (in this setup, VM at 192.168.122.180):

| Service  | URL                                 |
|----------|-------------------------------------|
| Angular  | http://192.168.122.180:8090         |
| Next.js  | http://192.168.122.180:8091         |
| API      | http://192.168.122.180:4000/api     |
| Postgres | 192.168.122.180:5432 (app/app, db `shop`) |

The API container runs `npx prisma migrate deploy` on start, then `node dist/server.js`.

## Run without Docker (local dev)

**1. Database** — start Postgres 17 and create user `app` / password `app` / database `shop`.

**2. API**

    cd api
    cp .env.example .env       # set DATABASE_URL, PORT=4000, CORS_ORIGINS
    npm install
    npx prisma migrate deploy
    npx prisma generate
    npx prisma db seed
    npm run dev

**3. Angular**

    cd ngapp
    npm install
    npm start                  # http://localhost:4200

**4. Next.js**

    cd nxapp
    npm install
    cp .env.example .env.local
    npm run dev                # http://localhost:3000

## Environment variables

### Root (`.env` for Docker Compose)

| Name             | Example                                                   | Purpose                        |
|------------------|-----------------------------------------------------------|--------------------------------|
| `PUBLIC_API_URL` | `http://192.168.122.180:4000/api`                         | Baked into both front-ends     |
| `CORS_ORIGINS`   | `http://192.168.122.180:8090,http://192.168.122.180:8091` | Allowed browser origins on API |
| `PG_IMAGE`       | `postgres:17` (or `postgres:17-alpine`)                   | Postgres image                 |

### `api/.env`

| Name           | Example                                                  |
|----------------|----------------------------------------------------------|
| `DATABASE_URL` | `postgresql://app:app@localhost:5432/shop?schema=public` |
| `PORT`         | `4000`                                                   |
| `CORS_ORIGINS` | `http://localhost:4200,http://localhost:3000`            |

### `nxapp/.env.local`

| Name                  | Purpose                                  |
|-----------------------|------------------------------------------|
| `API_URL`             | Server-side base URL (Server Components) |
| `NEXT_PUBLIC_API_URL` | Browser base URL (Client Components)     |

### `ngapp`

Both `src/environments/environment.ts` and `environment.development.ts` contain `apiUrl`. The Dockerfile replaces `http://localhost:4000/api` with `${PUBLIC_API_URL}` at build time.

## API endpoints

| Method | Path                | Description                                    |
|--------|---------------------|------------------------------------------------|
| GET    | `/api/health`       | Health check                                   |
| GET    | `/api/products`     | List — query: `limit`, `skip`, `q`, `category` |
| GET    | `/api/products/:id` | One product with `category` and `reviews`      |
| POST   | `/api/products`     | Create product (JSON body, Zod validated)      |
| PATCH  | `/api/products/:id` | Update product (partial)                       |
| DELETE | `/api/products/:id` | Delete product                                 |
| GET    | `/api/categories`   | Categories with `_count.products`              |
| POST   | `/api/auth/register`| Register user — body `{email,password>=8}`     |
| POST   | `/api/auth/login`   | Login — returns `{user, token}`                |

Example requests: `api/requests.http`.

`POST/PATCH/DELETE /api/products` require `Authorization: Bearer <token>`. `GET` endpoints are public.

## Authentication (JWT)

- `User` model: `id`, `email` (unique), `passwordHash` (bcrypt, 12 rounds).
- `POST /api/auth/register` and `POST /api/auth/login` return a signed JWT.
- `JWT_SECRET` and `JWT_EXPIRES_IN` come from env (see `.env.example`).
- Angular: `authInterceptor` adds `Authorization: Bearer <token>` to every request; login/register on `/login`; admin redirects to login when logged out.
- Next.js: `lib/auth.ts` stores the token in `localStorage` and `authHeaders()` adds it to admin CRUD calls; `/admin` redirects to `/login` when the token is missing.

## Docker Hub images

- `hediam/api:2.0`
- `hediam/ngapp:3.0`
- `hediam/nxapp:3.0`

## Notes

- JWT authentication (lab section 8) is outlined in TP2 and is the main topic of TP3, so it is implemented in Part III.
- Prisma client is generated at build time; the API Dockerfile sets a placeholder `DATABASE_URL` only for `prisma generate`.

## Project parts

| Part | Folder | Description |
|------|--------|-------------|
| TP1  | `ngapp/`, `nxapp/` | Angular and Next.js front-ends (dummyjson) |
| TP2  | `api/` (with `ngapp/` and `nxapp/`) | Express + Prisma + PostgreSQL API with JWT, consumed by both front-ends (`docker-compose.yml` at the root) |
| TP3  | `appareils-tp/` | Appliances manager: Angular + Express + MongoDB (Mongoose), with its own `docker-compose.yml` and README |

See [`appareils-tp/README.md`](appareils-tp/README.md) for the TP3 run instructions and endpoints.
