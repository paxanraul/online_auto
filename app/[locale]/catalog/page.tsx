import {Suspense} from 'react';
import Catalog from '@/components/static-catalog';
import {settings,local,type Locale} from '@/lib/settings';
export default async function Page({params}:{params:Promise<{locale:Locale}>}){const {locale}=await params;return <Suspense><Catalog locale={locale}/></Suspense>}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const s = await settings();
  return {
    title: local(s.data.catalogMetaTitle, locale),
    description: local(s.data.catalogMetaDescription, locale),
  };
}
