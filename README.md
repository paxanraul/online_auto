# Online Auto frontend

Static export of the original local Next.js storefront: the same CSS, header, menu, language picker, category icons, product cards, detail pages, contacts and cart. Public catalog data is captured at build preparation time; database access, API routes and admin pages are excluded. Order submission is unavailable in the static preview.

Run `npm ci`, then `NEXT_PUBLIC_BASE_PATH=/online_auto npm run build`. GitHub Actions publishes `out`. The local source project regenerates this deployment checkout with `npx tsx scripts/prepare-pages.ts`.
