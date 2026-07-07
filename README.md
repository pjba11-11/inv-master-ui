# inv-master-ui

Frontend for the Invoice Master application — built with **Next.js 16** and **React 19**.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS |
| API | Next.js Route Handlers (mock data, wired to match backend DTOs) |

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, Register, Forgot Password
│   ├── (dashboard)/      # Dashboard, Invoices, Customers, Products, Materials, Companies, Reports, Settings
│   └── api/              # Route handlers — mock data with field names matching backend DTOs
│       ├── auth/         # login, logout, register
│       ├── companies/    # company profile + [id]/settings
│       ├── customers/    # CRUD + [id]/notes
│       ├── invoices/     # CRUD + [id]/line-items, [id]/payments, [id]/pdf
│       ├── materials/    # CRUD + [id]/price-history
│       └── products/     # CRUD
└── components/
    ├── forms/            # CustomerForm, ProductForm, MaterialForm, CompanyForm, InvoiceForm
    ├── layout/           # Sidebar, Navbar, Breadcrumbs
    ├── ui/               # Button, Input, Select, Card, Badge, etc.
    └── widgets/          # RevenueChart, InvoicesTable, StatCard
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default mock credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | manager123 |
| Sales | sales@example.com | sales123 |

## API → Backend Mapping

Route handlers under `src/app/api/` use in-memory mock data. Field names match the Spring Boot backend DTOs exactly so each handler can be replaced with a `fetch` call once the backend is running.

| UI Route | Backend Endpoint |
|---|---|
| `POST /api/auth/login` | `POST /auth/login` → `{ accessToken, refreshToken }` |
| `POST /api/auth/register` (type: company) | `POST /auth/company/register` |
| `POST /api/auth/register` (type: user) | `POST /auth/user/register` |
| `GET/PUT /api/companies` | Company entity |
| `GET/PUT /api/companies/[id]/settings` | Settings entity |
| `GET/POST /api/customers` | Customers entity |
| `GET/POST /api/materials` | Materials entity |
| `GET/POST /api/products` | `GET/POST /products` (ProductFullResponse) |
| `GET/POST /api/invoices` | Invoices entity |
| `GET/POST /api/invoices/[id]/line-items` | InvoiceLineItems entity |
| `GET/POST /api/invoices/[id]/payments` | Payments entity |

## Backend

See [inv-master-001](https://github.com/pjba11-11/inv-master-001) for the Spring Boot backend.
