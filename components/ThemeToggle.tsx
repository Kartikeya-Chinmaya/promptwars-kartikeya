"use client";

import { useSyncExternalStore } from "react";
import { themeStore } from "@/lib/themeStore";

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  function toggle() {
    themeStore.setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="tag font-mono text-xs font-semibold uppercase tracking-wide px-2.5 py-1.5 text-accent-text hover:border-accent"
    >
      [{theme === "dark" ? "LIGHT" : "DARK"}]
    </button>
  );
}
