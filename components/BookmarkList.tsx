"use client";

import { useState } from "react";
import type { Bookmark } from "@/types/bookmark";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onDelete: (id: string) => Promise<{ error: string | null }>;
}

export default function BookmarkList({
  bookmarks,
  loading,
  onDelete,
}: BookmarkListProps) {
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = (bookmark: Bookmark) => {
    setBookmarkToDelete(bookmark);
  };

  const handleDeleteConfirm = async () => {
    if (!bookmarkToDelete) return;
    setDeletingId(bookmarkToDelete.id);
    await onDelete(bookmarkToDelete.id);
    setDeletingId(null);
    setBookmarkToDelete(null);
  };

  const handleDeleteCancel = () => {
    setBookmarkToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No bookmarks yet. Add one above.
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              {bookmark.title}
            </a>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden truncate text-sm text-zinc-500 hover:underline sm:block sm:max-w-[200px]"
            >
              {bookmark.url}
            </a>
            <button
              type="button"
              onClick={() => handleDeleteClick(bookmark)}
              disabled={deletingId === bookmark.id}
              className="shrink-0 rounded p-1.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              aria-label={`Delete ${bookmark.title}`}
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>

      {bookmarkToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleDeleteCancel}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
              Delete bookmark?
            </h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
              Are you sure you want to delete &quot;{bookmarkToDelete.title}&quot;?
              This cannot be undone.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === bookmarkToDelete.id}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === bookmarkToDelete.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
