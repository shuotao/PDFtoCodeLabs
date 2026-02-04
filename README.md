# PDF to Codelabs Converter

將 PDF 文件轉換為 Google Codelabs 風格的互動式教學網頁。

## ⚠️ 重要說明

此工具**需要 GitHub Copilot CLI** 配合使用。單純使用 markitdown 有以下限制：

| 功能 | markitdown | 本工具 + Copilot |
|------|------------|------------------|
| PDF 文字提取 | ✅ 支援 | ✅ 支援 |
| 顏色標記提取 | ❌ 不支援 | ✅ AI 語義識別 |
| 圖片提取 | ❌ 不支援 | ✅ PyMuPDF 提取 |
| 裝飾圖過濾 | ❌ 不支援 | ✅ 自動過濾 |
| HTML 生成 | ❌ 不支援 | ✅ AI 生成 |

## 🚀 完整工作流程

### 步驟 1：執行預處理腳本

```bash
# 提取 Markdown 和圖片
./convert_to_codelabs.sh your-file.pdf
```

此腳本會：
- ✅ 使用 markitdown 轉換 PDF 為 Markdown
- ✅ 使用 PyMuPDF 提取圖片到 `images/` 資料夾
- ✅ 過濾裝飾性圖片（如藍色條紋）
- ❌ **不會**生成 HTML（需要 Copilot）

### 步驟 2：使用 Copilot CLI 生成網頁

```bash
copilot

> 請根據 CODELABS_SDD.md 規格，將 your-file.md 製作成 Codelabs 互動式網頁。
> 參考 templates/ 資料夾的模板，並為提示詞添加顏色標籤（Persona/Task/Context/Format）。
```

Copilot 會：
- ✅ 分析內容結構，拆分章節
- ✅ 根據語義識別顏色標籤
- ✅ 生成符合規格的 HTML
- ✅ 連結正確的圖片

## 📂 工具結構

```
pdf-to-codelabs/
├── README.md                 # 本文件（使用說明）
├── USER_MANUAL.md            # 詳細使用手冊
├── CODELABS_SDD.md          # 規格說明書（給 Copilot 參考）
├── convert_to_codelabs.sh    # 預處理腳本
├── templates/                # 模板檔案（給 Copilot 參考）
│   ├── codelabs.html        # HTML 骨架
│   ├── codelabs.css         # 樣式表
│   └── codelabs.js          # 互動腳本
└── markitdown/              # PDF 轉換工具（Git submodule）
```

## 📋 系統需求

- **必要**：GitHub Copilot CLI
- **必要**：Python 3.8+
- **套件**：markitdown, pymupdf, pdfplumber

## 🔧 安裝

```bash
# 安裝 Python 依賴
pip install markitdown pymupdf pdfplumber

# 確認 Copilot CLI 已安裝
copilot --version
```

## 📖 文件

| 文件 | 用途 | 讀者 |
|------|------|------|
| [USER_MANUAL.md](USER_MANUAL.md) | 完整使用教學 | 使用者 |
| [CODELABS_SDD.md](CODELABS_SDD.md) | 技術規格 | Copilot / 開發者 |
| [templates/](templates/) | 樣式模板 | Copilot |

## 🔄 為什麼需要 Copilot？

1. **顏色標籤識別**：PDF 中的顏色資訊在轉換時會丟失，需要 AI 根據語義重新識別
2. **章節拆分**：需要 AI 理解內容結構來決定如何拆分
3. **HTML 生成**：需要 AI 將 Markdown 轉換為互動式網頁
4. **圖片對應**：需要 AI 判斷圖片應該放在哪個章節

## 📄 授權

MIT License
