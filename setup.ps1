# VocalMart Setup & Management Script
# Quick commands to manage your VocalMart application

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start', 'stop', 'status', 'add-products', 'clean')]
    [string]$Action = 'help'
)

$API_URL = "http://localhost:8081/api/products"
$MONGO_CONTAINER = "vocalmart-mongo"

function Show-Help {
    Write-Host "`n=== VocalMart Management Script ===" -ForegroundColor Cyan
    Write-Host "`nUsage: .\setup.ps1 -Action <command>`n" -ForegroundColor Yellow
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  start         - Start all services"
    Write-Host "  stop          - Stop all services"
    Write-Host "  status        - Check service status"
    Write-Host "  add-products  - Add sample products to database"
    Write-Host "  clean         - Clean build artifacts"
    Write-Host "`nExamples:" -ForegroundColor Green
    Write-Host "  .\setup.ps1 -Action start"
    Write-Host "  .\setup.ps1 -Action add-products`n"
}

function Start-Services {
    Write-Host "`nStarting VocalMart services..." -ForegroundColor Cyan
    
    # Start MongoDB
    Write-Host "`n[1/3] Starting MongoDB..." -ForegroundColor Yellow
    $mongoRunning = docker ps --filter "name=$MONGO_CONTAINER" --format "{{.Names}}"
    if ($mongoRunning) {
        Write-Host "  MongoDB already running" -ForegroundColor Green
    } else {
        docker start $MONGO_CONTAINER 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  Creating new MongoDB container..." -ForegroundColor Yellow
            docker run -d --name $MONGO_CONTAINER -p 27017:27017 mongo:7.0
        }
        Write-Host "  MongoDB started" -ForegroundColor Green
    }
    
    # Start Spring Boot
    Write-Host "`n[2/3] Starting Spring Boot..." -ForegroundColor Yellow
    Write-Host "  Open new terminal and run:" -ForegroundColor White
    Write-Host "  cd productapi; .\mvnw.cmd spring-boot:run" -ForegroundColor Cyan
    
    # Start React
    Write-Host "`n[3/3] Starting React..." -ForegroundColor Yellow
    Write-Host "  Open new terminal and run:" -ForegroundColor White
    Write-Host "  cd voice-search-frontend; npm start" -ForegroundColor Cyan
    
    Write-Host "`n✅ MongoDB started. Start other services manually." -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   Backend:  http://localhost:8081`n" -ForegroundColor Cyan
}

function Stop-Services {
    Write-Host "`nStopping VocalMart services..." -ForegroundColor Cyan
    
    # Stop MongoDB
    Write-Host "  Stopping MongoDB..." -ForegroundColor Yellow
    docker stop $MONGO_CONTAINER 2>$null
    
    # Kill Spring Boot
    $springPID = (netstat -ano | findstr ":8081" | Select-Object -First 1) -replace '\s+', ' ' -split ' ' | Select-Object -Last 1
    if ($springPID) {
        Write-Host "  Stopping Spring Boot (PID: $springPID)..." -ForegroundColor Yellow
        taskkill /F /PID $springPID 2>$null
    }
    
    # Kill React
    $reactPID = (netstat -ano | findstr ":3000" | Select-Object -First 1) -replace '\s+', ' ' -split ' ' | Select-Object -Last 1
    if ($reactPID) {
        Write-Host "  Stopping React (PID: $reactPID)..." -ForegroundColor Yellow
        taskkill /F /PID $reactPID 2>$null
    }
    
    Write-Host "`n✅ Services stopped`n" -ForegroundColor Green
}

function Show-Status {
    Write-Host "`n=== Service Status ===" -ForegroundColor Cyan
    
    # MongoDB
    $mongoStatus = docker ps --filter "name=$MONGO_CONTAINER" --format "{{.Status}}"
    if ($mongoStatus) {
        Write-Host "  MongoDB:    ✅ Running ($mongoStatus)" -ForegroundColor Green
    } else {
        Write-Host "  MongoDB:    ❌ Stopped" -ForegroundColor Red
    }
    
    # Spring Boot
    $springPort = netstat -ano | findstr ":8081" | findstr "LISTENING"
    if ($springPort) {
        Write-Host "  Spring Boot: ✅ Running (Port 8081)" -ForegroundColor Green
    } else {
        Write-Host "  Spring Boot: ❌ Stopped" -ForegroundColor Red
    }
    
    # React
    $reactPort = netstat -ano | findstr ":3000" | findstr "LISTENING"
    if ($reactPort) {
        Write-Host "  React:      ✅ Running (Port 3000)" -ForegroundColor Green
    } else {
        Write-Host "  React:      ❌ Stopped" -ForegroundColor Red
    }
    
    # Products count
    try {
        $products = Invoke-RestMethod -Uri $API_URL -Method Get -ErrorAction Stop
        Write-Host "`n  Products in DB: $($products.Count)" -ForegroundColor Cyan
    } catch {
        Write-Host "`n  Products in DB: Unable to connect to API" -ForegroundColor Yellow
    }
    Write-Host ""
}

