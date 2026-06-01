"""
Bリーグ移籍情報スクレイパー
GitHub Actionsで毎日自動実行される
"""

import os
import re
import requests
from bs4 import BeautifulSoup
from datetime import date
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"],
)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; BleagueTracker/1.0)"
}

# B1チーム公式ニュースURL一覧
TEAM_NEWS_URLS = {
    "アルバルク東京": "https://www.alvark-tokyo.jp/news/",
    "宇都宮ブレックス": "https://www.utsunomiyabrex.com/news/",
    "千葉ジェッツ": "https://www.chibajets.jp/news/",
    "川崎ブレイブサンダース": "https://www.kawasaki-bravethunders.com/news/",
    "横浜DeNAビーコルズ": "https://www.ybbeacors.jp/news/",
    "琉球ゴールデンキングス": "https://kings.b-league.jp/news/",
}

TRANSFER_KEYWORDS = [
    "移籍", "加入", "退団", "契約合意", "新加入", "継続", "来季も", "残留"
]


def is_transfer_news(title: str) -> bool:
    return any(kw in title for kw in TRANSFER_KEYWORDS)


def classify_status(title: str) -> str:
    if "退団" in title:
        return "departure"
    if "移籍" in title:
        return "transfer"
    if "新加入" in title or "加入" in title:
        return "new"
    if "継続" in title or "残留" in title or "来季も" in title:
        return "renewal"
    return "new"


def extract_player_name(title: str) -> str:
    """タイトルから選手名を抽出（簡易版）"""
    # 「田中 大貴 選手 移籍のお知らせ」などのパターンに対応
    patterns = [
        r"([^\s]+\s[^\s]+)\s*選手",
        r"選手\s*([^\s]+\s[^\s]+)",
        r"^([^\s]+\s[^\s]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, title)
        if match:
            return match.group(1).strip()
    return title[:10]  # フォールバック


def scrape_team_news(team_name: str, url: str) -> list[dict]:
    results = []
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        # 一般的なニュース一覧のリンクを取得
        for a_tag in soup.find_all("a", href=True):
            title = a_tag.get_text(strip=True)
            if not is_transfer_news(title):
                continue

            player_name = extract_player_name(title)
            status = classify_status(title)

            results.append({
                "player_name": player_name,
                "from_team": team_name if status == "transfer" else None,
                "to_team": team_name if status != "departure" else None,
                "status": status,
                "announced_at": str(date.today()),
                "source_url": a_tag["href"] if a_tag["href"].startswith("http") else url,
                "source_name": f"{team_name}公式",
                "notes": title,
            })
    except Exception as e:
        print(f"[ERROR] {team_name}: {e}")

    return results


def upsert_transfers(transfers: list[dict]) -> None:
    if not transfers:
        return
    result = supabase.table("transfers").upsert(
        transfers,
        on_conflict="player_name,announced_at"
    ).execute()
    print(f"[OK] {len(transfers)}件 upsert完了")


def main():
    all_transfers = []
    for team_name, url in TEAM_NEWS_URLS.items():
        print(f"スクレイピング中: {team_name}")
        transfers = scrape_team_news(team_name, url)
        all_transfers.extend(transfers)
        print(f"  → {len(transfers)}件取得")

    print(f"\n合計: {len(all_transfers)}件")
    upsert_transfers(all_transfers)


if __name__ == "__main__":
    main()
