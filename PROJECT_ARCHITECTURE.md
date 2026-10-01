# VocalMart architecture

VocalMart is one Spring Boot application and one React application. PostgreSQL is the only application database.

```text
React pages
    ↓
Axios (JWT on authenticated calls)
    ↓
Spring Boot REST controllers
    ↓
Services
    ↓
Spring Data repositories
    ↓
JPA / Hibernate
    ↓
PostgreSQL
```

Controllers do not contain shopping rules. Services check stock, hash passwords, and calculate totals. Repositories only read and write the database. API responses use DTOs, not JPA entities.

## Authentication

```text
React login form
    ↓
POST /api/auth/login
    ↓
Spring Security AuthenticationManager
    ↓
BCrypt password check against PostgreSQL users
    ↓
JWT returned to React
    ↓
Authorization: Bearer <token> on later requests
    ↓
JwtAuthenticationFilter loads the user
```

Public pages are home, products, product details, categories, login, and register. Cart, checkout, orders, and profile require a logged-in user. `/api/admin/**` requires the `ADMIN` role.

Registration creates a `USER` and an empty cart. Passwords are hashed with BCrypt before they are saved.

## Catalog

Categories and products are related: many products belong to one category. Product prices use `BigDecimal`. Seed data is inserted by Flyway, looking up categories by name rather than a fixed id.

Search is case-insensitive across product name and description. The same query also accepts category, minimum price, maximum price, and sort.

## Cart

Each user has one cart. Cart lines store a product and a quantity. The API rejects a quantity below 1 or above the current stock. Subtotal, shipping, and total are calculated in `Pricing` on the server. The browser displays those values.

## Orders

Checkout sends the shipping address only. The server copies each cart line into an order item and stores the product name and price at that moment, so later catalog edits do not change the order. Stock is reduced and the cart is cleared in the same transaction. The first status is `PLACED`.

```text
User
 ├── Cart
 │    └── CartItem → Product
 └── Order
      └── OrderItem → Product (name and price are also stored on the line)

Category
 └── Product
```

## API map

- `/api/auth` registration, login, current user
- `/api/products` catalog, search, category filter
- `/api/categories` category list
- `/api/cart` cart for the logged-in user
- `/api/orders` place and read the logged-in user's orders
- `/api/admin/products` create, update, stock, and delete for admins

Errors are returned as JSON by `GlobalExceptionHandler`, including 400, 401, 403, 404, 409, and 500.
