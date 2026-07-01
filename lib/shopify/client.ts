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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Private Storefront token — server-side only (Headless channel → Private access token)
      "Shopify-Storefront-Private-Token": config.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    ...nextOptions,
  });

  if (!res.ok) {
    throw new Error(`Shopify API request failed (${res.status})`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Shopify API error");
  }

  return json.data as T;
}
