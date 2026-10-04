import { settings, local, type Locale } from "@/lib/settings";
import { ContactSection } from "@/components/contact-section";
import { dictionary } from "@/lib/i18n";
export default async function Contacts({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const s = await settings();
  return (
    <main className="container contacts-page">
      <p className="eyebrow">{dictionary(locale).contacts}</p>
      <ContactSection data={s.data} locale={locale} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const s = await settings();
  return {
    title: local(s.data.contactsMetaTitle, locale),
    description: local(s.data.contactsMetaDescription, locale),
  };
}
