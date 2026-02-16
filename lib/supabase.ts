import { createClient as createBrowserClient } from "./supabase/client";

export { createClient } from "./supabase/client";

let _supabase: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createBrowserClient();
  }
  return _supabase;
}
