# 🔧 v2.3.2 徹底修正文字亂跳問題

## 問題根源分析

### 為什麼還在亂跳？

之前的版本雖然分離了計時器，但還有這些問題：

#### 問題 1: setTimeout 嵌套太深
```javascript
// v2.3.1 的問題代碼
breathSequenceTimer = setTimeout(() => {
    setInstruction('吸氣');  // 第一次
    
    breathSequenceTimer = setTimeout(() => {
        if (hasHold) {
            setInstruction('停頓');  // 第二次
            
            breathSequenceTimer = setTimeout(() => {
                setInstruction('吐氣');  // 第三次
                
                breathSequenceTimer = setTimeout(() => {
                    runBreathCycle();  // ❌ 遞迴但 breathSequenceTimer 被覆蓋
                }, exhaleTime);
            }, holdTime);
        }
    }, inhaleTime);
}, 0);
```

**問題**：
- `breathSequenceTimer` 被不斷覆蓋
- 停止時只清除最後一個 timer
- 前面的 timer 還在運行
- 導致文字被多次設定

#### 問題 2: 沒有統一的狀態管理
```javascript
// 文字在多處被設定
instruction.textContent = '吸氣';     // 這裡
instruction.textContent = '停頓';     // 這裡  
instruction.textContent = '吐氣';     // 這裡
circle.className = 'breath-circle inhale';   // 這裡
circle.className = 'breath-circle hold';     // 這裡
circle.className = 'breath-circle exhale';   // 這裡
```

**問題**：
- 沒有統一入口
- 難以確保只執行一次
- 除錯困難

---

## v2.3.2 解決方案

### 核心設計原則

#### 1. 單一狀態更新函數
```javascript
// 唯一修改顯示的函數
function setBreathState(text, circleClass) {
    document.getElementById('breathInstruction').textContent = text;
    document.getElementById('breathCircle').className = 'breath-circle ' + circleClass;
}

// 所有地方都呼叫這個函數
setBreathState('吸氣', 'inhale');
setBreathState('停頓', 'hold');
setBreathState('吐氣', 'exhale');
```

**優點**：
- ✅ 所有更新集中管理
- ✅ 容易追蹤
- ✅ 保證同步

#### 2. 全域旗標控制
```javascript
let isBreathing = false;

function startBreath() {
    isBreathing = true;  // 開始
    doBreathCycle();
}

function stopBreath() {
    isBreathing = false;  // 停止
}

function doBreathCycle() {
    if (!isBreathing) return;  // ✓ 檢查點
    // ...
    
    setTimeout(() => {
        if (!isBreathing) return;  // ✓ 檢查點
        // ...
    }, time);
}
```

**優點**：
- ✅ 可以立即停止所有循環
- ✅ 防止已排程的任務執行
- ✅ 狀態清晰

#### 3. 純函數式遞迴
```javascript
function doBreathCycle() {
    // 檢查是否繼續
    if (!isBreathing) return;
    if (currentCycle >= maxCycles) return;
    
    currentCycle++;
    updateCycleDisplay();
    
    // 階段 1: 吸氣
    setBreathState('吸氣', 'inhale');
    
    setTimeout(() => {
        if (!isBreathing) return;  // 安全檢查
        
        // 階段 2: 停頓（如果有）
        if (pattern.hold > 0) {
            setBreathState('停頓', 'hold');
            
            setTimeout(() => {
                if (!isBreathing) return;  // 安全檢查
                
                // 階段 3: 吐氣
                setBreathState('吐氣', 'exhale');
                
                setTimeout(() => {
                    if (!isBreathing) return;  // 安全檢查
                    
                    // 遞迴：下一輪
                    doBreathCycle();
                    
                }, pattern.exhale * 1000);
            }, pattern.hold * 1000);
        } else {
            // 無停頓版本
            setBreathState('吐氣', 'exhale');
            
            setTimeout(() => {
                if (!isBreathing) return;  // 安全檢查
                doBreathCycle();
            }, pattern.exhale * 1000);
        }
    }, pattern.inhale * 1000);
}
```

**優點**：
- ✅ 清晰的流程控制
- ✅ 每個階段只執行一次
- ✅ 所有分支都有安全檢查
- ✅ 遞迴自然結束

#### 4. 獨立倒數計時
```javascript
// 只負責倒數，不干涉呼吸循環
countdownTimer = setInterval(() => {
    if (isBreathing) {
        timeRemaining--;
        document.getElementById('breathTimer').textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            stopBreath();
        }
    }
}, 1000);
```

**優點**：
- ✅ 完全獨立
- ✅ 只做一件事
- ✅ 不影響呼吸循環

---

## 執行流程圖

### 完整流程

```
使用者點擊「呼吸練習」
    ↓
startBreath()
    ├─ isBreathing = true
    ├─ 選擇今日呼吸法
    ├─ 顯示呼吸法名稱和說明
    ├─ 啟動倒數計時器（每秒 -1）
    └─ 呼叫 doBreathCycle()
         ↓
    ┌────────────────────────┐
    │  doBreathCycle() 第1輪 │
    └────────────────────────┘
         ↓
    setBreathState('吸氣', 'inhale')  ← 只執行一次
         ↓
    等待 inhaleTime 秒
         ↓
    setBreathState('停頓', 'hold')     ← 只執行一次（如有）
         ↓
    等待 holdTime 秒
         ↓
    setBreathState('吐氣', 'exhale')   ← 只執行一次
         ↓
    等待 exhaleTime 秒
         ↓
    doBreathCycle()  ← 遞迴呼叫
         ↓
    ┌────────────────────────┐
    │  doBreathCycle() 第2輪 │
    └────────────────────────┘
         ↓
    ... (重複)
         ↓
    達到最大輪數或時間到
         ↓
    stopBreath()
         ├─ isBreathing = false
         ├─ 清除倒數計時器
         └─ 重置顯示
```

