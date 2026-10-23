# Full Stack Web App - TP1 (Angular and Next.js front-end)

Two front-end apps built from the same lab and the same API (https://dummyjson.com/products):

| Folder   | Stack                         | Dev port |
|----------|-------------------------------|----------|
| `ngapp/` | Angular + Bootstrap           | 4200     |
| `nxapp/` | Next.js + Tailwind CSS        | 3000     |

Features: product list (responsive grid, pagination 12 per page), product detail page with a "Back to catalogue" link, loading and error states, reusable product card, typed code (TypeScript `strict`).

## Prerequisites

- Node.js 24 LTS and npm
- Git
- Docker (to run the containers)

## Run the Angular app (ngapp)

```bash
cd ngapp
npm install
npm start
```

Open http://localhost:4200

## Run the Next.js app (nxapp)

```bash
cd nxapp
npm install
npm run dev
```

Open http://localhost:3000

## Run the containers

Public images on Docker Hub:

- `hediam/ngapp:1.0`
- `hediam/nxapp:1.0`

### Run from Docker Hub

```bash
docker run -d -p 8080:80 hediam/ngapp:1.0
docker run -d -p 8081:3000 hediam/nxapp:1.0
```

- Angular: http://localhost:8080
- Next.js: http://localhost:8081

### Build locally

```bash
docker build -t hediam/ngapp:1.0 ./ngapp
docker build -t hediam/nxapp:1.0 ./nxapp
```

### Push to Docker Hub

```bash
docker login
docker push hediam/ngapp:1.0
docker push hediam/nxapp:1.0
```

The Angular image is a multi-stage build (Node to build, Nginx to serve, with `try_files` so refreshing `/products/5` works). The Next.js image is a multi-stage build using `output: "standalone"` and `node server.js`.

## Screenshots

Located in the `screenshots/` folder: list and detail pages for both apps.
