#!/bin/bash
# PDF 轉 Codelabs 自動化腳本
# 用法: ./convert_to_codelabs.sh your-file.pdf

set -e

# 檢查參數
if [ -z "$1" ]; then
    echo "❌ 錯誤：請提供 PDF 檔案路徑"
    echo "用法: ./convert_to_codelabs.sh your-file.pdf"
    exit 1
fi

PDF_FILE="$1"
WORK_DIR=$(dirname "$PDF_FILE")
BASE_NAME=$(basename "$PDF_FILE" .pdf)

echo "🚀 開始轉換: $PDF_FILE"
echo "📁 工作目錄: $WORK_DIR"

# 建立虛擬環境（如果不存在）
if [ ! -d "$WORK_DIR/venv" ]; then
    echo "📦 建立 Python 虛擬環境..."
    python3 -m venv "$WORK_DIR/venv"
fi

# 啟動虛擬環境
source "$WORK_DIR/venv/bin/activate"

# 安裝依賴
echo "📦 安裝依賴套件..."
pip install -q markitdown pymupdf pdfplumber

# 步驟 1：轉換 PDF 為 Markdown
echo "📝 步驟 1/4: 轉換 PDF 為 Markdown..."
markitdown "$PDF_FILE" > "$WORK_DIR/${BASE_NAME}.md"

# 步驟 2：提取圖片
echo "🖼️ 步驟 2/4: 提取圖片..."
mkdir -p "$WORK_DIR/images"

python3 << EOF
import fitz
import os
import hashlib

pdf_path = "$PDF_FILE"
output_dir = "$WORK_DIR/images"

doc = fitz.open(pdf_path)
seen_hashes = set()
count = 0

for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images(full=True)
    
    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # 過濾小圖片和重複圖片
        if len(image_bytes) < 5000:
            continue
        
        img_hash = hashlib.md5(image_bytes).hexdigest()
        if img_hash in seen_hashes:
            continue
        seen_hashes.add(img_hash)
        
        # 過濾已知的裝飾條紋 (255KB)
        if len(image_bytes) == 255194:
            continue
        
        filename = f"{output_dir}/page{page_num+1}_img{img_index+1}.{image_ext}"
        with open(filename, "wb") as f:
            f.write(image_bytes)
        count += 1

print(f"✅ 已提取 {count} 張圖片")
EOF

# 步驟 3：生成 HTML（需要手動或透過 Copilot）
echo "📄 步驟 3/4: 準備生成 Codelabs HTML..."
echo ""
echo "⚠️ 請使用 Copilot CLI 執行以下指令來生成互動式網頁："
echo ""
echo "   cd $WORK_DIR"
echo "   copilot"
echo "   > 請將 ${BASE_NAME}.md 製作成 Codelabs 互動式教學網頁"
echo ""

# 步驟 4：清理
echo "🧹 步驟 4/4: 環境準備完成"
echo ""
echo "📊 轉換結果："
echo "   - Markdown: $WORK_DIR/${BASE_NAME}.md"
echo "   - 圖片資料夾: $WORK_DIR/images/"
echo "   - 圖片數量: $(ls -1 $WORK_DIR/images/*.jpeg 2>/dev/null | wc -l | tr -d ' ') 張"
echo ""
echo "✅ 預處理完成！請使用 Copilot CLI 完成 HTML 生成。"
