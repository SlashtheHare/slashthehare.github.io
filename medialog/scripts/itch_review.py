"""
itch_review.py
--------------
Reads all itch.io game titles from your index.html, searches for each one
on itch.io, fetches the game page, extracts the description, and saves
results to itch_review.csv for you to review.

Requirements:
    pip install requests beautifulsoup4

Usage:
    python itch_review.py --html path/to/index.html

Progress is saved to itch_review_progress.json as it runs, so you can
Ctrl+C and resume any time by running again.

Output columns in itch_review.csv:
    title        - game title from your list
    url          - itch.io page found
    hint         - auto-hint: KEEP / REMOVE / MIXED / ?
    hint_reasons - keywords that triggered the hint
    tags         - genre/tag list from the page
    description  - first ~500 chars of the description
    keep         - leave blank, fill in Y/N/? yourself during review
    notes        - leave blank, fill in yourself
"""

import argparse
import csv
import json
import re
import sys
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── Config ───────────────────────────────────────────────────────────────────
PROGRESS_FILE = Path("itch_review_progress.json")
OUTPUT_FILE   = Path("itch_review.csv")
DELAY         = 1.2    # seconds between game page fetches
SEARCH_DELAY  = 1.5    # seconds between search requests
USER_AGENT    = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)
HEADERS = {"User-Agent": USER_AGENT}

# Keywords for auto-hinting — these are hints only, YOU make the final call
TASTE_KEEP = [
    "horror", "disturbing", "psychological", "surreal", "dark", "unsettling",
    "gore", "violence", "violent", "murder", "death", "body horror", "eldritch",
    "occult", "cosmic horror", "nightmare", "creepy", "eerie", "weird fiction",
    "lovecraftian", "experimental", "meta", "fourth wall", "glitch", "abstract",
    "existential", "dystopian", "post-apocalyptic", "cyberpunk", "sci-fi horror",
    "mystery", "noir", "detective", "investigation", "thriller",
    "fps", "first-person shooter", "third-person shooter",
    "bitsy", "twine", "interactive fiction",
    "point and click", "point-and-click", "adventure game",
    "monsters", "creature", "paranormal", "supernatural", "demonic",
    "anxiety", "trauma", "abuse", "grief", "loss",
]
TASTE_REMOVE = [
    "cozy", "wholesome", "cute", "family friendly", "for kids", "adorable",
    "farming sim", "relaxing", "chill", "peaceful", "casual", "match-3",
    "tower defense", "clicker", "idle game",
    "sports game", "racing game", "driving game", "flight simulator",
    "dating sim", "romance", "otome", "slice of life",
    "tabletop rpg", "ttrpg", "tabletop", "physical card game", "board game",
    "vr game", "virtual reality",
    "rpg maker", "rpgmaker",
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def extract_titles(path: str) -> list:
    with open(path, encoding="utf-8") as f:
        content = f.read()

    # Normalize any curly/smart quotes to straight quotes
    content = (content
        .replace('‘', "'").replace('’', "'")
        .replace('“', '"').replace('”', '"'))

    # JS/HTML file — contains platform:"itch.io" or platform:itch
    if 'platform:' in content and ('itch.io' in content or 'itch' in content):
        # Try strict match first
        raw = re.findall(r'title:"([^"]+)",platform:"itch\.io"', content)
        if not raw:
            # Fallback: match title value with various quote styles
            raw = re.findall(r'title:["\']([^"\',}]+)["\'],platform', content)
        cleaned = []
        for t in raw:
            t = t.replace('\\"'  , '"').replace("\\'", "'").replace("\\\\", "\\").strip()
            if t:
                cleaned.append(t)
        if cleaned:
            return sorted(set(cleaned))

    # Plain text file (itch.txt) — one entry per line.
    # Try to extract title from JS syntax; if no JS syntax found, use line as-is.
    titles = []
    for line in content.splitlines():
        line = line.strip()
        if not line:
            continue
        # Try JS entry syntax: title:"..." or title:'...'
        m = re.search(r'title:["\']([^"\',}]+)["\']', line)
        if m:
            t = m.group(1).replace('\\"'  , '"').replace("\\'", "'").replace("\\\\", "\\").strip()
            if t:
                titles.append(t)
        else:
            # Plain title line — skip lines that look like JS noise
            if not line.startswith("{") and not line.startswith("}"):
                titles.append(line)
    return sorted(set(titles))


def search_itch(title: str, session: requests.Session):
    """Search itch.io and return the first game result URL, or None."""
    try:
        r = session.get(
            "https://itch.io/search",
            params={"q": title, "type": "games"},
            headers=HEADERS,
            timeout=15,
        )
        r.raise_for_status()
    except Exception as e:
        print(f"  [search error] {e}")
        return None

    soup = BeautifulSoup(r.text, "html.parser")
    for cell in soup.select(".game_cell"):
        a = cell.select_one("a.game_link, a.title, .game_title a")
        if not a:
            a = cell.find("a", href=True)
        if a and a.get("href"):
            href = a["href"].split("?")[0]  # strip query params
            if href.startswith("http"):
                return href
            return "https://itch.io" + href
    return None


def fetch_game_page(url: str, session: requests.Session) -> dict:
    """Fetch a game page and extract description + tags."""
    result = {"url": url, "description": "", "tags": "", "hint": "?", "hint_reasons": ""}
    try:
        r = session.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
    except Exception as e:
        result["description"] = f"[fetch error: {e}]"
        return result

    soup = BeautifulSoup(r.text, "html.parser")

    # Description
    desc = ""
    for sel in [".formatted_description", ".game_summary", "#description", ".body"]:
        el = soup.select_one(sel)
        if el:
            desc = el.get_text(" ", strip=True)
            break
    if not desc:
        for meta_attr in [{"name": "description"}, {"property": "og:description"}]:
            meta = soup.find("meta", meta_attr)
            if meta and meta.get("content"):
                desc = meta["content"]
                break

    result["description"] = desc[:500]

    # Tags
    tags = [el.get_text(strip=True) for el in soup.select(".game_tags a, .tags a")]
    result["tags"] = ", ".join(tags[:20])

    # Auto-hint
    combined = (desc + " " + result["tags"]).lower()
    keep_hits = [k for k in TASTE_KEEP   if k in combined]
    rmv_hits  = [k for k in TASTE_REMOVE if k in combined]

    if keep_hits and not rmv_hits:
        result["hint"] = "KEEP"
    elif rmv_hits and not keep_hits:
        result["hint"] = "REMOVE"
    elif keep_hits and rmv_hits:
        result["hint"] = "MIXED"
    else:
        result["hint"] = "?"

    reasons = ""
    if keep_hits:
        reasons += "+" + ",".join(keep_hits[:5])
    if rmv_hits:
        reasons += " -" + ",".join(rmv_hits[:5])
    result["hint_reasons"] = reasons.strip()

    return result


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_progress(progress: dict):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=2, ensure_ascii=False)


