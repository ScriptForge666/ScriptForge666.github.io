function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const [k, val] = v.split('=');
    return k === name ? val : r;
  }, null);
}
const savedTheme = getCookie("my-web-theme");
if(savedTheme === "dark") {
  // ✅ 改成 html 根节点，head阶段就能访问
  document.documentElement.classList.add("dark-mode");
} else if(savedTheme === null) {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(systemDark) document.documentElement.classList.add("dark-mode");
}