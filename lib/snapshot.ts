import raw from './snapshot.json';
import type { SiteData } from './settings';
import type { StoreProduct } from '@/components/product-card';
type PublicProduct = StoreProduct & {category: StoreProduct['category'] & {slug:string}; compatibility:{make:string;model:string;verified:boolean}[]; createdAt:string};
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (src: string) => src.startsWith('/') ? base + src : src;
export const snapshot = {
 settings: { ...raw.settings, data: { ...raw.settings.data, logo: asset(raw.settings.data.logo), favicon: asset(raw.settings.data.favicon), heroImage: asset(raw.settings.data.heroImage) } as SiteData },
 categories: raw.categories.map(c => ({...c, image: asset(c.image)})),
 products: (raw.products as PublicProduct[]).map(p => ({...p, images: p.images.map(asset)})),
};
