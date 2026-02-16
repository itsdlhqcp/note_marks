"use client";

import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import LoginBackground from "@/components/LoginBackground";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-100 px-4 dark:bg-zinc-950">
        <Logo size="lg" showText={true} />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:py-8">
        <LoginBackground />
        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-8">
            <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
              <Logo size="lg" showText={true} />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                Sign in to continue to your workspace
              </p>
            </div>

            <button
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 sm:gap-3 sm:px-5 sm:py-3.5"
            >
              <svg
                className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="mt-4 text-center text-[10px] text-zinc-400 sm:mt-6 sm:text-xs dark:text-zinc-500">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <DashboardContent userId={user.id} />
  );
}

function DashboardContent({ userId }: { userId: string }) {
  const { bookmarks, loading, error, addBookmark, updateBookmark, deleteBookmark } =
    useBookmarks(userId);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h1 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50 sm:text-xl">
          Bookmarks
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          Add and manage your bookmarks. Changes sync in real-time across tabs.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h2 className="mb-4 text-base font-medium text-zinc-900 dark:text-zinc-50">
          Add bookmark
        </h2>
        <AddBookmarkForm onSubmit={addBookmark} />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h2 className="mb-4 text-base font-medium text-zinc-900 dark:text-zinc-50">
          Your bookmarks
        </h2>
        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <BookmarkList
          bookmarks={bookmarks}
          loading={loading}
          onUpdate={updateBookmark}
          onDelete={deleteBookmark}
        />
      </div>
    </div>
  );
}
