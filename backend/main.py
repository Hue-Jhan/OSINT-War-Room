from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import sys
from pathlib import Path
from backend.api import news, alerts, economy, radar
from backend.api.news import scrape_twitter
from backend.api.alerts import scrape_telegram

app = FastAPI()

PROJECT_ROOT = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent.parent))

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(economy.router, prefix="/api/economy", tags=["Economy"])
app.include_router(radar.router, prefix="/api/radar", tags=["Radar"])

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(scrape_twitter())
    asyncio.create_task(scrape_telegram())

@app.get("/api/status")
async def get_status():
    return {"status": "Chanos War Room Backend Active"}

# Mount Frontend Static Files (Must be last to avoid overriding API routes)
app.mount("/", StaticFiles(directory=PROJECT_ROOT / "frontend", html=True), name="frontend")
