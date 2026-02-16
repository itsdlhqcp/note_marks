import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next") ?? "/";
  const next = nextParam.startsWith("/") ? nextParam : "/";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignored
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = new URL(next, requestUrl.origin).toString();
      const safeUrl = redirectUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return new NextResponse(
        `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${redirectUrl}"/><script>window.location.replace("${safeUrl}");</script></head><body>Redirecting...</body></html>`,
        {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-store",
          },
        }
      );
    }
  }

  const errorUrl = new URL("/?error=auth", requestUrl.origin).toString();
  const safeErrorUrl = errorUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return new NextResponse(
    `<!DOCTYPE html><html><head><script>window.location.replace("${safeErrorUrl}");</script></head><body>Redirecting...</body></html>`,
    {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-store",
      },
    }
  );
}
