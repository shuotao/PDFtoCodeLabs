# Codelabs 網頁規格說明書 (SDD)
# Software Design Document for Codelabs Generator

## 📋 文件資訊

| 項目 | 內容 |
|------|------|
| 文件名稱 | Codelabs 互動式網頁規格說明書 |
| 版本 | 1.0 |
| 建立日期 | 2026-02-04 |
| 適用範圍 | PDF 轉 Codelabs 互動式教學網頁 |

---

## 1. 概述

### 1.1 目的
定義從 PDF 文件轉換為 Google Codelabs 風格互動式教學網頁的技術規格。

### 1.2 範圍
- 輸入：任意 PDF 文件
- 輸出：單頁 HTML 互動式教學網頁 + 圖片資料夾

---

## 2. 輸出檔案結構規格

```
output/
├── [ProjectName]_Codelabs.html    # 主要網頁檔案
├── images/                         # 圖片資料夾
│   ├── page[N]_img[M].jpeg        # 提取的圖片
│   └── ...
└── README.md                       # 專案說明（可選）
```

---

## 3. HTML 結構規格

### 3.1 基本結構

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[教學標題]</title>
    <style>/* 內嵌 CSS */</style>
</head>
<body>
    <div class="codelab-container">
        <aside class="sidebar"><!-- 側邊欄導航 --></aside>
        <main class="content"><!-- 章節內容 --></main>
    </div>
    <script>/* 內嵌 JavaScript */</script>
</body>
</html>
```

### 3.2 章節結構

每個章節使用以下結構：

```html
<section class="chapter" data-chapter="[N]">
    <h2>[章節標題]</h2>
    <p>[章節內容]</p>
    <!-- 提示詞框、圖片、資訊框等 -->
</section>
```

---

## 4. CSS 樣式規格

### 4.1 色彩系統

| 用途 | 變數名稱 | 預設值 | 說明 |
|------|----------|--------|------|
| 主色 | --primary-color | #1a73e8 | Google 藍 |
| 成功 | --success-color | #34a853 | Google 綠 |
| 警告 | --warning-color | #fbbc04 | Google 黃 |
| 錯誤 | --error-color | #ea4335 | Google 紅 |
| 背景 | --background-color | #f8f9fa | 淺灰 |
| 文字 | --text-color | #202124 | 深灰 |

### 4.2 提示詞標籤顏色

| 元素類型 | CSS Class | 背景色 | 文字色 |
|----------|-----------|--------|--------|
| Persona（角色）| `.tag-persona` | #fce4ec | #c62828 |
| Task（任務）| `.tag-task` | #e3f2fd | #1565c0 |
| Context（背景）| `.tag-context` | #e8f5e9 | #2e7d32 |
| Format（格式）| `.tag-format` | #fff8e1 | #f57f17 |

### 4.3 元件樣式

#### 提示詞框 (.prompt-box)
```css
.prompt-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    font-family: 'Consolas', monospace;
}
```

#### 成功框 (.success-box)
```css
.success-box {
    background-color: #e8f5e9;
    border-left: 4px solid #4caf50;
    padding: 15px;
    border-radius: 8px;
}
```

#### 資訊框 (.info-box)
```css
.info-box {
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
    padding: 15px;
    border-radius: 8px;
}
```

#### 警告框 (.warning-box)
```css
.warning-box {
    background-color: #fff3e0;
    border-left: 4px solid #ff9800;
    padding: 15px;
    border-radius: 8px;
}
```

---

## 5. JavaScript 功能規格

### 5.1 必要功能

| 功能 | 函數名稱 | 說明 |
|------|----------|------|
| 章節導航 | `showChapter(n)` | 顯示指定章節 |
| 上一章 | `prevChapter()` | 導航到上一章 |
| 下一章 | `nextChapter()` | 導航到下一章 |
| 進度更新 | `updateProgress()` | 更新進度指示器 |

### 5.2 導航實作

```javascript
let currentChapter = 1;
const totalChapters = document.querySelectorAll('.chapter').length;

