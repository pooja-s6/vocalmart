# VocalMart Current State

Inspection date: 30 September 2026. This report is based on the code in this repository and on services that were actually started and exercised. Documentation in `README.md` was checked against the code and is not fully accurate.

No application source was rewritten for this pass. The only environment change made so that the existing Flask app could start was installing `flask-cors` into the local Python environment. Flask was also restarted with `PYTHONIOENCODING=utf-8` so its log lines could print on Windows.

## Architecture

VocalMart is not one backend. The storefront uses two HTTP APIs that do not share a database, plus a third voice service that the UI never calls.

```text
Browser (React, port 3000)
  |-- product catalog ----> Spring Boot productapi (port 8081) --> H2 in-memory
  |-- cart / table --------> Node Express server (port 4000) --> in-memory arrays
  |-- voice button --------> browser Web Speech API only
  |
  Flask Whisper (port 5000) is a separate process. The React app does not call it.
```

| Piece | Path | What it actually is |
| --- | --- | --- |
| Frontend | `voice-search-frontend/` | React 18 (Create React App). Single-page UI with local page state, not a router. |
| Catalog API | `productapi/` | Spring Boot 3.5.3, Java 17, Spring Data JPA, H2. Seeds 20 products on startup. |
| Shop API | `server/` | Express + TypeScript. Auth, products, cart, orders, and a payment stub. Data lives in `server/src/data/store.ts`, not in Prisma. |
| Voice API | `voice_search_project/` | Flask + Hugging Face `openai/whisper-base`. Not connected to the storefront. |
| Database declared but unused | `server/prisma/schema.prisma` | PostgreSQL schema for User, Product, Cart, Order. No code imports Prisma. No `server/.env` file exists. |
| Docker | `docker-compose.yml` | Still describes MongoDB, a Spring service with `SPRING_DATA_MONGODB_URI`, React, and Flask. The current Spring app does not use MongoDB. |

The README says the stack is React + Spring Boot + H2, with optional Flask. The homepage copy still says MongoDB. The Postman collection (`VocalMart_API.postman_collection.json`) still describes MongoDB image upload endpoints that are not in the Java controller. `pom.xml` includes Spring Security, JWT, mail, and Redis, but the Java code does not use mail, Redis, or JWT.

## How to run

Verified on this machine: Java 17, Maven 3.9, Node 24, npm 11, Python 3.14, Docker 29. PostgreSQL is listening on port 5432, but this application does not connect to it.

Start each process in its own terminal, from `vocalmart/`:

```powershell
# Catalog API — http://localhost:8081
Set-Location productapi
.\mvnw.cmd spring-boot:run

# Storefront — http://localhost:3000
Set-Location voice-search-frontend
npm install
npm start

# Optional shop API — http://localhost:4000
# Starts without a database. Data is in memory.
Set-Location server
npm install
npm run dev

# Optional Whisper API — http://localhost:5000
# Needs flask-cors, torch, transformers, and ffmpeg.
Set-Location voice_search_project
pip install flask-cors
$env:PYTHONIOENCODING = "utf-8"
python app.py
```

`docker compose up` is not a working path for the current code. Compose still injects a MongoDB URI, and the Spring app expects H2.

## Working features

These were exercised, not inferred from file names.

- Spring `GET /api/products` returns 20 seeded products (name, price, description, category, Unsplash `imageUrl`, stock, UUID id).
- Spring search `GET /api/products/search?query=headphones` returns Wireless Headphones. A blank query returns all 20.
- Spring category filter `GET /api/products/category/Grocery` returns 5 products. An unknown category returns an empty list.
- Spring `GET /api/products/{id}` returns one product. A missing id returns 404.
- H2 console at `http://localhost:8081/h2-console` returns 200. The database is in-memory (`jdbc:h2:mem:vocalmart`) and is recreated on every restart (`ddl-auto=create-drop`).
- The React homepage loads those 20 products from port 8081.
- Typing `headphones` in the navbar switches to the Products page and shows Wireless Headphones. Filtering is done in the browser against the already loaded list. It does not call the Spring search endpoint.
- Category chips and homepage category cards filter that same in-memory list.
- Add to cart stores the Spring product in `localStorage` after the Node cart API rejects the Spring product id. The navbar badge then shows the quantity.
- The cart page shows the product name, category, Unsplash image, quantity, and a rupee total for that first add.
- Checkout opens a form (name, address, Card / UPI / Cash on delivery). Submitting it shows a toast, returns to Home, and clears the local cart. Nothing is saved as an order.
- The login form accepts any email and password, stays on the login screen, and shows a toast: `Demo login completed`. Leaving the page shows `Signed in locally as <email>`. No token is stored. There is no logout.
- The voice button is present. In this browser, `webkitSpeechRecognition` exists. Clicking it changes the label to `Listening...`, then returns to `Voice` when recognition ends. No transcript was produced in this automated session, so a spoken query was not verified.
- Node `GET /health` returns ok.
- Node in-memory catalog `GET /api/products` returns its own 7 products (different ids and a different rice price from Spring).
- Node `POST /api/auth/register` and `POST /api/auth/login` issue JWTs. A wrong password returns 401. Seeded admin `admin@local.com` can log in. The React login screen does not call these routes.
- Node authenticated cart, `POST /api/orders`, and the payment stub work when called directly with a Node product id. Payment verify marks the order `paid` / `processing` without checking a real signature. Orders disappear when the Node process restarts.

