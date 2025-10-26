#!/bin/bash
echo "========================================"
echo "  Ticket to Now - 本地伺服器"
echo "========================================"
echo ""
echo "正在啟動伺服器..."
echo "請開啟瀏覽器訪問: http://localhost:8000"
echo ""
python3 -m http.server 8000
