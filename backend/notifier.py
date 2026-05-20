import requests
from db import get_setting


def notify_telegram(token: str, chat_id: str, message: str) -> bool:
    if not token or not chat_id:
        return False
    try:
        resp = requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={"chat_id": chat_id, "text": message, "parse_mode": "Markdown"},
            timeout=8
        )
        return resp.status_code == 200
    except Exception as e:
        print(f"Telegram error: {e}")
        return False


def notify_discord(webhook: str, message: str) -> bool:
    if not webhook:
        return False
    try:
        resp = requests.post(webhook, json={"content": message}, timeout=8)
        return resp.status_code in (200, 204)
    except Exception as e:
        print(f"Discord error: {e}")
        return False


def send_notification(message: str) -> dict:
    """Send to all enabled channels from settings."""
    sent = {"telegram": False, "discord": False}

    if get_setting("enable_telegram") == "true":
        token = get_setting("telegram_bot_token")
        chat_id = get_setting("telegram_chat_id")
        sent["telegram"] = notify_telegram(token, chat_id, message)

    if get_setting("enable_discord") == "true":
        webhook = get_setting("discord_webhook")
        sent["discord"] = notify_discord(webhook, message)

    return sent


def test_telegram(token: str, chat_id: str) -> dict:
    ok = notify_telegram(token, chat_id, "✅ Airdrop Bot connected successfully!")
    return {"success": ok, "message": "Telegram test sent" if ok else "Failed — check token/chat_id"}


def test_discord(webhook: str) -> dict:
    ok = notify_discord(webhook, "✅ Airdrop Bot connected successfully!")
    return {"success": ok, "message": "Discord test sent" if ok else "Failed — check webhook URL"}
