// 切换主题逻辑
const toggleBtn = document.getElementById('toggle-theme');

// 初始化：同步按钮状态，加一层安全判断
if (toggleBtn) {
    if (document.documentElement.classList.contains('dark-mode')) {
        toggleBtn.classList.add('on');
    } else {
        toggleBtn.classList.remove('on');
    }

    // 点击事件只在按钮存在的时候绑定
    toggleBtn.addEventListener('click', () => {
        const root = document.documentElement;
        root.classList.toggle('dark-mode');
        toggleBtn.classList.toggle('on');

        const isDark = root.classList.contains('dark-mode');
        showToastNotification(isDark ? "已切换至深色模式" : "已切换至浅色模式");
        document.cookie = `scriptforge-web-theme=${isDark ? 'dark' : 'light'}; path=/; domain=.script-forge.top; max-age=31536000; SameSite=Lax; Secure`;
    });
}