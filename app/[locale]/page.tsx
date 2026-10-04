import Link from "next/link";
import {
  LayoutGrid,
  Armchair,
  Smartphone,
  Package,
  Car,
  Sparkles,
  Compass,
  Layers,
} from "lucide-react";
import { snapshot } from "@/lib/snapshot";
import {
  settings,
  local,
  publicProductWhere,
  type Locale,
} from "@/lib/settings";
import { dictionary } from "@/lib/i18n";
import { productView } from "@/lib/catalog";
import { ProductCard, type StoreProduct } from "@/components/product-card";
import { ContactSection } from "@/components/contact-section";
import { Button } from "@/components/ui/button";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const s = await settings();
  const categories = snapshot.categories;
  const preview = false;
  const products = snapshot.products.filter(p => !s.data.featured.length || s.data.featured.includes(p.id)).slice(0,8);
  const d = dictionary(locale);
  const suffix = preview ? "?preview=1" : "";
  const icons = [
    LayoutGrid,
    Layers,
    Armchair,
    Smartphone,
    Package,
    Car,
    Sparkles,
    Compass,
  ];
  return (
    <main>
      {preview && <div className="preview-banner">{d.preview}</div>}
      {s.data.sections
        .filter((section) => section.visible)
        .map((section) => {
          if (section.id === "intro")
            return (
              <section className="container hero" key={section.id}>
                <div className="hero-copy">
                  <p className="eyebrow">
                    <span className="orange-line" />
                    {d.introEyebrow}
                  </p>
                  <h1>{local(s.data.heroTitle, locale)}</h1>
                  <p>{local(s.data.heroDescription, locale)}</p>
                  <Button asChild>
                    <Link href={`/${locale}/catalog${suffix}`}>
                      {d.discover}
                    </Link>
                  </Button>
                  <span className="hero-caption">{d.categoryEyebrow}</span>
                </div>
                {s.data.heroImage && (
                  <div className="hero-image">
                    <img src={s.data.heroImage} alt="" fetchPriority="high" />
                    <span className="hero-image-label">
                      {local(s.data.tagline, locale)}
                    </span>
                  </div>
                )}
              </section>
            );
          if (section.id === "categories")
            return (
              <section className="container section" key={section.id}>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">01 / {d.categories}</p>
                    <h2>{local(s.data.catalogTitle, locale)}</h2>
                  </div>
                  <Link
                    href={`/${locale}/catalog${suffix}`}
                    className="text-link"
                  >
                    {d.allCategories}
                  </Link>
                </div>
                <div className="category-grid">
                  {categories.map((c, i) => {
                    const Icon = icons[i % icons.length];
                    return (
                      <Link
                        key={c.id}
                        className="category-card"
                        href={`/${locale}/catalog?category=${c.slug}${preview ? "&preview=1" : ""}`}
                      >
                        {c.image ? (
                          <img src={c.image} alt="" />
                        ) : (
                          <div className="category-icon">
                            <Icon size={28} strokeWidth={1.5} />
                          </div>
                        )}
                        <span className="category-index">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3>
                          {locale === "az" ? c.nameAz || c.nameRu : c.nameRu}
                        </h3>
                        <p>
                          {locale === "az"
                            ? c.descriptionAz || c.descriptionRu
                            : c.descriptionRu}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          if (section.id === "featured")
            return (
              <section className="container section" key={section.id}>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">02 / {d.catalog}</p>
                    <h2>{local(s.data.featuredTitle, locale)}</h2>
                  </div>
                  <Link
                    className="text-link"
                    href={`/${locale}/catalog${suffix}`}
                  >
                    {d.all}
                  </Link>
                </div>
                {products.length ? (
                  <div className="product-grid">
                    {products.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={productView(p) as StoreProduct}
                        locale={locale}
                        currency={s.currency}
                        preview={preview}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="catalog-empty">
                    <Package size={36} strokeWidth={1.3} />
                    <h3>{d.noProducts}</h3>
                    <Link className="text-link" href={`/${locale}/catalog`}>
                      {d.allCategories}
                    </Link>
                  </div>
                )}
              </section>
            );
          return (
            <section className="contact-strip" key={section.id}>
              <div className="container">
                <ContactSection data={s.data} locale={locale} />
              </div>
            </section>
          );
        })}
    </main>
  );
}
