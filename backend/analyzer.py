import os
import json
import re
import requests
from db import get_setting, add_notification

try:
    from bs4 import BeautifulSoup
    BS4_AVAILABLE = True
except ImportError:
    BS4_AVAILABLE = False

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def scrape_project(url: str):
    """Real web scraping using BeautifulSoup4."""
    result = {
        "text": "",
        "links": [],
        "social_links": {},
        "faucet_url": None,
        "title": "",
        "description": "",
        "reachable": False
    }
    try:
        resp = requests.get(url, timeout=10, headers=HEADERS)
        resp.raise_for_status()
        result["reachable"] = True

        if not BS4_AVAILABLE:
            result["text"] = resp.text[:4000]
            return result

        soup = BeautifulSoup(resp.text, "html.parser")

        # Title & meta
        title_tag = soup.find("title")
        result["title"] = title_tag.get_text(strip=True) if title_tag else ""
        meta_desc = soup.find("meta", {"name": "description"}) or soup.find("meta", {"property": "og:description"})
        if meta_desc:
            result["description"] = meta_desc.get("content", "")

        # Visible text (trim)
        for tag in soup(["script", "style", "noscript", "head"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        result["text"] = text[:5000]

        # All links
        all_links = [a.get("href", "") for a in soup.find_all("a", href=True)]

        # Social link detection
        social_patterns = {
            "twitter": r"(twitter\.com|x\.com)/[^/\"'\s]+",
            "discord": r"discord\.(gg|com)/[^\"'\s]+",
            "telegram": r"t\.me/[^\"'\s]+",
            "github": r"github\.com/[^\"'\s]+",
            "medium": r"medium\.com/[^\"'\s]+",
        }
        page_text_raw = resp.text
        for platform, pattern in social_patterns.items():
            match = re.search(pattern, page_text_raw, re.IGNORECASE)
            if match:
                found = match.group(0)
                if not found.startswith("http"):
                    found = "https://" + found
                result["social_links"][platform] = found

        # Faucet detection
        faucet_keywords = ["faucet", "claim", "testnet-faucet", "get-tokens", "drip"]
        for link in all_links:
            if link and any(kw in link.lower() for kw in faucet_keywords):
                faucet = link if link.startswith("http") else url.rstrip("/") + "/" + link.lstrip("/")
                result["faucet_url"] = faucet
                break

        result["links"] = [l for l in all_links if l and l.startswith("http")][:30]
    except Exception as e:
        result["error"] = str(e)

    return result


def analyze_with_claude(project_name: str, project_url: str, scraped: dict) -> dict:
    """Send scraped data to Claude for intelligent analysis."""
    api_key = get_setting("anthropic_api_key")
    if not api_key:
        return _fallback_analysis(project_name, project_url, scraped)

    prompt = f"""You are an expert crypto airdrop analyst. Analyze this project and respond ONLY with valid JSON.

Project: {project_name}
URL: {project_url}
Title: {scraped.get('title', '')}
Description: {scraped.get('description', '')}
Page Content (first 3000 chars): {scraped.get('text', '')[:3000]}
Links found: {json.dumps(scraped.get('links', [])[:15])}

Respond with ONLY this JSON structure (no markdown, no extra text):
{{
  "type": "testnet|points|swap|bridge|nft|social|governance|unknown",
  "chain": "ethereum|arbitrum|optimism|base|solana|cosmos|sui|aptos|polygon|bsc|avalanche|multi-chain|unknown",
  "score": <integer 1-100 indicating airdrop potential>,
  "summary": "<2-3 sentence summary of airdrop opportunity>",
  "tasks": [
    {{"name": "task name", "description": "what to do", "priority": "high|medium|low", "type": "faucet|swap|bridge|social|governance|nft|checkin|testnet"}}
  ],
  "keywords": ["keyword1", "keyword2"],
  "has_points_system": true|false,
  "has_testnet": true|false,
  "estimated_airdrop_value": "low|medium|high|unknown"
}}"""

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1500,
                "messages": [{"role": "user", "content": prompt}]
            },
            timeout=30
        )
        resp.raise_for_status()
        data = resp.json()
        text = data["content"][0]["text"].strip()
        # Strip markdown fences if present
        text = re.sub(r"^```json\s*|```$", "", text, flags=re.MULTILINE).strip()
        return json.loads(text)
    except Exception as e:
        print(f"Claude API error: {e}")
        return _fallback_analysis(project_name, project_url, scraped)