## Broken features

### Product images on cards

What should happen: cards show the Unsplash URL already returned by Spring.

What happens: every card shows a box placeholder and the text `No Image`.

Cause: `ProductCard.js` only renders an image when `product.imageBase64` and `product.imageType` exist. Spring sends `imageUrl`. The cart component does use `imageUrl`, which is why the cart image works and the cards do not.

Files: `voice-search-frontend/src/components/ProductCard.js`, `productapi/.../Product.java`.

### Product details never open

`App.js` passes `onOpen` into `ProductCard`, and `ProductModal.js` can show a large image, description, stock, and price. `ProductCard` does not accept or call `onOpen`, so there is no way to open details. There is no product route.

### Cart updates wipe the item

What should happen: increasing quantity keeps the name, image, and price.

What happens: the first add falls back to `localStorage` and looks correct. Pressing `+` calls `POST http://localhost:4000/api/cart/public/set`. That route succeeds even when the product id is not in the Node catalog, and it returns the line without a product. The UI then replaces the cart with a blank name and `₹0`. Verified in the browser: quantity became 2, name disappeared, total became `₹0`.

Cause: the storefront catalog is Spring. The cart client targets the Node server (`REACT_APP_API_BASE` default `http://localhost:4000`). Spring UUIDs are not Node product ids. Add returns 404 and falls back locally. Set does not require the product to exist.

Files: `voice-search-frontend/src/context/CartContext.js`, `server/src/routes/cart.ts`.

### Products table is empty

The Table page calls `GET http://localhost:4000/api/products/table`. That handler exists, but `GET /:id` is registered first, so `table` is treated as a product id and the API returns 404. The page catches the error and renders only the column headers.

File: `server/src/routes/products.ts`.

### Voice search does not search the catalog by speech, and Flask transcription crashes

The storefront microphone never uploads audio and never calls port 5000. A successful browser transcript would only be copied into the text search box and matched as a substring of name, description, or category. These commands are not understood as commands:

- `products under 2000`
- `show electronics` (unless those exact words appear in a product field)
- `add headphones to cart`

`Listening...` is the only voice state. There is no Processing, no-results, or microphone-denied message. `onerror` only turns listening off.

Flask `GET /` returns `Voice Search API is running.` The model `openai/whisper-base` loads. `POST /transcribe` with a WAV file returns HTTP 500:

`ffmpeg was not found but is required to load audio files from filename`

Before the process was given a UTF-8 console, the same route died earlier: `print` of the checkmark emoji raised `UnicodeEncodeError` on the Windows cp1252 console, and the error handler printed another emoji and crashed again. Transcription never reached Whisper.

`record_audio.py` imports `sounddevice`, which is not installed.

Files: `voice-search-frontend/src/components/VoiceSearch.js`, `voice_search_project/app.py`.

### Checkout does not create an order

The checkout modal says it is a demo form. `handlePlaceOrder` clears the cart and shows a toast. It does not call `POST /api/orders`. There is no Orders page. Order status values such as Shipped and Delivered do not exist.

### Login is not authentication

The visible login form does not call Spring or Node. Any password is accepted. There is no session, protected page, registration validation, or logout.

A separate JWT API exists on port 4000 and was tested with curl. The UI does not use it. `AdminProductForm.js` can post a product with `admin_token` from `localStorage`, but that form is not rendered anywhere.

### Homepage facts are hardcoded and one of them is wrong

The hero says the app is built with MongoDB. It is not. The figures `20` seeded products and `4` categories are written in `App.js`. They happen to match today's seed, but they are not read from the API.

### Price, rating, and wishlist are inconsistent

Cards format price as US dollars (`$2,999.00`). Cart and checkout use rupees. Every card shows a hardcoded `4.5` rating and "Free shipping". The wishlist heart only flips local component state and writes to the console. `WishlistContext.js` is never mounted.

