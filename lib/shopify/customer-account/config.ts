import { getStoreDomain } from "../config";
import { getSiteUrl } from "../../site";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export type CustomerAccountClientType = "public" | "confidential";

export interface CustomerAccountConfig {
  clientId: string;
  /** Present only for Confidential clients. Public clients use PKCE without a secret. */
  clientSecret?: string;
  clientType: CustomerAccountClientType;
  storeDomain: string;
  redirectUri: string;
}

export function getCustomerAccountConfig(): CustomerAccountConfig | null {
  const clientId = readEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID");
  const clientSecret = readEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET");
  const storeDomain = getStoreDomain();
  const siteUrl = getSiteUrl();

  if (!clientId || !storeDomain || !siteUrl) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    clientType: clientSecret ? "confidential" : "public",
    storeDomain,
    redirectUri: `${siteUrl}/api/customer/account/callback`,
  };
}

export function isCustomerAccountConfigured(): boolean {
  return getCustomerAccountConfig() !== null;
}
