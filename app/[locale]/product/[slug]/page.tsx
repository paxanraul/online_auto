import Link from 'next/link';
import {notFound} from 'next/navigation';
import {snapshot} from '@/lib/snapshot';
import {settings,type Locale} from '@/lib/settings';
import {dictionary} from '@/lib/i18n';
import {ProductDetail} from '@/components/product-detail';
export function generateStaticParams(){return snapshot.products.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{locale:Locale;slug:string}>}){const {locale,slug}=await params;const p=snapshot.products.find(p=>p.slug===slug);return {title:p?(locale==='az'?p.nameAz||p.nameRu:p.nameRu):dictionary(locale).catalog,description:p?(locale==='az'?p.descriptionAz||p.descriptionRu:p.descriptionRu):undefined}}
export default async function ProductPage({params}:{params:Promise<{locale:Locale;slug:string}>}){const {locale,slug}=await params;const p=snapshot.products.find(p=>p.slug===slug);if(!p)notFound();const s=await settings();const d=dictionary(locale);return <main className="container product-page"><div className="breadcrumbs"><Link href={`/${locale}`}>{d.home}</Link><span>/</span><Link href={`/${locale}/catalog`}>{d.catalog}</Link><span>/</span>{locale==='az'?p.nameAz||p.nameRu:p.nameRu}</div><ProductDetail product={p} currency={s.currency} locale={locale}/></main>}