### Mobile layout

At a 390px-wide viewport the nav wraps onto two lines (Home, Products, Table, Cart, then Login and the cart chip). Page `scrollWidth` was 432 against a 390 client width, so the page overflows horizontally by about 40 pixels. There is no mobile menu.

## Missing features

These are absent from the running storefront, even where a partial API exists:

- Orders page and persisted orders from the UI
- Real registration, logout, and protected actions
- Product details page and related products
- Price filter and sort in the UI
- Voice commands beyond "put this transcript in the search box"
- Connection from the microphone to Whisper
- Shipping line, order summary tied to real line items, and a saved demo order
- Admin product creation in the UI
- Shared catalog between the page the user sees and the cart/order API
- Automated UI tests. `productapi` has only `contextLoads`. The React `src/` folder has no component tests. `setupTests.js` only imports jest-dom.

## APIs

### Spring Boot `http://localhost:8081` — used by the product grid

| Method | Path | Tested |
| --- | --- | --- |
| GET | `/api/products` | 200, 20 products |
| GET | `/api/products/search?query=` | 200 |
| GET | `/api/products/category/{category}` | 200 |
| GET | `/api/products/{id}` | 200 / 404 |
| GET | `/h2-console` | 200 |
| POST | `/api/products` | 405, not implemented |
| GET | `/api/products/{id}/image` | 404, described only in the old Postman file |

### Node `http://localhost:4000` — used by cart and the Table page

| Method | Path | Tested |
| --- | --- | --- |
| GET | `/health` | 200 |
| GET | `/api/products` | 200, 7 in-memory products |
| GET | `/api/products/:id` | works for a Node id |
| GET | `/api/products/table` | 404 because `/:id` is registered first |
| POST | `/api/products` | admin JWT required; UI form is not mounted |
| POST | `/api/auth/register` | 200, returns a token |
| POST | `/api/auth/login` | 200 or 401 |
| POST | `/api/cart/public/add` | 200 for a Node id, 404 for a Spring id |
| POST | `/api/cart/public/set` | 200 even for an unknown product id |
| GET | `/api/cart/public/:clientId` | 200 |
| DELETE | `/api/cart/public/:clientId/:productId` | present |
| POST | `/api/cart/add` and `GET /api/cart` | 200 with Bearer token |
| POST | `/api/orders` | 201 with Bearer token and a non-empty Node cart; 401 without a token |
| POST | `/api/payment/create-order` | 200 stub |
| POST | `/api/payment/verify` | 200 and marks the order paid without a real check |

### Flask `http://localhost:5000` — not used by React

| Method | Path | Tested |
| --- | --- | --- |
| GET | `/` | 200, plain text health message |
| POST | `/transcribe` | 500, ffmpeg missing. Not called by the frontend. |

## Database

| Store | Technology | Connected | Data | Used by the UI |
| --- | --- | --- | --- | --- |
| Catalog | H2 in memory, created and dropped on startup | Yes, while Spring is running | 20 products seeded in `ProductapiApplication.java` if the table is empty | Yes, product grid |
| Shop API | JavaScript arrays in `server/src/data/store.ts` | Not a database | 7 products, 1 admin user, carts and orders lost on restart | Cart tries to use it, then falls back to `localStorage` |
| Prisma | PostgreSQL schema only | No `.env`, client is never imported | None | No |
| Docker MongoDB | Declared in compose | Not started for this test | None | No |
| Browser | `localStorage` keys `vocalmart_cart`, `vocalmart_client`, `vocalmart_wishlist` | Yes | Cart after a failed server add | Yes |

The running catalog depends on the Spring seed. There is no SQL seed file.

H2 console: `http://localhost:8081/h2-console`, JDBC URL `jdbc:h2:mem:vocalmart`, username `sa`, empty password. That password is empty by configuration, not a stored secret.

## Voice pipeline

```text
Microphone
  -> browser SpeechRecognition (en-US)     works as far as "Listening..."
  -> transcript text                       not verified with real speech here
  -> React search box + client-side filter
  -> already loaded Spring product list
  -> product cards

Flask path, not wired to the UI:

Audio file
  -> POST /transcribe
  -> print() crashes on Windows cp1252 unless PYTHONIOENCODING=utf-8
  -> transformers pipeline openai/whisper-base   model loads
  -> ffmpeg required to read the file            missing, HTTP 500
  -> product search                              never reached
```

