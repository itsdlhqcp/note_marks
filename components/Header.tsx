"use client";

import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
  onMenuClick?: () => void;
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-zinc-200 bg-white px-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:h-14 sm:gap-4 sm:px-4">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 sm:h-10 sm:w-10"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
          Note Marks
        </span>
      </div>

      {user && (
        <span className="hidden truncate text-xs text-zinc-600 sm:inline sm:max-w-[140px] sm:text-sm md:max-w-[200px] dark:text-zinc-400">
          {user.email}
        </span>
      )}
    </header>
  );
}
