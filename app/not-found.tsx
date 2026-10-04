import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Страница не найдена / Səhifə tapılmadı</h1>
      <Link className="button" href="/ru">
        Главная
      </Link>
      <Link className="button button-outline" href="/az">
        Ana səhifə
      </Link>
    </main>
  );
}
