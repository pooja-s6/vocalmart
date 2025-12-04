# Test Flask Voice API Setup
Write-Host "🎙️ Flask Voice API - Setup Test" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$projectPath = "c:\Users\pooja\Desktop\vocalmart\vocalmart\voice_search_project"

# Check Python
Write-Host "1️⃣ Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = py --version 2>&1
    Write-Host "   ✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Python not found. Please install Python from python.org" -ForegroundColor Red
    exit
}

# Check if virtual environment exists
Write-Host "`n2️⃣ Checking virtual environment..." -ForegroundColor Yellow
if (Test-Path "$projectPath\venv") {
    Write-Host "   ✅ Virtual environment exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Virtual environment not found. Creating..." -ForegroundColor Yellow
    Set-Location $projectPath
    py -m venv venv
    Write-Host "   ✅ Virtual environment created" -ForegroundColor Green
}

# Check if Flask is running
Write-Host "`n3️⃣ Checking Flask API..." -ForegroundColor Yellow
$flaskRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue 2>$null
if ($flaskRunning) {
    Write-Host "   ✅ Flask API is running on port 5000" -ForegroundColor Green
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
        Write-Host "   ✅ Response: $response" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️ Flask is running but not responding correctly" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Flask API is not running" -ForegroundColor Red
}

Write-Host "`n4️⃣ Next Steps:" -ForegroundColor Yellow

if (-not $flaskRunning) {
    Write-Host "`n   To start Flask Voice API, run these commands:" -ForegroundColor Cyan
    Write-Host "   ────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host "   cd $projectPath" -ForegroundColor White
    Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
    Write-Host "   pip install -r requirements.txt" -ForegroundColor White
    Write-Host "   py app.py" -ForegroundColor White
    Write-Host ""
    Write-Host "   ⚠️ First run will download Whisper model (~150MB)" -ForegroundColor Yellow
    Write-Host "   ⏱️ This may take 5-10 minutes depending on internet speed" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Flask API is ready!" -ForegroundColor Green
    Write-Host "   🌐 API URL: http://localhost:5000" -ForegroundColor White
    Write-Host "   🎤 Transcription endpoint: http://localhost:5000/transcribe" -ForegroundColor White
}

Write-Host "`n================================" -ForegroundColor Cyan
