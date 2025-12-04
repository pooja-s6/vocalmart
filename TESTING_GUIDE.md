# 🚀 VocalMart - Complete Testing Guide for Tomorrow

## ✅ What's Ready Now:
1. ✅ MongoDB is running on port 27017
2. ✅ Spring Boot API ready on port 8081
3. ✅ React Frontend ready on port 3000
4. ⚠️ Flask Voice API needs to be started on port 5000

---

## 📋 Tomorrow's Testing Steps:

### Step 1: Start All Services

#### 1.1 Start MongoDB (if not running)
```powershell
docker start vocalmart-mongo
# OR if container doesn't exist:
docker run -d --name vocalmart-mongo -p 27017:27017 mongo
```

#### 1.2 Start Spring Boot Backend
```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi
cmd /c mvnw.cmd spring-boot:run
```
✅ Wait for: "Started ProductapiApplication" message
🌐 API will be at: http://localhost:8081/api/products

#### 1.3 Start React Frontend (New Terminal)
```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice-search-frontend
npm start
```
✅ Wait for: "Compiled successfully!" message
🌐 Frontend will open at: http://localhost:3000

#### 1.4 Start Flask Voice API (New Terminal)
```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice_search_project
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
py app.py
```
✅ Wait for: "Running on http://0.0.0.0:5000" message
🌐 Voice API will be at: http://localhost:5000

**Note:** First time Flask will download the Whisper model (~150MB) - this may take 5-10 minutes!

---

### Step 2: Add Sample Products

Once Spring Boot is running, open a NEW PowerShell terminal and run:

```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart
.\add_sample_products.ps1
```

This will add 8 sample products:
- Gaming Laptop ($1299.99)
- Wireless Mouse ($29.99)
- Mechanical Keyboard ($89.99)
- Smartphone Pro ($899.99)
- Wireless Headphones ($199.99)
- Smartwatch ($249.99)
- Tablet Pro ($599.99)
- 4K Monitor ($399.99)

---

### Step 3: Test the Website

Open browser: http://localhost:3000

**What you should see:**
- Beautiful purple gradient background
- VocalMart header
- Search bar with voice button
- 8 product cards displayed

**Test Text Search:**
1. Type "laptop" in search box → Click Search
2. Should show only the Gaming Laptop

**Test Voice Search:**
1. Click the 🎤 Voice button
2. Allow microphone access
3. Say "headphones"
4. Click ⏹️ Stop button
5. Audio will be sent to Flask API
6. Results should appear

---

### Step 4: Test APIs Manually

#### Test Spring Boot API:

**Get all products:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/products" -Method Get
```

**Search products:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/products/search?q=phone" -Method Get
```

**Add product manually:**
```powershell
$form = @{
    name = "Test Product"
    description = "This is a test product"
    price = "99.99"
}
Invoke-RestMethod -Uri "http://localhost:8081/api/products" -Method Post -Form $form
```

#### Test Flask Voice API:

**Check if running:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
```
Should return: "Voice Search API is running."

**Test transcription (needs audio file):**
You'll need to use the website's voice button to test this properly.

---

### Step 5: Add Products via Postman (Alternative)

If you prefer Postman over the PowerShell script:

1. **Import Collection:**
   - File: `VocalMart_API.postman_collection.json` (if available)
   - OR create requests manually

2. **Create Product Request:**
   - Method: POST
   - URL: `http://localhost:8081/api/products`
   - Body Type: form-data
   - Fields:
     * `name` (text): "Product Name"
     * `description` (text): "Product Description"
     * `price` (text): "99.99"
     * `image` (file): Optional - select image file

3. **Get All Products:**
   - Method: GET
   - URL: `http://localhost:8081/api/products`

4. **Search Products:**
   - Method: GET
   - URL: `http://localhost:8081/api/products/search?q=laptop`

---

## 🐛 Troubleshooting:

### MongoDB not connecting:
```powershell
docker ps  # Check if container is running
docker start vocalmart-mongo
```

### Spring Boot port 8081 in use:
```powershell
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F
```

### React port 3000 in use:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Flask dependencies error:
```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice_search_project
py -m pip install --upgrade pip
pip install flask flask-cors transformers torch
```

### Voice search not working:
- Check Flask API is running on port 5000
- Check browser console for errors (F12)
- Verify microphone permissions in browser

---

## 📊 Expected Results:

### Frontend (http://localhost:3000):
- ✅ Beautiful UI with gradient background
- ✅ Search bar with text input and voice button
- ✅ Product cards with images, names, descriptions, prices
- ✅ "Add to Cart" buttons (UI only, no cart functionality yet)

### Backend (http://localhost:8081/api/products):
- ✅ Returns JSON array of products
- ✅ Search works with query parameter

### Voice API (http://localhost:5000):
- ✅ Home route returns "Voice Search API is running."
- ✅ /transcribe endpoint accepts audio files
- ✅ Returns transcribed text in JSON

---

## 🎯 Quick Start for Tomorrow:

Open 3 PowerShell terminals and run:

**Terminal 1 - Backend:**
```powershell
docker start vocalmart-mongo
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi
cmd /c mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice-search-frontend
npm start
```

**Terminal 3 - Voice API:**
```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice_search_project
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
py app.py
```

**Terminal 4 - Add Products:**
```powershell
cd c:\Users\pooja\Desktop\vocalmart\vocalmart
.\add_sample_products.ps1
```

Then open: http://localhost:3000

---

## 📸 What to Test:

1. ✅ Products display on homepage
2. ✅ Text search works (try "laptop", "phone", "mouse")
3. ✅ Voice search button appears
4. ✅ Microphone permission prompt
5. ✅ Voice recording indicator
6. ✅ Audio sent to Flask API
7. ✅ Search results update based on voice input

---

**Good luck with testing tomorrow! 🚀**
