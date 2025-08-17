# Azure Static Web Apps Deployment Script
# This script deploys the built application to Azure Static Web Apps

param(
    [Parameter(Mandatory=$false)]
    [string]$ApiToken = $env:AZURE_STATIC_WEB_APPS_API_TOKEN,
    
    [Parameter(Mandatory=$false)]
    [string]$AppLocation = "./dist",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "seoaudit-webapp"
)

Write-Host "Starting Azure Static Web Apps Deployment" -ForegroundColor Green
Write-Host "App Name: $AppName" -ForegroundColor Yellow
Write-Host "Build Location: $AppLocation" -ForegroundColor Yellow

# Check if API token is set
if ([string]::IsNullOrEmpty($ApiToken)) {
    Write-Host "API Token is required but not set." -ForegroundColor Red
    Write-Host "Please set the AZURE_STATIC_WEB_APPS_API_TOKEN environment variable" -ForegroundColor Red
    Write-Host "or pass it as a parameter: -ApiToken '<your-token>'" -ForegroundColor Red
    exit 1
}

# Check if dist folder exists
if (-not (Test-Path $AppLocation)) {
    Write-Host "Build folder '$AppLocation' not found. Please run 'npm run build' first." -ForegroundColor Red
    exit 1
}

# Check if Azure CLI is available
try {
    $azVersion = az --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Azure CLI not found"
    }
    Write-Host "Azure CLI is available" -ForegroundColor Green
} catch {
    Write-Host "Azure CLI is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if logged in to Azure
try {
    $account = az account show 2>$null | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0) {
        throw "Not logged in"
    }
    Write-Host "Logged in to Azure as: $($account.user.name)" -ForegroundColor Green
} catch {
    Write-Host "Not logged in to Azure. Please run 'az login' first." -ForegroundColor Red
    exit 1
}

# Create a zip file of the dist folder
$zipPath = "./deployment.zip"
Write-Host "Creating deployment package..." -ForegroundColor Yellow

try {
    # Remove existing zip if it exists
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    # Create zip file
    Compress-Archive -Path "$AppLocation/*" -DestinationPath $zipPath -Force
    Write-Host "Deployment package created: $zipPath" -ForegroundColor Green
} catch {
    Write-Host "Failed to create deployment package: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Deployment Summary:" -ForegroundColor Cyan
Write-Host "  - Static Web App: $AppName" -ForegroundColor White
Write-Host "  - Resource Group: SEOAudit-RG" -ForegroundColor White
Write-Host "  - Build Output: $AppLocation" -ForegroundColor White
Write-Host "  - Package Size: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor White
Write-Host "  - URL: https://witty-desert-0ac8c7a0f.2.azurestaticapps.net" -ForegroundColor White

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. The deployment package has been created: $zipPath" -ForegroundColor White
Write-Host "  2. You can upload this manually via Azure Portal or use GitHub Actions" -ForegroundColor White
Write-Host "  3. For GitHub Actions, add the API token as a secret: AZURE_STATIC_WEB_APPS_API_TOKEN" -ForegroundColor White
Write-Host "  4. Push your code to GitHub to trigger automatic deployment" -ForegroundColor White

Write-Host "Deployment preparation completed successfully!" -ForegroundColor Green
Write-Host "Your app will be available at: https://witty-desert-0ac8c7a0f.2.azurestaticapps.net" -ForegroundColor Cyan

# Clean up
if (Test-Path $zipPath) {
    Write-Host "Cleaning up deployment package..." -ForegroundColor Yellow
    Remove-Item $zipPath -Force
    Write-Host "Cleanup completed" -ForegroundColor Green
}