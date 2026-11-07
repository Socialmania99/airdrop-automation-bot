<div align="center">

<img src="https://img.shields.io/badge/version-2.0.0-4f63e7?style=for-the-badge&logo=github" alt="version"/>
<img src="https://img.shields.io/badge/license-MIT-10b981?style=for-the-badge" alt="license"/>
<img src="https://img.shields.io/badge/Python-3.9+-3b82f6?style=for-the-badge&logo=python&logoColor=white" alt="python"/>
<img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="react"/>
<img src="https://img.shields.io/badge/Claude_AI-Powered-8b5cf6?style=for-the-badge" alt="claude"/>

# ⚡ Airdrop Automation Bot v2.0

**Professional crypto airdrop tracker with AI analysis, real web scraping, 24/7 automation & Telegram/Discord alerts.**

[Quick Start](#-quick-start) · [API Docs](#-api-reference) · [Deploy](#-cloud-deployment) · [Contributing](#-contributing)

</div>

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🤖 **AI Project Analysis** | Claude AI scrapes project URLs and generates intelligent task lists |
| 📡 **Real Web Scraping** | BeautifulSoup4 extracts faucets, social links, and airdrop keywords live |
| ⏰ **24/7 Scheduler** | APScheduler auto-runs tasks + monitors announcements every hour |
| 🔔 **Push Notifications** | Instant Telegram + Discord alerts when airdrops are detected |
| 🗄️ **Local Database** | SQLite stores everything — projects, tasks, wallets, logs |
| ☀️🌙 **Dark / Light Mode** | Professional dashboard with Circle.com-inspired design |
| 🛡️ **Privacy First** | Only public wallet addresses stored — never private keys |

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)

### Windows
```bash
start.bat
```

### Mac / Linux
```bash
chmod +x start.sh && ./start.sh
```

Open: **http://localhost:3000**

---

## ⚙️ Manual Setup

### 1. Clone
```bash
git clone https://github.com/YOUR_USERNAME/airdrop-automation-bot.git
cd airdrop-automation-bot
```

### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate.bat       # Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env — add your keys
python app.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Configuration

Copy `backend/.env.example` → `backend/.env` and fill in:

```env
# AI Analysis (optional — greatly improves task quality)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Notifications (optional)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...

# Scheduler
ENABLE_SCHEDULER=true
AUTO_RUN_INTERVAL_HOURS=24
ANNOUNCEMENT_CHECK_INTERVAL_MINUTES=60

# Server
PORT=5050
```

> All settings can also be configured live in the **Settings** page of the dashboard.

---

## 📦 Project Structure

```
airdrop-automation-bot-v2/
│
├── frontend/                    # React 18 Dashboard (Vite)
│   ├── src/
│   │   ├── App.jsx              # Full UI — all pages + integrated docs
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Python Flask API
│   ├── app.py                   # REST API + APScheduler
│   ├── analyzer.py              # Web scraping + Claude AI analysis
│   ├── task_engine.py           # Task automation bot
│   ├── notifier.py              # Telegram + Discord notifications
│   ├── db.py                    # SQLite database layer
│   ├── requirements.txt
│   └── .env.example             # Copy to .env and fill keys
│
├── data/                        # Auto-created at runtime
│   └── projects.db
│
├── preview.html                 # Offline preview (no backend needed)
├── start.bat                    # Windows one-click launcher
├── start.sh                     # Mac/Linux launcher
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🤖 What the Bot Automates

| Task | Mode | Notes |
|------|------|-------|
| Site Health Check | ✅ Auto | Verifies uptime + latency |
| Faucet Token Request | ✅ Auto | POSTs wallet to detected endpoint |
| Social Link Discovery | ✅ Auto | Twitter, Discord, Telegram |
| Announcement Monitoring | ✅ Auto | Keyword scan every 60 min |
| Eligibility Check | ✅ Auto | Tests common /eligibility patterns |
| Daily Check-in | ✅ Auto | Logs visit for activity tracking |
| On-chain Swaps / Bridges | ❌ Manual | Requires wallet signing |
| Liquidity Provision | ❌ Manual | Requires wallet signing |
| Governance Voting | ❌ Manual | Opens page in browser |

---

## 📡 API Reference

Base URL: `http://localhost:5050`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System status + scheduler state |
| `GET` | `/api/projects` | List all projects with tasks |
| `POST` | `/api/projects` | Add + AI analyze: `{name, url}` |
| `DELETE` | `/api/projects/:id` | Delete project |
| `PATCH` | `/api/projects/:id/status` | Pause / resume |
| `POST` | `/api/projects/:id/reanalyze` | Re-run AI analysis |
| `POST` | `/api/tasks/run/:id` | Run bot for a project |
| `GET` | `/api/tasks` | Task logs (`?project_id=&limit=`) |
| `GET` | `/api/wallets` | List wallets |
| `POST` | `/api/wallets` | Add: `{address, chain, label}` |
| `DELETE` | `/api/wallets/:id` | Remove wallet |
| `GET` | `/api/notifications` | Alerts + unread count |
| `POST` | `/api/notifications/read` | Mark all read |
| `DELETE` | `/api/notifications/clear` | Clear all |
| `GET` | `/api/stats` | Dashboard metrics |
| `GET/POST` | `/api/settings` | Get / save settings |
| `POST` | `/api/settings/test-telegram` | Test Telegram |
| `POST` | `/api/settings/test-discord` | Test Discord |

---

## 🔔 Notification Setup

### Telegram
1. Open Telegram → search `@BotFather` → `/newbot`
2. Copy the bot token
3. Visit `https://api.telegram.org/bot{TOKEN}/getUpdates`
4. Copy your `chat_id`
5. Paste both into **Settings → Telegram → Test**

### Discord
1. Server Settings → Integrations → Webhooks → **New Webhook**
2. Copy Webhook URL → **Settings → Discord → Test**

---

## ☁️ Cloud Deployment

### Backend → Railway (Free)
```bash
npm install -g @railway/cli
cd backend
railway init && railway up
railway variables set ANTHROPIC_API_KEY=sk-ant-...
```

### Frontend → Vercel (Free)
```bash
cd frontend
npm run build
vercel --prod
```

### VPS (~$5/month)
```bash
pm2 start "python app.py" --name airdrop-bot
pm2 save && pm2 startup
# nginx: serve frontend + proxy /api → :5050
```

---

## 🛡️ Security & Ethics

**What this bot does:**
- ✅ Tracks projects and generates task reminders
- ✅ Checks site availability and faucet endpoints
- ✅ Discovers social links and community channels
- ✅ Monitors for airdrop announcements

**What this bot does NOT do:**
- ❌ Execute on-chain transactions or sign anything
- ❌ Store or use private keys
- ❌ Create Sybil / fake wallets
- ❌ Automate DEX swaps or bypass protocol ToS

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting.

---

## 📄 License

MIT © [Socialmania99](https://github.com/Socialmania99)

---

<div align="center">Made with ⚡ by Socialmania99 · Star ⭐ if useful!</div>
