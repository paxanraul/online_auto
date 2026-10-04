import { snapshot } from "./snapshot";
export type Locale = "ru" | "az";
export type Bilingual = { ru: string; az: string };
export type Section = {
  id: "intro" | "categories" | "featured" | "contacts";
  visible: boolean;
};
export type SiteData = {
  name: Bilingual;
  tagline: Bilingual;
  heroTitle: Bilingual;
  heroDescription: Bilingual;
  catalogTitle: Bilingual;
  featuredTitle: Bilingual;
  contactsTitle: Bilingual;
  business: Bilingual;
  address: Bilingual;
  hours: Bilingual;
  footer: Bilingual;
  maintenanceTitle: Bilingual;
  maintenanceMessage: Bilingual;
  metaTitle: Bilingual;
  metaDescription: Bilingual;
  catalogMetaTitle: Bilingual;
  catalogMetaDescription: Bilingual;
  contactsMetaTitle: Bilingual;
  contactsMetaDescription: Bilingual;
  cartMetaTitle: Bilingual;
  cartMetaDescription: Bilingual;
  logo: string;
  favicon: string;
  heroImage: string;
  phone: string;
  whatsapp: string;
  accent: string;
  featured: string[];
  sections: Section[];
  navigation: {
    type: "catalog" | "contacts";
    label: Bilingual;
    visible: boolean;
  }[];
};
export const defaults: SiteData = {
  name: { ru: "Автомобильные аксессуары", az: "Avtomobil aksesuarları" },
  tagline: { ru: "Для вашего автомобиля", az: "Avtomobiliniz üçün" },
  heroTitle: {
    ru: "Каждая деталь имеет значение.",
    az: "Hər detal önəmlidir.",
  },
  heroDescription: {
    ru: "Аксессуары для салона, ухода и комфортных поездок. Найдите то, что нужно вашему автомобилю.",
    az: "Salon, qulluq və rahat səfərlər üçün aksesuarlar. Avtomobilinizə lazım olanı tapın.",
  },
  catalogTitle: { ru: "Найдите свою категорию", az: "Kateqoriyanızı tapın" },
  featuredTitle: { ru: "В центре внимания", az: "Diqqət mərkəzində" },
  contactsTitle: { ru: "Будем на связи", az: "Əlaqədə olaq" },
  business: { ru: "", az: "" },
  address: { ru: "", az: "" },
  hours: { ru: "", az: "" },
  footer: {
    ru: "Аксессуары для повседневных поездок.",
    az: "Gündəlik səfərlər üçün aksesuarlar.",
  },
  maintenanceTitle: {
    ru: "Скоро снова в дороге",
    az: "Tezliklə yenidən yoldayıq",
  },
  maintenanceMessage: {
    ru: "Мы обновляем магазин. Пожалуйста, загляните чуть позже.",
    az: "Mağazamızı yeniləyirik. Zəhmət olmasa, bir qədər sonra yenidən baxın.",
  },
  metaTitle: { ru: "Автомобильные аксессуары", az: "Avtomobil aksesuarları" },
  metaDescription: {
    ru: "Каталог автомобильных аксессуаров для салона, ухода и поездок.",
    az: "Salon, qulluq və səfərlər üçün avtomobil aksesuarları kataloqu.",
  },
  catalogMetaTitle: { ru: "Каталог аксессуаров", az: "Aksesuarlar kataloqu" },
  catalogMetaDescription: {
    ru: "Аксессуары для вашего автомобиля по категориям.",
    az: "Kateqoriyalar üzrə avtomobiliniz üçün aksesuarlar.",
  },
  contactsMetaTitle: { ru: "Контакты", az: "Əlaqə" },
  contactsMetaDescription: {
    ru: "Свяжитесь с магазином автомобильных аксессуаров.",
    az: "Avtomobil aksesuarları mağazası ilə əlaqə saxlayın.",
  },
  cartMetaTitle: { ru: "Корзина", az: "Səbət" },
  cartMetaDescription: {
    ru: "Оформление заказа без онлайн-оплаты.",
    az: "Onlayn ödənişsiz sifarişin rəsmiləşdirilməsi.",
  },
  logo: "/logo.svg",
  favicon: "/logo.svg",
  heroImage: "/hero.webp",
  phone: "",
  whatsapp: "",
  accent: "#c74416",
  featured: [],
  sections: [
    { id: "intro", visible: true },
    { id: "categories", visible: true },
    { id: "featured", visible: true },
    { id: "contacts", visible: true },
  ],
  navigation: [
    { type: "catalog", label: { ru: "Каталог", az: "Kataloq" }, visible: true },
    { type: "contacts", label: { ru: "Контакты", az: "Əlaqə" }, visible: true },
  ],
};
export function local(value: Bilingual | undefined, locale: Locale) {
  return value?.[locale]?.trim() || value?.ru || "";
}
export async function settings() { return snapshot.settings; }
export const publicProductWhere = {
  status: "PUBLISHED" as const,
  reviewed: true,
  category: { visible: true },
};
