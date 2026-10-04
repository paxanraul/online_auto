"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  const locale = usePathname().startsWith("/az") ? "az" : "ru";
  const d = dictionary(locale);
  return (
    <main className="container confirmation">
      <p className="eyebrow">404</p>
      <h1>{locale === "az" ? "Səhifə tapılmadı" : "Страница не найдена"}</h1>
      <Button asChild>
        <Link href={`/${locale}/catalog`}>{d.backCatalog}</Link>
      </Button>
    </main>
  );
}
