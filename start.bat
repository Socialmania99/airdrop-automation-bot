@echo off
title Airdrop Automation Bot v2.0
color 0A

echo.
echo  ================================================
echo   AIRDROP AUTOMATION BOT v2.0 - PRODUCTION
echo  ================================================
echo.

:: ── Check Python ────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install from python.org
    pause & exit /b 1
)

:: ── Check Node ──────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Install from nodejs.org
    pause & exit /b 1
)

:: ── Backend Setup ────────────────────────────────────
echo  [1/4] Setting up Python backend...
cd backend

if not exist venv (
    echo  Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo  Installing backend dependencies...
pip install -r requirements.txt -q

if not exist .env (
    echo  Copying .env.example to .env...
    copy .env.example .env
    echo  [!] Edit backend\.env to add your API keys
)

:: ── Create data dir ──────────────────────────────────
if not exist ..\data mkdir ..\data

:: ── Start Backend ────────────────────────────────────
echo  [2/4] Starting backend server on port 5050...
start "Airdrop Bot - Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

:: ── Frontend Setup ───────────────────────────────────
echo  [3/4] Setting up React frontend...
cd ..\frontend

if not exist node_modules (
    echo  Installing frontend dependencies...
    npm install
)

:: ── Start Frontend ───────────────────────────────────
echo  [4/4] Starting frontend on port 3000...
start "Airdrop Bot - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 4 /nobreak >nul

:: ── Open Browser ─────────────────────────────────────
echo.
echo  ================================================
echo   Both servers running!
echo   Dashboard: http://localhost:3000
echo   API:       http://localhost:5050/api/health
echo  ================================================
echo.
start http://localhost:3000

pause
