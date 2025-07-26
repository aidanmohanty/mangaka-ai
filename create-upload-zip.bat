@echo off
echo 📦 Creating complete project ZIP for upload...
echo.

REM Create a temporary folder
mkdir temp-upload 2>nul

REM Copy all important files and folders
xcopy /E /Y client temp-upload\client\
xcopy /E /Y server temp-upload\server\
xcopy /E /Y ai-service temp-upload\ai-service\
xcopy /E /Y scripts temp-upload\scripts\

REM Copy root files
copy package.json temp-upload\
copy package-lock.json temp-upload\
copy vercel.json temp-upload\
copy README.md temp-upload\
copy .gitignore temp-upload\
copy Dockerfile temp-upload\
copy *.md temp-upload\
copy *.js temp-upload\

echo.
echo ✅ Files copied to temp-upload folder
echo.
echo 📋 NEXT STEPS:
echo 1. Go to temp-upload folder
echo 2. Select ALL files and folders (Ctrl+A)
echo 3. Right-click → Send to → Compressed folder
echo 4. Upload the ZIP to GitHub
echo.
pause