"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";

const BOOKMARKS_SYNC_CHANNEL = "note-marks-bookmarks-sync";

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);
  const fetchBookmarksRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setBookmarks([]);
    } else {
      setBookmarks(data ?? []);
    }
    setLoading(false);
  }, [userId, supabase]);

  fetchBookmarksRef.current = fetchBookmarks;

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchBookmarksRef.current();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  useEffect(() => {
    if (!userId) return;

    const bc = new BroadcastChannel(BOOKMARKS_SYNC_CHANNEL);
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "bookmarks-changed" && e.data?.userId === userId) {
        fetchBookmarksRef.current();
      }
    };
    bc.addEventListener("message", handler);
    return () => {
      bc.removeEventListener("message", handler);
      bc.close();
    };
  }, [userId]);

  const broadcastBookmarksChanged = useCallback(() => {
    if (typeof BroadcastChannel !== "undefined" && userId) {
      new BroadcastChannel(BOOKMARKS_SYNC_CHANNEL).postMessage({
        type: "bookmarks-changed",
        userId,
      });
    }
  }, [userId]);

  const addBookmark = useCallback(
    async (url: string, title: string) => {
      if (!userId) return { error: "Not authenticated" };

      const { data, error: insertError } = await supabase
        .from("bookmarks")
        .insert({ user_id: userId, url, title })
        .select()
        .single();

      if (!insertError && data) {
        setBookmarks((prev) => [data, ...prev]);
        broadcastBookmarksChanged();
      }

      return { error: insertError?.message ?? null };
    },
    [userId, supabase, broadcastBookmarksChanged]
  );

  const updateBookmark = useCallback(
    async (id: string, url: string, title: string) => {
      const { data, error: updateError } = await supabase
        .from("bookmarks")
        .update({ url, title })
        .eq("id", id)
        .select()
        .single();

      if (!updateError && data) {
        setBookmarks((prev) =>
          prev.map((b) => (b.id === id ? data : b))
        );
        broadcastBookmarksChanged();
      }

      return { error: updateError?.message ?? null };
    },
    [supabase, broadcastBookmarksChanged]
  );

  const deleteBookmark = useCallback(
    async (id: string) => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));

      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id);

      if (deleteError) {
        fetchBookmarks();
        return { error: deleteError.message };
      }
      broadcastBookmarksChanged();
      return { error: null };
    },
    [supabase, fetchBookmarks, broadcastBookmarksChanged]
  );

  return { bookmarks, loading, error, addBookmark, updateBookmark, deleteBookmark };
}
