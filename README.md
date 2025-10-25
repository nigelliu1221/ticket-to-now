# Ticket to Now｜通往當下的票

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> 一個簡單輸入，就能讓你回到當下。

## 📖 專案簡介

**Ticket to Now** 是一個低摩擦正念互動平台，介於「藝術 × 心理練習 × 程式詩」之間。將傳統的「撕日票」升級為「抽當下」的數位正念儀式。

### 核心理念

- 🎫 **無需登入** - 零摩擦體驗
- 🧘 **即時回饋** - 輸入票號立即獲得當下語句
- 💨 **呼吸引導** - 整合 1 分鐘正念練習
- 🎨 **極簡美學** - Apple 風格設計語言
- 🔒 **隱私優先** - 無追蹤，所有資料存於本地

## ✨ 功能特色

### 1. 票號抽取系統
- 手動輸入票號（1-500）
- 隨機抽票功能
- 每日抽卡記錄

### 2. 七大心理旅線
- 🚀 **行動流域** - 激發行動力
- 🤝 **共感流域** - 促進連結
- 🌱 **修復流域** - 療癒創傷
- 🙏 **接納流域** - 自我接納
- 🎯 **專注流域** - 回到當下
- ✨ **希望流域** - 展望未來
- 🕊️ **平靜流域** - 內心安定

### 3. 呼吸練習模式
- 7 種呼吸模式（溫柔、活力、修復、專注、平靜、希望、感恩）
- 動態視覺引導
- 1 分鐘計時器
- 沉浸式暗色介面

### 4. 收藏與分享
- 本地收藏功能
- 一鍵分享文字
- 複製到剪貼簿

## 🚀 快速開始

### 線上體驗

訪問 [GitHub Pages 部署連結](#) 立即體驗

### 本地運行

```bash
# 1. 克隆專案
git clone https://github.com/yourusername/ticket-to-now.git

# 2. 進入目錄
cd ticket-to-now

# 3. 使用任何 HTTP 伺服器運行
# 方法 1: 使用 Python
python -m http.server 8000

# 方法 2: 使用 Node.js
npx serve

# 4. 在瀏覽器開啟
# http://localhost:8000
```

## 📁 專案結構

```
ticket-to-now/
├── index.html              # 主要 HTML 文件
├── css/
│   └── style.css          # 極簡樣式表
├── js/
│   └── index.js           # 核心邏輯
├── data/
│   ├── tickets.json       # 500 張票資料
│   └── breath.json        # 呼吸引導資料
├── assets/                # 圖片與資源
└── README.md             # 專案說明
```

## 🎨 設計系統

### 色彩語系
- **主色調**: 白底 × 極淡灰
- **輔助色**: 粉灰藍（#D8E3E8）
- **主題色**: 根據流域動態變化

### 字體系統
- 中文: Noto Sans TC
- 西文: SF Pro Display
- 權重: 300（Light）、400（Regular）、500（Medium）

### 互動動效
- 淡入淡出過渡
- 呼吸圓形動畫
- 流暢的畫面切換

## 💻 技術架構

### 前端技術
- **框架**: Vanilla JavaScript (ES6+)
- **樣式**: CSS3 + CSS Variables
- **資料**: JSON 檔案
- **儲存**: LocalStorage API

### 瀏覽器支援
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 響應式設計
- 桌面優先設計
- 平板完美適配
- 手機流暢體驗

## 🗂️ 資料格式

### 票卡資料格式 (tickets.json)

```json
{
  "id": 127,
  "theme": "修復流域",
  "title": "先陪自己安靜片刻",
  "content": "再向外分享溫柔與在意。",
  "question": "此刻我需要如何被理解，才能感覺安心？",
  "breath": "gentle",
  "color": "#D8E3E8"
}
```

### 呼吸引導格式 (breath.json)

```json
{
  "gentle": {
    "name": "溫柔呼吸",
    "description": "適合需要被理解與修復的時刻",
    "pattern": {
      "inhale": 4,
      "hold": 4,
      "exhale": 6
    },
    "instructions": [...]
  }
}
```

## 🔧 自訂與擴展

### 新增票卡

1. 編輯 `data/tickets.json`
2. 按照格式新增票卡物件
3. 確保 ID 唯一且在 1-500 範圍內

### 新增呼吸模式

1. 編輯 `data/breath.json`
2. 定義新的呼吸模式
3. 設定吸氣、停留、吐氣時間

### 自訂樣式

修改 `css/style.css` 中的 CSS Variables:

```css
:root {
    --color-bg: #FFFFFF;
    --color-text-primary: #1D1D1F;
    --color-accent: #D8E3E8;
    /* 更多變數... */
}
```

## 📈 使用場景

### 個人使用
- 晨間正念練習
- 工作間隙放鬆
- 睡前靜心儀式

### 配合紙本
1. 撕下紙本日票
2. 輸入票號到網站
3. 獲得延伸引導與呼吸練習

### 社群活動
- #今天抽到第幾張 主題挑戰
- 分享語句到社群媒體
- KOL 正念推廣活動

## 🚢 部署指南

### GitHub Pages 部署

```bash
# 1. 推送到 GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. 在 GitHub 倉庫設定中
# Settings > Pages > Source > main branch

# 3. 訪問
# https://yourusername.github.io/ticket-to-now/
```

### Vercel 部署

```bash
# 1. 安裝 Vercel CLI
npm i -g vercel

# 2. 部署
vercel

# 3. 按照提示完成設定
```

## 🎯 未來規劃

- [ ] 多語言支援（英文、日文）
- [ ] PWA 支援（離線可用）
- [ ] 語音引導呼吸練習
- [ ] 每日推送提醒
- [ ] 統計與分析儀表板
- [ ] 自訂票卡生成器
- [ ] 社群分享圖片自動生成

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程

1. Fork 本專案
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權協議

本專案採用 MIT 授權協議 - 詳見 [LICENSE](LICENSE) 文件

## 🙏 致謝

- 設計靈感來自 Apple 的極簡美學
- 正念理念參考 Headspace 與 Calm
- 感謝所有測試與回饋的朋友們

## 📮 聯絡方式

- 專案維護者: [Your Name]
- Email: your.email@example.com
- 問題回報: [GitHub Issues](https://github.com/yourusername/ticket-to-now/issues)

---

**Ticket to Now** - 每個當下，都值得被溫柔對待。

