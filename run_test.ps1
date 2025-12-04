# VocalMart - Test and Run Script
# Run this after Docker Desktop is started

Write-Host "🚀 VocalMart - API Test Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check Docker
Write-Host "📦 Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit
}

# Check if Docker daemon is running
try {
    docker ps > $null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker Desktop is not running. Please start it first!" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "❌ Docker Desktop is not running. Please start it first!" -ForegroundColor Red
    exit
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Ask user what to do
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "1. Run with Docker Compose (All services)" -ForegroundColor White
Write-Host "2. Run MongoDB only (then Spring Boot manually)" -ForegroundColor White
Write-Host "3. Check service status" -ForegroundColor White
Write-Host "4. Stop all services" -ForegroundColor White
Write-Host "5. Test APIs (must be running first)" -ForegroundColor White
Write-Host "0. Exit`n" -ForegroundColor White

$choice = Read-Host "Enter choice (0-5)"

switch ($choice) {
    "1" {
        Write-Host "`n🐳 Starting all services with Docker Compose..." -ForegroundColor Cyan
        Set-Location "c:\Users\pooja\Desktop\vocalmart\vocalmart"
        docker-compose up --build
    }
    "2" {
        Write-Host "`n🍃 Starting MongoDB container..." -ForegroundColor Cyan
        docker run -d --name vocalmart-mongo -p 27017:27017 mongo
        Write-Host "✅ MongoDB started on port 27017" -ForegroundColor Green
        Write-Host "`nNow run Spring Boot manually:" -ForegroundColor Yellow
        Write-Host "cd c:\Users\pooja\Desktop\vocalmart\vocalmart\productapi" -ForegroundColor White
        Write-Host ".\mvnw.cmd spring-boot:run`n" -ForegroundColor White
    }
    "3" {
        Write-Host "`n📊 Checking service status...`n" -ForegroundColor Cyan
        
        # Check MongoDB
        if (Test-Port 27017) {
            Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
        } else {
            Write-Host "❌ MongoDB is not running on port 27017" -ForegroundColor Red
        }
        
        # Check Spring Boot
        if (Test-Port 8081) {
            Write-Host "✅ Spring Boot API is running on port 8081" -ForegroundColor Green
        } else {
            Write-Host "❌ Spring Boot API is not running on port 8081" -ForegroundColor Red
        }
        
        # Check Flask
        if (Test-Port 5000) {
            Write-Host "✅ Flask API is running on port 5000" -ForegroundColor Green
        } else {
            Write-Host "❌ Flask API is not running on port 5000" -ForegroundColor Red
        }
        
        # Check React
        if (Test-Port 3000) {
            Write-Host "✅ React Frontend is running on port 3000" -ForegroundColor Green
        } else {
            Write-Host "❌ React Frontend is not running on port 3000" -ForegroundColor Red
        }
        
        Write-Host "`nDocker containers:" -ForegroundColor Yellow
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    }
    "4" {
        Write-Host "`n🛑 Stopping all services..." -ForegroundColor Cyan
        Set-Location "c:\Users\pooja\Desktop\vocalmart\vocalmart"
        docker-compose down
        docker stop vocalmart-mongo 2>$null
        docker rm vocalmart-mongo 2>$null
        Write-Host "✅ All services stopped" -ForegroundColor Green
    }
    "5" {
        Write-Host "`n🧪 Testing APIs...`n" -ForegroundColor Cyan
        
        # Test Spring Boot API
        Write-Host "Testing Spring Boot API (GET /api/products)..." -ForegroundColor Yellow
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8081/api/products" -Method Get
            Write-Host "✅ Spring Boot API is working!" -ForegroundColor Green
            Write-Host "   Products found: $($response.Count)" -ForegroundColor White
        } catch {
            Write-Host "❌ Spring Boot API is not responding" -ForegroundColor Red
            Write-Host "   Error: $_" -ForegroundColor Red
        }
        
        # Test Flask API
        Write-Host "`nTesting Flask API (GET /)..." -ForegroundColor Yellow
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
            Write-Host "✅ Flask API is working!" -ForegroundColor Green
            Write-Host "   Response: $response" -ForegroundColor White
        } catch {
            Write-Host "❌ Flask API is not responding" -ForegroundColor Red
        }
        
        Write-Host "`n📝 API Endpoints:" -ForegroundColor Cyan
        Write-Host "   Spring Boot: http://localhost:8081/api/products" -ForegroundColor White
        Write-Host "   Flask Voice: http://localhost:5000/transcribe" -ForegroundColor White
        Write-Host "   MongoDB:     mongodb://localhost:27017/voice_shop" -ForegroundColor White
    }
    "0" {
        Write-Host "`nGoodbye! 👋" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host "`n❌ Invalid choice" -ForegroundColor Red
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
