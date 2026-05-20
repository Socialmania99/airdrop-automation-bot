import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from db import init_db, get_conn, get_setting, set_setting, add_notification
from analyzer import full_analyze, check_announcement
from task_engine import run_project_tasks, run_all_active_projects, check_site_status, check_eligibility
from notifier import send_notification, test_telegram, test_discord

app = Flask(__name__)
CORS(app)

# ── Scheduler ─────────────────────────────────────────────────────────────────

scheduler = None

def start_scheduler():
    global scheduler
    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        scheduler = BackgroundScheduler(daemon=True)
        interval_h = int(get_setting("auto_run_interval_hours") or 24)
        check_m = int(get_setting("announcement_check_minutes") or 60)
        if get_setting("enable_scheduler") == "true":
            scheduler.add_job(run_all_active_projects, 'interval', hours=interval_h, id='auto_run')
            scheduler.add_job(_check_announcements, 'interval', minutes=check_m, id='announce_check')
        scheduler.start()
        print(f"[Scheduler] Started — auto-run every {interval_h}h, announce check every {check_m}m")
    except ImportError:
        print("[Scheduler] apscheduler not installed — background jobs disabled")
    except Exception as e:
        print(f"[Scheduler] Error: {e}")

def _check_announcements():
    conn = get_conn()
    projects = [dict(p) for p in conn.execute("SELECT * FROM projects WHERE status='active'").fetchall()]
    conn.close()
    for p in projects:
        if check_announcement(p["url"]):
            add_notification(f"🚨 {p['name']}", "Airdrop announcement keywords detected!", "alert")
            send_notification(f"🚨 *{p['name']}* has new airdrop keywords!\n{p['url']}")


# ── Health ─────────────────────────────────────────────────────────────────────

@app.route("/api/health")
def health():
    conn = get_conn()
    proj_count = conn.execute("SELECT COUNT(*) FROM projects").fetchone()[0]
    task_count = conn.execute("SELECT COUNT(*) FROM task_logs").fetchone()[0]
    conn.close()
    return jsonify({
        "status": "online",
        "version": "2.0.0",
        "projects": proj_count,
        "task_logs": task_count,
        "scheduler": scheduler.running if scheduler else False,
        "timestamp": datetime.now().isoformat()
    })


# ── Projects ───────────────────────────────────────────────────────────────────

@app.route("/api/projects", methods=["GET"])
def get_projects():
    conn = get_conn()
    rows = [dict(r) for r in conn.execute("SELECT * FROM projects ORDER BY created_at DESC").fetchall()]
    conn.close()
    for r in rows:
        r["tasks"] = json.loads(r.get("tasks_json") or "[]")
        r["social_links"] = json.loads(r.get("social_links") or "{}")
    return jsonify(rows)


@app.route("/api/projects", methods=["POST"])
def add_project():
    data = request.json
    name = data.get("name", "").strip()
    url = data.get("url", "").strip()
    if not name or not url:
        return jsonify({"error": "name and url required"}), 400

    # Run full analysis
    analysis = full_analyze(name, url)
    tasks_json = json.dumps(analysis.get("tasks", []))
    social_json = json.dumps(analysis.get("social_links", {}))

    conn = get_conn()
    c = conn.cursor()
    c.execute('''INSERT INTO projects
        (name, url, description, type, chain, score, summary, tasks_json, social_links, faucet_url)
        VALUES (?,?,?,?,?,?,?,?,?,?)''',
        (name, url, data.get("description",""), analysis.get("type","unknown"),
         analysis.get("chain","unknown"), analysis.get("score",50), analysis.get("summary",""),
         tasks_json, social_json, analysis.get("faucet_url")))
    project_id = c.lastrowid
    conn.commit()

    project = dict(conn.execute("SELECT * FROM projects WHERE id=?", (project_id,)).fetchone())
    conn.close()
    project["tasks"] = json.loads(project.get("tasks_json") or "[]")
    project["social_links"] = json.loads(project.get("social_links") or "{}")

    return jsonify(project), 201


@app.route("/api/projects/<int:pid>", methods=["DELETE"])
def delete_project(pid):
    conn = get_conn()
    conn.execute("DELETE FROM projects WHERE id=?", (pid,))
    conn.commit()
    conn.close()
    return jsonify({"deleted": pid})


@app.route("/api/projects/<int:pid>/status", methods=["PATCH"])
def update_project_status(pid):
    data = request.json
    status = data.get("status", "active")
    conn = get_conn()
    conn.execute("UPDATE projects SET status=? WHERE id=?", (status, pid))
    conn.commit()
    conn.close()
    return jsonify({"id": pid, "status": status})


@app.route("/api/projects/<int:pid>/reanalyze", methods=["POST"])
def reanalyze_project(pid):
    conn = get_conn()
    project = dict(conn.execute("SELECT * FROM projects WHERE id=?", (pid,)).fetchone())
    conn.close()
    analysis = full_analyze(project["name"], project["url"])
    conn = get_conn()
    conn.execute('''UPDATE projects SET type=?,chain=?,score=?,summary=?,tasks_json=?,social_links=?,faucet_url=?
        WHERE id=?''',
        (analysis.get("type"), analysis.get("chain"), analysis.get("score"),
         analysis.get("summary"), json.dumps(analysis.get("tasks",[])),
         json.dumps(analysis.get("social_links",{})), analysis.get("faucet_url"), pid))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "analysis": analysis})


# ── Tasks ──────────────────────────────────────────────────────────────────────

