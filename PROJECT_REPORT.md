# Google Prompt Engineering Codelabs 專案報告

## 📁 專案檔案清單

### 網頁檔案
| 檔案名稱 | 說明 | 大小 |
|----------|------|------|
| `Google_Prompting_Codelabs_Part1.html` | 互動式 Codelabs 教學網頁（11 章節） | 163 KB |

### 圖片資料夾 (`images/`)
共 25 張 Gemini 界面截圖：

| 檔案名稱 | 章節 | 內容描述 |
|----------|------|----------|
| page7_img1.jpeg | Ch 2 | 行政支援 - 異地會議議程 |
| page8_img1.jpeg | Ch 2 | 破冰活動建議 |
| page8_img2.jpeg | Ch 2 | 表格格式議程 |
| page9_img1.jpeg | Ch 2 | 議程詳細內容 |
| page13_img1.jpeg | Ch 3 | 新聞稿初始回應 |
| page13_img3.jpeg | Ch 3 | 新聞稿迭代回應（公司資訊）|
| page18_img1.jpeg | Ch 4 | 同理心電子郵件回應 |
| page18_img4.jpeg | Ch 4 | 10 個替代方案列表 |
| page24_img1.jpeg | Ch 5 | 確認郵件精煉後版本 |
| page24_img3.jpeg | Ch 5 | 確認郵件初始回應 |
| page33_img1.jpeg | Ch 6 | Gemini in Drive 搜尋結果 |
| page34_img1.jpeg | Ch 6 | 促銷折扣查詢回應 |
| page34_img2.jpeg | Ch 6 | 促銷詳情 |
| page39_img1.jpeg | Ch 7 | HR 演講要點初始回應 |
| page39_img2.jpeg | Ch 7 | HR 演講要點迭代回應 |
| page45_img1.jpeg | Ch 8 | 咖啡店標誌創意 |
| page45_img2.jpeg | Ch 8 | 復古風格標誌 |
| page45_img3.jpeg | Ch 8 | 業務名稱和標語建議 |
| page55_img1.jpeg | Ch 9 | UAT 表格生成 |
| page56_img1.jpeg | Ch 9 | UAT 電子郵件草稿 |
| page56_img4.jpeg | Ch 9 | UAT 電子郵件詳細內容 |
| page61_img1.jpeg | Ch 10 | 銷售郵件精煉後版本 |
| page61_img2.jpeg | Ch 10 | 銷售郵件初始回應 |
| page62_img1.jpeg | Ch 10 | 市場策略研究回應 |
| page70_img1.jpeg | Ch 11 | 六大技巧視覺化圖表 |

### 原始參考資料
| 檔案名稱 | 說明 |
|----------|------|
| `Google's 71-page prompting guide.pdf` | 原始 PDF（71 頁）|
| `Google_Prompting_Guide.md` | Markitdown 轉換的 Markdown |
| `2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1 (1).pdf` | 原始上傳 PDF |

### 工具資料夾
| 資料夾 | 說明 |
|--------|------|
| `markitdown/` | Microsoft Markitdown 工具（GitHub clone）|

---

## 🔧 Markitdown 問題分析與修正建議

### 問題一：PDF 顏色文字無法識別

**問題描述**：
PDF 中使用顏色標記的提示詞元素（Persona=紅色、Task=藍色、Context=綠色、Format=黃色）在轉換時會丟失顏色資訊。

**根本原因**：
`_pdf_converter.py` 使用 pdfminer 和 pdfplumber 提取文字，這些工具只提取純文字內容，不保留字體顏色屬性。

**修正建議**：
```python
# 在 _pdf_converter.py 中添加顏色提取功能
import fitz  # PyMuPDF

def extract_colored_text(pdf_path):
    """提取 PDF 中帶有顏色資訊的文字"""
    doc = fitz.open(pdf_path)
    colored_spans = []
    
    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            if "lines" in block:
                for line in block["lines"]:
                    for span in line["spans"]:
                        color = span.get("color", 0)
                        if color != 0:  # 非黑色文字
                            colored_spans.append({
                                "text": span["text"],
                                "color": color,
                                "page": page.number
                            })
    return colored_spans
```

**顏色對應表**：
| 顏色代碼 | 元素類型 | HTML Class |
|----------|----------|------------|
| 0xE74C3C | Persona | tag-persona |
| 0x3498DB | Task | tag-task |
| 0x27AE60 | Context | tag-context |
| 0xF1C40F | Format | tag-format |

---

### 問題二：PDF 圖片提取藍色條紋問題

**問題描述**：
提取的圖片中有 11 張是相同的藍色漸變條紋（255,194 bytes），而非實際的 Gemini 截圖。

**根本原因**：
1. PDF 中的藍色條紋是裝飾性背景元素，被當作圖片提取
2. Markitdown 的 `_image_converter.py` 沒有過濾機制
3. PDF 中的 Gemini 截圖可能使用向量圖形或嵌入方式不同

**修正建議**：
```python
# 在圖片提取邏輯中添加過濾
def is_decorative_image(image_bytes, width, height):
    """判斷是否為裝飾性圖片"""
    # 過濾條件：
    # 1. 圖片尺寸過於細長（高度/寬度比 < 0.3）
    # 2. 圖片大小完全相同（255194 bytes = 裝飾條紋）
    # 3. 圖片內容重複出現多次
    
    if height / width < 0.3:  # 細長條紋
        return True
    if len(image_bytes) == 255194:  # 已知的裝飾條紋大小
        return True
    return False

# 使用 PyMuPDF 提取圖片時過濾
def extract_meaningful_images(pdf_path, output_dir):
    doc = fitz.open(pdf_path)
    seen_hashes = set()
    
    for page_num, page in enumerate(doc):
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            
            # 計算圖片哈希值，過濾重複
            img_hash = hashlib.md5(image_bytes).hexdigest()
            if img_hash in seen_hashes:
                continue
            seen_hashes.add(img_hash)
            
            # 過濾裝飾性圖片
            if len(image_bytes) == 255194:
                continue
                
            # 保存有意義的圖片
            # ...
```

---

## 📊 專案統計

| 項目 | 數量 |
|------|------|
| 章節數 | 11 |
| 總提示詞數 | 132 |
| 有顏色標籤的提示詞 | 10 |
| 使用的圖片數 | 25 |
| HTML 檔案大小 | 163 KB |

---

## ✅ 已完成的修正

1. **圖片資料夾整理**：移除藍色條紋裝飾圖片，只保留 25 張有效截圖
2. **圖片重複問題**：修正 Ch 3、4、5、7、10 的重複圖片引用
3. **提示詞標籤修正**：修正 Ch 3、5、6、7、9、10 的顏色標籤錯誤
4. **檔案清理**：移除臨時腳本和中間檔案

---

*報告生成時間：2026-02-04*
