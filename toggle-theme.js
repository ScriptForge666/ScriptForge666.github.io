const toggleBtn = document.getElementById('toggle-theme');

// DOM已经构建完成，此时body存在
if (toggleBtn) {
    // 页面初始化，把保存的主题设置给body
    if(window.__preferTheme === "dark"){
        document.body.classList.add('dark-mode');
        toggleBtn.classList.add('on');
    }else{
        document.body.classList.remove('dark-mode');
        toggleBtn.classList.remove('on');
    }

    toggleBtn.addEventListener('click', () => {
        // ✅ 全部操作 body，不是 html
        const body = document.body;
        body.classList.toggle('dark-mode');
        toggleBtn.classList.toggle('on');

        const isDark = body.classList.contains('dark-mode');
        // 错开渲染帧，避免toast和主题切换抢主线程
        requestAnimationFrame(()=>{
            if(typeof showToastNotification === 'function'){
                showToastNotification(isDark ? "已切换至深色模式" : "已切换至浅色模式");
            }
        });

        // 写入Cookie，线上完整配置
        document.cookie = `scriptforge-web-theme=${isDark ? 'dark' : 'light'}; path=/; domain=.script-forge.top; max-age=31536000; SameSite=Lax; Secure`;
    });
}
