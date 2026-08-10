from fastapi import APIRouter
from pydantic import BaseModel
import asyncio
import requests
from bs4 import BeautifulSoup
import json
import hashlib
from datetime import datetime
from backend.storage import DATABASE_FILE

router = APIRouter()
DEFAULT_CHANNELS = ["monitor_the_situation", "terroralarm", "ConflictsTracker", "aljazeeraglobal", "OSINTWarfare"]

class TelegramSettings(BaseModel):
    channels: list

def load_db():
    default_db = {"alerts": [], "news": [], "settings": {"telegram_channels": DEFAULT_CHANNELS}}
    if not DATABASE_FILE.exists():
        return default_db
    try:
        with DATABASE_FILE.open("r", encoding="utf-8") as f:
            db = json.load(f)
            if "settings" not in db: db["settings"] = {}
            if "telegram_channels" not in db["settings"]: db["settings"]["telegram_channels"] = DEFAULT_CHANNELS
            return db
    except:
        return default_db

def save_db(data):
    with DATABASE_FILE.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

async def scrape_telegram():
    while True:
        db = load_db()
        channels = db["settings"].get("telegram_channels", DEFAULT_CHANNELS)
        new_alerts = []
        
        for channel in channels:
            try:
                url = f"https://t.me/s/{channel}"
                response = await asyncio.to_thread(requests.get, url, timeout=10)
                if response.status_code != 200:
                    continue
                    
                soup = BeautifulSoup(response.text, 'html.parser')
                messages = soup.find_all('div', class_='tgme_widget_message_wrap')
                
                for msg in messages:
                    text_div = msg.find('div', class_='tgme_widget_message_text')
                    time_div = msg.find('a', class_='tgme_widget_message_date')
                    
                    # Check for media (photo or video)
                    has_media = bool(msg.find('a', class_='tgme_widget_message_photo_wrap') or msg.find('video'))
                    
                    if text_div and time_div:
                        text = text_div.get_text(separator=" ", strip=True)
                        timestamp = time_div.find('time')['datetime'] if time_div.find('time') else datetime.now().isoformat()
                        msg_id = hashlib.md5(text.encode()).hexdigest()
                        msg_url = time_div.get('href', f"https://t.me/{channel}")
                        
                        new_alerts.append({
                            "id": msg_id,
                            "url": msg_url,
                            "source": "telegram",
                            "channel": channel,
                            "text": text,
                            "timestamp": timestamp,
                            "has_media": has_media
                        })
            except Exception as e:
                print(f"Error scraping {channel}: {e}")
                
        if new_alerts:
            db = load_db()
            existing_ids = {a['id'] for a in db['alerts']}
            
            # Prepend new unique alerts
            for alert in new_alerts:
                if alert['id'] not in existing_ids:
                    db['alerts'].insert(0, alert)
                    
            # Keep max 200
            db['alerts'] = db['alerts'][:200]
            save_db(db)
        
        await asyncio.sleep(15)

@router.get("/telegram")
async def get_telegram_alerts():
    db = load_db()
    return {"status": "success", "data": db['alerts']}

@router.get("/settings")
async def get_settings():
    db = load_db()
    return {"telegram_channels": db["settings"].get("telegram_channels", DEFAULT_CHANNELS)}

@router.post("/settings")
async def update_settings(settings: TelegramSettings):
    db = load_db()
    db["settings"]["telegram_channels"] = settings.channels
    save_db(db)
    return {"status": "success"}