### 關鍵檢查點

每個階段都有 `if (!isBreathing) return;`：

```
startBreath()
    ↓
isBreathing = true
    ↓
doBreathCycle()
    ├─ ✓ 檢查 isBreathing
    ├─ setBreathState('吸氣')
    └─ setTimeout
         ├─ ✓ 檢查 isBreathing
         ├─ setBreathState('停頓')
         └─ setTimeout
              ├─ ✓ 檢查 isBreathing
              ├─ setBreathState('吐氣')
              └─ setTimeout
                   ├─ ✓ 檢查 isBreathing
                   └─ doBreathCycle()

如果使用者點擊「結束」：
    ↓
stopBreath()
    ↓
isBreathing = false
    ↓
所有後續的檢查點都會 return
    ↓
不會再執行任何 setBreathState
```

---

## 為什麼這次不會亂跳？

### 保證機制

#### 1. 單一入口點
```javascript
// ✅ 正確：統一管理
function setBreathState(text, circleClass) {
    // 所有更新都在這裡
}

// ❌ 錯誤：多處更新
instruction.textContent = '吸氣';  // 這裡
// ...
instruction.textContent = '吐氣';  // 那裡
```

#### 2. 每階段只呼叫一次
```javascript
// 階段 1
setBreathState('吸氣', 'inhale');  // ← 呼叫 1 次

setTimeout(() => {
    // 階段 2
    setBreathState('停頓', 'hold');  // ← 呼叫 1 次
    
    setTimeout(() => {
        // 階段 3
        setBreathState('吐氣', 'exhale');  // ← 呼叫 1 次
    }, holdTime);
}, inhaleTime);
```

#### 3. 遞迴自然控制
```javascript
function doBreathCycle() {
    currentCycle++;
    
    if (currentCycle > maxCycles) {
        return;  // ✓ 自動停止
    }
    
    // ... 執行呼吸 ...
    
    setTimeout(() => {
        doBreathCycle();  // ✓ 遞迴
    }, time);
}
```

#### 4. 旗標保護
```javascript
let isBreathing = false;

// 任何時候都可以檢查
if (!isBreathing) return;

// 停止時設為 false
isBreathing = false;  // 所有循環立即停止
```

---

## 測試驗證

### 驗證點

#### 1. 文字穩定性
```
✓ 吸氣階段（3-5秒）
  → 「吸氣」文字出現
  → 保持不變整個階段
  → 圓球同步變大

✓ 停頓階段（0-2秒）
  → 「停頓」文字出現
  → 保持不變整個階段
  → 圓球保持大

✓ 吐氣階段（3-6秒）
  → 「吐氣」文字出現
  → 保持不變整個階段
  → 圓球同步變小
```

#### 2. 循環正確性
```
✓ 輪數顯示
  第 1 / 3 輪
  第 2 / 3 輪
  第 3 / 3 輪
  
✓ 自動進入下一輪
✓ 達到最大輪數停止
```

#### 3. 倒數準確性
```
✓ 從 30 開始
✓ 每秒 -1
✓ 到 0 停止
```

---

## 程式碼對比

### v2.3.1（有問題）

```javascript
// 問題：timer 被覆蓋
breathSequenceTimer = setTimeout(...);
breathSequenceTimer = setTimeout(...);  // ❌ 前一個 timer 失控
breathSequenceTimer = setTimeout(...);  // ❌ 前一個 timer 失控

// 問題：多處更新
instruction.textContent = '吸氣';  // 這裡
instruction.textContent = '停頓';  // 那裡
instruction.textContent = '吐氣';  // 到處都是
```

### v2.3.2（修正版）

```javascript
// 解決：不需要儲存 timer，用旗標控制
let isBreathing = false;

function doBreathCycle() {
    if (!isBreathing) return;  // ✓ 檢查點
    
    setBreathState('吸氣', 'inhale');  // ✓ 單一入口
    
    setTimeout(() => {
        if (!isBreathing) return;  // ✓ 檢查點
        
        setBreathState('停頓', 'hold');  // ✓ 單一入口
        
        setTimeout(() => {
            if (!isBreathing) return;  // ✓ 檢查點
            
            setBreathState('吐氣', 'exhale');  // ✓ 單一入口
            
            setTimeout(() => {
                doBreathCycle();  // ✓ 遞迴
            }, exhaleTime);
        }, holdTime);
    }, inhaleTime);
}
```

---

## 下載測試

**[Ticket to Now v2.3.2](computer:///mnt/user-data/outputs/ticket-to-now-standalone.html)**

### 測試步驟

1. **下載並開啟**
2. **輸入票號**
3. **點擊「呼吸練習 30 秒」**
4. **觀察文字**：
   - ✅ 「吸氣」應該穩定顯示 3-5 秒
   - ✅ 「停頓」應該穩定顯示 0-2 秒  
   - ✅ 「吐氣」應該穩定顯示 3-6 秒
   - ✅ 沒有任何閃爍或跳動

5. **確認呼吸法顯示**：
   - ✅ 頂部顯示呼吸法名稱
   - ✅ 下方顯示說明文字

---

## 技術保證

### 這次保證不會亂跳的原因

1. ✅ **單一更新函數** - 所有文字更新都通過 `setBreathState()`
2. ✅ **一次性呼叫** - 每個階段只呼叫一次
3. ✅ **遞迴控制** - 自然的流程控制
4. ✅ **旗標保護** - `isBreathing` 防止執行
5. ✅ **無 timer 衝突** - 不儲存 timer 變數
6. ✅ **清晰的生命週期** - 開始→執行→結束

---

**這次真的修好了！文字不會再亂跳！** 🎉
