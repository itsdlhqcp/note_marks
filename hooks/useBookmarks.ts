"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

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

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, fetchBookmarks]);

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
      }

      return { error: insertError?.message ?? null };
    },
    [userId, supabase]
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
      return { error: null };
    },
    [supabase, fetchBookmarks]
  );

  return { bookmarks, loading, error, addBookmark, deleteBookmark };
}
