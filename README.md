# Note Marks

A bookmark management web application built with Next.js and Supabase. Users can sign in with Google, add, edit, and delete bookmarks, with real-time sync across tabs and devices.

## Project Live link

https://note-marks.vercel.app/

## Challenging task

### dual sync (realtime + broadcastchannel)

- subscribing to supabase realtime `postgres_changes` with a `user_id` filter  
- using broadcastchannel for cross-tab sync in the same browser  
- using `fetchBookmarksRef` so callbacks always call the latest `fetchBookmarks` and avoid stale closures  
- ensuring both realtime and broadcastchannel trigger refetches without duplicate work or race conditions  

---

## AI tools used during the build

- i used v0 for logo creation.  
- i used cursor for debugging and wire-up through the architecture.  
- i used github copilot for:
  - autocomplete and real-time code suggestions  
  - generating functions  
  - writing api logic  
  - filling boilerplate code  
- i used codium for typscript syntax reframing and typo corrections


## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Data Models](#data-models)
- [Technical Flows](#technical-flows)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

---

## Architecture Overview

Note Marks follows a **client-first SPA-style architecture** with a Next.js App Router frontend and Supabase as the backend (PostgreSQL + Auth + Realtime).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Next.js App Router (React 19)                                    │  │
│  │  • Route Groups: (dashboard) for /, /settings                      │  │
│  │  • Client Components for interactivity                            │  │
│  │  • Contexts: AuthProvider, ThemeProvider                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                    │
│  ┌────────────────────────────────┼────────────────────────────────┐  │
│  │  Supabase Client (Browser)      │  BroadcastChannel (cross-tab)   │  │
│  │  • Auth (OAuth, session)        │  • Sync bookmarks across tabs   │  │
│  │  • PostgREST (CRUD)             │                                 │  │
│  │  • Realtime (postgres_changes)  │                                 │  │
│  └────────────────────────────────┴────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVER (Supabase)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ Auth (GoTrue)│  │  PostgreSQL  │  │ Realtime (postgres_changes)     │ │
│  │ • Google OAuth│  │ • bookmarks │  │ • Publishes INSERT/UPDATE/DELETE│ │
│  │ • JWT sessions│  │ • RLS       │  │ • Filtered by user_id           │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Supabase** | Backend-as-a-Service: Auth, DB, Realtime in one platform; Row Level Security for multi-tenant isolation |
| **Next.js App Router** | File-based routing, Server Components where useful, middleware for session refresh |
| **Client Components** | Most UI is interactive (auth, forms, real-time); `"use client"` used where needed |
| **BroadcastChannel + Realtime** | Keeps bookmarks in sync across tabs and devices without polling |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4 |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Auth** | Supabase Auth (Google OAuth) |
| **Data Access** | `@supabase/supabase-js`, `@supabase/ssr` |
| **Language** | TypeScript 5 |

---

## Data Models

### Bookmark

The only domain entity. Stored in `public.bookmarks`.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | Owner; links to Supabase Auth user |
| `url` | `text` | NOT NULL | Bookmark URL (http/https) |
| `title` | `text` | NOT NULL | Display title |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |

**Indexes**

- `bookmarks_user_id_idx` on `user_id` for fast lookups by user

**Row Level Security (RLS)**

- `SELECT`: `auth.uid() = user_id`
- `INSERT`: `auth.uid() = user_id`
- `UPDATE`: `auth.uid() = user_id`
- `DELETE`: `auth.uid() = user_id`

**Realtime**

- Table uses `REPLICA IDENTITY FULL` so DELETE/UPDATE events include full row data
- Table added to `supabase_realtime` publication for `postgres_changes`

### TypeScript Interface

```typescript
// types/bookmark.ts
interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
}
```

### Auth User (Supabase)

- Managed by Supabase Auth (`auth.users`)
- Used via `User` from `@supabase/supabase-js`
- No custom user table; `user_id` in `bookmarks` references `auth.users(id)`

---

## Technical Flows

### 1. Authentication Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  User    │────▶│ Sign in     │────▶│ Supabase OAuth   │────▶│ Google      │
│  clicks  │     │ with Google │     │ redirect         │     │ consent     │
└──────────┘     └─────────────┘     └──────────────────┘     └─────────────┘
                                                                     │
                                                                     ▼
┌──────────┐     ┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│ Dashboard│◀────│ AuthContext │◀────│ /auth/callback   │◀────│ Redirect    │
│ rendered │     │ user set    │     │ exchange code    │     │ with code   │
└──────────┘     └─────────────┘     └──────────────────┘     └─────────────┘
```

**Steps**

1. User clicks "Continue with Google" → `AuthContext.signInWithGoogle()` calls `supabase.auth.signInWithOAuth({ provider: "google" })`.
2. Supabase redirects to Google; user consents.
3. Google redirects to `/auth/callback?code=...`.
4. `app/auth/callback/route.ts` uses `supabase.auth.exchangeCodeForSession(code)` to create a session and set cookies.
5. Response redirects to `/` (or `next` param).
6. `AuthContext` listens via `onAuthStateChange`; `user` is set and dashboard renders.

**Session handling**

- **Middleware** (`middleware.ts`): Runs on every request; `updateSession()` calls `supabase.auth.getUser()` to refresh the session and update cookies.
- **Client**: `createClient()` from `lib/supabase/client.ts` uses `createBrowserClient`; cookies are sent automatically.
- **Server**: `createClient()` from `lib/supabase/server.ts` uses `createServerClient` with `cookies()` from Next.js.

---

### 2. Bookmark CRUD Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ AddBookmarkForm │     │ useBookmarks     │     │ Supabase        │
│ / BookmarkList  │────▶│ add/update/delete│────▶│ PostgREST       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                        │                        │
         │                        │                        ▼
         │                        │               ┌─────────────────┐
         │                        │               │ PostgreSQL      │
         │                        │               │ (RLS enforced)  │
         │                        │               └─────────────────┘
         │                        │
         │                        ▼
         │               ┌─────────────────┐
         │               │ Optimistic UI    │
         │               │ + broadcast      │
         └───────────────│ BroadcastChannel│
                         └─────────────────┘
```

**Add bookmark**

1. User submits form → `AddBookmarkForm` calls `onSubmit(url, title)`.
2. `useBookmarks.addBookmark()` inserts into `bookmarks` with `user_id` from auth.
3. On success: local state updated, `broadcastBookmarksChanged()` called.
4. Other tabs receive BroadcastChannel message and refetch.

**Update bookmark**

1. User edits in `EditBookmarkModal` → `onUpdate(id, url, title)`.
2. `useBookmarks.updateBookmark()` runs `update().eq('id', id)`.
3. On success: local state updated, broadcast sent.

**Delete bookmark**

1. User confirms in delete modal → `onDelete(id)`.
2. `useBookmarks.deleteBookmark()` optimistically removes from state, then calls `delete().eq('id', id)`.
3. On error: refetch to restore state. On success: broadcast sent.

---

### 3. Real-Time Sync Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Tab A                    Supabase Realtime              Tab B          │
│  ┌─────────────┐         ┌─────────────────────┐       ┌─────────────┐ │
│  │ Add bookmark│────────▶│ postgres_changes     │──────▶│ Refetch     │ │
│  │ (INSERT)    │         │ filter: user_id=eq.X │       │ bookmarks   │ │
│  └─────────────┘         └─────────────────────┘       └─────────────┘ │
│                                                                         │
│  ┌─────────────┐         ┌─────────────────────┐       ┌─────────────┐ │
│  │ Broadcast   │────────▶│ BroadcastChannel     │──────▶│ Refetch     │ │
│  │ Channel     │         │ note-marks-bookmarks │       │ bookmarks   │ │
│  └─────────────┘         └─────────────────────┘       └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Dual sync strategy**

1. **Supabase Realtime**: Subscribes to `postgres_changes` on `bookmarks` with `user_id=eq.{userId}`. Any INSERT/UPDATE/DELETE from any client triggers a refetch.
2. **BroadcastChannel**: After local mutations, `broadcastBookmarksChanged()` notifies other tabs in the same browser. Those tabs refetch without waiting for Realtime.

---

### 4. Theme Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Settings page   │────▶│ ThemeContext     │────▶│ document.document│
│ toggleTheme()   │     │ setTheme()       │     │ Element.classList│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ localStorage    │
                        │ note-marks-theme│
                        └─────────────────┘
```

- Theme stored in `localStorage` under `note-marks-theme` (`"light"` | `"dark"`).
- Root layout injects a script to apply theme before paint to avoid flash.
- `ThemeContext` syncs `document.documentElement.classList` with `dark` and persists to `localStorage`.

---

### 5. Network Status Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ navigator.onLine│     │ NetworkStatus   │     │ Connection API   │
│ online/offline  │────▶│ connectionState │◀────│ effectiveType   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Banner + link   │
                        │ /network-slow   │
                        └─────────────────┘
```

- `NetworkStatus` listens to `online`, `offline`, and `connection.change`.
- States: `online`, `offline`, `slow` (slow-2g, 2g, 3g).
- When not `online`, shows a banner and a link to `/network-slow` for tips.

---

### 6. Route & Layout Flow

```
app/
├── layout.tsx              # Root: ThemeProvider, AuthProvider, NetworkStatus
├── (dashboard)/
│   ├── layout.tsx           # Dashboard: auth guard, AppShell when logged in
│   ├── page.tsx             # / : Login or DashboardContent
│   └── settings/
│       └── page.tsx         # /settings : Theme toggle
├── network-slow/
│   └── page.tsx             # /network-slow : Connection tips
└── auth/
    └── callback/
        └── route.ts         # /auth/callback : OAuth code exchange
```

**Auth guard (dashboard layout)**

- If `!user && !loading` and path ≠ `/` → redirect to `/`.
- If `loading` → show spinner.
- If `user` → render `AppShell` (Header + Sidebar + main content).

---

## Project Structure

```
note_marks/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Tailwind + theme keyframes
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Dashboard layout (auth + AppShell)
│   │   ├── page.tsx            # Home: login or bookmarks
│   │   └── settings/
│   │       └── page.tsx        # Settings: theme
│   ├── network-slow/
│   │   └── page.tsx            # Network tips page
│   └── auth/
│       └── callback/
│           └── route.ts        # OAuth callback handler
├── components/
│   ├── AppShell.tsx            # Header + Sidebar + main wrapper
│   ├── Header.tsx              # Top bar, logo, menu toggle
│   ├── Sidebar.tsx             # Nav (Dashboard, Settings), Logout
│   ├── Logo.tsx                # App logo
│   ├── AddBookmarkForm.tsx     # Add bookmark form
│   ├── BookmarkList.tsx        # List + edit/delete modals
│   ├── LoginBackground.tsx     # Login page background
│   └── NetworkStatus.tsx       # Connection banner
├── contexts/
│   ├── AuthContext.tsx         # Auth state, signIn, signOut
│   └── ThemeContext.tsx       # Theme state, toggle
├── hooks/
│   └── useBookmarks.ts        # CRUD + Realtime + BroadcastChannel
├── lib/
│   ├── supabase.ts            # getSupabase (legacy)
│   └── supabase/
│       ├── client.ts          # Browser Supabase client
│       ├── server.ts          # Server Supabase client
│       └── middleware.ts      # Session refresh
├── types/
│   └── bookmark.ts            # Bookmark interface
├── supabase/
│   └── migrations/
│       ├── 20250216000000_create_bookmarks_table.sql
│       ├── 20250216000001_add_bookmarks_rls_policies.sql
│       └── 20250216000002_enable_bookmarks_realtime.sql
├── middleware.ts              # Runs updateSession on matched routes
├── package.json
├── next.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase project

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Setup

1. Enable Google OAuth in Supabase Dashboard → Authentication → Providers.
2. Add redirect URL: `http://localhost:3000/auth/callback` (and production URL).
3. Run migrations:

```bash
supabase db push
```

Or apply the SQL in `supabase/migrations/` manually.

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run demo` | Start app for demo (same as dev) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

**referential resources :-**

## referential resources

* next js – [https://nextjs.org/](https://nextjs.org/)
* tailwind css – [https://tailwindcss.com/](https://tailwindcss.com/)
* supabase – [https://supabase.com/](https://supabase.com/)
  * supabase google auth – https://supabase.com/docs/guides/auth/social-login/auth-google
  * supabase real time sync – https://supabase.com/realtime


## License

Private project -- having coding with 💖!!
