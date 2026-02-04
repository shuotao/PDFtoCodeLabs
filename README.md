# PDF to Codelabs Converter

將 PDF 文件轉換為 Google Codelabs 風格的互動式教學網頁。

## 🚀 快速開始

### 使用 Copilot CLI（推薦）

```bash
# 進入工作目錄
cd /path/to/your/pdf

# 啟動 Copilot
copilot

# 輸入指令
> @your-file.pdf 請將此 PDF 轉換為 Codelabs 互動式教學網頁
```

### 使用腳本預處理

```bash
./convert_to_codelabs.sh your-file.pdf
```

## 📂 工具結構

```
pdf-to-codelabs/
├── README.md                 # 本文件
├── USER_MANUAL.md            # 詳細使用手冊
├── CODELABS_SDD.md          # 規格說明書
├── convert_to_codelabs.sh    # 自動化腳本
├── templates/                # 模板檔案
│   ├── codelabs.html        # HTML 骨架
│   ├── codelabs.css         # 樣式表
│   └── codelabs.js          # 互動腳本
└── markitdown/              # PDF 轉換工具
```

## 📋 系統需求

- Python 3.8+
- pip 套件：markitdown, pymupdf, pdfplumber
- macOS / Linux / Windows (WSL)

## 📖 文件

- **[USER_MANUAL.md](USER_MANUAL.md)** - 完整使用教學
- **[CODELABS_SDD.md](CODELABS_SDD.md)** - 技術規格說明

## 🔧 安裝依賴

```bash
pip install markitdown pymupdf pdfplumber
```

## 📄 授權

MIT License