function showChapter(n) {
    // 隱藏所有章節
    document.querySelectorAll('.chapter').forEach(ch => {
        ch.style.display = 'none';
    });
    
    // 顯示目標章節
    const target = document.querySelector(`[data-chapter="${n}"]`);
    if (target) {
        target.style.display = 'block';
        currentChapter = n;
        updateProgress();
        window.scrollTo(0, 0);
    }
}

function updateProgress() {
    const indicator = document.querySelector('.progress-indicator');
    indicator.textContent = `${currentChapter} / ${totalChapters}`;
}
```

---

## 6. 圖片處理規格

### 6.1 提取規則

| 規則 | 說明 |
|------|------|
| 最小尺寸 | > 5KB（過濾小圖標）|
| 過濾重複 | 使用 MD5 哈希值比對 |
| 過濾裝飾 | 排除已知的裝飾圖案（如 255KB 藍色條紋）|
| 命名規則 | `page[頁碼]_img[序號].[副檔名]` |

### 6.2 圖片嵌入格式

```html
<div class="image-container">
    <img src="images/page[N]_img[M].jpeg" 
         alt="[圖片描述]"
         style="max-width: 100%; height: auto; border-radius: 8px;">
</div>
```

---

## 7. 內容標記規格

### 7.1 提示詞標記語法

原始 PDF 中的顏色文字應轉換為：

```html
<span class="component-tag tag-persona">我是 [角色]</span>
<span class="component-tag tag-task">請幫我 [任務]</span>
<span class="component-tag tag-context">基於 @[檔案名稱]</span>
<span class="component-tag tag-format">以表格形式呈現</span>
```

### 7.2 標籤識別規則

| 標籤類型 | 識別特徵 |
|----------|----------|
| Persona | "我是..."、"你是..."、"作為..." |
| Task | 動詞開頭："建立"、"撰寫"、"生成"、"幫我" |
| Context | 包含 "@[檔案]"、背景說明、條件描述 |
| Format | "以...格式"、"包括..."、"列出..." |

---

## 8. 章節拆分規格

### 8.1 預設拆分規則

| 優先級 | 規則 | 說明 |
|--------|------|------|
| 1 | H1 標題 | 每個 H1 為新章節 |
| 2 | 明確分隔 | "---" 或頁面分隔符 |
| 3 | 主題變化 | 內容主題明顯轉換 |

### 8.2 建議章節結構

1. **概述/介紹** - 背景和目標
2. **快速開始** - 基本概念
3-N. **主題章節** - 核心內容
N+1. **進階技巧** - 深入主題
N+2. **總結** - 回顧和下一步

---

## 9. 響應式設計規格

### 9.1 斷點定義

| 斷點 | 寬度 | 說明 |
|------|------|------|
| 桌面 | > 1024px | 側邊欄固定顯示 |
| 平板 | 768px - 1024px | 側邊欄可收合 |
| 手機 | < 768px | 側邊欄隱藏，漢堡選單 |

### 9.2 手機版調整

```css
@media (max-width: 768px) {
    .sidebar { display: none; }
    .content { margin-left: 0; padding: 15px; }
    .prompt-box { font-size: 14px; }
}
```

---

## 10. 效能規格

| 項目 | 目標 |
|------|------|
| HTML 檔案大小 | < 500KB |
| 單張圖片大小 | < 200KB |
| 首次載入時間 | < 3 秒 |
| 無外部依賴 | 純 HTML/CSS/JS |

---

## 11. 相容性規格

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

---

## 附錄 A：完整 CSS 模板

參見 `templates/codelabs.css`

## 附錄 B：完整 JavaScript 模板

參見 `templates/codelabs.js`

## 附錄 C：HTML 骨架模板

參見 `templates/codelabs.html`

---

*文件結束*
