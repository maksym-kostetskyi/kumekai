// app/actions.ts
"use server"; // Позначаємо, що це серверний код

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Наш серверний клієнт

// Тип для відповіді
type ActionResult = {
  success: boolean;
  roomCode?: string;
  error?: string;
};

export async function createRoom(nickname: string): Promise<ActionResult> {
  // 1. Перевіряємо, чи є ім'я
  if (!nickname.trim()) {
    return { success: false, error: "Ім'я не може бути порожнім." };
  }

  const supabase = await createClient();

  // 2. Перевіряємо сесію (чи є юзер, хоч анонімний)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Помилка сесії. Оновіть сторінку." };
  }

  // 3. Викликаємо нашу функцію з БД
  const { data: roomCode, error } = await supabase.rpc("create_game_room", {
    host_nickname: nickname,
  });

  if (error) {
    console.error("Supabase RPC error:", error);
    return {
      success: false,
      error: "Не вдалося створити кімнату. Спробуйте ще раз.",
    };
  }

  if (!roomCode) {
    return {
      success: false,
      error: "Помилка: кімнату створено, але не отримано код.",
    };
  }

  // 4. Успіх!
  console.log(`Room created with code: ${roomCode}`);

  // 5. Очищуємо кеш і перенаправляємо юзера
  revalidatePath("/"); // Оновлюємо дані на головній (на майбутнє)
  redirect(`/${roomCode}`); // Перехід на сторінку лобі
}
