from fastapi import APIRouter
from pydantic import BaseModel
import asyncio
import json
from datetime import datetime, timezone, timedelta
from backend.storage import DATABASE_FILE

# This whole file is basically useless, i tried several free
#  twitter scrapers with limited success, the only good ones
#  are paid or require an account which could result in ban.

router = APIRouter()
DEFAULT_ACCOUNTS = ["FaytuksNetwork", "pizzintwatch", "MEPPonPM",
                     "Osinttechnical", "sentdefender", "Conflict_Radar", 
                     "AJEnglish", "warsurv", "WarMonitor3", "WarMonitors", 
                     "OSINTWarfare", "MenchOsint"]

class SettingsUpdate(BaseModel):
    twitter_accounts: list
    hashtags: list

def load_db():
    default_db = {"alerts": [], "news": [], "settings": {}}
    if not DATABASE_FILE.exists():
        return default_db
    try:
        with DATABASE_FILE.open("r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return default_db


async def scrape_twitter():
    print("[*] Twitter scraper disabled. Focusing on Telegram.")
    while True:
        await asyncio.sleep(86400)

@router.get("/feed")
async def get_unified_feed():
    db = load_db()
    combined = db.get("alerts", []) + db.get("news", [])
    combined.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return {"status": "success", "data": combined[:200]}
