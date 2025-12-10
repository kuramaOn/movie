@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
REM Network Chanel - One-Click Run Script for Windows
REM This script handles setup and starts the development server

REM Keep window open on any error
if not "%1"=="launched" (
    cmd /k "%~f0" launched
    exit
)

title Network Chanel - Starting...

echo.
echo ========================================
echo [*] Network Chanel - One-Click Launcher
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/7] Checking Node.js...
node -v >nul 2>&1
if !errorlevel! neq 0 (
    echo [X] Node.js is not installed!
    echo.
    echo Please install Node.js 18+ from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node -v
echo.

REM Check if npm is installed
echo [2/7] Checking npm...
call npm -v >nul 2>&1
if !errorlevel! neq 0 (
    echo [X] npm is not installed!
    echo.
    pause
    exit /b 1
)

echo [OK] npm found: 
call npm -v
echo.

REM Check if node_modules exists, install if missing
echo [3/7] Checking dependencies...
if not exist "node_modules" (
    echo [!] node_modules not found. Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    
    if !errorlevel! neq 0 (
        echo [X] Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
    
    echo [OK] Dependencies installed successfully
    echo.
) else (
    echo [OK] Dependencies already installed
    echo.
)

REM Check if .env.local exists, create from example if missing
echo [4/7] Checking environment configuration...
if not exist ".env.local" (
    echo [!] .env.local not found. Creating from .env.example...
    
    if exist ".env.example" (
        copy .env.example .env.local >nul
        echo [OK] Created .env.local
        echo.
        echo [!] IMPORTANT: Please edit .env.local with your database credentials
        echo Press any key to open .env.local in notepad...
        pause >nul
        notepad .env.local
        echo.
        echo After saving your database credentials, press any key to continue...
        pause >nul
    ) else (
        echo [X] .env.example not found!
        echo.
        pause
        exit /b 1
    )
) else (
    echo [OK] Environment file exists
    echo.
)

REM Generate Prisma client
echo [5/7] Generating Prisma client...
echo This may take a moment...
call npx prisma generate

if !errorlevel! neq 0 (
    echo [!] Prisma client generation failed
    echo Trying to fix by reinstalling Prisma...
    call npm install @prisma/client prisma
    call npx prisma generate
    if !errorlevel! neq 0 (
        echo [X] Still failed - please check your prisma/schema.prisma file
        pause
        exit /b 1
    )
)

echo [OK] Prisma client generated
echo.

REM Ask about database schema setup
echo [6/7] Database setup...
set /p db_setup="Do you want to setup/sync the database schema? (y/n): "

if /i "!db_setup!"=="y" (
    echo.
    echo Pushing database schema...
    echo This will create/update tables in your database...
    call npx prisma db push --skip-generate
    
    if !errorlevel! equ 0 (
        echo [OK] Database schema synced successfully
        echo.
        echo Regenerating Prisma client with new schema...
        call npx prisma generate >nul 2>&1
        echo [OK] Prisma client updated
        echo.
    ) else (
        echo [X] Database schema sync failed
        echo.
        echo This might be because:
        echo - Database credentials in .env.local are incorrect
        echo - Database server is not running
        echo - Network connection issue
        echo.
        echo You can try again later by running: npx prisma db push
        echo.
        set /p continue="Continue without database? (y/n): "
        if /i not "!continue!"=="y" (
            pause
            exit /b 1
        )
    )
) else (
    echo [>>] Skipping database setup
    echo Run 'npx prisma db push' manually when ready
    echo.
)

REM Start the development server
echo [7/7] Starting development server...
echo.
echo ========================================
echo [^>^>] Server is starting...
echo ========================================
echo.
echo Opening browser in 5 seconds...
echo Press Ctrl+C to stop the server
echo.

REM Wait 5 seconds then open browser
start /min cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

REM Start the Next.js dev server
title Network Chanel - Running on http://localhost:3000
call npm run dev

REM This part runs when the server is stopped
echo.
echo ========================================
echo [DONE] Server stopped
echo ========================================
echo.
pause
