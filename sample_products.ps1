# Sample Product Data for Testing
# Use this in Postman or create test data

Write-Host "🛍️ VocalMart - Sample Product Data" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

$products = @(
    @{
        name = "Samsung Galaxy S24"
        description = "Latest flagship smartphone with AI features, 200MP camera, and 5G connectivity"
        price = 999.99
    },
    @{
        name = "Apple iPhone 15 Pro"
        description = "Premium smartphone with A17 Pro chip, titanium design, and advanced camera system"
        price = 1199.99
    },
    @{
        name = "Sony WH-1000XM5"
        description = "Industry-leading noise canceling wireless headphones with premium sound quality"
        price = 399.99
    },
    @{
        name = "Dell XPS 15 Laptop"
        description = "High-performance laptop with Intel i7, 16GB RAM, and 4K OLED display"
        price = 1799.99
    },
    @{
        name = "iPad Pro 12.9"
        description = "Powerful tablet with M2 chip, ProMotion display, and Apple Pencil support"
        price = 1099.99
    },
    @{
        name = "Samsung 65 inch QLED TV"
        description = "4K Smart TV with Quantum Dot technology and HDR support"
        price = 1499.99
    },
    @{
        name = "Nintendo Switch OLED"
        description = "Gaming console with vibrant OLED screen and extensive game library"
        price = 349.99
    },
    @{
        name = "Logitech MX Master 3S"
        description = "Advanced wireless mouse with ergonomic design and precise tracking"
        price = 99.99
    }
)

Write-Host "📦 Sample Products for Testing:`n" -ForegroundColor Yellow

$products | ForEach-Object -Begin { $i = 1 } -Process {
    Write-Host "$i. $($_.name) - `$$($_.price)" -ForegroundColor Green
    Write-Host "   $($_.description)`n" -ForegroundColor Gray
    $i++
}

Write-Host "`n📝 To add products via API:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "Using Postman:" -ForegroundColor Yellow
Write-Host "1. Import the Postman collection: VocalMart_API.postman_collection.json"
Write-Host "2. Use 'Add Product with Image' request"
Write-Host "3. Fill in the form-data fields with the sample data above"
Write-Host "4. Add an image file for the product`n"

Write-Host "Using PowerShell (without image):" -ForegroundColor Yellow
Write-Host "Invoke-RestMethod -Uri 'http://localhost:8081/api/products' ``"
Write-Host "  -Method Post ``"
Write-Host "  -Form @{"
Write-Host "    name = 'Samsung Galaxy S24'"
Write-Host "    description = 'Latest smartphone'"
Write-Host "    price = '999.99'"
Write-Host "    image = Get-Item 'path\to\image.jpg'"
Write-Host "  }`n"

Write-Host "Using curl:" -ForegroundColor Yellow
Write-Host "curl -X POST http://localhost:8081/api/products ``"
Write-Host "  -F 'name=Samsung Galaxy S24' ``"
Write-Host "  -F 'description=Latest smartphone with AI features' ``"
Write-Host "  -F 'price=999.99' ``"
Write-Host "  -F 'image=@path/to/image.jpg'`n"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Export to JSON for easy import
$jsonProducts = $products | ConvertTo-Json -Depth 3
$jsonPath = "c:\Users\pooja\Desktop\vocalmart\vocalmart\sample_products.json"
$jsonProducts | Out-File -FilePath $jsonPath -Encoding UTF8

Write-Host "✅ Sample data exported to: sample_products.json" -ForegroundColor Green
Write-Host "   Location: $jsonPath`n" -ForegroundColor Gray
