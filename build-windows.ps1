$ErrorActionPreference = "Stop"

python -m pip install -r requirements.txt
python -m PyInstaller --noconfirm --clean --windowed --name "Chanos War Room" --specpath build `
    --add-data "frontend;frontend" `
    --add-data "backend/database.json;backend" `
    --collect-all webview `
    desktop.py

Write-Host "Created dist\Chanos War Room\Chanos War Room.exe"
