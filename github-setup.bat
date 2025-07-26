@echo off
setlocal enabledelayedexpansion

echo.
echo 🔗 CONNECTING TO GITHUB...
echo =====================
echo.

echo Please create a GitHub repository first:
echo 1. Go to: https://github.com/new
echo 2. Repository name: mangaka-ai
echo 3. Set to Public
echo 4. Don't initialize with README
echo 5. Click Create repository
echo.

set /p username="Enter your GitHub username: "

if "%username%"=="" (
    echo Error: Username cannot be empty!
    pause
    exit /b 1
)

echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%username%/mangaka-ai.git

if errorlevel 1 (
    echo.
    echo Note: Remote might already exist, trying to set URL instead...
    git remote set-url origin https://github.com/%username%/mangaka-ai.git
)

echo.
echo Setting branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed! Common solutions:
    echo 1. Make sure the GitHub repository exists
    echo 2. Check your GitHub username is correct
    echo 3. You may need to authenticate with GitHub
    echo.
    echo To authenticate, run: git config --global credential.helper manager
    echo Then try: git push -u origin main
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! Your code is now on GitHub!
echo 🔗 Repository URL: https://github.com/%username%/mangaka-ai
echo.
echo 📋 NEXT STEPS:
echo 1. Go to https://vercel.com/dashboard
echo 2. Click "Import Git Repository"
echo 3. Select your mangaka-ai repository
echo 4. Add environment variables
echo 5. Deploy!
echo.
pause