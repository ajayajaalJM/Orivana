import { shopifyFetch, isShopifyConfigured } from "./client";

let cachedLive: boolean | null = null;
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
  } catch {
    cachedLive = false;
  }

  cachedAt = Date.now();
  return cachedLive;
}

export function resetShopifyLiveCache() {
  cachedLive = null;
  cachedAt = 0;
}
