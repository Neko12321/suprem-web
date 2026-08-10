import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suprem Record | Müzik Prodüksiyon Stüdyosu",
  description: "Suprem Record, müzikte sınırları zorlayan sanatçılar için yaratıcı prodüksiyon çözümleri sunar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
