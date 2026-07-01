/** Site-wide SEO copy and social preview defaults. */
export const siteSeo = {
  title: "Orivana | Dates | Olive Oil",
  description:
    "Discover Orivana, a premium destination for healthy foods. Dates, artisan olive oil, honey, herbs, and handcrafted products. Ethically sourced, naturally exceptional, and delivered worldwide. Experience the rich flavours, traditions, and heritage of the Mediterranean in every order.",
  ogImageAlt: "Orivana brand logo — premium Mediterranean dates, olive oil, and honey",
  siteName: "Orivana",
  ogImageWidth: 1024,
  ogImageHeight: 536,
} as const;

/** Default /og.png in public/, or override with NEXT_PUBLIC_OG_IMAGE. */
export function getOgImagePath(): string {
  return process.env.NEXT_PUBLIC_OG_IMAGE?.trim() || "/og.png";
}

export function getOgImageUrl(baseUrl?: URL): string {
  const path = getOgImagePath();
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return baseUrl ? new URL(path, baseUrl).toString() : path;
}

export function getDefaultOpenGraphImages(baseUrl?: URL) {
  return [
    {
      url: getOgImageUrl(baseUrl),
      width: siteSeo.ogImageWidth,
      height: siteSeo.ogImageHeight,
      alt: siteSeo.ogImageAlt,
    },
  ];
}
