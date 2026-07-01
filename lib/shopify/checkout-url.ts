import type { CartLine } from "./types";

/** Extract numeric variant ID from a Storefront API GID. */
export function parseShopifyVariantNumericId(gid: string): string | null {
  const match = gid.match(/ProductVariant\/(\d+)$/);
  return match?.[1] ?? null;
}

/** Mock catalog uses short fake IDs (e.g. ProductVariant/1). Real Shopify IDs are much larger. */
export function isLikelyShopifyVariantGid(gid: string): boolean {
  const numericId = parseShopifyVariantNumericId(gid);
  if (!numericId) return false;
  return numericId.length >= 10;
}

/** Fallback checkout when Storefront cart checkoutUrl is unavailable. */
export function buildCartPermalinkCheckoutUrl(
  lines: CartLine[],
  storeDomain: string
): string | null {
  if (!lines.length) return null;

  const segments: string[] = [];
  for (const line of lines) {
    const numericId = parseShopifyVariantNumericId(line.merchandise.variantId);
    if (!numericId || !isLikelyShopifyVariantGid(line.merchandise.variantId)) {
      return null;
    }
    segments.push(`${numericId}:${line.quantity}`);
  }

  return `https://${storeDomain}/cart/${segments.join(",")}`;
}
