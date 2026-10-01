# Add Sample Products to VocalMart
Write-Host "Adding Sample Products to VocalMart" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$API_URL = "http://localhost:8081/api/products"

# Check if API is running
try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Get -ErrorAction Stop
    Write-Host "API is running on port 8081" -ForegroundColor Green
} catch {
    Write-Host "API is not running. Please start Spring Boot first!" -ForegroundColor Red
    exit
}

Write-Host "`nAdding products...`n" -ForegroundColor Yellow

# Array of products
$products = @(
    @{
        name = "Gaming Laptop"
        description = "High-performance gaming laptop with RTX 4060, 16GB RAM, and 512GB SSD"
        price = 1299.99
        category = "Computing"
        brand = "TechPro"
        stock = 50
        rating = 4.5
        reviewCount = 128
    },
    @{
        name = "Wireless Mouse"
        description = "Ergonomic wireless mouse with precision tracking"
        price = 29.99
        category = "Accessories"
        brand = "TechGear"
        stock = 200
        rating = 4.2
        reviewCount = 89
    },
    @{
        name = "Mechanical Keyboard"
        description = "RGB mechanical keyboard with Cherry MX switches"
        price = 89.99
        category = "Accessories"
        brand = "KeyMaster"
        stock = 100
        rating = 4.7
        reviewCount = 156
    },
    @{
        name = "Smartphone Pro"
        description = "Latest smartphone with 5G, 128GB storage, triple camera"
        price = 899.99
        category = "Mobile"
        brand = "PhonePlus"
        stock = 75
        rating = 4.6
        reviewCount = 234
    },
    @{
        name = "Wireless Headphones"
        description = "Noise-canceling wireless headphones with 30-hour battery"
        price = 199.99
        category = "Audio"
        brand = "AudioMax"
        stock = 150
        rating = 4.8
        reviewCount = 312
    },
    @{
        name = "Smartwatch"
        description = "Fitness tracking smartwatch with heart rate monitor and GPS"
        price = 249.99
        category = "Wearables"
        brand = "FitTech"
        stock = 120
        rating = 4.4
        reviewCount = 178
    },
    @{
        name = "Tablet Pro"
        description = "10-inch tablet with stylus support, 256GB storage"
        price = 599.99
        category = "Mobile"
        brand = "TabletCo"
        stock = 80
        rating = 4.3
        reviewCount = 92
    },
    @{
        name = "4K Monitor"
        description = "27-inch 4K Ultra HD monitor with 144Hz refresh rate"
        price = 399.99
        category = "Electronics"
        brand = "ViewPro"
        stock = 60
        rating = 4.9
        reviewCount = 267
    }
)

# Add each product
foreach ($product in $products) {
    Write-Host "Adding: $($product.name)..." -ForegroundColor White
    
    # Create form data for multipart/form-data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"name`"$LF",
        $product.name,
        "--$boundary",
        "Content-Disposition: form-data; name=`"description`"$LF",
        $product.description,
        "--$boundary",
        "Content-Disposition: form-data; name=`"price`"$LF",
        $product.price,
        "--$boundary",
        "Content-Disposition: form-data; name=`"category`"$LF",
        $product.category,
        "--$boundary",
        "Content-Disposition: form-data; name=`"brand`"$LF",
        $product.brand,
        "--$boundary",
        "Content-Disposition: form-data; name=`"stock`"$LF",
        $product.stock,
        "--$boundary",
        "Content-Disposition: form-data; name=`"rating`"$LF",
        $product.rating,
        "--$boundary",
        "Content-Disposition: form-data; name=`"reviewCount`"$LF",
        $product.reviewCount,
        "--$boundary--$LF"
    )
    
    $body = $bodyLines -join $LF
    
    try {
        $result = Invoke-RestMethod -Uri $API_URL -Method Post -Body $body -ContentType "multipart/form-data; boundary=$boundary"
        Write-Host "  Added: $($result.name) - `$$($result.price)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to add $($product.name): $_" -ForegroundColor Red
    }
}

Write-Host "`nDone! Checking total products..." -ForegroundColor Green
$allProducts = Invoke-RestMethod -Uri $API_URL -Method Get
Write-Host "Total products in database: $($allProducts.Count)" -ForegroundColor Cyan

Write-Host "`nOpen your browser to see the products:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  API:      http://localhost:8081/api/products"
