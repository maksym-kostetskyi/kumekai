"use client";

import { useState, useTransition } from "react";
import { useSupabase } from "@/lib/supabase/auth-provider";
import { createRoom } from "./actions";

// --- ▼▼▼ КОД КАРТОК МАЄ БУТИ ТУТ ▼▼▼ ---

function GameCardBase({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col justify-between p-6 rounded-lg shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

function GameCardSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <GameCardBase className="bg-gray-800 opacity-60">
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <span className="px-3 py-1 text-sm font-semibold text-gray-900 bg-yellow-400 rounded-full">
          Незабаром!
        </span>
      </div>
    </GameCardBase>
  );
}

function GameCardAvailable({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <GameCardBase className="bg-gray-700 border-2 border-green-500">
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-green-700">
        <span className="px-3 py-1 text-sm font-semibold text-gray-900 bg-green-400 rounded-full">
          Безкоштовно
        </span>
      </div>
    </GameCardBase>
  );
}

// --- Головний компонент сторінки (Оновлено) ---
export default function Home() {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const { session } = useSupabase();

  // 3. Додаємо стан "очікування"
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCreateGame = () => {
    setError(null); // Скидаємо помилку

    // 4. Використовуємо startTransition для виклику Server Action
    startTransition(async () => {
      const result = await createRoom(nickname);
      if (result && !result.success) {
        setError(result.error || "Сталася невідома помилка.");
      }
      // Якщо успіх, `redirect()` в action сам перекине юзера
    });
  };

  const handleJoinGame = () => {
    // Логіку додамо в Задачі 3.3
    console.log("Приєднатись до кімнати:", roomCode, "з іменем:", nickname);
  };

  const isSessionLoading = !session;
  // 5. Блокуємо кнопки, якщо йде завантаження сесії АБО очікування відповіді від сервера
  const isInputDisabled = !nickname || isSessionLoading || isPending;

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 md:p-8 bg-gray-900 text-white">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-yellow-400 mb-8">
          Кумекай
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* --- Блок 1: "Вітрина" Ігор --- */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-3xl font-bold text-center">Доступні Ігри</h2>

            {/* ▼▼▼ ОСЬ ТУТ ВИПРАВЛЕННЯ ▼▼▼ */}
            <GameCardAvailable
              title="Коментоманія"
              description="Вгадайте трендове відео YouTube за одним коментарем!"
            />
            <GameCardSoon
              title="Словодром"
              description="Поясніть, покажіть або намалюйте слово своїй команді."
            />
            <GameCardSoon
              title="Пантоміма"
              description="Класична гра, де ви показуєте слова та фрази без звуку."
            />
            {/* ▲▲▲ КІНЕЦЬ ВИПРАВЛЕННЯ ▲▲▲ */}
          </div>

          {/* --- Блок 2: Форма входу (Оновлено) --- */}
          <div className="p-6 md:p-8 bg-gray-800 rounded-lg shadow-xl sticky top-8">
            <h2 className="text-3xl font-bold text-center mb-6">
              Почати нову гру
            </h2>

            <div className="flex flex-col space-y-4">
              {/* 1. Поле для імені */}
              <div>
                <label
                  htmlFor="nickname"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Ваше ігрове ім&apos;я
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Капітан Кумека"
                  className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  disabled={isSessionLoading || isPending} // <-- Оновлено
                />
                {isSessionLoading && (
                  <p className="mt-2 text-xs text-gray-400">
                    Завантаження сесії...
                  </p>
                )}
              </div>

              {/* 2. Кнопка "Створити" */}
              <button
                onClick={handleCreateGame}
                disabled={isInputDisabled} // <-- Оновлено
                className="w-full px-6 py-4 font-bold text-gray-900 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                {/* 6. Показуємо спіннер під час очікування */}
                {isPending ? "Створення..." : "Створити кімнату"}
              </button>

              {/* ... (код "АБО", "Код кімнати") ... */}
              <div className="flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-600" />
                <span className="px-3 text-gray-400">АБО</span>
                <div className="w-full border-t border-gray-600" />
              </div>

              <div>
                <label
                  htmlFor="roomCode"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Введіть код кімнати
                </label>
                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="КОД"
                  maxLength={6}
                  className="w-full px-4 py-3 text-white text-center font-mono text-lg tracking-widest bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isInputDisabled} // <-- Оновлено
                />
              </div>

              {/* ... (кнопка "Приєднатись") ... */}
              <button
                onClick={handleJoinGame}
                disabled={isInputDisabled || !roomCode}
                className="w-full px-6 py-4 font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                Приєднатись
              </button>

              {/* 7. Показуємо помилку, якщо вона є */}
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
