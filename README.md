# inv-master-ui

Frontend for the Invoice Master application — built with **Next.js 16** and **React 19**, fully wired to the [Spring Boot backend](https://github.com/pjba11-11/inv-master-001).

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| API | Next.js Route Handlers proxying the Spring Boot backend |
| Auth | HTTP-only cookie JWT; role stored client-side for UI gating |

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, two-step company registration (with logo upload)
│   ├── (dashboard)/      # Dashboard, Invoices, Customers, Products, Materials, Settings
│   └── api/              # Route handlers — thin proxies to the backend at :8080
│       ├── auth/         # login, logout, register
│       ├── admin/        # user management (admin only)
│       ├── customers/    # CRUD
│       ├── invoices/     # CRUD + [id]/line-items, [id]/payments, [id]/pdf
│       ├── materials/    # CRUD + [id]/price-history
│       ├── products/     # CRUD
│       └── settings/     # company tax + invoice settings
├── components/
│   ├── forms/            # CustomerForm, ProductForm, MaterialForm, InvoiceForm
│   ├── guards/           # WriteGuard — redirects read-only users away from write pages
│   ├── layout/           # Sidebar (collapsible, grouped nav, profile footer), Navbar
│   ├── ui/               # Button, Input, Select, Card, Badge, etc.
│   └── widgets/          # RevenueChart, InvoicesTable, StatCard
└── hooks/
    └── use-role.ts       # Reads role from session; exposes canWrite
```

## Getting Started

1. Start the backend (PostgreSQL + Spring Boot on `http://localhost:8080`) — see the [backend README](https://github.com/pjba11-11/inv-master-001).

2. Run the frontend:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register a company, or log in with an existing user.

### Docker

```bash
docker build -t inv-master-ui .
docker run -p 3000:3000 inv-master-ui
```

## Role-Based UI

The JWT role claim (`ADMIN` / `MANAGER` / `EMPLOYEE`) drives what users see:

| Capability | ADMIN | MANAGER | EMPLOYEE |
|---|---|---|---|
| View all pages | ✓ | ✓ | ✓ |
| Add / edit / delete records | ✓ | ✓ | — |
| Save settings | ✓ | ✓ | — |
| Team Members (list + create users) | ✓ | — | — |

- `useRole()` gates buttons on list pages
- `<WriteGuard>` wraps every add/edit/create page and redirects unauthorized users
- The backend enforces the same rules with `@PreAuthorize` — the UI gating is UX, not security

## API Proxy

Route handlers under `src/app/api/` forward requests to the backend via `src/lib/backend.ts`, attaching the JWT from the HTTP-only cookie. Field names map 1:1 to backend DTOs; invoices additionally expose `customerName` and `createdByName` for the audit trail columns.

## Backend

See [inv-master-001](https://github.com/pjba11-11/inv-master-001) for the Spring Boot backend.
