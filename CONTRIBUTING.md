# Contributing to Airdrop Automation Bot

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/airdrop-automation-bot.git
cd airdrop-automation-bot

# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

## Branch Naming

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/name` | `feature/add-solana-support` |
| Bug fix | `fix/name` | `fix/faucet-timeout` |
| Docs | `docs/name` | `docs/update-api-reference` |
| Chore | `chore/name` | `chore/upgrade-dependencies` |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Solana wallet support
fix: handle faucet timeout gracefully
docs: update API reference table
chore: upgrade Flask to 3.1
```

## Pull Request Checklist

- [ ] Code runs without errors locally
- [ ] Backend: `python app.py` starts cleanly
- [ ] Frontend: `npm run dev` starts cleanly
- [ ] No `.env` or `data/` files committed
- [ ] README updated if needed

## Reporting Bugs

Open an issue with:
- OS and Python/Node versions
- Steps to reproduce
- Expected vs actual behavior
- Error output / logs

## Feature Requests

Open an issue describing:
- The problem you're solving
- Your proposed solution
- Any alternatives considered

## Code Style

- **Python**: follow PEP8, use f-strings, type hints where practical
- **JavaScript/React**: functional components, hooks, no class components
- **Comments**: explain *why*, not *what*

---

Made with ⚡ by Aditya GFX
