# Add Sample Products to VocalMart
Write-Host "🛒 Adding Sample Products to VocalMart" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

$API_URL = "http://localhost:8081/api/products"

# Check if API is running
try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Get -ErrorAction Stop
    Write-Host "✅ API is running on port 8081" -ForegroundColor Green
} catch {
    Write-Host "❌ API is not running. Please start Spring Boot first!" -ForegroundColor Red
    Write-Host "   Run: cd c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi; cmd /c mvnw.cmd spring-boot:run" -ForegroundColor Yellow
    exit
}

Write-Host "`n📦 Adding products...`n" -ForegroundColor Yellow

# Product 1: Laptop
Write-Host "Adding: Gaming Laptop..." -ForegroundColor White
$form = @{
    name = "Gaming Laptop"
    description = "High-performance gaming laptop with RTX 4060, 16GB RAM, and 512GB SSD. Perfect for gaming and productivity."
    price = "1299.99"
    category = "Computing"
    brand = "TechPro"
    stock = "50"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add laptop" -ForegroundColor Red
}

# Product 2: Wireless Mouse
Write-Host "Adding: Wireless Mouse..." -ForegroundColor White
$form = @{
    name = "Wireless Mouse"
    description = "Ergonomic wireless mouse with precision tracking and long battery life. Comfortable for all-day use."
    price = "29.99"
    category = "Accessories"
    brand = "TechGear"
    stock = "200"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add mouse" -ForegroundColor Red
}

# Product 3: Mechanical Keyboard
Write-Host "Adding: Mechanical Keyboard..." -ForegroundColor White
$form = @{
    name = "Mechanical Keyboard"
    description = "RGB mechanical keyboard with Cherry MX switches. Customizable lighting and responsive keys for typing and gaming."
    price = "89.99"
    category = "Accessories"
    brand = "KeyMaster"
    stock = "100"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add keyboard" -ForegroundColor Red
}

# Product 4: Smartphone
Write-Host "Adding: Smartphone..." -ForegroundColor White
$form = @{
    name = "Smartphone Pro"
    description = "Latest smartphone with 5G, 128GB storage, triple camera system, and all-day battery life."
    price = "899.99"
    category = "Mobile"
    brand = "PhonePlus"
    stock = "75"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add smartphone" -ForegroundColor Red
}

# Product 5: Headphones
Write-Host "Adding: Wireless Headphones..." -ForegroundColor White
$form = @{
    name = "Wireless Headphones"
    description = "Noise-canceling wireless headphones with premium sound quality and 30-hour battery life. Perfect for music and calls."
    price = "199.99"
    category = "Audio"
    brand = "AudioMax"
    stock = "150"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add headphones" -ForegroundColor Red
}

# Product 6: Smartwatch
Write-Host "Adding: Smartwatch..." -ForegroundColor White
$form = @{
    name = "Smartwatch"
    description = "Fitness tracking smartwatch with heart rate monitor, GPS, and water resistance. Track your health 24/7."
    price = "249.99"
    category = "Wearables"
    brand = "FitTech"
    stock = "120"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add smartwatch" -ForegroundColor Red
}

# Product 7: Tablet
Write-Host "Adding: Tablet..." -ForegroundColor White
$form = @{
    name = "Tablet Pro"
    description = "10-inch tablet with stylus support, perfect for drawing, note-taking, and entertainment. 256GB storage."
    price = "599.99"
    category = "Mobile"
    brand = "TabletCo"
    stock = "80"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add tablet" -ForegroundColor Red
}

# Product 8: Monitor
Write-Host "Adding: 4K Monitor..." -ForegroundColor White
$form = @{
    name = "4K Monitor"
    description = "27-inch 4K Ultra HD monitor with HDR support and 144Hz refresh rate. Crystal clear display for work and gaming."
    price = "399.99"
    category = "Electronics"
    brand = "ViewPro"
    stock = "60"
}
try {
    $result = Invoke-RestMethod -Uri $API_URL -Method Post -Form $form
    Write-Host "  ✅ Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to add monitor" -ForegroundColor Red
}

Write-Host "`n✅ Done! Products added successfully!" -ForegroundColor Green
Write-Host "`n📊 Checking total products..." -ForegroundColor Yellow

try {
    $products = Invoke-RestMethod -Uri $API_URL -Method Get
    Write-Host "   Total products in database: $($products.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "   Could not retrieve products" -ForegroundColor Red
}

Write-Host "`n🌐 Open your browser to see the products:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   API:      http://localhost:8081/api/products`n" -ForegroundColor White
