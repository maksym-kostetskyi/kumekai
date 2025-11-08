// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/lib/supabase/auth-provider"; // <-- 1. Імпорт

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Кумекай",
  description: "PWA-платформа для вечіркових ігор",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        {/* 2. Обгортаємо {children} нашим провайдером */}
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
