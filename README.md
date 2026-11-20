# RateHub — Full-Stack Store Rating Application

Monorepo with an Express + Prisma (MySQL) API and a React (Vite + Tailwind) client. Users register as shoppers, rate stores 1–5, store owners see who rated them, and admins manage the catalog.

## Prerequisites

- Node.js 18+
- MySQL 8+

Create the database:

```sql
CREATE DATABASE store_rating_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## MySQL connection string

```
mysql://USER:PASSWORD@localhost:3306/store_rating_db
```

Example:

```
mysql://root:secret@localhost:3306/store_rating_db
```

## Backend setup

```bash
cd backend
copy .env.example .env   # Windows
# cp .env.example .env  # macOS/Linux
```

Edit `.env` and set `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

```bash
npm install
npx prisma generate
npx prisma db push
node prisma/apply-checks.js
npx prisma db seed
npm run dev
```

API runs at `http://localhost:5000`. Health check: `GET /api/health`.

`apply-checks.js` adds a MySQL `CHECK (rating >= 1 AND rating <= 5)` constraint on `ratings.rating`.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Client runs at `http://localhost:5173` and proxies `/api` to the backend.

## Seed accounts

All seeded names are 20–60 characters to satisfy validation.

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@storerating.com` | `Admin@1234` |
| STORE_OWNER | `owner1@storerating.com` | `Owner@1234` |
| STORE_OWNER | `owner2@storerating.com` | `Owner@1234` |
| USER | `user1@storerating.com` | `User@1234!` |
| USER | `user2@storerating.com` | `User@1234!` |

## Validation rules (frontend + backend)

- **Name:** 20–60 characters
- **Address:** required, max 400 characters
- **Password:** 8–16 characters, at least one uppercase letter and one special character from `!@#$%^&*(),.?":{}|<>`
- **Email:** standard email format
- **Rating:** integer 1–5

## API overview

### Auth

- `POST /api/auth/signup` — public, `USER` role only
- `POST /api/auth/login` — any role, returns JWT + user
- `GET /api/auth/me` — current user
- `PATCH /api/auth/update-password` — `USER` and `STORE_OWNER`

### Admin (`ADMIN` JWT)

- `GET /api/admin/stats`
- `POST /api/admin/users`
- `GET /api/admin/users` — filter `name`, `email`, `address`, `role`; sort `sortBy`, `order`
- `GET /api/admin/users/:id` — includes store average rating for `STORE_OWNER`
- `POST /api/admin/stores`
- `GET /api/admin/stores`
- `GET /api/admin/owners/available`

### User (`USER` JWT)

- `GET /api/stores` — includes overall average and the logged-in user’s rating
- `POST /api/ratings` / `PUT /api/ratings/:storeId` — upsert on `(userId, storeId)`

### Store owner (`STORE_OWNER` JWT)

- `GET /api/owner/dashboard` — store average + sortable rater list

Send the JWT as `Authorization: Bearer <token>`.
