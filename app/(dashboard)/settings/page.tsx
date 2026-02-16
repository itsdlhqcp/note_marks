"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Settings
      </h1>

      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div>
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
              Appearance
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {theme === "dark" ? "Dark mode" : "Light mode"} is on
            </p>
          </div>
          <button
            role="switch"
            aria-checked={theme === "light"}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-950 ${
              theme === "light"
                ? "bg-zinc-200"
                : "bg-zinc-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition ${
                theme === "light" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
