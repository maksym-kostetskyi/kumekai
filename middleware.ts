import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

/**
 * Цей middleware оновлює сесію користувача (cookie)
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

  // Оновлення сесії юзера (анонімного чи ні)
  await supabase.auth.getSession();

  return response;
}

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Конфіг, що вказує, на яких шляхах має працювати middleware
export const config = {
  matcher: [
    /*
     * Зіставляти всі шляхи запитів, окрім тих, що починаються з:
     * - _next/static (статичні файли)
     * - _next/image (оптимізація зображень)
     * - favicon.ico (іконка)
     * Це оптимізує роботу, щоб middleware не запускався на кожне зображення.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
