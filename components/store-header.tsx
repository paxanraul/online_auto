"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, Check, Globe, Phone } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useCart } from "./store-provider";
import { dictionary } from "@/lib/i18n";
import { local, type SiteData, type Locale } from "@/lib/settings";
type Category = { id: string; slug: string; nameRu: string; nameAz: string };
export function StoreHeader({
  data,
  locale,
  categories,
  maintenance,
  admin,
}: {
  data: SiteData;
  locale: Locale;
  categories: Category[];
  maintenance: boolean;
  admin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();
  const d = dictionary(locale);
  const { items, ready } = useCart();
  const switchUrl = (lang: string) =>
    pathname.replace(/^\/(ru|az)(?=\/|$)/, `/${lang}`) +
    (params.toString() ? `?${params}` : "");
  const preview = admin && params.get("preview") === "1";
  const suffix = preview ? "?preview=1" : "";
  return (
    <>
      <header className="store-header">
        <div className="container header-inner">
          <Link
            href={`/${locale}${suffix}`}
            className="brand"
            aria-label={local(data.name, locale)}
          >
            <img src={data.logo} width={46} height={46} alt="" />
            <span>
              {local(data.name, locale)}
              <small>{local(data.tagline, locale)}</small>
            </span>
          </Link>
          {!maintenance && (
            <form
              action={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${locale}/catalog/`}
              className="header-search"
              role="search"
            >
              <Search size={20} />
              <input
                name="q"
                aria-label={d.search}
                placeholder={d.search}
                defaultValue={params.get("q") ?? ""}
              />
              {preview && <input type="hidden" name="preview" value="1" />}
              <button aria-label={d.searchButton}>
                <Search size={19} />
              </button>
            </form>
          )}
          <div className="header-actions">
            {!maintenance && (
              <Link
                href={`/${locale}/cart`}
                className="cart-link"
                aria-label={`${d.cart}: ${ready ? items.reduce((n, i) => n + i.quantity, 0) : 0}`}
              >
                <ShoppingBag size={23} />
                <span className="cart-word">{d.cart}</span>
                <span className="cart-count">
                  {ready ? items.reduce((n, i) => n + i.quantity, 0) : 0}
                </span>
              </Link>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label={d.menu}>
                  <Menu size={24} />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="drawer menu-drawer"
                closeLabel={d.close}
              >
                <DialogTitle className="drawer-title">{d.menu}</DialogTitle>
                <DialogDescription className="sr-only">
                  {d.catalog} · {d.contacts} · {d.language}
                </DialogDescription>
                <nav aria-label={d.menu}>
                  {data.navigation
                      .filter((n) => n.visible)
                      .map((n, i) => (
                        <Link
                          key={i}
                          className="menu-main-link"
                          href={`/${locale}/${n.type}${suffix}`}
                          onClick={() => setOpen(false)}
                        >
                          {local(n.label, locale)}
                        </Link>
                      ))}
                  {(
                    <div className="menu-categories">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/${locale}/catalog?category=${c.slug}${preview ? "&preview=1" : ""}`}
                          onClick={() => setOpen(false)}
                        >
                          {locale === "az" ? c.nameAz || c.nameRu : c.nameRu}
                        </Link>
                      ))}
                    </div>
                  )}
                  {data.phone && (
                    <a
                      className="menu-main-link"
                      href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}
                    >
                      <Phone size={18} />
                      {data.phone}
                    </a>
                  )}
                </nav>
                <div className="language-picker">
                  <p>
                    <Globe size={17} />
                    {d.language}
                  </p>
                  {(["ru", "az"] as const).map((l) => (
                    <Link
                      key={l}
                      href={switchUrl(l)}
                      onClick={() => setOpen(false)}
                      className={locale === l ? "selected" : ""}
                      hrefLang={l}
                    >
                      {l === "ru" ? "Русский" : "Azərbaycanca"}
                      {locale === l && <Check size={17} />}
                    </Link>
                  ))}
                </div>
                {admin && (
                  <Link href="/admin" className="admin-shortcut">
                    Администрирование
                  </Link>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      {(
        <div className="catalog-nav">
          <div className="container">
            <Link
              className="catalog-nav-all"
              href={`/${locale}/catalog${suffix}`}
            >
              <Menu size={17} />
              {d.catalog}
            </Link>
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/${locale}/catalog?category=${c.slug}${preview ? "&preview=1" : ""}`}
              >
                {locale === "az" ? c.nameAz || c.nameRu : c.nameRu}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
