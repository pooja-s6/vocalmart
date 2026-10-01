$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$envFiles = @(
    (Join-Path $PSScriptRoot ".env"),
    (Join-Path $PSScriptRoot "..\.env")
)
foreach ($envFile in $envFiles) {
    if (-not (Test-Path $envFile)) { continue }
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*#' -or $line -match '^\s*$') { continue }
        $pair = $line -split '=', 2
        if ($pair.Length -eq 2) {
            Set-Item -Path "Env:$($pair[0].Trim())" -Value $pair[1].Trim().Trim('"')
        }
    }
}

if (-not $env:DB_PASSWORD) {
    Write-Error "DB_PASSWORD is not set. Copy ..\.env.example to backend\.env and set the PostgreSQL password for user postgres."
}

mvn spring-boot:run
