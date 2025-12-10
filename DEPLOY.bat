@echo off
REM Network Chanel - Deploy to Vercel Script
REM This script commits changes and pushes to GitHub, which triggers Vercel deployment

title Deploying to Vercel...

echo.
echo ========================================
echo [*] Network Chanel - Deploy to Vercel
echo ========================================
echo.

REM Check if git is installed
echo [1/5] Checking Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Check if we're in a git repository
echo [2/5] Checking Git repository...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] This is not a Git repository!
    echo.
    echo Please initialize a Git repository first:
    echo   git init
    echo   git remote add origin YOUR_GITHUB_REPO_URL
    echo.
    pause
    exit /b 1
)

echo [OK] Git repository found
echo.

REM Show current status
echo [3/5] Checking changes...
echo.
git status --short
echo.

REM Ask for confirmation
set /p confirm="Do you want to commit and push these changes? (y/n): "
if /i not "%confirm%"=="y" (
    echo [X] Deployment cancelled
    pause
    exit /b 0
)

echo.
echo [4/5] Committing changes...
git add .

REM Commit with message
git commit -m "Enhanced RSS feed parser with 4 fallback methods for Vercel"

if %errorlevel% neq 0 (
    echo [!] Nothing to commit or commit failed
    echo.
    set /p push_anyway="Push anyway? (y/n): "
    if /i not "%push_anyway%"=="y" (
        echo [X] Deployment cancelled
        pause
        exit /b 0
    )
)

echo [OK] Changes committed
echo.

REM Push to GitHub
echo [5/5] Pushing to GitHub...
echo.
git push

if %errorlevel% neq 0 (
    echo.
    echo [X] Push failed!
    echo.
    echo Common issues:
    echo - No remote repository configured
    echo - Authentication failed
    echo - Network connection issue
    echo.
    echo To configure remote repository:
    echo   git remote add origin YOUR_GITHUB_REPO_URL
    echo.
    echo To push to a specific branch:
    echo   git push origin main
    echo   (or: git push origin master)
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [OK] Successfully pushed to GitHub!
echo ========================================
echo.
echo Vercel will automatically detect the changes and start deploying.
echo.
echo Next steps:
echo 1. Go to your Vercel dashboard: https://vercel.com/dashboard
echo 2. Click on your project
echo 3. Click on the latest deployment
echo 4. Check the "Logs" tab to see deployment progress
echo 5. Look for [RSS Parser] messages in the Function Logs
echo.
echo After deployment completes:
echo - Test the feed preview at: https://YOUR_SITE/dashboard-nmc-2024/feeds/preview/[id]
echo - Check Vercel Function Logs for detailed RSS parser output
echo.
echo Happy streaming! 🍿
echo.
pause
