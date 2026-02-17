-- RLS policies: users can only access their own bookmarks

-- SELECT: users can read only their own bookmarks
create policy "Users can select own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- INSERT: users can create bookmarks for themselves here
create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- UPDATE: users can update only their own bookmarks
create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: users can delete only their own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);
