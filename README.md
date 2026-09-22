# KING DAY — E-Commerce Catalogue Website & Secure Admin Panel

> **Fun • Quality • Happiness**

KING DAY is a modern, high-converting e-commerce catalogue and WhatsApp ordering website designed for kids products, electric ride-on cars, 4x4 jeeps, educational toys, bicycles, and baby care accessories.

---

## 🌟 Features

### 🛒 Customer Catalogue Experience
- **Dynamic Category Menu & Mega-Menu**: Real-time product counts fetched directly from Prisma database.
- **High-Conversion Product Pages**: Image gallery with thumbnail selection, MRP vs Sale Price, discount % badges, stock availability status, age recommendation, and technical specifications table.
- **Direct WhatsApp Ordering**: Dynamic `BUY ON WHATSAPP` links pre-filling product name, SKU, price in Indian Rupees (`₹`), and dynamic product URL using `window.location.origin`.
- **Search & Filtering**: Filter by category, price, availability, featured status, and search by product title or SKU.
- **Mobile First & Responsive**: Sticky bottom WhatsApp CTA bar on mobile screens, mobile filter drawer, and custom touch targets.
- **Floating WhatsApp Button**: Persistent bottom-right floating chat button carefully positioned to avoid mobile CTA bar overlap.

### 🔒 Secure Admin Control Panel
- **JWT Authentication**: Protected `/admin/*` routes with password hashing via `bcrypt`.
- **Dashboard Overview**: Metrics for Total Products, Active Products, Low Stock (≤ 5), Out of Stock, Categories, and Featured Items.
- **Product Management**: Create, edit, search, filter, toggle active/featured status, and delete products.
- **Category Management**: Create, edit, set display order, and **Safe Category Deletion** with automated reassignment prompts if products are assigned.
- **Inventory Fast-Editor**: Dedicated stock quantity editor with real-time stock status determination.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons, React Router DOM.
- **Backend**: Node.js, Express, TypeScript, JWT, BcryptJS, Cors, Helmet, Express Rate Limit.
- **Database & ORM**: PostgreSQL / SQLite, Prisma ORM.

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies
```bash
# Install root, client, and server dependencies
npm.cmd install
npm.cmd install --prefix client
npm.cmd install --prefix server
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="kingday_super_secret_jwt_key_2026_change_in_production"
PORT=5000
CLIENT_URL="http://localhost:5173"
VITE_API_BASE_URL="http://localhost:5000/api"
VITE_WHATSAPP_NUMBER="919495902904"
```

### 3. Setup Database & Seed Sample Data
```bash
# Push Prisma schema to database
npx.cmd prisma db push

# Seed initial admin account & sample catalogue
npx.cmd tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
# Run client (port 5173) and server (port 5000) concurrently
npm.cmd run dev
```

---

## 🔐 Admin Development Credentials

- **Email**: `admin@kingday.store`
- **Password**: `ADMIN123`

---

## 📡 API Endpoints

### Public Routes
- `GET /api/categories` — Get active categories with product count
- `GET /api/categories/:slug` — Get category details
- `GET /api/products` — Get filtered products catalogue
- `GET /api/products/:slug` — Get product details & related products
- `POST /api/admin/login` — Admin login (Rate limited)

### Admin Protected Routes (Require JWT Header `Authorization: Bearer <TOKEN>`)
- `GET /api/admin/me` — Verify token session
- `GET /api/admin/dashboard` — Get dashboard metrics
- `POST /api/admin/categories` — Create category
- `PUT /api/admin/categories/:id` — Update category
- `DELETE /api/admin/categories/:id` — Delete category (Supports reassignment)
- `POST /api/admin/products` — Create product
- `PUT /api/admin/products/:id` — Update product
- `PATCH /api/admin/products/:id/inventory` — Quick inventory stock update
- `DELETE /api/admin/products/:id` — Delete product

---

## 🌐 Deployment to Vercel
This repository includes `vercel.json` with SPA rewrite rules preventing 404 errors on direct page refreshes.

Build commands:
```bash
npm.cmd run build
```