| Question | Answer |
| --- | --- |
| Speech-to-text in the UI | Browser Web Speech API (`webkitSpeechRecognition` in Chrome). No API key. Needs a Chromium browser, microphone permission, and internet for some browsers' recognition service. |
| Model | UI: none. Flask: `openai/whisper-base` via Hugging Face Transformers, loaded at import time in `app.py`. |
| Does the model run | It loads. A transcription request fails before inference because ffmpeg is not installed. |
| Frontend connection | None. `VoiceSearch.js` does not use axios or port 5000. |
| Linked to product search | Only if the browser returns text. That text is a substring filter, not a backend search and not a command parser. |

## Authentication

- UI: demo form in `LoginPanel.js`. No request is sent. Verified by the toast `Demo login completed` and the note `Signed in locally as demo@vocalmart.test`.
- Node: bcrypt passwords and JWT (`JWT_SECRET`, falling back to a hardcoded development secret if unset). Register and login were tested. The UI does not store the token.
- Spring: every request is `permitAll`. JWT libraries are on the classpath and unused.
- `admin_login.json` at the repo root is not valid JSON and is not read by the app.

## Frontend issues seen in the running UI

- Page title is still `React App`.
- Hero reads "Student Project Demo" and "Shop Smarter. Shop Faster. Shop by Voice."
- Product cards have no photo, dollar prices, a fake rating, and a second "Added to Cart" state that does not remove the item (`onRemoveFromCart` is not passed).
- Quantity buttons on the cart are unstyled browser buttons. The total label is cramped (`Total₹2999`).
- Navbar is a wrapping row of buttons. On a phone width, Login and the cart chip drop to a second line and the page scrolls sideways.
- Search state is not fully shared: a voice result updates the filter in `App.js` but does not update the text inside the navbar input, because that input keeps its own state.
- There is no empty-results message when a filter matches nothing; the grid is simply empty.
- The Table page has no error state. A failed API call looks like an empty table.

## Environment variables

Do not put real secret values in this file.

| Name | Where | Required today |
| --- | --- | --- |
| `PORT` | Spring `application.properties` default 8081; Node default 4000 | No, defaults work |
| `REACT_APP_API_URL` | `voice-search-frontend/src/api.js`, default `http://localhost:8081` | No |
| `REACT_APP_API_BASE` | cart, table, admin form, default `http://localhost:4000` | No, but this default points cart at the wrong catalog |
| `DATABASE_URL` | `server/.env.example` and Prisma | Not for the current Node process. Required only if Prisma is wired up later |
| `JWT_SECRET` | Node auth | Not required to boot. A development fallback is hardcoded |
| `HF_TOKEN` | Hugging Face download warning | No. Downloads work unauthenticated with a lower rate limit |
| `PYTHONIOENCODING` / `PYTHONUTF8` | Windows console for Flask | Needed so `/transcribe` can get past its emoji `print` lines |
| `app.cors.allowed-origin-patterns` | Spring property, already set for localhost | No extra variable |
| `SPRING_DATA_MONGODB_URI` | `docker-compose.yml` only | Ignored by the current Spring app |

`server/.env.example` is the only env template. There is no frontend `.env`.

## Dependencies

- Frontend `node_modules` and server `node_modules` are already installed. `npm start` compiled. Node 24 prints deprecation warnings from `react-scripts` 5.0.1. Browserslist data is about 15 months old. The app still compiled.
- `voice_search_project/requirements.txt` lists `flask`, `flask-cors`, `transformers`, `torch`, `pydub`, `librosa`, and `soundfile`, with Flask, Transformers, and torch duplicated. `sounddevice` is imported by `record_audio.py` but is not listed.
- Installed before this test: flask, transformers, torch, scipy. Missing until installed for this test: `flask-cors` (then installed globally). Still missing: `pydub`, `librosa`, `soundfile`, `sounddevice`, and the `ffmpeg` binary.
- Spring started with Maven and seeded H2. Redis and mail starters did not block startup because nothing uses them.
- `uuid` 14 in the Node server is ESM-only. The running `ts-node-dev` process did start, so the current import works in this setup.
- No `server/.env`, so Prisma generate/migrate was not run and is not required for the process that is running.

## What this means for the next build

The useful demo path is already visible: search, open a product, add it to the cart, change quantity, check out, and keep an order. That path is split across two backends and breaks on the second cart click.

The voice button is the product identity, and today it only starts the browser recognizer. It does not call Whisper, and it does not understand shopping commands.

A later implementation pass should keep React and the Spring catalog, and should make one cart and one order path use that same catalog. The Node in-memory API and the unused Prisma schema should not be treated as the live store until that choice is made explicitly. MongoDB is not part of the running application.
