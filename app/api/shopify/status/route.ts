import { NextResponse } from "next/server";
import { isShopifyConfigured } from "@/lib/shopify/config";
import { getCustomerAccountConfig } from "@/lib/shopify/customer-account/config";
import { isAdminApiConfigured } from "@/lib/shopify/admin";

export async function GET() {
  const customerAccountConfig = getCustomerAccountConfig();

  return NextResponse.json({
    storefront: isShopifyConfigured(),
    customerAccount: Boolean(customerAccountConfig),
    customerAccountClientType: customerAccountConfig?.clientType ?? null,
    admin: isAdminApiConfigured(),
    configured: isShopifyConfigured(),
  });
}