@app.route("/api/tasks/run/<int:pid>", methods=["POST"])
def run_tasks(pid):
    results = run_project_tasks(pid)
    return jsonify({"results": results, "count": len(results)})


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    project_id = request.args.get("project_id")
    limit = int(request.args.get("limit", 100))
    conn = get_conn()
    if project_id:
        rows = conn.execute("SELECT * FROM task_logs WHERE project_id=? ORDER BY created_at DESC LIMIT ?",
                            (project_id, limit)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM task_logs ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


# ── Wallets ────────────────────────────────────────────────────────────────────

@app.route("/api/wallets", methods=["GET"])
def get_wallets():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM wallets ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/wallets", methods=["POST"])
def add_wallet():
    data = request.json
    address = data.get("address","").strip()
    chain = data.get("chain","ethereum").strip()
    label = data.get("label","").strip()
    if not address:
        return jsonify({"error": "address required"}), 400
    conn = get_conn()
    c = conn.cursor()
    c.execute("INSERT INTO wallets (address, chain, label) VALUES (?,?,?)", (address, chain, label))
    wid = c.lastrowid
    conn.commit()
    wallet = dict(conn.execute("SELECT * FROM wallets WHERE id=?", (wid,)).fetchone())
    conn.close()
    return jsonify(wallet), 201


@app.route("/api/wallets/<int:wid>", methods=["DELETE"])
def delete_wallet(wid):
    conn = get_conn()
    conn.execute("DELETE FROM wallets WHERE id=?", (wid,))
    conn.commit()
    conn.close()
    return jsonify({"deleted": wid})


@app.route("/api/wallets/<int:wid>/check-eligibility", methods=["POST"])
def wallet_eligibility(wid):
    data = request.json
    project_url = data.get("project_url","")
    conn = get_conn()
    wallet = dict(conn.execute("SELECT * FROM wallets WHERE id=?", (wid,)).fetchone())
    conn.close()
    result = check_eligibility(wallet["address"], project_url)
    return jsonify(result)


# ── Notifications ──────────────────────────────────────────────────────────────

@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50").fetchall()
    unread = conn.execute("SELECT COUNT(*) FROM notifications WHERE read=0").fetchone()[0]
    conn.close()
    return jsonify({"notifications": [dict(r) for r in rows], "unread": unread})


@app.route("/api/notifications/read", methods=["POST"])
def mark_read():
    conn = get_conn()
    conn.execute("UPDATE notifications SET read=1")
    conn.commit()
    conn.close()
    return jsonify({"success": True})


@app.route("/api/notifications/clear", methods=["DELETE"])
def clear_notifications():
    conn = get_conn()
    conn.execute("DELETE FROM notifications")
    conn.commit()
    conn.close()
    return jsonify({"success": True})


# ── Stats ──────────────────────────────────────────────────────────────────────

@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_conn()
    total_p = conn.execute("SELECT COUNT(*) FROM projects").fetchone()[0]
    active_p = conn.execute("SELECT COUNT(*) FROM projects WHERE status='active'").fetchone()[0]
    total_t = conn.execute("SELECT COUNT(*) FROM task_logs").fetchone()[0]
    success_t = conn.execute("SELECT COUNT(*) FROM task_logs WHERE status='success'").fetchone()[0]
    total_w = conn.execute("SELECT COUNT(*) FROM wallets").fetchone()[0]
    unread_n = conn.execute("SELECT COUNT(*) FROM notifications WHERE read=0").fetchone()[0]
    type_breakdown = conn.execute("SELECT type, COUNT(*) as c FROM projects GROUP BY type").fetchall()
    chain_breakdown = conn.execute("SELECT chain, COUNT(*) as c FROM projects GROUP BY chain").fetchall()
    recent_tasks = [dict(r) for r in conn.execute(
        "SELECT * FROM task_logs ORDER BY created_at DESC LIMIT 5").fetchall()]
    conn.close()
    return jsonify({
        "projects": {"total": total_p, "active": active_p, "paused": total_p - active_p},
        "tasks": {"total": total_t, "success": success_t, "success_rate": round(success_t/max(total_t,1)*100, 1)},
        "wallets": {"total": total_w},
        "notifications": {"unread": unread_n},
        "type_breakdown": {r["type"]: r["c"] for r in type_breakdown},
        "chain_breakdown": {r["chain"]: r["c"] for r in chain_breakdown},
        "recent_tasks": recent_tasks,
    })


# ── Settings ───────────────────────────────────────────────────────────────────

@app.route("/api/settings", methods=["GET"])
def get_settings():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM settings").fetchall()
    conn.close()
    s = {r["key"]: r["value"] for r in rows}
    # Mask API key
    if s.get("anthropic_api_key"):
        s["anthropic_api_key_set"] = True
        s["anthropic_api_key"] = "sk-ant-***" + s["anthropic_api_key"][-6:] if len(s["anthropic_api_key"]) > 6 else "***"
    return jsonify(s)


@app.route("/api/settings", methods=["POST"])
def save_settings():
    data = request.json
    for key, value in data.items():
        if key == "anthropic_api_key" and value.startswith("sk-ant-***"):
            continue  # Don't overwrite masked key
        set_setting(key, str(value))
    # Restart scheduler with new intervals if needed
    return jsonify({"success": True})


@app.route("/api/settings/test-telegram", methods=["POST"])
def test_tg():
    data = request.json
    result = test_telegram(data.get("token",""), data.get("chat_id",""))
    return jsonify(result)


@app.route("/api/settings/test-discord", methods=["POST"])
def test_dc():
    data = request.json
    result = test_discord(data.get("webhook",""))
    return jsonify(result)


# ── Boot ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    start_scheduler()
    port = int(os.environ.get("PORT", 5050))
    print(f"[Server] Airdrop Bot API running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
