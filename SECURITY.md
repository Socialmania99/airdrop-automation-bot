# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.0.x   | ✅ Yes    |
| 1.x     | ❌ No     |

## Security Design

- **No private keys** — only public wallet addresses are ever stored
- **Local data only** — SQLite database stored on your machine
- **Optional AI calls** — Anthropic API only used if key is configured
- **No transactions** — zero on-chain automation; all signing is manual

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues via email or GitHub private security advisory:

1. Go to the repository → **Security** tab → **Report a vulnerability**
2. Describe the issue clearly with reproduction steps
3. We will respond within 48 hours

## What to Report

- Authentication bypasses
- SQL injection in the Flask API
- Sensitive data exposure via API endpoints
- Dependency vulnerabilities with active exploits

## What NOT to Report

- Missing rate limiting (known limitation for local use)
- Lack of HTTPS on localhost (expected for local dev)
- Issues in unmaintained 1.x versions
