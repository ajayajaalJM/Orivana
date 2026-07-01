import { NextResponse } from "next/server";
import { getStoreDomain, isShopifyConfigured } from "@/lib/shopify/config";
import { getStorefrontError, isShopifyLive } from "@/lib/shopify/live";
import { getCustomerAccountConfig } from "@/lib/shopify/customer-account/config";
import { isAdminApiConfigured } from "@/lib/shopify/admin";

export async function GET() {
  const customerAccountConfig = getCustomerAccountConfig();
  const storefrontLive = await isShopifyLive();
  const storeDomain = getStoreDomain() ?? null;

  return NextResponse.json({
    storefront: isShopifyConfigured(),
    storeDomain,
    storefrontLive,
    storefrontError: storefrontLive ? null : getStorefrontError(),
    commerceMode: storefrontLive ? "shopify" : isShopifyConfigured() ? "degraded" : "demo",
    customerAccount: Boolean(customerAccountConfig),
    customerAccountClientType: customerAccountConfig?.clientType ?? null,
    admin: isAdminApiConfigured(),
  });
}
