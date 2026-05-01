# OSINT War Room Docker Setup Guide

## Building the Docker Image

```bash
docker build -t osint-war-room:latest .
```

## Running the Container

### Basic Usage (with AISStream API Key)

```bash
docker run -d \
  -p 8000:8000 \
  -e AISSTREAM_API_KEY="your_aisstream_api_key_here" \
  --name osint-war-room \
  osint-war-room:latest
```

### Complete Example (with all API keys and persistent storage)

The application requires several API credentials depending on which features you want to enable. It also uses `database.json` to store settings, alerts, and cache, which should persist across container restarts:

```bash
docker run -d \
  -p 8000:8000 \
  -v osint-data:/app/backend \
  -e AISSTREAM_API_KEY="your_aisstream_key" \
  -e ACLED_EMAIL="your_acled_email" \
  -e ACLED_PASSWORD="your_acled_password" \
  --name osint-war-room \
  osint-war-room:latest
```

Or using a bind mount (if you prefer host directory):

```bash
docker run -d \
  -p 8000:8000 \
  -v /path/to/local/backend:/app/backend \
  -e AISSTREAM_API_KEY="your_aisstream_key" \
  -e ACLED_EMAIL="your_acled_email" \
  -e ACLED_PASSWORD="your_acled_password" \
  --name osint-war-room \
  osint-war-room:latest
```

## Environment Variables

The following environment variables should be passed at runtime:

| Variable | Description | Source |
|----------|-------------|--------|
| `AISSTREAM_API_KEY` | AIS maritime tracking API key | https://aisstream.io/ |
| `ACLED_EMAIL` | ACLED account email | Armed Conflict Location & Event Data Project |
| `ACLED_PASSWORD` | ACLED account password | Same as above |

## Data Persistence (database.json)

The application stores user settings, alert history, and cached data in `backend/database.json`. To persist this data across container restarts, use either a **Docker volume** or **bind mount**:

### Option 1: Docker Named Volume (Recommended)
Best for most use cases. Data is managed by Docker:

```bash
docker run -d \
  -p 8000:8000 \
  -v osint-data:/app/backend \
  -e AISSTREAM_API_KEY="your_key" \
  --name osint-war-room \
  osint-war-room:latest
```

List Docker volumes:
```bash
docker volume ls
docker volume inspect osint-data
```

### Option 2: Bind Mount (Host Directory)
Better if you want direct access to files on your host system:

```bash
mkdir -p ~/osint-war-room/backend
docker run -d \
  -p 8000:8000 \
  -v ~/osint-war-room/backend:/app/backend \
  -e AISSTREAM_API_KEY="your_key" \
  --name osint-war-room \
  osint-war-room:latest
```

Your `database.json` will be at `~/osint-war-room/backend/database.json`

## Updating the Application Code

To use your own modified version:

```bash
docker build -t osint-war-room:custom .
docker run -d \
  -p 8000:8000 \
  -e AISSTREAM_API_KEY="your_key" \
  -e ACLED_EMAIL="your_email" \
  -e ACLED_PASSWORD="your_password" \
  --name osint-war-room-custom \
  osint-war-room:custom
```

## Accessing the Application

Once running, access the dashboard at:
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:8000/api/status

## Checking Container Logs

```bash
docker logs osint-war-room
```

## Stopping the Container

```bash
docker stop osint-war-room
docker rm osint-war-room
```

## Using Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  osint-war-room:
    build: .
    container_name: osint-war-room
    ports:
      - "8000:8000"
    volumes:
      - osint-data:/app/backend
    environment:
      - AISSTREAM_API_KEY=${AISSTREAM_API_KEY}
      - ACLED_EMAIL=${ACLED_EMAIL}
      - ACLED_PASSWORD=${ACLED_PASSWORD}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

volumes:
  osint-data:
```

Then create a `.env` file in the same directory:

```
AISSTREAM_API_KEY=your_aisstream_key_here
ACLED_EMAIL=your_acled_email_here
ACLED_PASSWORD=your_acled_password_here
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Notes

- The Dockerfile uses `python:3.11-slim` as the base image (lightweight)
- All Python dependencies from `requirements.txt` are installed during build
- The application runs on port 8000 with `uvicorn`
- A health check is configured to monitor the `/api/status` endpoint
- API keys should be passed as environment variables at runtime, not baked into the image
- The app serves both the backend API and frontend on the same port

## Troubleshooting

### Container fails to start
Check logs: `docker logs osint-war-room`

### Health check failing
Ensure the backend is fully initialized (GDELT data may take 10-30 seconds on first load)

### API key not being recognized
Verify the environment variable names match those expected by `backend/main.py` and `backend/api/` modules. You may need to update the application code to read these environment variables if they currently use hardcoded values or .env files.