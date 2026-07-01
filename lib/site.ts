/** Public site URL from NEXT_PUBLIC_SITE_URL (canonical domain for metadata and links). */
export function getSiteUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return url || undefined;
}

export function absoluteUrl(path: string): string | undefined {
  const base = getSiteUrl();
  if (!base) return undefined;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
