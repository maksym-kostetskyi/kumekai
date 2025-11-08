"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "./client"; // Наш клієнт для браузера
import type { SupabaseClient, Session } from "@supabase/supabase-js";

// Типізуємо дані, які буде надавати наш провайдер
type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
};

// Створюємо контекст з початковим значенням null
const SupabaseContext = createContext<SupabaseContextType | null>(null);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 1. Отримати початкову сесію
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getInitialSession();

    // 2. Слідкувати за змінами сесії
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Відписатися від слухача при "розмонтуванні" компонента
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Створюємо кастомний "хук" для легкого доступу до контексту
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
