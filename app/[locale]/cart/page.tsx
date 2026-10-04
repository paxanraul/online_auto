"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "@/components/store-provider";
import { ProductImage } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { dictionary } from "@/lib/i18n";
import { money } from "@/lib/utils";
type Resolved = {
  id: string;
  slug: string;
  nameRu: string;
  nameAz: string;
  price: string | null;
  images: string[];
  available: boolean;
};
export default function CartPage() {
  const { items, currency, setCart, locale, ready } = useCart();
  const d = dictionary(locale);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState({ name: "", phone: "", comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<{ number: number } | null>(null);
  const [needsAck, setNeedsAck] = useState(false);
  const initial = useRef(false);
  const key = useRef("");
  const inFlight = useRef(false);
  const reconcile = (products: Resolved[], newCurrency: string) => {
    const changed =
      currency !== newCurrency ||
      items.some((i) => {
        const p = products.find((p) => p.id === i.id);
        return !p || !p.available || Number(p.price) !== Number(i.price);
      });
    const next = items.flatMap((i) => {
      const p = products.find((p) => p.id === i.id);
      return p && p.available && p.price
        ? [
            {
              ...i,
              slug: p.slug,
              nameRu: p.nameRu,
              nameAz: p.nameAz,
              price: String(p.price),
              image: p.images[0] ?? "",
            },
          ]
        : [];
    });
    if (changed) {
      setCart({ items: next, currency: newCurrency });
      setMessage(d.changed);
      setNeedsAck(true);
      key.current = "";
      sessionStorage.removeItem("autoshop-order-attempt");
    }
    return changed;
  };

  const update = (id: string, quantity: number) => {
    setCart({
      currency,
      items: items.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.min(99, Math.max(1, quantity)) }
          : i,
      ),
    });
  };
  async function submit(event: React.FormEvent) { event.preventDefault(); setMessage(locale === 'az' ? 'Statik önbaxışda sifariş göndərmək mümkün deyil.' : 'В статическом предпросмотре отправка заказа недоступна.'); }
  if (!ready)
    return (
      <main className="container cart-page" aria-live="polite">
        {d.load}
      </main>
    );
  if (success)
    return (
      <main className="container confirmation">
        <div className="success-icon">
          <Check size={35} />
        </div>
        <p className="eyebrow">
          {d.orderNumber} #{String(success.number).padStart(5, "0")}
        </p>
        <h1>{d.success}</h1>
        <p>{d.successText}</p>
        <Button asChild>
          <Link href={`/${locale}/catalog`}>{d.back}</Link>
        </Button>
      </main>
    );
  if (!items.length)
    return (
      <main className="container cart-page">
        <div className="catalog-empty">
          <ShoppingBag size={44} strokeWidth={1.3} />
          <h1>{d.emptyCart}</h1>
          <p>{d.emptyCartText}</p>
          {message && (
            <p role="status" className="notice">
              {message}
            </p>
          )}
          <Button asChild>
            <Link href={`/${locale}/catalog`}>{d.continue}</Link>
          </Button>
        </div>
      </main>
    );
  return (
    <main className="container cart-page">
      <p className="eyebrow">{d.cart}</p>
      <h1>
        {d.cart}{" "}
        <span className="muted">
          ({items.reduce((n, i) => n + i.quantity, 0)})
        </span>
      </h1>
      {message && (
        <p role="alert" className="notice">
          {message}
        </p>
      )}
      {needsAck && (
        <label className="checkbox-row">
          <input type="checkbox" onChange={() => setNeedsAck(false)} />
          {d.ack}
        </label>
      )}
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((i: CartItem) => (
            <article className="cart-item" key={i.id}>
              <Link
                href={`/${locale}/product/${i.slug}`}
                className="cart-image"
              >
                <ProductImage
                  src={i.image}
                  alt={locale === "az" ? i.nameAz || i.nameRu : i.nameRu}
                />
              </Link>
              <div>
                <Link
                  href={`/${locale}/product/${i.slug}`}
                  className="cart-product-name"
                >
                  {locale === "az" ? i.nameAz || i.nameRu : i.nameRu}
                </Link>
                <p className="muted">{money(i.price, currency, locale)}</p>
                <label className="sr-only" htmlFor={`quantity-${i.id}`}>
                  {d.quantity}
                </label>
                <div className="quantity-stepper">
                  <button
                    aria-label={`${d.quantity} −`}
                    onClick={() => update(i.id, i.quantity - 1)}
                    disabled={busy || i.quantity === 1}
                  >
                    −
                  </button>
                  <input
                    id={`quantity-${i.id}`}
                    type="number"
                    min="1"
                    max="99"
                    value={i.quantity}
                    disabled={busy}
                    onChange={(e) => update(i.id, Number(e.target.value) || 1)}
                  />
                  <button
                    aria-label={`${d.quantity} +`}
                    disabled={busy || i.quantity === 99}
                    onClick={() => update(i.id, i.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-line-total">
                <strong>
                  {money(Number(i.price) * i.quantity, currency, locale)}
                </strong>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={busy}
                  aria-label={`${d.remove}: ${i.nameRu}`}
                  onClick={() =>
                    setCart({
                      currency,
                      items: items.filter((p) => p.id !== i.id),
                    })
                  }
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </article>
          ))}
        </div>
        <form className="checkout-form" onSubmit={submit} noValidate>
          <h2>{d.checkout}</h2>
          <label>
            {d.name}
            <input
              autoComplete="name"
              name="name"
              aria-label={d.name}
              value={fields.name}
              disabled={busy}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              onChange={(e) => setFields({ ...fields, name: e.target.value })}
            />
            {errors.name && (
              <span id="name-error" className="field-error">
                {errors.name}
              </span>
            )}
          </label>
          <label>
            {d.phone}
            <input
              autoComplete="tel"
              type="tel"
              name="phone"
              aria-label={d.phone}
              value={fields.phone}
              disabled={busy}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              onChange={(e) => setFields({ ...fields, phone: e.target.value })}
            />
            {errors.phone && (
              <span id="phone-error" className="field-error">
                {errors.phone}
              </span>
            )}
          </label>
          <label>
            {d.comment} <small>{d.optional}</small>
            <textarea
              name="comment"
              aria-label={d.comment}
              maxLength={1000}
              value={fields.comment}
              disabled={busy}
              onChange={(e) =>
                setFields({ ...fields, comment: e.target.value })
              }
            />
          </label>
          <div className="checkout-total">
            <span>{d.total}</span>
            <strong>
              {money(
                items.reduce(
                  (n, i) => n + Math.round(Number(i.price) * 100) * i.quantity,
                  0,
                ) / 100,
                currency,
                locale,
              )}
            </strong>
          </div>
          <Button disabled={busy || needsAck} type="submit">
            {busy ? d.sending : d.submit}
          </Button>
          <p className="muted">{d.noPayment}</p>
        </form>
      </div>
    </main>
  );
}
