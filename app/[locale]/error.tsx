"use client";
import { usePathname } from "next/navigation";
import { dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const d = dictionary(usePathname().startsWith("/az") ? "az" : "ru");
  return (
    <main className="container catalog-empty">
      <p role="alert">{d.network}</p>
      <Button onClick={reset}>{d.apply}</Button>
    </main>
  );
}
