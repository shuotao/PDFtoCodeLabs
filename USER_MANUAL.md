# PDF 轉 Codelabs 網頁使用手冊

## ⚠️ 重要前提

本工具**必須配合 GitHub Copilot CLI 使用**。

### 為什麼需要 Copilot？

| 任務 | 自動化腳本 | Copilot AI |
|------|------------|------------|
| PDF → Markdown | ✅ markitdown | - |
| 圖片提取 | ✅ PyMuPDF | - |
| 裝飾圖過濾 | ✅ 腳本過濾 | - |
| 章節拆分 | ❌ | ✅ 語義分析 |
| 顏色標籤識別 | ❌ | ✅ 語義分析 |
| HTML 生成 | ❌ | ✅ 根據規格生成 |
| 圖片位置對應 | ❌ | ✅ 內容理解 |

---

## 🎯 快速開始

將任何 PDF 文件轉換為 Google Codelabs 風格的互動式教學網頁。

---

## 📋 使用方式

### 方法一：一鍵指令（推薦）

將 PDF 檔案放入工作資料夾後，對 Copilot CLI 說：

```
@your-file.pdf 請將此 PDF 轉換為 Codelabs 互動式教學網頁，
參考 CODELABS_SDD.md 規格和 templates/ 模板
```

或更詳細的指令：

```
@your-file.pdf 請執行以下任務：
1. 將 PDF 轉換為 Markdown
2. 使用 PyMuPDF 提取圖片（過濾 255KB 裝飾圖）
3. 分析內容結構，拆分為適當章節
4. 根據 CODELABS_SDD.md 製作互動式 HTML
5. 識別提示詞並添加顏色標籤（Persona/Task/Context/Format）
```

### 方法二：腳本 + Copilot（更可靠）

```bash
# 步驟 1：執行預處理腳本
./convert_to_codelabs.sh your-file.pdf

# 步驟 2：啟動 Copilot 完成 HTML
copilot
> 請根據 CODELABS_SDD.md 將 your-file.md 製作成 Codelabs 網頁
```

---

## 🛠️ 環境需求

### 必要工具

| 工具 | 用途 | 安裝方式 |
|------|------|----------|
| Python 3.8+ | 執行轉換腳本 | 系統內建或 `brew install python` |
| markitdown | PDF 轉 Markdown | `pip install markitdown` |
| pymupdf | 圖片提取 | `pip install pymupdf` |
| pdfimages | 備用圖片提取 | `brew install poppler` |

### 自動安裝腳本

```bash
# 建立虛擬環境
python3 -m venv venv
source venv/bin/activate

# 安裝依賴
pip install markitdown pymupdf pdfplumber
```

---

## 📂 輸出檔案結構

轉換完成後，資料夾結構如下：

```
your-project/
├── Your_Codelabs.html      # 互動式教學網頁
├── images/                  # 提取的圖片
│   ├── page1_img1.jpeg
│   ├── page2_img1.jpeg
│   └── ...
├── original.pdf            # 原始 PDF
└── PROJECT_REPORT.md       # 專案報告（可選）
```

---

## 🎨 Codelabs 網頁功能

生成的網頁包含：

### 導航功能
- ⬅️ **上一章** / **下一章** ➡️ 按鈕
- 📊 進度指示器（目前章節 / 總章節數）
- 🎯 點擊側邊欄直接跳轉章節

### 互動元素
- 📦 可展開/收合的提示詞框
- ✅ 成功案例高亮框
- 💡 提示資訊框
- ⚠️ 警告框

### 樣式標籤（用於提示詞）
- 🔴 **Persona**（紅色）- 角色定義
- 🔵 **Task**（藍色）- 任務指令
- 🟢 **Context**（綠色）- 背景資訊
- 🟡 **Format**（黃色）- 輸出格式

---

## ⚠️ 已知問題與解決方案

### 問題 1：圖片顯示為藍色條紋

**原因**：PDF 中的裝飾性背景元素被誤提取為圖片

**解決方案**：
```
請檢查 images/ 資料夾中是否有 255KB 的重複圖片，
這些是裝飾條紋，請使用 pymupdf 重新提取並過濾
```

### 問題 2：顏色標記文字丟失

**原因**：markitdown 不保留文字顏色資訊

**解決方案**：
```
請使用 PyMuPDF 提取 PDF 中的顏色資訊：
1. 識別帶顏色的文字區塊
2. 根據顏色添加對應的 HTML 標籤類別
```

### 問題 3：章節拆分不正確

**解決方案**：
```
請根據 PDF 的目錄結構重新拆分章節，
確保每個章節有明確的標題和內容邊界
```

---

## 📝 自訂選項

### 章節拆分規則

告訴 Copilot 你偏好的拆分方式：

```
請將 PDF 轉換為 Codelabs，並按以下規則拆分章節：
- 每個 H1 標題為新章節
- 每個案例研究為獨立章節
- 總結和附錄各為一章
```

### 樣式自訂

```
請使用以下品牌顏色：
- 主色：#1a73e8
- 強調色：#ea4335
- 背景色：#f8f9fa
```

### 圖片處理

```
請處理圖片：
- 過濾小於 5KB 的圖標
- 統一縮放至最大寬度 800px
- 添加圖片說明文字
```

---

## 🚀 進階用法

### 批次處理多個 PDF

```
請將資料夾中所有 PDF 檔案轉換為 Codelabs 網頁：
- 每個 PDF 生成獨立的 HTML
- 建立索引頁連結所有教學
```

### 多語言支援

```
@english.pdf 請將此 PDF 轉換為 Codelabs，
並同時生成繁體中文版本
```

### 匯出格式

```
請將 PDF 轉換為 Codelabs，並額外匯出：
- 純 HTML（無需伺服器）
- Markdown 版本
- PDF 講義版本
```

---

## 📊 品質檢查清單

轉換完成後，請 Copilot 執行檢查：

```
請檢查生成的 Codelabs 網頁：
1. 所有圖片是否正常顯示
2. 章節導航是否正常運作
3. 提示詞標籤顏色是否正確
4. 是否有重複或遺漏的內容
5. 連結是否可點擊
```

---

## 💡 最佳實踐

1. **PDF 品質**：使用文字版 PDF，避免掃描圖片版
2. **檔案命名**：使用英文或無空格的檔名
3. **圖片優化**：轉換後檢查圖片大小，必要時壓縮
4. **內容審核**：AI 生成的結構可能需要微調
5. **測試瀏覽**：在瀏覽器中實際操作測試導航功能

---

## 📞 常用指令速查

| 任務 | 指令 |
|------|------|
| 完整轉換 | `@file.pdf 轉換為 Codelabs 網頁` |
| 只提取圖片 | `@file.pdf 提取所有圖片到 images/` |
| 只轉 Markdown | `@file.pdf 轉換為 Markdown` |
| 檢查圖片 | `檢查 HTML 中的圖片是否都存在` |
| 修正標籤 | `檢查並修正提示詞的顏色標籤` |
| 清理檔案 | `整理資料夾，只保留必要檔案` |
| 生成報告 | `生成專案報告 PROJECT_REPORT.md` |

---

*使用手冊版本：1.0*
*最後更新：2026-02-04*
