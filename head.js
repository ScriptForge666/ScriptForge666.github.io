function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const [k, val] = v.split('=');
    return k === name ? val : r;
  }, null);
}
// head阶段只做计算，不碰DOM
window.__preferTheme = getCookie("scriptforge-web-theme");
if(window.__preferTheme === null){
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  window.__preferTheme = sysDark ? "dark" : "light";
}

document.documentElement.dataset.theme = window.__preferTheme;