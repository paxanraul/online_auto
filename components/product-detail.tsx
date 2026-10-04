"use client";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { ProductImage, type StoreProduct } from "./product-card";
import { useCart } from "./store-provider";
import { Button } from "./ui/button";
import { dictionary } from "@/lib/i18n";
import { money } from "@/lib/utils";
import type { Locale } from "@/lib/settings";
export function ProductDetail({
  product: p,
  currency,
  locale,
}: {
  product: StoreProduct & {
    compatibility: { make: string; model: string; verified: boolean }[];
  };
  currency: string;
  locale: Locale;
}) {
  const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const d = dictionary(locale);
  const name = locale === "az" ? p.nameAz || p.nameRu : p.nameRu;
  const description =
    locale === "az" ? p.descriptionAz || p.descriptionRu : p.descriptionRu;
  const orderable =
    p.available && p.price !== null && p.reviewed && p.status === "PUBLISHED";
  return (
    <div className="product-detail">
      <div>
        <div className="detail-main-image">
          <ProductImage
            key={p.images[image]}
            src={p.images[image]}
            alt={name}
          />
        </div>
        {p.images.length > 1 && (
          <div className="gallery-thumbs">
            {p.images.map((src, i) => (
              <button
                aria-label={`${name} ${i + 1}`}
                aria-pressed={image === i}
                key={src}
                onClick={() => setImage(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="detail-info">
        <p className="eyebrow">
          {locale === "az"
            ? p.category.nameAz || p.category.nameRu
            : p.category.nameRu}
        </p>
        <h1>{name}</h1>
        <div className="detail-price">
          {p.price ? money(p.price, currency, locale) : d.request}
        </div>
        {orderable ? (
          <>
            <div className="purchase-row">
              <label>
                {d.quantity}
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(99, Math.max(1, Number(e.target.value) || 1)),
                    )
                  }
                />
              </label>
              <Button
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
                    quantity,
                  );
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1800);
                }}
              >
                {added ? <Check size={19} /> : <ShoppingBag size={19} />}{" "}
                {added ? d.added : d.add}
              </Button>
            </div>
            <p className="muted detail-note">{d.noPayment}</p>
          </>
        ) : (
          <p className="availability">{d.unavailable}</p>
        )}
        {description && (
          <div className="detail-description">
            <h2>{d.description}</h2>
            <p>{description}</p>
          </div>
        )}
        {p.compatibility.some((c) => c.verified) && (
          <div className="detail-description">
            <h2>{d.compatibility}</h2>
            <ul>
              {p.compatibility
                .filter((c) => c.verified)
                .map((c, i) => (
                  <li key={i}>
                    {c.make} · {c.model}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
