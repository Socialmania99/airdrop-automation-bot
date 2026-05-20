#!/bin/bash
set -e

echo ""
echo " ================================================"
echo "  AIRDROP AUTOMATION BOT v2.0 - PRODUCTION"
echo " ================================================"
echo ""

# ── Check dependencies ────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo " [ERROR] Python 3 not found. Install from python.org"
  exit 1
fi

if ! command -v node &>/dev/null; then
  echo " [ERROR] Node.js not found. Install from nodejs.org"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$ROOT_DIR/data"

# ── Backend setup ─────────────────────────────────────
echo " [1/4] Setting up Python backend..."
cd "$ROOT_DIR/backend"

if [ ! -d "venv" ]; then
  echo " Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo " [!] Edit backend/.env to add your API keys"
fi

# ── Start Backend ─────────────────────────────────────
echo " [2/4] Starting backend on port 5050..."
python app.py &
BACKEND_PID=$!
sleep 3

# ── Frontend setup ────────────────────────────────────
echo " [3/4] Setting up React frontend..."
cd "$ROOT_DIR/frontend"

if [ ! -d "node_modules" ]; then
  echo " Installing frontend dependencies..."
  npm install
fi

# ── Start Frontend ────────────────────────────────────
echo " [4/4] Starting frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!
sleep 3

# ── Open browser ──────────────────────────────────────
echo ""
echo " ================================================"
echo "  Dashboard: http://localhost:3000"
echo "  API:       http://localhost:5050/api/health"
echo " ================================================"
echo ""

if command -v xdg-open &>/dev/null; then
  xdg-open http://localhost:3000
elif command -v open &>/dev/null; then
  open http://localhost:3000
fi

echo " Press Ctrl+C to stop both servers."

# Wait and cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ' Stopped.'; exit 0" INT TERM
wait
