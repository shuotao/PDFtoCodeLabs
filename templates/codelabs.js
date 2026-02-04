/**
 * Codelabs 互動功能腳本
 * 版本: 1.0
 */

// 全域變數
let currentChapter = 1;
let totalChapters = 0;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCodelabs();
});

/**
 * 初始化 Codelabs
 */
function initializeCodelabs() {
    const chapters = document.querySelectorAll('.chapter');
    totalChapters = chapters.length;
    
    // 生成側邊欄章節列表
    generateChapterList(chapters);
    
    // 顯示第一章
    showChapter(1);
    
    // 設定鍵盤導航
    setupKeyboardNavigation();
    
    console.log(`Codelabs 初始化完成: ${totalChapters} 章節`);
}

/**
 * 生成側邊欄章節列表
 */
function generateChapterList(chapters) {
    const chapterList = document.getElementById('chapter-list');
    if (!chapterList) return;
    
    chapterList.innerHTML = '';
    
    chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        const title = chapter.querySelector('h2')?.textContent || `章節 ${index + 1}`;
        
        li.textContent = `${index + 1}. ${title}`;
        li.dataset.chapter = index + 1;
        li.onclick = () => showChapter(index + 1);
        
        chapterList.appendChild(li);
    });
}

/**
 * 顯示指定章節
 * @param {number} n - 章節編號 (1-based)
 */
function showChapter(n) {
    // 邊界檢查
    if (n < 1) n = 1;
    if (n > totalChapters) n = totalChapters;
    
    // 隱藏所有章節
    document.querySelectorAll('.chapter').forEach(ch => {
        ch.classList.remove('active');
        ch.style.display = 'none';
    });
    
    // 顯示目標章節
    const target = document.querySelector(`[data-chapter="${n}"]`);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }
    
    // 更新當前章節
    currentChapter = n;
    
    // 更新 UI
    updateProgress();
    updateNavButtons();
    updateSidebarActive();
    
    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 上一章
 */
function prevChapter() {
    if (currentChapter > 1) {
        showChapter(currentChapter - 1);
    }
}

/**
 * 下一章
 */
function nextChapter() {
    if (currentChapter < totalChapters) {
        showChapter(currentChapter + 1);
    }
}

/**
 * 更新進度指示器
 */
function updateProgress() {
    document.querySelectorAll('.progress-indicator').forEach(el => {
        el.textContent = `${currentChapter} / ${totalChapters}`;
    });
}

/**
 * 更新導航按鈕狀態
 */
function updateNavButtons() {
    const prevBtns = document.querySelectorAll('[id^="prev-btn"]');
    const nextBtns = document.querySelectorAll('[id^="next-btn"]');
    
    prevBtns.forEach(btn => {
        btn.disabled = currentChapter <= 1;
    });
    
    nextBtns.forEach(btn => {
        btn.disabled = currentChapter >= totalChapters;
    });
}

/**
 * 更新側邊欄活動狀態
 */
function updateSidebarActive() {
    document.querySelectorAll('.chapter-nav li').forEach(li => {
        li.classList.remove('active');
        if (parseInt(li.dataset.chapter) === currentChapter) {
            li.classList.add('active');
        }
    });
}

/**
 * 設定鍵盤導航
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // 左箭頭：上一章
        if (e.key === 'ArrowLeft' && !isInputFocused()) {
            prevChapter();
        }
        // 右箭頭：下一章
        if (e.key === 'ArrowRight' && !isInputFocused()) {
            nextChapter();
        }
        // 數字鍵：直接跳轉
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9 && num <= totalChapters && !isInputFocused()) {
            showChapter(num);
        }
    });
}

/**
 * 檢查是否聚焦在輸入框
 */
function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement.tagName === 'INPUT' || 
           activeElement.tagName === 'TEXTAREA' ||
           activeElement.isContentEditable;
}

/**
 * 切換側邊欄（手機版）
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}

/**
 * 展開/收合提示詞框
 */
function togglePromptBox(element) {
    element.classList.toggle('expanded');
}

/**
 * 複製提示詞到剪貼簿
 */
async function copyPrompt(element) {
    const text = element.textContent.trim();
    
    try {
        await navigator.clipboard.writeText(text);
        showToast('已複製到剪貼簿！');
    } catch (err) {
        console.error('複製失敗:', err);
        showToast('複製失敗，請手動選取複製');
    }
}

/**
 * 顯示 Toast 訊息
 */
function showToast(message, duration = 2000) {
    // 移除現有的 toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    // 建立新的 toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #323232;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 自動移除
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
`;
document.head.appendChild(style);