def write_csv(progress: dict, titles: list):
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["title", "url", "hint", "hint_reasons", "tags", "description", "keep", "notes"])
        for t in titles:
            d = progress.get(t, {})
            w.writerow([
                t,
                d.get("url", ""),
                d.get("hint", ""),
                d.get("hint_reasons", ""),
                d.get("tags", ""),
                d.get("description", ""),
                "",
                "",
            ])


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Audit itch.io games from index.html"
    )
    parser.add_argument("source", help="Path to itch.txt (plain title list) or index.html (JS data file)")
    parser.add_argument(
        "--limit", type=int, default=0,
        help="Only process first N titles (0 = all, useful for testing)"
    )
    parser.add_argument(
        "--fresh", action="store_true",
        help="Delete saved progress and start from scratch"
    )
    args = parser.parse_args()

    if args.fresh and PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()
        print("Progress cleared — starting from scratch.\n")

    titles = extract_titles(args.source)
    print(f"Found {len(titles)} unique itch.io titles in {args.source}")

    if args.limit:
        titles = titles[:args.limit]
        print(f"(Limited to first {args.limit} for testing)")

    progress = load_progress()
    done  = sum(1 for t in titles if t in progress)
    total = len(titles)
    print(f"Already processed: {done}/{total}\n")

    session = requests.Session()

    try:
        for i, title in enumerate(titles):
            if title in progress:
                continue

            print(f"[{i+1}/{total}] {title[:70]}")
            time.sleep(SEARCH_DELAY)

            url = search_itch(title, session)
            if not url:
                print(f"  → not found in search")
                progress[title] = {
                    "url": "", "description": "[not found]",
                    "tags": "", "hint": "?", "hint_reasons": ""
                }
                save_progress(progress)
                continue

            print(f"  → {url}")
            time.sleep(DELAY)
            data = fetch_game_page(url, session)
            progress[title] = data

            hint = data["hint"]
            if data.get("hint_reasons"):
                hint += f" ({data['hint_reasons']})"
            print(f"  → [{hint}] {data['description'][:100]}...")

            save_progress(progress)

            # Checkpoint CSV every 50 entries
            if (i + 1) % 50 == 0:
                write_csv(progress, titles)
                print(f"  [checkpoint — CSV updated at {i+1} entries]")

    except KeyboardInterrupt:
        print("\n\nStopped by user. Progress saved — run again to resume.")

    write_csv(progress, titles)
    remaining = total - len([t for t in titles if t in progress])
    print(f"\nFinished! {len(progress)} titles processed, {remaining} remaining.")
    print(f"\nNext steps:")
    print(f"  1. Open {OUTPUT_FILE} in Excel/LibreOffice/Numbers")
    print(f"  2. Fill in the 'keep' column: Y = keep, N = remove, ? = unsure")
    print(f"  3. Send the filled CSV back and I'll apply the changes to index.html")

    # Shut down the PC
    import platform
    import subprocess
    print("\nShutting down...")
    if platform.system() == "Windows":
        subprocess.run(["shutdown", "/s", "/t", "0"])
    elif platform.system() == "Darwin":
        subprocess.run(["sudo", "shutdown", "-h", "now"])
    else:
        subprocess.run(["sudo", "shutdown", "-h", "now"])


if __name__ == "__main__":
    main()