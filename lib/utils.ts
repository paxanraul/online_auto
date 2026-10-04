import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function money(value: number | string, currency: string, locale = "ru") {
  return new Intl.NumberFormat(locale === "az" ? "az-AZ" : "ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}
export function serial<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
