import type { snapshot } from './snapshot';
export function productView(p: (typeof snapshot.products)[number]) { return p; }
