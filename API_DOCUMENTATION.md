# VocalMart API

Base URL: `http://localhost:8080`

Authenticated requests send `Authorization: Bearer <token>`.

Error body:

```json
{
  "timestamp": "2026-10-01T09:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "What went wrong"
}
```

## Auth

### POST `/api/auth/register`

Authentication: none

Request:

```json
{ "name": "Asha Sharma", "email": "asha@example.com", "password": "secret123" }
```

Response `201`:

```json
{
  "token": "<jwt>",
  "user": { "id": 3, "name": "Asha Sharma", "email": "asha@example.com", "role": "USER", "createdAt": "2026-10-01T09:00:00" }
}
```

`409` if the email already exists. Password must be at least 8 characters.

### POST `/api/auth/login`

Authentication: none

Request:

```json
{ "email": "user@vocalmart.com", "password": "User@123" }
```

Response `200`: same shape as register. `401` when the email or password is wrong.

### GET `/api/auth/me`

Authentication: required

Response `200`: the user object without a password.

## Products

### GET `/api/products`

Authentication: none

Query parameters, all optional:

- `query` name or description, case-insensitive
- `categoryId`
- `minPrice`
- `maxPrice`
- `sort`: `newest` (default), `price_asc`, `price_desc`, `rating`, `name`

Response `200`: array of products.

```json
{
  "id": 1,
  "name": "Wireless Headphones",
  "description": "...",
  "price": 2499.00,
  "imageUrl": "/images/wireless-headphones.jpg",
  "stockQuantity": 35,
  "categoryId": 1,
  "categoryName": "Electronics",
  "rating": 4.6,
  "createdAt": "2026-10-01T09:00:00"
}
```

### GET `/api/products/{id}`

Authentication: none. `404` when the product does not exist.

### GET `/api/products/search?query=headphones`

Authentication: none. `query` is required. Matches name and description.

### GET `/api/products/category/{categoryId}`

Authentication: none. `404` when the category does not exist.

## Categories

### GET `/api/categories`

Authentication: none

```json
{ "id": 1, "name": "Electronics", "description": "...", "productCount": 5 }
```

### GET `/api/categories/{id}`

Authentication: none. `404` when missing.

## Cart

Authentication: required for every cart route.

### GET `/api/cart`

Returns the user's cart, creating one if needed.

```json
{
  "id": 1,
  "items": [
    {
      "id": 10,
      "productId": 1,
      "productName": "Wireless Headphones",
      "imageUrl": "/images/wireless-headphones.jpg",
      "price": 2499.00,
      "quantity": 1,
      "lineTotal": 2499.00,
      "stockQuantity": 35
    }
  ],
  "subtotal": 2499.00,
  "shipping": 0.00,
  "total": 2499.00,
  "itemCount": 1,
  "shippingNote": "Free shipping on orders of ₹999 and above. A flat ₹49 fee applies below that."
}
```

### POST `/api/cart/items`

```json
{ "productId": 1, "quantity": 1 }
```

Adds to an existing line for the same product. `400` when the product is out of stock or the quantity is above stock.

### PUT `/api/cart/items/{itemId}`

```json
{ "quantity": 2 }
```

Replaces the quantity. Quantity must be at least 1 and not above stock.

### DELETE `/api/cart/items/{itemId}`

Removes one line and returns the cart.

### DELETE `/api/cart`

Clears every line and returns the empty cart.

## Orders

Authentication: required. A user can only read their own orders.

### POST `/api/orders`

Request is the shipping address. Totals are calculated on the server from the cart.

```json
{
  "fullName": "Asha Sharma",
  "phone": "9876543210",
  "addressLine": "12 MG Road",
  "city": "Pune",
  "postalCode": "411001"
}
```

Response `201`: the created order, status `PLACED`. Each item stores `productName` and `price` from the moment of purchase. Stock is reduced and the cart is cleared. `400` when the cart is empty or stock changed.

### GET `/api/orders`

The current user's orders, newest first.

### GET `/api/orders/{id}`

One order. `404` if it is missing or belongs to someone else.

## Admin products

Authentication: `ADMIN` role. Others receive `403`.

### POST `/api/admin/products`

```json
{
  "name": "Desk Organiser",
  "description": "A small tray for pens and cables.",
  "price": 499.00,
  "imageUrl": "/images/desk-lamp.jpg",
  "stockQuantity": 12,
  "categoryId": 4,
  "rating": 4.2
}
```

### PUT `/api/admin/products/{id}`

Same body as create.

### PATCH `/api/admin/products/{id}/stock`

```json
{ "stockQuantity": 0 }
```

### DELETE `/api/admin/products/{id}`

Response `204`. Cart lines for that product are removed. Past order lines keep the saved name and price.
