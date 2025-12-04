# 🚀 VocalMart - Quick Start Guide

## Prerequisites
✅ Java 17 - Installed
✅ Docker Desktop - **NEEDS TO BE RUNNING**
✅ MongoDB Compass - For database visualization
✅ Postman - For API testing

---

## 🐳 Option A: Run with Docker Compose (Recommended)

### 1. Start Docker Desktop
Make sure Docker Desktop is running (check system tray).

### 2. Run all services
```bash
cd c:\Users\pooja\Desktop\vocalmart\vocalmart
docker-compose up --build
```

This will start:
- MongoDB on `localhost:27017`
- Spring Boot API on `localhost:8081`
- Flask API on `localhost:5000`
- React Frontend on `localhost:3000`

---

## 💻 Option B: Run Spring Boot Locally (Without Docker)

### 1. Start MongoDB Only
```bash
docker run -d --name vocalmart-mongo -p 27017:27017 mongo
```

### 2. Run Spring Boot Application
```bash
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi
.\mvnw.cmd spring-boot:run
```

The API will start on `http://localhost:8081`

---

## 🔌 Connect MongoDB Compass

**Connection String:**
```
mongodb://localhost:27017/voice_shop
```

1. Open MongoDB Compass
2. Click "New Connection"
3. Paste the connection string above
4. Click "Connect"
5. You should see the `voice_shop` database

---

## 🧪 Test API Endpoints with Postman

### Base URL
```
http://localhost:8081/api/products
```

### 1. GET All Products
- **Method:** GET
- **URL:** `http://localhost:8081/api/products`
- **Expected:** Returns JSON array of products (empty initially)

### 2. POST Add Product
- **Method:** POST
- **URL:** `http://localhost:8081/api/products`
- **Body Type:** form-data
- **Fields:**
  - `name` (text): "Samsung Galaxy S24"
  - `description` (text): "Latest smartphone with AI features"
  - `price` (text): "999.99"
  - `image` (file): Select any image file

### 3. GET Product Image
- **Method:** GET
- **URL:** `http://localhost:8081/api/products/{id}/image`
- Replace `{id}` with actual product ID from the response

---

## 🎯 Quick Test Commands

### Check if Spring Boot is running:
```bash
curl http://localhost:8081/api/products
```

### Check if MongoDB is running:
```bash
docker ps | findstr mongo
```

### Check if Flask API is running:
```bash
curl http://localhost:5000
```

---

## 🛑 Stop Services

### Stop Docker Compose:
```bash
docker-compose down
```

### Stop MongoDB container only:
```bash
docker stop vocalmart-mongo
docker rm vocalmart-mongo
```

---

## 📊 Database Information

- **Database Name:** `voice_shop`
- **Collection:** `products`
- **Port:** `27017`
- **Connection:** `mongodb://localhost:27017/voice_shop`

---

## ⚠️ Troubleshooting

### Docker not running:
Start Docker Desktop and wait for it to fully initialize.

### Port already in use:
```bash
# Check what's using port 8081
netstat -ano | findstr :8081

# Kill process if needed (replace PID)
taskkill /PID <PID> /F
```

### MongoDB connection failed:
Ensure MongoDB container is running:
```bash
docker ps
```
