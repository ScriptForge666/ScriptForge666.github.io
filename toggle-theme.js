// toggle-theme.js
/**
 * 应用全局主题：修改body、驱动theme‑button组件、写cookie、toast提示
 * @param {'dark'|'light'} mode
 */
function applyGlobalTheme(mode) {
  const body = document.body;
  const widget = document.getElementById('theme-widget');
  if (mode === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
  // 驱动WebComponent UI状态
  if (widget && typeof widget.setTheme === 'function') {
    widget.setTheme(mode);
  }
  // 写入持久化Cookie（与原有站点配置保持一致）
  document.cookie = `scriptforge-web-theme=${mode}; path=/; domain=.script-forge.top; max-age=31536000; SameSite=Lax; Secure`;
  requestAnimationFrame(() => {
    if (typeof showToastNotification === 'function') {
      showToastNotification(mode === "dark" ? "已切换至深色模式" : "已切换至浅色模式");
    }
  });
}

function bindThemeWidget() {
  const widget = document.getElementById('theme-widget');
  if (!widget) return false;
  // 已经绑定过就不要再重复绑定
  if(widget.__themeBound) return true;

  widget.addEventListener('change', (ev) => {
    const nextMode = ev.detail;
    applyGlobalTheme(nextMode);
  });

  // 系统配色变更监听
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (mediaEv) => {
    applyGlobalTheme(mediaEv.matches ? 'dark' : 'light');
  });

  // 使用head.js预先算好的全局初始主题完成页面初始化渲染
  applyGlobalTheme(window.__preferTheme);
  widget.__themeBound = true;
  return true;
}

// 关键修复：不要等DOMContentLoaded，循环等待组件升级
(function waitWidgetReady() {
  if(bindThemeWidget()){
    return;
  }
  // 还没准备好，下一帧继续检测
  requestAnimationFrame(waitWidgetReady);
})();
