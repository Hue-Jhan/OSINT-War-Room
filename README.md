# 🌍 CHANOS WAR ROOM

Chanos War Room is a high-performance, tactical dashboard designed for tracking global conflicts, military movements, and geopolitical events in real-time. It aggregates multiple open-source intelligence (OSINT) feeds into a single, customizable, interactive command center with a dark tactical interface.

It currently tracks global conflicts, live air/naval radar, frontline Telegram intelligence, latest news, Cyber threat feeds, Stock markets, raw energy & industrial materials, crypto, live casualties, war time events, Pentagon pizza index, CCTV footage all around the world, VIX fear index, Polymarket bets, and more. Fully customizable.

![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Python](https://img.shields.io/badge/Backend-Python_FastAPI-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla_JS_&_HTML5-orange.svg)
![Mapping](https://img.shields.io/badge/Mapping-Leaflet.js-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)


https://github.com/user-attachments/assets/6734bdf2-be98-4182-992c-bce890ee476f


### 📋 Index

- [🛰️ Features](#️-features)
   - [Tactical Map & Tracking](#tactical-map--tracking)
   - [Intelligence Feeds](#intelligence-feeds)
   - [Markets & Macro](#markets--macro)
   - [System & UI](#system--ui)
- [💻 Code](#-code)
   - [🔋 How to Install & Run](#-how-to-install--run)
   - [⚙️ Configuration](#️-configuration)
   - [📁 Project Structure](#-project-structure)
   - [🔌 API Endpoints](#-api-endpoints)
   - [⚠️ Known Limitations & Bugs](#️-known-limitations--bugs)
- [💸 Donate](#-donate)

# 🛰️ Features

#### Tactical Map & Tracking:
- **Live Conflict Events** — Parses the [GDELT Project](https://www.gdeltproject.org/) database every 15 minutes to display explosions, missile strikes, and armed engagements as animated pulse markers. Prioritizes Middle East, Ukraine, and active conflict zones.
- **Airspace Monitoring (ADS-B)** — Integrates with [OpenSky Network](https://opensky-network.org/) to render live aircraft positions, altitude, heading, and callsign with rotating arrow icons.
- **Maritime Traffic (AIS)** — WebSocket connection to [AISStream.io](https://aisstream.io/) for real-time ship tracking across 4 global regions. Color-coded by vessel type (tanker, cargo, military, passenger).
- **Military Infrastructure** — Queries the [Overpass API](https://overpass-api.de/) (OpenStreetMap) to map military bases, airfields, and naval ports across Ukraine, the Middle East, and the Taiwan Strait.
- **Nuclear Detonation Simulator** — Click-to-detonate nuke simulator using Glasstone & Dolan cube-root scaling. Choose from 7 historical weapons (Little Boy → Tsar Bomba) and visualize 5 blast zones (fireball, heavy blast, moderate blast, thermal radiation, light blast) with animated ring expansion.
- **Tactical Tools** — Distance measurement tool, custom marker placement with labels, coordinate HUD, and toggleable map legend.
- **Conflict Casualties Tracker** — Overlay widget that aggregates `NumKilled` and `NumWounded` GDELT fields for a live 24h casualty estimate.

#### Intelligence Feeds:
- **Webcam Grid** — Customizable live surveillance feed grid (1×1, 2×2, 3×3) from YouTube streams and public CCTV cameras worldwide.
- **Telegram Scraper** — Background async scraper that polls public web previews of frontline OSINT channels every 15 seconds. Configurable channel list. Supports channels like `@monitor_the_situation`, `@terroralarm`, `@ConflictsTracker`, `@OSINTWarfare`, `@aljazeeraglobal`.
- **Live News Ticker** — Scrolling RSS headline aggregator from BBC World, Reuters, Al Jazeera, and AP News.
- **Cyber Intel Panel** — Visualizes the [CISA Known Exploited Vulnerabilities (KEV)](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) catalog. Displays CVEs on the world map as glowing blue dots, filterable by type (exploit, DDoS, malware, breach).
- **Air Raid Alerts** — Real-time polling of regional alarm APIs for active air raid sirens (Ukraine focus).
- **Radio Intercepts** — Simulated military radio widget using Web Audio API. Generates realistic bandpass-filtered static, squelch cycles, and rotating transcripts for 5 stations (CENTCOM, NATO OPS, PACIFIC CMD, KYIV CTRL, NORAD).

#### Markets & Macro:
- **Market Dashboard** — Live tickers via `yfinance` for S&P 500, FTSE 100, Nikkei, Gold, Silver, WTI Crude, Natural Gas, Wheat, BTC, ETH, XMR, and the VIX Fear Index;
- **Pentagon Pizza Index** — Tracks order volume at pizza chains near the Pentagon as a proxy for unusual after-hours military activity ([source](https://monitor-the-situation.com/api/pizza));
- **Polymarket Integration** — Live betting odds on geopolitical outcomes, filtered to remove sports markets. Shows 24h trending and highest all-time volume markets;
- **DEFCON Threat Meter** — Calculated global tension score derived from active Ukraine alarms + GDELT conflict event density. Displays as a DEFCON 1–5 rating in the top bar;

#### System & UI:
- **Sound Engine:** Procedural sound effects (alarms, clicks, nukes) generated with Web Audio API;
- **Window Management:** Resizable, multi-pane layout powered by Split.js with local storage persistence, draggable floating panels (nuke sim, cyber intel, radio);
- **Map:** Region-based map presets (Global, Middle East, Ukraine, Taiwan);
- **Optimization:** Server-side in-memory caching with pending-request locking to prevent API stampedes on multi-tab load;



# 💻 Code

I vibecoded 90% of this project using Gemini extension on Vs Code, Claude, and Gemini Pro. The structure was originally designed to be lightweight, modular, and extremely fast, avoiding heavy frontend frameworks, and it kinda respects these prerequisites:

* **Backend:** Python 3.11+ using FastAPI for rapid endpoint delivery, asyncio for non-blocking background scraping loops and BeautifulSoup4 for parsing HTML feeds. 
* **Frontend:** ES6 JavaScript, HTML5, and CSS Grid/Flexbox, libraries: Leaflet.js, Split.js, FontAwesome;
* **Database:** Lightweight, local JSON flat-file storage (`database.json`) for caching alerts and managing user settings.

---

### 🔋 How to install & run

0) Requirements: Python 3.11, [AISStream.io](https://aisstream.io/) API key (free).

1) Clone the repo:
```bash
git clone https://github.com/DrChance239/OSINT-War-Room
cd OSINT-War-Room
``` 

3) Install requirements (optionally in a virtual env):
``` 
pip install -r requirements.txt
```

5) Run (port 8000): 
```bash
uvicorn backend.main:app --reload
```
> **Note:** On first load, the GDELT conflict feed and OSM military bases may take 10–30 seconds to appear, this is normal and happens because GDELT's live feed requires downloading and parsing a large ZIP. Results are cached server-side for 15 minutes (GDELT) and 6 hours (military bases) after the first successful fetch.

### Windows desktop app

Build a native Windows app with WebView2:

```powershell
.\build-windows.ps1
```

Open `dist\Chanos War Room\Chanos War Room.exe`. The desktop app stores its local alert cache and settings in `%LOCALAPPDATA%\ChanosWarRoom`.

---

### ⚙️ Configuration

The Api is added in `frontend/js/map.js`, in the `startAISWebSocket` function.

Telegram channels are configurable at runtime via the News settings modal in the UI, or by editing `backend/database.json` directly:

```json
{
  "settings": {
    "telegram_channels": [
      "monitor_the_situation",
      "terroralarm",
      "ConflictsTracker",
      "aljazeeraglobal",
      "OSINTWarfare" ]
  }
}
```

Regarding CORS Origins, if you're running the frontend from a different port (e.g., Live Server on :5500), add your origin to the origins list in `backend/main.py`:

```python
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://127.0.0.1:8000", ]
```

---

### 📁 Project Structure

```md
osint-war-room/
├── backend/
│   ├── main.py               # FastAPI app entry point, CORS, router mounting, startup tasks
│   ├── database.json         # Flat-file storage for alerts, news cache, and user settings
│   └── api/
│       ├── alerts.py         # Telegram scraper (async background task, BeautifulSoup parser)
│       ├── news.py           # (Not used) unified news feed endpoint, RSS aggregation
│       ├── economy.py        # Market data (yfinance), Pizza Index, Polymarket, VIX
│       └── radar.py          # GDELT conflict events, OSM military bases, OpenSky aircraft,
│                             #   AIS ships, CISA KEV cyber feed, air alarms and more...
│
└── frontend/
    ├── index.html            # Main dashboard layout, all panels, modals, sidebar
    ├── css/
    │   ├── base.css          # CSS variables, resets, scrollbar, .hidden utility
    │   ├── layout.css        # App shell, sidebar, top bar, Split.js gutters, panel cards
    │   ├── components.css    # Nav items, modals, ticker, buttons, region toggles, clock
    │   ├── map.css           # Leaflet overrides, custom icons, pulse animations, nuke rings
    │   └── modules.css       # Bottom panel modules (markets, feeds, webcams, pizza)
    └── js/
        ├── main.js           # DOMContentLoaded entry point, initializes all modules
        ├── map.js            # Leaflet map, all layer logic, nuke sim, cyber panel,
        │                     #   threat meter, body count, radio widget, sound engine (_sfx)
        ├── ui.js             # Split.js layout, modals, clock, webcam grid, snap buttons
        └── api.js            # Data polling (Telegram feed, markets, pizza, ticker, webcams)
```

---

### 🔌 Api Endpoints

  | Method | Endpoint | Description |
  |--------|----------|-------------|
  | GET | `/api/status` | Backend health check |
  | GET | `/api/alerts/telegram` | Latest scraped Telegram messages |
  | GET | `/api/alerts/settings` | Current Telegram channel list |
  | POST | `/api/alerts/settings` | Update Telegram channel list |
  | GET | `/api/news/feed` | Unified Telegram + news feed |
  | GET | `/api/economy/markets` | Live market tickers (yfinance) |
  | GET | `/api/economy/pizza` | Pentagon Pizza Index |
  | GET | `/api/economy/polymarket` | Polymarket geopolitical bets |
  | GET | `/api/economy/ticker` | RSS headline ticker |
  | GET | `/api/radar/alarms` | Ukraine air raid alarms |
  | GET | `/api/radar/bases` | OSM military bases (cached 6h) |
  | GET | `/api/radar/conflicts` | GDELT conflict events (cached 15min) |
  | GET | `/api/radar/aircraft` | OpenSky live aircraft positions |
  | GET | `/api/radar/cyber` | CISA KEV vulnerability feed |

---

### ⚠️ Known Limitations & Bugs

- **AIS Maritime tracking** requires a working connection to `stream.aisstream.io`. Free tier IP blocks can occur after excessive connections, so wait 24 hours or register a new key on a different network.
- **GDELT first load** can be slow (10–30s) depending on the GDELT server and file size. Try to reload, open a page in a new tab or in a incognito tab.
- **Telegram scraping** uses the public web preview (`t.me/s/channel`) and may rate-limit on high-frequency polling or for channels with restricted previews.
- **OpenSky Network** has a 10-second rate limit on anonymous requests. Results refresh every 30 seconds while the layer is active.

---


### 💸 Donate

I'm broke pls donate plssss


<img align="left" alt="Bitcoin" width="50px" src="https://www.readmecodegen.com/api/social-icon?name=bitcoin&size=306&animation=rainbow&animationDuration=4.5" />

  ```
  bc1qdf06nx2mlpkxkmjj8vn29mwp88etgvzr9wh975
  ```

<img align="left" alt="Ethereum" width="50px" src="https://www.readmecodegen.com/api/social-icon?name=ethereum&size=30&animation=spin&animationDuration=4.5&color=%233b82f6" />
 
```
  0xFBc5aDF16f1459f2D61ab87f26431A6b377Dba8C
  ```


<img align="left" alt="Ethereum" width="50px" src="https://www.readmecodegen.com/api/social-icon?name=monero&size=30&animation=fade&animationDuration=3.2" />
 
  ```
  882ViUtGxERFvajFFiR698B2DKcpKDDCgFfpb4DzJDHKevB2cgq9gYjVudj9d8Us5ahxPMVtz4sxXgpwjcSCVu8pLcrbBC5
  ```