function Add-SampleProducts {
    Write-Host "`nAdding sample products..." -ForegroundColor Cyan
    
    # Check if API is running
    try {
        Invoke-RestMethod -Uri $API_URL -Method Get -ErrorAction Stop | Out-Null
    } catch {
        Write-Host "❌ API is not running. Start Spring Boot first!" -ForegroundColor Red
        return
    }
    
    $products = @(
        @{name="Gaming Laptop"; desc="High-performance laptop with RTX 4060"; price="1299.99"; cat="Computing"; brand="TechPro"; stock="50"; rating="4.5"; reviews="128"},
        @{name="Wireless Mouse"; desc="Ergonomic wireless mouse"; price="29.99"; cat="Accessories"; brand="TechGear"; stock="200"; rating="4.2"; reviews="89"},
        @{name="Mechanical Keyboard"; desc="RGB mechanical keyboard"; price="89.99"; cat="Accessories"; brand="KeyMaster"; stock="100"; rating="4.7"; reviews="156"},
        @{name="Smartphone Pro"; desc="Latest 5G smartphone"; price="899.99"; cat="Mobile"; brand="PhonePlus"; stock="75"; rating="4.6"; reviews="234"},
        @{name="Wireless Headphones"; desc="Noise-canceling headphones"; price="199.99"; cat="Audio"; brand="AudioMax"; stock="150"; rating="4.8"; reviews="312"},
        @{name="Smartwatch"; desc="Fitness tracking smartwatch"; price="249.99"; cat="Wearables"; brand="FitTech"; stock="120"; rating="4.4"; reviews="178"},
        @{name="Tablet Pro"; desc="10-inch tablet with stylus"; price="599.99"; cat="Mobile"; brand="TabletCo"; stock="80"; rating="4.3"; reviews="92"},
        @{name="4K Monitor"; desc="27-inch 4K monitor 144Hz"; price="399.99"; cat="Electronics"; brand="ViewPro"; stock="60"; rating="4.9"; reviews="267"}
    )
    
    foreach ($p in $products) {
        Write-Host "  Adding: $($p.name)..." -ForegroundColor White
        
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
            Invoke-WebRequest -Uri $API_URL -Method Post -Body $body -ContentType "multipart/form-data; boundary=----WebKitFormBoundary" | Out-Null
            Write-Host "    ✅ Added" -ForegroundColor Green
        } catch {
            Write-Host "    ❌ Failed" -ForegroundColor Red
        }
    }
    
    Write-Host "`n✅ Products added! View at: http://localhost:3000`n" -ForegroundColor Green
}

function Clean-Artifacts {
    Write-Host "`nCleaning build artifacts..." -ForegroundColor Cyan
    
    if (Test-Path "productapi\target") {
        Remove-Item -Recurse -Force "productapi\target"
        Write-Host "  ✅ Cleaned Spring Boot target/" -ForegroundColor Green
    }
    
    if (Test-Path "voice-search-frontend\build") {
        Remove-Item -Recurse -Force "voice-search-frontend\build"
        Write-Host "  ✅ Cleaned React build/" -ForegroundColor Green
    }
    
    if (Test-Path "voice_search_project\__pycache__") {
        Remove-Item -Recurse -Force "voice_search_project\__pycache__"
        Write-Host "  ✅ Cleaned Python cache" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Cleanup complete`n" -ForegroundColor Green
}

# Main execution
switch ($Action) {
    'start' { Start-Services }
    'stop' { Stop-Services }
    'status' { Show-Status }
    'add-products' { Add-SampleProducts }
    'clean' { Clean-Artifacts }
    default { Show-Help }
}
