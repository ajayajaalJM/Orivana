import { shopifyFetch, isShopifyConfigured } from "./client";

let cachedLive: boolean | null = null;
let cachedError: string | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

/** True when env vars are set and the Storefront API responds successfully. */
export async function isShopifyLive(): Promise<boolean> {
  if (!isShopifyConfigured()) return false;

  if (cachedLive !== null && Date.now() - cachedAt < CACHE_MS) {
    return cachedLive;
  }

  try {
    await shopifyFetch<{ shop: { name: string } }>(
      `query { shop { name } }`,
      undefined,
      { cache: "no-store" }
    );
    cachedLive = true;
    cachedError = null;
  } catch (err) {
    cachedLive = false;
    cachedError = err instanceof Error ? err.message : "Storefront API unavailable";
  }

  cachedAt = Date.now();
  return cachedLive;
}

export function getStorefrontError(): string | null {
  return cachedError;
}

export function resetShopifyLiveCache() {
  cachedLive = null;
  cachedError = null;
  cachedAt = 0;
}
