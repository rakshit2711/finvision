# FinVision AI - Quick Start Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FinVision AI - Backend Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if .env exists
if (!(Test-Path .env)) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created. Please update it with your database credentials.`n" -ForegroundColor Green
    
    Write-Host "IMPORTANT: Update the following in .env:" -ForegroundColor Red
    Write-Host "1. DATABASE_URL - Your PostgreSQL connection string" -ForegroundColor Yellow
    Write-Host "2. JWT_SECRET - A secure random string`n" -ForegroundColor Yellow
    
    $continue = Read-Host "Press Enter to continue after updating .env, or 'q' to quit"
    if ($continue -eq 'q') {
        exit
    }
}

Write-Host "`nStep 1: Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed`n" -ForegroundColor Green

Write-Host "Step 2: Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma Client generated`n" -ForegroundColor Green

Write-Host "Step 3: Running database migrations..." -ForegroundColor Cyan
Write-Host "This will create the necessary tables in your database.`n" -ForegroundColor Yellow

npx prisma migrate dev --name init

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ Failed to run migrations. Please check your DATABASE_URL in .env" -ForegroundColor Red
    Write-Host "`nCommon issues:" -ForegroundColor Yellow
    Write-Host "- PostgreSQL is not running" -ForegroundColor White
    Write-Host "- Invalid database credentials" -ForegroundColor White
    Write-Host "- Database does not exist (create it first)`n" -ForegroundColor White
    exit 1
}
Write-Host "✓ Database migrations completed`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Create an account at /signup`n" -ForegroundColor White

Write-Host "Optional commands:" -ForegroundColor Cyan
Write-Host "- npx prisma studio (View database in browser)" -ForegroundColor White
Write-Host "- npm run dev (Start development server)`n" -ForegroundColor White

$startDev = Read-Host "Would you like to start the development server now? (y/n)"
if ($startDev -eq 'y' -or $startDev -eq 'Y') {
    Write-Host "`nStarting development server...`n" -ForegroundColor Green
    npm run dev
}
