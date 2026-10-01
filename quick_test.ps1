# Quick Product Add Script - Using Curl Style Approach
$API_URL = "http://localhost:8081/api/products"

Write-Host "Testing Product API..." -ForegroundColor Cyan

# Test with a simple product
$formData = @"
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="name"

Gaming Laptop
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="description"

High-performance gaming laptop
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="price"

1299.99
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="category"

Computing
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="brand"

TechPro
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="stock"

50
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="rating"

4.5
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="reviewCount"

128
------WebKitFormBoundary7MA4YWxkTrZu0gW--
"@

try {
    $response = Invoke-WebRequest -Uri $API_URL -Method Post -Body $formData -ContentType "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    Write-Host "Success! Product added:" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

Write-Host "`nYou can also use Postman with the collection file:" -ForegroundColor Yellow
Write-Host "  VocalMart_API.postman_collection.json"
Write-Host "`nOr add products via the frontend at: http://localhost:3000" -ForegroundColor Cyan