def _fallback_analysis(name, url, scraped) -> dict:
    """Rule-based fallback when no API key."""
    text_lower = scraped.get("text", "").lower()
    url_lower = url.lower()

    # Detect type
    ptype = "unknown"
    if any(k in text_lower for k in ["testnet", "faucet", "test network"]):
        ptype = "testnet"
    elif any(k in text_lower for k in ["points", "xp", "season", "leaderboard"]):
        ptype = "points"
    elif any(k in text_lower for k in ["swap", "dex", "liquidity", "amm"]):
        ptype = "swap"
    elif any(k in text_lower for k in ["bridge", "cross-chain"]):
        ptype = "bridge"
    elif any(k in text_lower for k in ["nft", "mint", "collection"]):
        ptype = "nft"

    # Detect chain
    chain = "unknown"
    for c in ["ethereum", "arbitrum", "optimism", "base", "solana", "cosmos", "sui", "aptos", "polygon"]:
        if c in text_lower or c in url_lower:
            chain = c
            break

    # Build basic tasks
    tasks = [{"name": "Check-in / Daily Visit", "description": "Visit the project site daily to maintain activity", "priority": "high", "type": "checkin"}]
    if ptype == "testnet":
        tasks += [
            {"name": "Request Testnet Tokens", "description": "Use faucet to get testnet tokens", "priority": "high", "type": "faucet"},
            {"name": "Perform Test Swaps", "description": "Execute swaps on testnet DEX", "priority": "high", "type": "swap"},
        ]
    if scraped.get("social_links", {}).get("twitter"):
        tasks.append({"name": "Follow on Twitter/X", "description": "Follow project Twitter for updates", "priority": "medium", "type": "social"})
    if scraped.get("social_links", {}).get("discord"):
        tasks.append({"name": "Join Discord", "description": "Join official Discord server", "priority": "medium", "type": "social"})

    score = 50
    if ptype != "unknown": score += 15
    if scraped.get("social_links"): score += 10
    if scraped.get("faucet_url"): score += 10

    return {
        "type": ptype,
        "chain": chain,
        "score": min(score, 95),
        "summary": f"{name} appears to be a {ptype} project on {chain}. Detected {len(tasks)} actionable tasks. Monitor regularly for airdrop announcements.",
        "tasks": tasks,
        "keywords": [],
        "has_points_system": "points" in text_lower or "xp" in text_lower,
        "has_testnet": ptype == "testnet" or "testnet" in text_lower,
        "estimated_airdrop_value": "medium"
    }


def full_analyze(project_name: str, project_url: str) -> dict:
    """Main entry: scrape + analyze."""
    scraped = scrape_project(project_url)
    analysis = analyze_with_claude(project_name, project_url, scraped)

    # Merge social links from scraping into analysis
    if scraped.get("social_links"):
        analysis["social_links"] = scraped["social_links"]
    if scraped.get("faucet_url") and not analysis.get("faucet_url"):
        analysis["faucet_url"] = scraped["faucet_url"]
    analysis["reachable"] = scraped.get("reachable", False)
    analysis["site_title"] = scraped.get("title", "")

    add_notification(
        f"Project Analyzed: {project_name}",
        f"Type: {analysis.get('type','?')} | Chain: {analysis.get('chain','?')} | Score: {analysis.get('score','?')}/100",
        "success"
    )
    return analysis


def check_announcement(url: str) -> bool:
    """Check if a project page has new airdrop announcement keywords."""
    try:
        resp = requests.get(url, timeout=8, headers=HEADERS)
        keywords = ["airdrop", "claim", "eligible", "snapshot", "token distribution", "tge"]
        text = resp.text.lower()
        return any(k in text for k in keywords)
    except:
        return False
