# VocalMart

VocalMart is a simple shopping website. The React storefront talks to a Spring Boot REST API, and PostgreSQL stores users, products, carts, and orders.

```text
React + Vite
      ↓
REST API
      ↓
Spring Boot
 ├── Auth
 ├── Product
 ├── Category
 ├── Cart
 └── Order
      ↓
PostgreSQL 16
```

Voice search uses the browser microphone in Chrome or Edge. Say a product, category, or price, such as “grocery under 300”, or tap the example phrases. Saved products stay in this browser.

## Technology

- React, Vite, TypeScript, React Router, Axios
- Java 17, Spring Boot, Spring Web, Spring Data JPA, Spring Security, JWT, Bean Validation, Flyway
- PostgreSQL 16

## Folder structure

```text
backend/     Spring Boot API
frontend/    React storefront
```

Backend packages live under `com.vocalmart`: `controller`, `service`, `repository`, `entity`, `dto`, `security`, `exception`, `mapper`, and `config`.

## Database

PostgreSQL 16, database `vocalmart`, user `postgres`.

Create the database if it does not exist yet:

```sql
CREATE DATABASE vocalmart;
```

The password is not stored in source code. Copy the example env file and set it locally:

```powershell
Copy-Item .env.example backend\.env
```

Edit `backend\.env`:

```text
DB_URL=jdbc:postgresql://localhost:5432/vocalmart
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD
JWT_SECRET=replace-with-a-random-string-at-least-32-characters
```

Flyway creates the tables and seeds categories and products on startup.

## Run the backend

From `backend`, with `DB_PASSWORD` set in the shell or in `backend\.env`:

```powershell
.\run.ps1
```

The API listens on `http://localhost:8080`.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Optional: copy `frontend\.env.example` to `frontend\.env` if the API is not on `http://localhost:8080`.

## Seeded accounts

These accounts are created on first startup. Passwords are stored as BCrypt hashes.

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@vocalmart.com | Admin@123 |
| Customer | user@vocalmart.com | User@123 |

## Shopping flow

Register or log in, browse products, search by text or voice, save items, open a product, add it to the cart, check out, and review the order. Shipping is calculated on the server: free at ₹999 and above, otherwise ₹49. The Sports Cap is seeded with zero stock so the out-of-stock state is visible.

Admins can create, edit, delete, and restock products at `/admin`.

## API overview

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md). Architecture notes are in [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md).

## Screenshots

Add screenshots of the home page, product grid, cart, and orders here after a local run.
