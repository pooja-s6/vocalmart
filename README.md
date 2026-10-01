# VocalMart

VocalMart is a recruiter-friendly full-stack shopping demo with a polished React storefront, a Spring Boot API backed by H2, and an optional Flask transcription service for voice search.

## What Works

- Product browsing with seeded homepage cards
- Text search and category filtering
- Browser voice search with SpeechRecognition support
- Demo login/signup flow in the UI
- Cart persistence in localStorage
- H2 database with automatic table creation and product seeding
- Optional Flask `/transcribe` API for speech-to-text uploads

## Tech Stack

- Frontend: React 18, Axios, CSS
- Backend: Spring Boot 3.5.x, Spring Data JPA, H2
- Voice API: Flask, Flask-CORS, Transformers Whisper pipeline

## Project Layout

- `productapi/` - Spring Boot API and H2 persistence
- `voice-search-frontend/` - React application
- `voice_search_project/` - Optional Flask voice transcription API

## Quick Start

### 1. Start the backend

```powershell
Set-Location "C:\Users\pooja\Desktop\vocalmart\vocalmart\productapi"
.\mvnw.cmd spring-boot:run
```

The backend runs on `http://localhost:8081`.

On startup it:
- creates the `products` table in H2
- seeds 20 demo products
- exposes the product API used by the homepage

### 2. Start the frontend

Open a second terminal:

```powershell
Set-Location "C:\Users\pooja\Desktop\vocalmart\vocalmart\voice-search-frontend"
npm install
npm start
```

If port `3000` is busy, React will start on another port such as `3001`.

### 3. Start the Flask voice API

This service is optional, but it is available if you want to test transcription uploads.

```powershell
Set-Location "C:\Users\pooja\Desktop\vocalmart\vocalmart\voice_search_project"
pip install -r requirements.txt
python app.py
```

The Flask API runs on `http://localhost:5000`.

## Demo Flow

1. Open the frontend in the browser.
2. Use the login/signup panel to continue with any email and password.
3. Browse the seeded products on the home page.
4. Search by text or click the microphone for browser voice search.
5. Add items to the cart and verify the cart badge updates.

## Database

The product API now uses H2 instead of MongoDB.

- JDBC URL: `jdbc:h2:mem:vocalmart`
- H2 console: `http://localhost:8081/h2-console`
- Username: `sa`
- Password: empty

The `products` table is created automatically by Hibernate on startup.

## API Endpoints

### Product API

- `GET /api/products` - list all products
- `GET /api/products/{id}` - get a product by id
- `GET /api/products/search?query=` - search products by name
- `GET /api/products/category/{category}` - filter by category

### Voice API

- `GET /` - health check message
- `POST /transcribe` - upload an audio file in the `audio` form field

Example voice API request:

```powershell
Invoke-RestMethod -Uri http://localhost:5000/transcribe -Method Post -Form @{ audio = Get-Item "C:\path\to\sample.wav" }
```

## Verification

If everything is running, you should be able to open:

- Frontend: `http://localhost:3000` or the alternate port React prints
- Backend: `http://localhost:8081/api/products`
- H2 console: `http://localhost:8081/h2-console`
- Flask API: `http://localhost:5000`

## Notes

- The login flow is a demo flow for presentation purposes, not a persisted auth system.
- Voice search in the frontend uses browser SpeechRecognition.
- The Flask service is available for transcription-based voice workflows and can be wired in later if needed.

## Useful Checks

```powershell
Invoke-RestMethod -Uri http://localhost:8081/api/products | Select-Object -First 3 | Format-List
Invoke-RestMethod -Uri http://localhost:5000/
```

## License

MIT
