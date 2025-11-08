// proxy.ts (колишній middleware.ts)
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr"; // <-- Переконайтеся, що цей шлях правильний
import type { CookieOptions } from "@supabase/ssr";

/**
 * Цей proxy оновлює сесію користувача (cookie)
 * при кожному запиті до сайту.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getSession();

  return response;
}

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Конфіг залишається без змін
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
