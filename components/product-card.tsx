"use client";
import { useState } from "react";
import Link from "next/link";
import { ImageOff, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "./store-provider";
import { dictionary } from "@/lib/i18n";
import { money } from "@/lib/utils";
import type { Locale } from "@/lib/settings";
export type StoreProduct = {
  id: string;
  slug: string;
  nameRu: string;
  nameAz: string;
  descriptionRu: string;
  descriptionAz: string;
  price: string | null;
  images: string[];
  available: boolean;
  status: string;
  reviewed: boolean;
  category: { nameRu: string; nameAz: string };
};
export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const { locale } = useCart();
  return src && !failed ? (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className={`image-placeholder ${className}`}>
      <ImageOff size={34} strokeWidth={1.3} />
      <span>{dictionary(locale).photo}</span>
    </div>
  );
}
export function ProductCard({
  product: p,
  locale,
  currency,
  preview = false,
}: {
  product: StoreProduct;
  locale: Locale;
  currency: string;
  preview?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const d = dictionary(locale);
  const name = locale === "az" ? p.nameAz || p.nameRu : p.nameRu;
  const orderable =
    p.available && p.price !== null && p.status === "PUBLISHED" && p.reviewed;
  return (
    <article className="product-card">
      <Link
        className="product-image"
        href={`/${locale}/product/${p.slug}${preview ? "?preview=1" : ""}`}
      >
        <ProductImage src={p.images[0]} alt={name} />
        {!p.reviewed && <span className="product-badge">{d.draft}</span>}
      </Link>
      <div className="product-card-content">
        <small>
          {locale === "az"
            ? p.category.nameAz || p.category.nameRu
            : p.category.nameRu}
        </small>
        <Link
          className="product-name"
          href={`/${locale}/product/${p.slug}${preview ? "?preview=1" : ""}`}
        >
          {name}
        </Link>
        <div className="product-card-bottom">
          <strong>
            {p.price ? money(p.price, currency, locale) : d.request}
          </strong>
          {orderable ? (
            <Button
              size="icon"
              aria-label={`${d.add}: ${name}`}
              onClick={() => {
                add(
                  {
                    id: p.id,
                    slug: p.slug,
                    nameRu: p.nameRu,
                    nameAz: p.nameAz,
                    price: p.price!,
                    image: p.images[0],
                  },
                  1,
                );
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
            >
              {added ? <Check size={19} /> : <Plus size={20} />}
            </Button>
          ) : (
            <Link
              className="text-link"
              href={`/${locale}/product/${p.slug}${preview ? "?preview=1" : ""}`}
            >
              {d.view}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
