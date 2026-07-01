import {
  getShopifyConfig,
  getStorefrontApiUrl,
  isShopifyConfigured,
  getStoreDomain,
  getApiVersion,
} from "./config";

export {
  getShopifyConfig,
  isShopifyConfigured,
  getStoreDomain,
  getApiVersion,
  getStorefrontApiUrl,
};

export type { ShopifyConfig } from "./config";

export interface ShopifyFetchOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

function authHeaderSets(token: string): Record<string, string>[] {
  return [
    { "Shopify-Storefront-Private-Token": token },
    { "X-Shopify-Storefront-Access-Token": token },
  ];
}

/** Centralized Shopify Storefront API client — credentials from environment variables only. */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: ShopifyFetchOptions = {}
): Promise<T> {
  const config = getShopifyConfig();
  const endpoint = getStorefrontApiUrl();

  if (!config || !endpoint) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, and SHOPIFY_API_VERSION."
    );
  }

  const { cache, revalidate = 60, tags } = options;
  const nextOptions =
    cache === "no-store"
      ? { cache: "no-store" as const }
      : { next: { revalidate, ...(tags ? { tags } : {}) } };

  let lastError = "Shopify API request failed";

  for (const authHeaders of authHeaderSets(config.storefrontAccessToken)) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ query, variables }),
      ...nextOptions,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 402) {
        lastError =
          "Storefront API unavailable — use your Headless Private Storefront token in Vercel, not an Admin API token (shpat_).";
      } else {
        lastError = `Shopify API request failed (${res.status})`;
      }
      continue;
    }

    if (json.errors?.length) {
      lastError = json.errors[0]?.message ?? "Shopify API error";
      continue;
    }

    return json.data as T;
  }

  throw new Error(lastError);
}
