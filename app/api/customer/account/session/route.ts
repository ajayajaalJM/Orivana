import { NextResponse } from "next/server";
import { getCustomerAccountProfile, isCustomerAccountAuthenticated } from "@/lib/shopify/customer-account/customer";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";

export async function GET() {
  if (!isCustomerAccountConfigured()) {
    return NextResponse.json({ configured: false, authenticated: false, session: null });
  }

  const authenticated = await isCustomerAccountAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ configured: true, authenticated: false, session: null });
  }

  const profile = await getCustomerAccountProfile();
  if (!profile) {
    return NextResponse.json({ configured: true, authenticated: false, session: null });
  }

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;

  return NextResponse.json({
    configured: true,
    authenticated: true,
    session: {
      user: {
        id: profile.id,
        name,
        email: profile.email,
        tier: profile.metafields.membershipTier ?? "individual",
        applicationStatus: profile.metafields.applicationStatus ?? "approved",
        businessName: profile.metafields.businessName,
        chefSupplyMode: profile.metafields.chefSupplyMode ?? false,
      },
      source: "customer-account",
    },
  });
}
