# Appareils (TP3): Angular + Express + MongoDB

A small home appliances manager.

- `front/`: Angular 22 + Bootstrap 5 (standalone components, signals, zoneless)
- `api/`: Node.js 24 + Express 5 + Mongoose 9 + Zod + Helmet (TypeScript)
- `docker-compose.yml`: MongoDB 8 and the API

Features: list, detail, create (with validation), edit, delete (with confirmation), switch on/off one or all, filter by status, rooms (a second collection referenced by appliances, loaded with `populate()`), loading and error messages.

## Run with Docker (MongoDB + API)

```bash
docker compose up -d --build
curl http://localhost:3002/api/health
```

The API is published on port **3002** of the host (3001 inside the container). MongoDB is published on 27017 and its data is kept in the `mongodata` volume.

Stop: `docker compose down` (add `-v` to also delete the data).

## Run without Docker for the API (development)

1. Start MongoDB only: `docker compose up -d mongo`
2. API:

```bash
cd api
cp .env.example .env     # then edit MONGODB_URI if MongoDB is not on localhost
npm install
npm run dev              # http://localhost:3001
```

3. Front-end:

```bash
cd front
npm install
npm start                # http://localhost:4200
```

The API URL used by Angular is in `front/src/environments/environment*.ts`.

## Environment variables (api)

| Variable       | Example                                | Role                                       |
|----------------|----------------------------------------|--------------------------------------------|
| `MONGODB_URI`  | `mongodb://localhost:27017/appareilsDB` | MongoDB connection string                  |
| `PORT`         | `3001`                                 | HTTP port of the API                       |
| `CORS_ORIGINS` | `http://localhost:4200`                | Allowed origins, separated by commas       |

`.env` is never committed (see `.gitignore`).

## Endpoints

Base URL: `/api`

| Method | Path                      | Description                                  | Success | Errors   |
|--------|---------------------------|----------------------------------------------|---------|----------|
| GET    | `/health`                 | Health check                                 | 200     |          |
| GET    | `/appareils`              | List appliances (room populated)             | 200     | 400      |
| GET    | `/appareils?status=On`    | Filter by status (`On` or `Off`)             | 200     | 400      |
| GET    | `/appareils/:id`          | One appliance                                | 200     | 400, 404 |
| POST   | `/appareils`              | Create `{ name, status, room? }`             | 201     | 400      |
| PUT    | `/appareils/:id`          | Replace `{ name, status, room? }`            | 200     | 400, 404 |
| PATCH  | `/appareils/switch-all`   | Set the status of all appliances `{ status }`| 200     | 400      |
| DELETE | `/appareils/:id`          | Delete                                       | 204     | 400, 404 |
| GET    | `/rooms`                  | List rooms                                   | 200     |          |
| POST   | `/rooms`                  | Create `{ name }`                            | 201     | 400      |
| DELETE | `/rooms/:id`              | Delete (its appliances keep existing, room becomes null) | 204 | 400, 404 |

Status codes: 400 invalid data or malformed id, 404 unknown id, 500 unexpected error.

## Relational vs document (short comparison with TP2)

- PostgreSQL + Prisma: strict schema and migrations, foreign keys, joins (`include`).
- MongoDB + Mongoose: schema defined in the code, no migrations, `_id` as ObjectId, references resolved with `populate()`.
