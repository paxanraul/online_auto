import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Автомобильные аксессуары",
  description: "Аксессуары для вашего автомобиля",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "ru";
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
