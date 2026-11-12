# Employee CMS

Basic Employee Directory — add, view, edit, delete, search, and paginate employee records.

**Stack:** Next.js + TypeScript · Node.js/Express + TypeScript · Prisma · MySQL · Docker (MySQL + phpMyAdmin)

## Quick start

### 1. Start MySQL + phpMyAdmin

```bash
docker compose up -d
```

| Service    | URL / Port |
|------------|------------|
| MySQL      | `localhost:3307` |
| phpMyAdmin | http://localhost:8080 |

phpMyAdmin credentials:

- User: `employee_user`
- Password: `employee_pass`
- Database: `employee_cms`

> Host port **3307** avoids conflict with other MySQL instances on **3306**.

### 2. Start the API (Prisma)

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev      # tsx watch
```

Build for production: `npm run build && npm start`

API: http://localhost:5001  
Health: http://localhost:5001/health

### 3. Start the frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/employees?search=&page=1&limit=10` | List (search + pagination) |
| `POST` | `/employees` | Create |
| `PUT` | `/employees/:id` | Update |
| `DELETE` | `/employees/:id` | Delete |

## Prisma schema

```prisma
model Employee {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(150)
  role      String   @db.VarChar(100)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("employees")
}
```

Defined in `backend/prisma/schema.prisma`.  
Database URL lives in `backend/prisma.config.ts` via `DATABASE_URL` (Prisma 7).  
Seed data: `backend/prisma/seed.ts`.

## Project layout

```
├── docker-compose.yml
├── backend/
│   ├── prisma/schema.prisma
│   ├── prisma/seed.js
│   └── src/
└── frontend/                 # Next.js App Router
```

## Environment

**Backend** (`backend/.env`):

```
PORT=5001
DATABASE_URL="mysql://employee_user:employee_pass@127.0.0.1:3307/employee_cms"
```

**Frontend** (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Reset database

```bash
docker compose down -v
docker compose up -d
cd backend && npx prisma db push && npm run prisma:seed
```
