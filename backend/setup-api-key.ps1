#!/usr/bin/env pwsh
# Setup script for OpenAI API Key

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Water Treatment Simulator - API Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
$envPath = "./.env"
if (Test-Path $envPath) {
    Write-Host ".env file found!" -ForegroundColor Green
    $content = Get-Content $envPath -Raw
    if ($content -match "OPENAI_API_KEY") {
        Write-Host "✓ OPENAI_API_KEY is already configured" -ForegroundColor Green
        $key = $content -replace ".*OPENAI_API_KEY=([^\n]*).*", '$1'
        Write-Host "  Key: $($key.Substring(0, 10))..." -ForegroundColor Yellow
    } else {
        Write-Host "! .env exists but OPENAI_API_KEY is missing" -ForegroundColor Yellow
    }
} else {
    Write-Host "! .env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Steps to set up your API key:" -ForegroundColor Cyan
Write-Host "1. Visit: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "2. Create new secret key" -ForegroundColor White
Write-Host "3. Copy the key (starts with sk-proj-)" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Paste your OpenAI API key here"

if ($apiKey -match "^sk-proj-") {
    Write-Host ""
    Write-Host "Setting up .env file..." -ForegroundColor Cyan
    
    @"
OPENAI_API_KEY=$apiKey
"@ | Out-File -FilePath .env -Encoding UTF8 -NoNewline
    
    Write-Host "✓ .env file created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. npm install (if not done)" -ForegroundColor White
    Write-Host "2. npm run dev" -ForegroundColor White
    Write-Host "3. Open simulator and click 'Sync from GPT IoT'" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "✗ Invalid API key format!" -ForegroundColor Red
    Write-Host "  Keys should start with 'sk-proj-'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try again:" -ForegroundColor Cyan
    Write-Host "  .\setup-api-key.ps1" -ForegroundColor White
}
