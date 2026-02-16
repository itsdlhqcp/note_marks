-- REPLICA IDENTITY FULL ensures DELETE/UPDATE events include full row data
-- so Realtime filters (e.g. user_id) work correctly across tabs
alter table public.bookmarks replica identity full;

-- Add bookmarks table to Realtime publication for postgres_changes
alter publication supabase_realtime add table public.bookmarks;
