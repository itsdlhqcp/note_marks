"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export default function NetworkSlowPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" showText={true} />
        </div>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <svg
            className="h-8 w-8 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          Slow or Offline Connection
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          Your connection appears to be slow or unavailable. Some features may not
          work properly until your connection improves.
        </p>
        <ul className="mt-6 space-y-2 text-left text-sm text-zinc-600 dark:text-zinc-400">
          <li className="flex items-center gap-2">
            <span className="text-amber-500">•</span>
            Try moving closer to your Wi‑Fi router
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-500">•</span>
            Check if other devices have internet access
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-500">•</span>
            Switch to a different network if available
          </li>
        </ul>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
