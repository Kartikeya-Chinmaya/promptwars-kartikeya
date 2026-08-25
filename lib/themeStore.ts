export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

// Matches the SSR-rendered default (layout.tsx sets data-theme="dark") so
// there's no hydration mismatch — useSyncExternalStore reconciles this
// against the real client snapshot right after hydration on its own.
function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // storage unavailable (private mode) — theme still applies for this load
  }
  for (const listener of listeners) listener();
}

export const themeStore = { getSnapshot, getServerSnapshot, subscribe, setTheme };
