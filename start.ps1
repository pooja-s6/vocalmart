# VocalMart - Quick Start Script
Write-Host "🚀 VocalMart Quick Start" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Check Docker
Write-Host "1️⃣ Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoStatus = docker ps --filter "name=vocalmart-mongo" --format "{{.Status}}" 2>$null
    if ($mongoStatus -match "Up") {
        Write-Host "   ✅ MongoDB is already running" -ForegroundColor Green
    } else {
        Write-Host "   🔄 Starting MongoDB..." -ForegroundColor Yellow
        docker start vocalmart-mongo 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ MongoDB started successfully" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ MongoDB container not found, creating new one..." -ForegroundColor Yellow
            docker run -d --name vocalmart-mongo -p 27017:27017 mongo
            Write-Host "   ✅ MongoDB created and started" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   ❌ Docker is not running. Please start Docker Desktop first!" -ForegroundColor Red
    exit
}

Write-Host "`n2️⃣ Services Status:" -ForegroundColor Yellow
Write-Host "   📦 MongoDB:  http://localhost:27017 (Running)" -ForegroundColor Green

# Check Spring Boot
$springRunning = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue 2>$null
if ($springRunning) {
    Write-Host "   🍃 Spring Boot:  http://localhost:8081 (Running)" -ForegroundColor Green
} else {
    Write-Host "   🍃 Spring Boot:  http://localhost:8081 (Not Running)" -ForegroundColor Red
    Write-Host "      Start with: cd c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi; cmd /c mvnw.cmd spring-boot:run" -ForegroundColor Gray
}

# Check React
$reactRunning = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue 2>$null
if ($reactRunning) {
    Write-Host "   ⚛️ React:  http://localhost:3000 (Running)" -ForegroundColor Green
} else {
    Write-Host "   ⚛️ React:  http://localhost:3000 (Not Running)" -ForegroundColor Red
    Write-Host "      Start with: cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice-search-frontend; npm start" -ForegroundColor Gray
}

# Check Flask
$flaskRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue 2>$null
if ($flaskRunning) {
    Write-Host "   🎙️ Flask Voice API:  http://localhost:5000 (Running)" -ForegroundColor Green
} else {
    Write-Host "   🎙️ Flask Voice API:  http://localhost:5000 (Not Running)" -ForegroundColor Red
    Write-Host "      Start with: cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice_search_project; py app.py" -ForegroundColor Gray
}

Write-Host "`n3️⃣ Next Steps:" -ForegroundColor Yellow

if (-not $springRunning -or -not $reactRunning) {
    Write-Host "   ⚠️ Some services are not running. You need to start them manually in separate terminals." -ForegroundColor Yellow
    Write-Host ""
    if (-not $springRunning) {
        Write-Host "   Terminal 1 - Start Spring Boot:" -ForegroundColor Cyan
        Write-Host "   cd c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi" -ForegroundColor White
        Write-Host "   cmd /c mvnw.cmd spring-boot:run`n" -ForegroundColor White
    }
    if (-not $reactRunning) {
        Write-Host "   Terminal 2 - Start React:" -ForegroundColor Cyan
        Write-Host "   cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice-search-frontend" -ForegroundColor White
        Write-Host "   npm start`n" -ForegroundColor White
    }
    if (-not $flaskRunning) {
        Write-Host "   Terminal 3 - Start Flask (Optional for voice search):" -ForegroundColor Cyan
        Write-Host "   cd c:\Users\pooja\Desktop\vocalmart\vocalmart\voice_search_project" -ForegroundColor White
        Write-Host "   py -m venv venv" -ForegroundColor White
        Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
        Write-Host "   pip install -r requirements.txt" -ForegroundColor White
        Write-Host "   py app.py`n" -ForegroundColor White
    }
} else {
    Write-Host "   ✅ All main services are running!" -ForegroundColor Green
}

Write-Host "   📦 Add sample products (after Spring Boot is running):" -ForegroundColor Cyan
Write-Host "   .\add_sample_products.ps1`n" -ForegroundColor White

Write-Host "   🌐 Open in browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000`n" -ForegroundColor White

Write-Host "========================" -ForegroundColor Cyan
