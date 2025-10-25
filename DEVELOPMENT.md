# 🚀 Ticket to Now 開發指南

## 目錄結構說明

```
ticket-to-now/
├── index.html              # 主要 HTML 文件（單頁應用）
├── css/
│   └── style.css          # 所有樣式（極簡風格）
├── js/
│   └── index.js           # 核心邏輯（純 Vanilla JS）
├── data/
│   ├── tickets.json       # 示範票卡（9 張）
│   ├── tickets_full.json  # 完整票卡（500 張）
│   └── breath.json        # 呼吸引導資料（7 種）
├── assets/                # 圖片與多媒體資源
├── README.md             # 專案說明
├── GUIDE.md              # 使用指南
└── LICENSE               # MIT 授權
```

## 本地開發

### 方法 1: Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

訪問: http://localhost:8000

### 方法 2: Node.js serve

```bash
# 安裝 serve（全域）
npm install -g serve

# 運行
serve .

# 或指定端口
serve . -l 8000
```

### 方法 3: VS Code Live Server

1. 安裝 "Live Server" 擴充套件
2. 右鍵點擊 index.html
3. 選擇 "Open with Live Server"

## 修改與自訂

### 1. 修改票卡內容

編輯 `data/tickets.json` 或 `data/tickets_full.json`:

```json
{
  "id": 1,
  "theme": "行動流域",
  "title": "你的標題",
  "content": "你的內容",
  "question": "你的提問",
  "breath": "energize",
  "color": "#FFE8D6"
}
```

**breath 類型**:
- `energize` - 活力呼吸
- `gentle` - 溫柔呼吸
- `restore` - 修復呼吸
- `focus` - 專注呼吸
- `calm` - 平靜呼吸
- `hope` - 希望呼吸
- `gratitude` - 感恩呼吸

### 2. 修改呼吸模式

編輯 `data/breath.json`:

```json
{
  "custom": {
    "name": "自訂呼吸",
    "description": "描述",
    "pattern": {
      "inhale": 4,    // 吸氣秒數
      "hold": 4,      // 停留秒數
      "exhale": 6     // 吐氣秒數
    },
    "instructions": [
      { "time": 0, "text": "指示文字 1" },
      { "time": 3, "text": "指示文字 2" }
    ]
  }
}
```

### 3. 修改顏色主題

編輯 `css/style.css` 中的 CSS Variables:

```css
:root {
    --color-bg: #FFFFFF;              /* 背景色 */
    --color-text-primary: #1D1D1F;    /* 主要文字 */
    --color-text-secondary: #6E6E73;  /* 次要文字 */
    --color-accent: #D8E3E8;          /* 強調色 */
    --color-border: #E5E5E7;          /* 邊框色 */
    --color-hover: #F5F5F7;           /* 懸停色 */
}
```

### 4. 修改字體

在 `<head>` 中修改 Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=你的字體&display=swap" rel="stylesheet">
```

然後在 CSS 中更新:

```css
body {
    font-family: '你的字體', -apple-system, sans-serif;
}
```

### 5. 新增功能

在 `js/index.js` 中的 `TicketToNow` 類別新增方法:

```javascript
class TicketToNow {
    // ... 現有方法
    
