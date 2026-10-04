import { settings, local, type Locale } from "@/lib/settings";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const s = await settings();
  return {
    title: local(s.data.cartMetaTitle, locale),
    description: local(s.data.cartMetaDescription, locale),
    robots: { index: false, follow: false },
  };
}
export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
