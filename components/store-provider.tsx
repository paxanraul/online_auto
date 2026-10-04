"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/lib/settings";
export type CartItem = {
  id: string;
  slug: string;
  nameRu: string;
  nameAz: string;
  price: string;
  image: string;
  quantity: number;
};
type Cart = { items: CartItem[]; currency: string };
type CartContext = Cart & {
  ready: boolean;
  setCart: (cart: Cart) => void;
  add: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  locale: Locale;
};
const Context = createContext<CartContext | null>(null);
export function StoreProvider({
  children,
  locale,
  currency,
}: {
  children: React.ReactNode;
  locale: Locale;
  currency: string;
}) {
  const [cart, update] = useState<Cart>({ items: [], currency });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    document.documentElement.lang = locale;
    try { localStorage.setItem("autoshop-locale", locale); } catch {}
    const read = () => {
      try {
        const parsed = JSON.parse(
          localStorage.getItem("autoshop-cart-v1") ?? "null",
        );
        if (
          parsed &&
          typeof parsed.currency === "string" &&
          Array.isArray(parsed.items)
        )
          update({
            currency: parsed.currency,
            items: parsed.items
              .filter(
                (i: CartItem) =>
                  typeof i.id === "string" &&
                  typeof i.nameRu === "string" &&
                  typeof i.price === "string" &&
                  Number.isFinite(Number(i.price)) &&
                  Number(i.price) > 0 &&
                  Number.isInteger(i.quantity) &&
                  i.quantity > 0 &&
                  i.quantity <= 99,
              )
              .slice(0, 100),
          });
      } catch {}
    };
    read();
    setReady(true);
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, [locale]);
  const setCart = (next: Cart) => {
    update(next);
    localStorage.setItem("autoshop-cart-v1", JSON.stringify(next));
  };
  const add = (item: Omit<CartItem, "quantity">, quantity: number) => {
    const prior = cart.items.find((i) => i.id === item.id);
    const items = prior
      ? cart.items.map((i) =>
          i.id === item.id
            ? { ...item, quantity: Math.min(99, i.quantity + quantity) }
            : i,
        )
      : [...cart.items, { ...item, quantity }];
    setCart({ items, currency: cart.items.length ? cart.currency : currency });
  };
  return (
    <Context.Provider value={{ ...cart, ready, setCart, add, locale }}>
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const value = useContext(Context);
  if (!value) throw new Error("Cart provider missing");
  return value;
}