    // 新增自訂方法
    yourCustomFunction() {
        // 你的邏輯
    }
}
```

## 資料格式規範

### 票卡資料必填欄位

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| id | number | 唯一識別碼 (1-500) | 127 |
| theme | string | 流域名稱 | "修復流域" |
| title | string | 票卡標題 | "先陪自己安靜片刻" |
| content | string | 票卡內容 | "再向外分享溫柔與在意。" |
| question | string | 反思提問 | "此刻我需要如何被理解？" |
| breath | string | 呼吸類型 | "gentle" |
| color | string | 主題色彩 (Hex) | "#D8E3E8" |

### 七大流域色彩規範

| 流域 | 色碼 | 象徵意義 |
|------|------|----------|
| 行動流域 | #FFE8D6 | 溫暖橘（活力、行動） |
| 共感流域 | #D8E3E8 | 淡藍灰（理解、連結） |
| 修復流域 | #E8F4E8 | 淡綠色（療癒、成長） |
| 接納流域 | #F0E8F4 | 淡紫色（包容、完整） |
| 專注流域 | #E8F0F8 | 淡天藍（清明、當下） |
| 希望流域 | #FFF4E8 | 淡黃色（光明、期待） |
| 平靜流域 | #E8F4F8 | 淡青色（安定、寧靜） |

## 效能優化建議

### 1. 圖片優化
- 使用 WebP 格式
- 壓縮圖片大小
- 使用 SVG 向量圖

### 2. 程式碼優化
- 最小化 CSS 和 JS
- 使用 CDN 加速字體
- 啟用瀏覽器快取

### 3. 載入優化
- 延遲載入非關鍵資源
- 預載入關鍵資源
- 使用 Service Worker

## 測試檢查清單

### 功能測試
- [ ] 手動輸入票號正常
- [ ] 隨機抽票功能正常
- [ ] 呼吸練習完整運作
- [ ] 收藏功能儲存成功
- [ ] 分享功能複製正確
- [ ] 畫面切換流暢

### 瀏覽器測試
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版
- [ ] iOS Safari
- [ ] Android Chrome

### 響應式測試
- [ ] 桌面 (1920x1080)
- [ ] 筆電 (1366x768)
- [ ] 平板橫向 (1024x768)
- [ ] 平板直向 (768x1024)
- [ ] 手機橫向 (667x375)
- [ ] 手機直向 (375x667)

## 部署流程

### GitHub Pages 部署

```bash
# 1. 建立 GitHub 倉庫
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ticket-to-now.git
git push -u origin main

# 2. 啟用 GitHub Pages
# 前往 Settings > Pages
# Source: main branch
# 儲存

# 3. 訪問
# https://yourusername.github.io/ticket-to-now/
```

### Vercel 部署

```bash
# 1. 安裝 Vercel CLI
npm i -g vercel

# 2. 登入
vercel login

# 3. 部署
vercel

# 4. 跟隨提示完成設定
```

### Netlify 部署

1. 將專案推送到 GitHub
2. 前往 [Netlify](https://www.netlify.com/)
3. 點擊 "New site from Git"
4. 選擇你的倉庫
5. 部署設定留空（靜態網站）
6. 點擊 "Deploy site"

## 常見問題排除

### Q: JSON 資料載入失敗

檢查:
1. 檔案路徑是否正確
2. JSON 格式是否有效（使用 JSONLint 驗證）
3. 是否使用 HTTP 伺服器（不能直接開啟 file://）

### Q: 呼吸動畫不流暢

解決:
1. 檢查 CSS 動畫是否衝突
2. 確認 requestAnimationFrame 正常執行
3. 檢查瀏覽器效能

### Q: LocalStorage 不工作

檢查:
1. 瀏覽器是否禁用 LocalStorage
2. 隱私模式可能限制儲存
3. 儲存空間是否已滿

### Q: 在手機上顯示異常

解決:
1. 檢查 meta viewport 設定
2. 測試不同螢幕尺寸
3. 使用 Chrome DevTools 模擬

## 貢獻指南

### 提交 Pull Request

1. Fork 專案
2. 建立特性分支
3. 遵循程式碼風格
4. 撰寫清晰的 commit 訊息
5. 測試所有功能
6. 提交 PR

### 程式碼風格

- 使用 2 空格縮排
- 使用有意義的變數名稱
- 加上適當的註解
- 遵循 ES6+ 語法

## 授權

MIT License - 可自由使用、修改、分發

---

需要協助？歡迎提交 [Issue](https://github.com/yourusername/ticket-to-now/issues)
