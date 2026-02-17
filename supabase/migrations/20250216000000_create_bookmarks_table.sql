-- Create bookmarks tb
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- add indexing for faster lookups by user
create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;
