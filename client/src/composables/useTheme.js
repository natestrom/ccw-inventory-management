import { ref, watchEffect } from "vue";

const STORAGE_KEY = "app-theme";
const saved = localStorage.getItem(STORAGE_KEY) || "system";
const theme = ref(saved);

const mql = window.matchMedia("(prefers-color-scheme: dark)");

const applyTheme = () => {
  const isDark =
    theme.value === "dark" || (theme.value === "system" && mql.matches);
  document.documentElement.classList.toggle("dark", isDark);
};

mql.addEventListener("change", applyTheme);
watchEffect(applyTheme);

export function useTheme() {
  const setTheme = (t) => {
    theme.value = t;
    localStorage.setItem(STORAGE_KEY, t);
  };

  const toggle = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
  };

  const isDark = () => document.documentElement.classList.contains("dark");

  return { theme, setTheme, toggle, isDark };
}
