import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'projects.db')

def get_conn():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'unknown',
        chain TEXT DEFAULT 'unknown',
        status TEXT DEFAULT 'active',
        score INTEGER DEFAULT 0,
        summary TEXT,
        tasks_json TEXT DEFAULT '[]',
        social_links TEXT DEFAULT '{}',
        faucet_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_run TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS task_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        project_name TEXT,
        task_name TEXT,
        status TEXT DEFAULT 'pending',
        result TEXT,
        wallet TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL,
        chain TEXT NOT NULL,
        label TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        message TEXT,
        type TEXT DEFAULT 'info',
        read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )''')

    # Default settings
    defaults = {
        'anthropic_api_key': '',
        'telegram_bot_token': '',
        'telegram_chat_id': '',
        'discord_webhook': '',
        'auto_run_interval_hours': '24',
        'announcement_check_minutes': '60',
        'enable_scheduler': 'true',
        'enable_telegram': 'false',
        'enable_discord': 'false',
    }
    for k, v in defaults.items():
        c.execute('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', (k, v))

    conn.commit()
    conn.close()

def get_setting(key):
    conn = get_conn()
    row = conn.execute('SELECT value FROM settings WHERE key=?', (key,)).fetchone()
    conn.close()
    return row['value'] if row else None

def set_setting(key, value):
    conn = get_conn()
    conn.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', (key, value))
    conn.commit()
    conn.close()

def add_notification(title, message, ntype='info'):
    conn = get_conn()
    conn.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)',
                 (title, message, ntype))
    conn.commit()
    conn.close()
