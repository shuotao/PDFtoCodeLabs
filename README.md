# PDF to Codelabs Converter

將 PDF 文件轉換為 Google Codelabs 風格的互動式教學網頁。

## ⚠️ 重要說明

此工具**需要 AI 終端機助手**配合使用。支援以下工具：

| AI CLI 工具 | 安裝方式 | 說明 |
|-------------|----------|------|
| **GitHub Copilot CLI** | 內建於 GitHub CLI | GitHub 官方 AI 助手 |
| **Gemini CLI** | `npm i -g @google/gemini-cli` | Google Gemini 3，免費 1000 次/天 |
| **OpenAI Codex CLI** | `npm i -g @openai/codex` | OpenAI 官方編碼助手 |
| **Claude Code** | `curl -fsSL https://claude.ai/install.sh \| bash` | Anthropic Claude 終端機助手 |

### 為什麼需要 AI CLI？

單純使用 markitdown 有以下限制：

| 功能 | markitdown | 本工具 + AI CLI |
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
- ❌ **不會**生成 HTML（需要 AI CLI）

### 步驟 2：使用 AI CLI 生成網頁

選擇任一 AI 終端機工具：

```bash
# GitHub Copilot CLI
copilot
> 請根據 CODELABS_SDD.md 規格，將 your-file.md 製作成 Codelabs 互動式網頁

# Gemini CLI
gemini
> 請根據 CODELABS_SDD.md 規格，將 your-file.md 製作成 Codelabs 互動式網頁

# OpenAI Codex CLI
codex
> 請根據 CODELABS_SDD.md 規格，將 your-file.md 製作成 Codelabs 互動式網頁

# Claude Code
claude
> 請根據 CODELABS_SDD.md 規格，將 your-file.md 製作成 Codelabs 互動式網頁
```

AI CLI 會：
- ✅ 分析內容結構，拆分章節
- ✅ 根據語義識別顏色標籤
- ✅ 生成符合規格的 HTML
- ✅ 連結正確的圖片

## 📂 工具結構

```
pdf-to-codelabs/
├── README.md                 # 本文件（使用說明）
├── USER_MANUAL.md            # 詳細使用手冊
├── CODELABS_SDD.md          # 規格說明書（給 AI 參考）
├── convert_to_codelabs.sh    # 預處理腳本
├── templates/                # 模板檔案（給 AI 參考）
│   ├── codelabs.html        # HTML 骨架
│   ├── codelabs.css         # 樣式表
│   └── codelabs.js          # 互動腳本
└── markitdown/              # PDF 轉換工具（Git submodule）
```

## 📋 系統需求

- **必要**：任一 AI 終端機工具（見上方列表）
- **必要**：Python 3.8+
- **套件**：markitdown, pymupdf, pdfplumber

## 🔧 安裝

```bash
# 安裝 Python 依賴
pip install markitdown pymupdf pdfplumber

# 安裝 AI CLI（選擇一個）
npm i -g @google/gemini-cli      # Gemini CLI（免費）
npm i -g @openai/codex           # OpenAI Codex
curl -fsSL https://claude.ai/install.sh | bash  # Claude Code
```

## 📖 文件

| 文件 | 用途 | 讀者 |
|------|------|------|
| [USER_MANUAL.md](USER_MANUAL.md) | 完整使用教學 | 使用者 |
| [CODELABS_SDD.md](CODELABS_SDD.md) | 技術規格 | AI CLI / 開發者 |
| [templates/](templates/) | 樣式模板 | AI CLI |

## 🔄 為什麼需要 AI CLI？

1. **顏色標籤識別**：PDF 中的顏色資訊在轉換時會丟失，需要 AI 根據語義重新識別
2. **章節拆分**：需要 AI 理解內容結構來決定如何拆分
3. **HTML 生成**：需要 AI 將 Markdown 轉換為互動式網頁
4. **圖片對應**：需要 AI 判斷圖片應該放在哪個章節

## 📄 授權

MIT License
