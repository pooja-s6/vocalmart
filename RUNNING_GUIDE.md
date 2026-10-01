# 🚀 VocalMart - Running Without Docker

## ✅ Current Status

All services are now running successfully:

### Services Running:
1. **MongoDB** - Running in Docker container on port 27017
2. **Spring Boot API** - Running on http://localhost:8081
3. **React Frontend** - Running on http://localhost:3000

---

## 📁 Project Structure Created

### Spring Boot Backend (`productapi/src/main/java/com/example/productapi/`)
- ✅ `ProductapiApplication.java` - Main Spring Boot application
- ✅ `model/Product.java` - Product entity with MongoDB mapping
- ✅ `repository/ProductRepository.java` - MongoDB repository
- ✅ `service/ProductService.java` - Business logic for product operations
- ✅ `service/ImageService.java` - Image upload/storage service
- ✅ `controller/ProductController.java` - REST API endpoints
- ✅ `resources/application.properties` - Configuration (MongoDB, server port)

### React Frontend (`voice-search-frontend/src/`)
- ✅ `App.js` - Main application component
- ✅ `components/SearchBar.js` - Search and voice input component
- ✅ `components/ProductList.js` - Product grid display
- ✅ `components/ProductCard.js` - Individual product card

---

## 🌐 Access the Application

### Frontend (React)
**URL:** http://localhost:3000

Features:
- 🔍 Text-based product search
- 🎤 Voice search (records audio)
- 📦 Product display grid
- 💳 Add to cart buttons

### Backend API (Spring Boot)
**Base URL:** http://localhost:8081/api/products

**Endpoints:**
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product (form-data with image)
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/{id}/image` - Get product image

### MongoDB
**Connection:** mongodb://localhost:27017/voice_shop
**Database:** voice_shop
**Collection:** products

---

## 🧪 Test the API with PowerShell

### 1. Get all products (empty initially)
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/products" -Method Get
```

### 2. Add a product with Postman or PowerShell:
Use Postman with form-data:
- `name`: "Samsung Galaxy S24"
- `description`: "Latest smartphone"
- `price`: 999.99
- `image`: (select file)

### 3. Search for products
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/products/search?q=phone" -Method Get
```

---

## 🛑 Stop the Services

### Stop React Frontend:
Press `Ctrl+C` in the terminal running React

### Stop Spring Boot:
Find and kill the Java process or press `Ctrl+C` in the Maven terminal

### Stop MongoDB:
```powershell
docker stop vocalmart-mongo
```

---

## 🔄 Restart Services

### Start MongoDB:
```powershell
docker start vocalmart-mongo
```

### Start Spring Boot:
```powershell
cd "c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi"
cmd /c mvnw.cmd spring-boot:run
```

### Start React:
```powershell
cd "c:\Users\pooja\Desktop\vocalmart\vocalmart\voice-search-frontend"
npm start
```

---

## 📊 Architecture

```
┌─────────────────┐
│  React Frontend │ :3000
│  (User Interface)│
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│ Spring Boot API │ :8081
│  (REST Backend) │
└────────┬────────┘
         │ MongoDB Driver
         ▼
┌─────────────────┐
│    MongoDB      │ :27017
│   (Database)    │
└─────────────────┘
```

---

## 🎯 Features Implemented

### Backend (Spring Boot):
✅ CRUD operations for products
✅ Image upload and storage
✅ Search functionality (name & description)
✅ MongoDB integration
✅ CORS enabled for frontend
✅ RESTful API design

### Frontend (React):
✅ Product display grid
✅ Search functionality
✅ Voice recording capability
✅ Responsive design
✅ Modern UI with gradient background
✅ Product cards with images
✅ Search results filtering

---

## 📝 Notes

- **Voice Search**: Currently records audio but Flask API integration is not active
- **Images**: Stored locally in `productapi/uploads/images/`
- **Database**: MongoDB running in Docker container
- **No Docker Compose**: Running services individually as requested

---

## 🐛 Troubleshooting

### Port already in use:
```powershell
# Find process using port
netstat -ano | findstr :8081
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### MongoDB not connecting:
```powershell
docker ps  # Check if container is running
docker start vocalmart-mongo  # Start if stopped
```

### React not loading:
- Clear browser cache
- Check console for errors (F12)
- Restart React dev server

---

## 🎉 Success!

Your VocalMart application is now running without Docker (except MongoDB)!

Open http://localhost:3000 in your browser to see the app in action! 🚀
