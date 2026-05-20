import json
import time
import requests
import webbrowser
from datetime import datetime
from db import get_conn, add_notification, get_setting
from notifier import send_notification

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
}

# ── Site Health ────────────────────────────────────────────────────────────────

def check_site_status(url: str) -> dict:
    try:
        resp = requests.get(url, timeout=8, headers=HEADERS)
        return {"online": resp.status_code < 400, "status_code": resp.status_code, "latency_ms": int(resp.elapsed.total_seconds() * 1000)}
    except Exception as e:
        return {"online": False, "status_code": 0, "error": str(e)}


# ── Faucet ─────────────────────────────────────────────────────────────────────

def request_faucet(faucet_url: str, wallet: str) -> dict:
    if not faucet_url:
        return {"success": False, "message": "No faucet URL configured"}
    try:
        # Try common faucet POST patterns
        payloads = [
            {"address": wallet},
            {"wallet": wallet},
            {"account": wallet},
            {"recipient": wallet},
        ]
        for payload in payloads:
            try:
                resp = requests.post(faucet_url, json=payload, timeout=10, headers=HEADERS)
                if resp.status_code in (200, 201):
                    return {"success": True, "message": f"Faucet request sent ({resp.status_code})", "response": resp.text[:200]}
            except:
                pass
        # Fallback: open in browser for manual completion
        return {"success": False, "message": "Auto-POST failed — open faucet manually", "faucet_url": faucet_url, "manual": True}
    except Exception as e:
        return {"success": False, "message": str(e)}


# ── Social / Announcement Detection ──────────────────────────────────────────

def discover_social_links(url: str) -> dict:
    import re
    social_links = {}
    try:
        resp = requests.get(url, timeout=8, headers=HEADERS)
        text = resp.text
        patterns = {
            "twitter": r"https?://(twitter\.com|x\.com)/[A-Za-z0-9_]+",
            "discord": r"https?://discord\.(gg|com/invite)/[A-Za-z0-9_-]+",
            "telegram": r"https?://t\.me/[A-Za-z0-9_]+",
            "github": r"https?://github\.com/[A-Za-z0-9_-]+",
        }
        for platform, pattern in patterns.items():
            match = re.search(pattern, text)
            if match:
                social_links[platform] = match.group(0)
    except Exception as e:
        social_links["error"] = str(e)
    return social_links


def open_social_link(platform: str, link: str) -> dict:
    """Open social link in browser for manual follow/join."""
    if link:
        webbrowser.open(link)
        return {"success": True, "message": f"Opened {platform} in browser", "url": link}
    return {"success": False, "message": f"No {platform} link found"}


# ── Eligibility Check ─────────────────────────────────────────────────────────

def check_eligibility(wallet: str, project_url: str) -> dict:
    """Check common eligibility endpoint patterns."""
    if not wallet or not project_url:
        return {"eligible": None, "message": "Missing wallet or URL"}
    base = project_url.rstrip("/")
    endpoints = [
        f"{base}/api/eligibility?address={wallet}",
        f"{base}/api/check?wallet={wallet}",
        f"{base}/eligibility/{wallet}",
        f"{base}/api/airdrop/check?address={wallet}",
    ]
    for ep in endpoints:
        try:
            resp = requests.get(ep, timeout=6, headers=HEADERS)
            if resp.status_code == 200:
                data = resp.json()
                eligible = data.get("eligible") or data.get("isEligible") or data.get("qualified")
                return {"eligible": bool(eligible), "message": f"Checked at {ep}", "raw": data}
        except:
            continue
    return {"eligible": None, "message": "No eligibility endpoint found — check manually"}


# ── Announcement Monitor ──────────────────────────────────────────────────────

def monitor_announcements(projects: list) -> list:
    """Scan all active project URLs for airdrop/claim keywords."""
    found = []
    keywords = ["airdrop", "claim", "eligible", "snapshot", "token distribution", "tge", "launch"]
    for p in projects:
        try:
            resp = requests.get(p["url"], timeout=8, headers=HEADERS)
            text = resp.text.lower()
            hits = [kw for kw in keywords if kw in text]
            if hits:
                found.append({"project": p["name"], "url": p["url"], "keywords": hits})
                add_notification(
                    f"🚨 Alert: {p['name']}",
                    f"Airdrop keywords detected: {', '.join(hits)}",
                    "alert"
                )
                send_notification(f"🚨 *{p['name']}* airdrop keywords: {', '.join(hits)}\n{p['url']}")
        except:
            pass
    return found


