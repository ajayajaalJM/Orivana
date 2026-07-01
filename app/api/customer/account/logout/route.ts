import { NextResponse } from "next/server";
import { clearCustomerAccountSession, getCustomerAccountSessionCookie } from "@/lib/shopify/customer-account/cookies";
import { logoutFromShopify } from "@/lib/shopify/customer-account/oauth";

export async function POST() {
  const session = await getCustomerAccountSessionCookie();
  if (session?.accessToken) {
    await logoutFromShopify(session.accessToken);
  }
  await clearCustomerAccountSession();
  return NextResponse.json({ success: true });
}
