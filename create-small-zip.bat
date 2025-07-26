@echo off
echo 📦 Creating lightweight project ZIP for GitHub...
echo.

REM Create a clean upload folder
if exist temp-upload-clean rmdir /s /q temp-upload-clean
mkdir temp-upload-clean

REM Copy source files only (NO node_modules, NO build folders)
echo Copying client source files...
mkdir temp-upload-clean\client
mkdir temp-upload-clean\client\src
mkdir temp-upload-clean\client\public
xcopy /E /Y client\src temp-upload-clean\client\src\
xcopy /E /Y client\public temp-upload-clean\client\public\
copy client\package.json temp-upload-clean\client\
copy client\package-lock.json temp-upload-clean\client\
copy client\tsconfig.json temp-upload-clean\client\
copy client\tailwind.config.js temp-upload-clean\client\
copy client\postcss.config.js temp-upload-clean\client\

echo Copying server files...
mkdir temp-upload-clean\server
mkdir temp-upload-clean\server\models
mkdir temp-upload-clean\server\routes
mkdir temp-upload-clean\server\services
xcopy /E /Y server temp-upload-clean\server\

echo Copying AI service files...
mkdir temp-upload-clean\ai-service
xcopy /E /Y ai-service temp-upload-clean\ai-service\

echo Copying scripts...
mkdir temp-upload-clean\scripts
xcopy /E /Y scripts temp-upload-clean\scripts\

REM Copy root configuration files
copy package.json temp-upload-clean\
copy package-lock.json temp-upload-clean\
copy vercel.json temp-upload-clean\
copy README.md temp-upload-clean\
copy .gitignore temp-upload-clean\
copy Dockerfile temp-upload-clean\
copy *.md temp-upload-clean\

echo.
echo ✅ Lightweight project created in temp-upload-clean folder
echo 📁 Location: C:\Windows\System32\manga-ai-translator\temp-upload-clean
echo.
echo 📋 NEXT STEPS:
echo 1. Go to temp-upload-clean folder
echo 2. Select ALL files and folders (Ctrl+A)
echo 3. Right-click → Send to → Compressed folder
echo 4. Upload to GitHub (should be under 25MB now)
echo.
pause