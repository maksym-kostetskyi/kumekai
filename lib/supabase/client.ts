import { createBrowserClient } from "@supabase/ssr";

/**
 * Створює клієнт Supabase для Клієнтських Компонентів (браузера).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
