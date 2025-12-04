# Add All Sample Products
$API_URL = "http://localhost:8081/api/products"

Write-Host "Adding Sample Products to VocalMart..." -ForegroundColor Cyan

$products = @(
    @{name="Wireless Mouse"; desc="Ergonomic wireless mouse"; price="29.99"; cat="Accessories"; brand="TechGear"; stock="200"; rating="4.2"; reviews="89"},
    @{name="Mechanical Keyboard"; desc="RGB mechanical keyboard"; price="89.99"; cat="Accessories"; brand="KeyMaster"; stock="100"; rating="4.7"; reviews="156"},
    @{name="Smartphone Pro"; desc="Latest 5G smartphone"; price="899.99"; cat="Mobile"; brand="PhonePlus"; stock="75"; rating="4.6"; reviews="234"},
    @{name="Wireless Headphones"; desc="Noise-canceling headphones"; price="199.99"; cat="Audio"; brand="AudioMax"; stock="150"; rating="4.8"; reviews="312"},
    @{name="Smartwatch"; desc="Fitness tracking smartwatch"; price="249.99"; cat="Wearables"; brand="FitTech"; stock="120"; rating="4.4"; reviews="178"},
    @{name="Tablet Pro"; desc="10-inch tablet with stylus"; price="599.99"; cat="Mobile"; brand="TabletCo"; stock="80"; rating="4.3"; reviews="92"},
    @{name="4K Monitor"; desc="27-inch 4K monitor 144Hz"; price="399.99"; cat="Electronics"; brand="ViewPro"; stock="60"; rating="4.9"; reviews="267"}
)

foreach ($p in $products) {
    Write-Host "Adding: $($p.name)..." -ForegroundColor White
    
    $body = @"
------WebKitFormBoundary
Content-Disposition: form-data; name="name"

$($p.name)
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

$($p.desc)
------WebKitFormBoundary
Content-Disposition: form-data; name="price"

$($p.price)
------WebKitFormBoundary
Content-Disposition: form-data; name="category"

$($p.cat)
------WebKitFormBoundary
Content-Disposition: form-data; name="brand"

$($p.brand)
------WebKitFormBoundary
Content-Disposition: form-data; name="stock"

$($p.stock)
------WebKitFormBoundary
Content-Disposition: form-data; name="rating"

$($p.rating)
------WebKitFormBoundary
Content-Disposition: form-data; name="reviewCount"

$($p.reviews)
------WebKitFormBoundary--
"@

    try {
        $response = Invoke-WebRequest -Uri $API_URL -Method Post -Body $body -ContentType "multipart/form-data; boundary=----WebKitFormBoundary"
        Write-Host "  Added successfully!" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $_" -ForegroundColor Red
    }
}

Write-Host "`nAll products added!" -ForegroundColor Green
Write-Host "Check them at: http://localhost:3000" -ForegroundColor Cyan
