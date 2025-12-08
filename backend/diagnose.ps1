#!/usr/bin/env pwsh
# Diagnostic script to troubleshoot GPT water data integration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Water Treatment Simulator - Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: .env file
Write-Host "Check 1: Environment Configuration" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Yellow

$envPath = "./.env"
if (Test-Path $envPath) {
    Write-Host "✓ .env file found" -ForegroundColor Green
    $content = Get-Content $envPath -Raw
    
    if ($content -match "OPENAI_API_KEY=") {
        $apiKey = $content -replace ".*OPENAI_API_KEY=([^\n]*).*", '$1'
        if ($apiKey.Length -gt 10) {
            Write-Host "✓ OPENAI_API_KEY is configured" -ForegroundColor Green
            Write-Host "  Format: $($apiKey.Substring(0, 10))...$(if($apiKey.Length -gt 10) { $apiKey.Substring($apiKey.Length-5) } )" -ForegroundColor White
            
            if ($apiKey -match "^sk-proj-") {
                Write-Host "✓ Key format looks valid (starts with sk-proj-)" -ForegroundColor Green
            } else {
                Write-Host "✗ Key format may be invalid (should start with sk-proj-)" -ForegroundColor Red
            }
        } else {
            Write-Host "✗ OPENAI_API_KEY is empty or too short" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ OPENAI_API_KEY not found in .env" -ForegroundColor Red
    }
} else {
    Write-Host "✗ .env file not found" -ForegroundColor Red
    Write-Host "  Need to create: backend/.env" -ForegroundColor Yellow
    Write-Host "  Run: .\setup-api-key.ps1" -ForegroundColor Cyan
}

Write-Host ""

# Check 2: Node modules
Write-Host "Check 2: Dependencies" -ForegroundColor Yellow
Write-Host "---------------------" -ForegroundColor Yellow

if (Test-Path "./node_modules") {
    Write-Host "✓ node_modules folder found" -ForegroundColor Green
    
    if (Test-Path "./node_modules/openai") {
        Write-Host "✓ openai package installed" -ForegroundColor Green
    } else {
        Write-Host "✗ openai package NOT installed" -ForegroundColor Red
        Write-Host "  Run: npm install" -ForegroundColor Cyan
    }
    
    if (Test-Path "./node_modules/dotenv") {
        Write-Host "✓ dotenv package installed" -ForegroundColor Green
    } else {
        Write-Host "✗ dotenv package NOT installed" -ForegroundColor Red
        Write-Host "  Run: npm install" -ForegroundColor Cyan
    }
} else {
    Write-Host "✗ node_modules not found" -ForegroundColor Red
    Write-Host "  Run: npm install" -ForegroundColor Cyan
}

Write-Host ""

# Check 3: Backend files
Write-Host "Check 3: Backend Files" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow

$files = @(
    "./server.js",
    "./routes/iotRoutes.js",
    "./controllers/gptWaterController.js",
    "./package.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
    }
}

Write-Host ""

# Check 4: Port availability
Write-Host "Check 4: Port 5001 Status" -ForegroundColor Yellow
Write-Host "-------------------------" -ForegroundColor Yellow

$portCheck = netstat -ano | Select-String ":5001"
if ($portCheck) {
    Write-Host "! Port 5001 is in use" -ForegroundColor Yellow
    Write-Host "  Backend might already be running" -ForegroundColor White
    Write-Host "  Or another service is using it" -ForegroundColor White
} else {
    Write-Host "✓ Port 5001 is available" -ForegroundColor Green
}

Write-Host ""

# Check 5: Can reach OpenAI API
Write-Host "Check 5: Network Connectivity" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "https://api.openai.com/v1/models" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Can reach OpenAI API" -ForegroundColor Green
} catch {
    Write-Host "✗ Cannot reach OpenAI API" -ForegroundColor Red
    Write-Host "  Check your internet connection" -ForegroundColor Yellow
    Write-Host "  Or firewall settings" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary & Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "If all checks pass:" -ForegroundColor Green
Write-Host "1. npm run dev          (Start backend)" -ForegroundColor White
Write-Host "2. Open simulator       (In browser)" -ForegroundColor White
Write-Host "3. Click 'Sync from GPT IoT'" -ForegroundColor White
Write-Host ""

Write-Host "If checks failed:" -ForegroundColor Red
Write-Host "1. Read SETUP_API_KEY.md" -ForegroundColor White
Write-Host "2. Run setup-api-key.ps1" -ForegroundColor White
Write-Host "3. Run npm install" -ForegroundColor White
Write-Host ""
