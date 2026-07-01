export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

/** Strip protocol/trailing slash so env values like https://store.myshopify.com/ still work. */
export function normalizeStoreDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

/** Read Shopify credentials from environment variables (server-only). */
export function getShopifyConfig(): ShopifyConfig | null {
  const rawDomain = readEnv("SHOPIFY_STORE_DOMAIN");
  const storeDomain = rawDomain ? normalizeStoreDomain(rawDomain) : undefined;
  const storefrontAccessToken = readEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  const apiVersion = readEnv("SHOPIFY_API_VERSION");

  if (!storeDomain || !storefrontAccessToken || !apiVersion) {
    return null;
  }

  return { storeDomain, storefrontAccessToken, apiVersion };
}

export function isShopifyConfigured(): boolean {
  return getShopifyConfig() !== null;
}

export function getStoreDomain(): string | undefined {
  return getShopifyConfig()?.storeDomain;
}

export function getApiVersion(): string | undefined {
  return getShopifyConfig()?.apiVersion;
}

export function getStorefrontApiUrl(): string | null {
  const config = getShopifyConfig();
  if (!config) return null;
  return `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
}
