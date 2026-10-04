"use client";
import Link from "next/link";
import { Package } from "lucide-react";
import { snapshot } from "@/lib/snapshot";
import { useSearchParams } from "next/navigation";
import {
  settings,
  local,
  publicProductWhere,
  type Locale,
} from "@/lib/settings";
import { dictionary } from "@/lib/i18n";
import { productView } from "@/lib/catalog";
import { ProductCard, type StoreProduct } from "@/components/product-card";
import { CatalogFilters } from "@/components/catalog-filters";
import { Button } from "@/components/ui/button";
type Query = {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
  min?: string;
  max?: string;
  make?: string;
  model?: string;
  preview?: string;
};
export default function Catalog({locale}:{locale:Locale}) {
 const searchParams=useSearchParams();
 const q:Query=Object.fromEntries(searchParams.entries());
 const s=snapshot.settings; const categories=snapshot.categories; const preview=false; const d=dictionary(locale);
 const verified=snapshot.products.flatMap(p=>p.compatibility.filter(c=>c.verified).map(c=>({...c,id:p.id})));
 const makes=[...new Set(verified.map(c=>c.make))].sort();
 const models=[...new Set(verified.filter(c=>c.make===q.make).map(c=>c.model))].sort();
 const filtered=snapshot.products.filter(p=>{
 const text=[p.nameRu,p.nameAz,p.descriptionRu,p.descriptionAz].join(' ').toLocaleLowerCase(locale);
 return (!q.category||p.category.slug===q.category)&&(!q.q||text.includes(q.q.slice(0,200).toLocaleLowerCase(locale)))&&(!q.min||(p.price!==null&&Number(p.price)>=Number(q.min)))&&(!q.max||(p.price!==null&&Number(p.price)<=Number(q.max)))&&(!q.make||p.compatibility.some(c=>c.verified&&c.make===q.make&&(!q.model||c.model===q.model)));
 });
 filtered.sort((a,b)=>{if(q.sort==='name')return (locale==='az'?a.nameAz||a.nameRu:a.nameRu).localeCompare(locale==='az'?b.nameAz||b.nameRu:b.nameRu,locale); if(q.sort==='priceAsc'||q.sort==='priceDesc'){if(a.price===null)return b.price===null?0:1;if(b.price===null)return -1;return (Number(a.price)-Number(b.price))*(q.sort==='priceAsc'?1:-1)}return 0});
 const count=filtered.length; const pages=Math.max(1,Math.ceil(count/12)); const page=Math.min(pages,Math.floor(Math.max(1,Number(q.page)||1))); const products=filtered.slice((page-1)*12,page*12);
  const url = (changes: Query) => {
    const p = new URLSearchParams();
    Object.entries({ ...q, ...changes }).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    if (!preview) p.delete("preview");
    return `/${locale}/catalog?${p}`;
  };
  const category = categories.find((c) => c.slug === q.category);
  const title = category
    ? locale === "az"
      ? category.nameAz || category.nameRu
      : category.nameRu
    : d.all;
  const form = (
    <form action={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${locale}/catalog/`} className="filter-form">
      {preview && <input type="hidden" name="preview" value="1" />}
      {q.q && <input type="hidden" name="q" value={q.q} />}
      <label>
        {d.categories}
        <select name="category" defaultValue={q.category ?? ""}>
          <option value="">{d.all}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {locale === "az" ? c.nameAz || c.nameRu : c.nameRu}
            </option>
          ))}
        </select>
      </label>
      <label>
        {d.sort}
        <select name="sort" defaultValue={q.sort ?? "newest"}>
          <option value="newest">{d.newest}</option>
          <option value="priceAsc">{d.priceAsc}</option>
          <option value="priceDesc">{d.priceDesc}</option>
          <option value="name">{d.nameSort}</option>
        </select>
      </label>
      <fieldset>
        <legend>
          {d.price} · {s.currency}
        </legend>
        <div className="price-inputs">
          <input
            aria-label={d.from}
            type="number"
            name="min"
            min="0"
            step="0.01"
            placeholder={d.from}
            defaultValue={q.min}
          />
          <input
            aria-label={d.to}
            type="number"
            name="max"
            min="0"
            step="0.01"
            placeholder={d.to}
            defaultValue={q.max}
          />
        </div>
      </fieldset>
      {makes.length > 0 && (
        <>
          <label>
            {d.make}
            <select name="make" defaultValue={q.make ?? ""}>
              <option value="">{d.all}</option>
              {makes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          {q.make && (
            <label>
              {d.model}
              <select name="model" defaultValue={q.model ?? ""}>
                <option value="">{d.all}</option>
                {models.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
          )}
        </>
      )}
      <Button type="submit">{d.apply}</Button>
      <Link
        className="text-link"
        href={`/${locale}/catalog${preview ? "?preview=1" : ""}`}
      >
        {d.reset}
      </Link>
    </form>
  );
  return (
    <main className="container catalog-page">
      {preview && <div className="preview-banner">{d.preview}</div>}
      <div className="breadcrumbs">
        <Link href={`/${locale}`}>{d.home}</Link>
        <span>/</span>
        {d.catalog}
      </div>
      <div className="catalog-title">
        <div>
          <p className="eyebrow">{d.catalog}</p>
          <h1>{title}</h1>
          {q.q && <p>«{q.q}»</p>}
        </div>
        <span>
          {count} {d.products}
        </span>
      </div>
      <div className="catalog-layout">
        <CatalogFilters key={searchParams.toString()} locale={locale}>{form}</CatalogFilters>
        <div className="catalog-results">
          {products.length ? (
            <div className="product-grid catalog-product-grid">
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
              <Package size={40} strokeWidth={1.3} />
              <h2>{q.q || q.min || q.max ? d.noResults : d.noProducts}</h2>
              <p>{q.category ? d.emptyCategory : d.noResultsText}</p>
              <Link
                href={`/${locale}/catalog${preview ? "?preview=1" : ""}`}
                className="text-link"
              >
                {d.reset}
              </Link>
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label={d.page}>
              {page > 1 && (
                <Link href={url({ page: String(page - 1) })}>{d.previous}</Link>
              )}
              <span>
                {d.page} {page} / {pages}
              </span>
              {page < pages && (
                <Link href={url({ page: String(page + 1) })}>{d.next}</Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
