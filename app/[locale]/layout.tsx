import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { settings, local, type Locale } from "@/lib/settings";
import { snapshot } from "@/lib/snapshot";
import { StoreProvider } from "@/components/store-provider";
import { StoreHeader } from "@/components/store-header";
import { ContactSection } from "@/components/contact-section";
import { dictionary } from "@/lib/i18n";
export function generateStaticParams() { return [{locale:"ru"}, {locale:"az"}]; }
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const s = await settings();
  const l = locale === "az" ? "az" : "ru";
  return {
    title: {
      default: local(s.data.metaTitle, l),
      template: `%s · ${local(s.data.name, l)}`,
    },
    description: local(s.data.metaDescription, l),
    icons: { icon: s.data.favicon },
    alternates: { languages: { ru: "/ru", az: "/az" } },
  };
}
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (raw !== "ru" && raw !== "az") notFound();
  const locale = raw as Locale;
  const s = await settings();
  const admin = false;
  const categories = snapshot.categories;
  const maintenance = s.maintenance && !admin;
  const d = dictionary(locale);
  return (
    <StoreProvider locale={locale} currency={s.currency}>
      <div
        className="store"
        style={{ "--accent": s.data.accent } as React.CSSProperties}
      >
        <Suspense>
          <StoreHeader
            data={s.data}
            locale={locale}
            categories={categories}
            maintenance={maintenance}
            admin={!!admin}
          />
        </Suspense>
        {maintenance ? (
          <main className="maintenance">
            <div className="maintenance-logo">
              <img src={s.data.logo} width={72} height={72} alt="" />
            </div>
            <p className="eyebrow">{local(s.data.tagline, locale)}</p>
            <h1>{local(s.data.maintenanceTitle, locale)}</h1>
            <p>{local(s.data.heroDescription, locale)}</p>
            <p>{local(s.data.maintenanceMessage, locale)}</p>
            <ContactSection data={s.data} locale={locale} />
          </main>
        ) : (
          <>
            {s.maintenance && admin && (
              <div className="preview-banner">
                Режим обслуживания включён. Вы видите магазин как администратор.
              </div>
            )}
            {children}
            <footer className="store-footer">
              <div className="container footer-inner">
                <div className="brand">
                  <img src={s.data.logo} width={36} height={36} alt="" />
                  <span>
                    {local(s.data.name, locale)}
                    <small>{local(s.data.footer, locale)}</small>
                  </span>
                </div>
                <nav>
                  {s.data.navigation
                    .filter((n) => n.visible)
                    .map((n, i) => (
                      <Link key={i} href={`/${locale}/${n.type}`}>
                        {local(n.label, locale)}
                      </Link>
                    ))}
                </nav>
                <span className="footer-lang">
                  {locale === "ru" ? "Русский" : "Azərbaycanca"} · {s.currency}
                </span>
              </div>
            </footer>
          </>
        )}
      </div>
    </StoreProvider>
  );
}
