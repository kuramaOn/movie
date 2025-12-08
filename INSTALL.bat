@echo off
REM Network Chanel - Quick Installation Script for Windows
REM This script automates the setup process

echo ========================================
echo 🎬 Network Chanel - Installation Script
echo ========================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node -v
echo.

REM Check if npm is installed
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm found
npm -v
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy .env.example .env.local
    echo ⚠️  Please edit .env.local with your database credentials
    echo.
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate

if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo ✅ Prisma client generated
echo.

REM Ask about database setup
echo 🗄️  Database Setup
set /p response="Do you want to push the database schema now? (y/n): "

if /i "%response%"=="y" (
    echo Pushing database schema...
    call npx prisma db push
    
    if %errorlevel% equ 0 (
        echo ✅ Database schema created
    ) else (
        echo ❌ Failed to push database schema
        echo Please check your DATABASE_URL in .env.local
        pause
        exit /b 1
    )
) else (
    echo ⏭️  Skipping database setup
    echo Run 'npx prisma db push' when ready
)

echo.
echo 🎉 Installation Complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your database credentials (if not done)
echo 2. Run: npx prisma db push (if not done)
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo 5. Visit: http://localhost:3000/admin to add content
echo.
echo 📚 Documentation:
echo - README.md - Main documentation
echo - SETUP_GUIDE.md - Setup instructions
echo - API_DOCUMENTATION.md - API reference
echo.
echo Happy streaming! 🍿
echo.
pause