# ── Main Task Runner ──────────────────────────────────────────────────────────

def run_project_tasks(project_id: int) -> list:
    """Run all tasks for a project and log results."""
    conn = get_conn()
    project = conn.execute("SELECT * FROM projects WHERE id=?", (project_id,)).fetchone()
    if not project:
        conn.close()
        return [{"error": "Project not found"}]

    project = dict(project)
    wallets = [dict(w) for w in conn.execute("SELECT * FROM wallets").fetchall()]
    conn.close()

    tasks_json = json.loads(project.get("tasks_json") or "[]")
    results = []
    wallet_addr = wallets[0]["address"] if wallets else "0x0000000000000000000000000000000000000000"

    # Always run site check
    _log_task(project_id, project["name"], "Site Health Check", "running", "", wallet_addr)
    site = check_site_status(project["url"])
    status = "success" if site["online"] else "failed"
    result_msg = f"Online ✓ ({site.get('latency_ms',0)}ms)" if site["online"] else f"Offline ✗ — {site.get('error','')}"
    _log_task(project_id, project["name"], "Site Health Check", status, result_msg, wallet_addr)
    results.append({"task": "Site Health Check", "status": status, "result": result_msg})

    # Run auto tasks based on type
    for task in tasks_json:
        ttype = task.get("type", "")
        tname = task.get("name", "Unknown Task")
        _log_task(project_id, project["name"], tname, "running", "", wallet_addr)

        try:
            if ttype == "faucet" and project.get("faucet_url"):
                res = request_faucet(project["faucet_url"], wallet_addr)
                status = "success" if res.get("success") else "manual"
                msg = res.get("message", "")
            elif ttype == "social":
                social = json.loads(project.get("social_links") or "{}")
                platform = "twitter" if "twitter" in tname.lower() else "discord" if "discord" in tname.lower() else "telegram"
                link = social.get(platform, "")
                if link:
                    status = "success"
                    msg = f"Social link ready: {link}"
                else:
                    status = "skipped"
                    msg = "No link found on project page"
            elif ttype == "checkin":
                # Re-check site as daily visit
                site2 = check_site_status(project["url"])
                status = "success" if site2["online"] else "failed"
                msg = "Daily visit logged" if site2["online"] else "Site unreachable"
            else:
                status = "skipped"
                msg = f"Task type '{ttype}' requires manual action"

        except Exception as e:
            status = "failed"
            msg = str(e)

        _log_task(project_id, project["name"], tname, status, msg, wallet_addr)
        results.append({"task": tname, "status": status, "result": msg})
        time.sleep(0.5)

    # Update last_run
    conn = get_conn()
    conn.execute("UPDATE projects SET last_run=? WHERE id=?", (datetime.now().isoformat(), project_id))
    conn.commit()
    conn.close()

    send_notification(f"✅ *{project['name']}* bot run complete — {len(results)} tasks processed.")
    add_notification(f"Bot Run: {project['name']}", f"{len(results)} tasks completed", "success")

    return results


def run_all_active_projects():
    """Scheduled: run all active projects."""
    conn = get_conn()
    projects = [dict(p) for p in conn.execute("SELECT * FROM projects WHERE status='active'").fetchall()]
    conn.close()
    for p in projects:
        try:
            run_project_tasks(p["id"])
        except Exception as e:
            add_notification(f"Scheduler Error: {p['name']}", str(e), "error")

    # Also monitor for announcements
    monitor_announcements(projects)


def _log_task(project_id, project_name, task_name, status, result, wallet):
    conn = get_conn()
    conn.execute(
        "INSERT INTO task_logs (project_id, project_name, task_name, status, result, wallet) VALUES (?,?,?,?,?,?)",
        (project_id, project_name, task_name, status, result, wallet)
    )
    conn.commit()
    conn.close()
