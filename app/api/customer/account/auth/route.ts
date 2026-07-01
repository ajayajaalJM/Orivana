import { NextResponse } from "next/server";
import { buildAuthorizationUrl } from "@/lib/shopify/customer-account/oauth";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";

export async function GET(request: Request) {
  if (!isCustomerAccountConfigured()) {
    return NextResponse.json({ error: "Customer Account API is not configured" }, { status: 503 });
  }

  try {
    const url = new URL(request.url);
    const returnTo = url.searchParams.get("returnTo") ?? "/membership";
    const authUrl = await buildAuthorizationUrl();
    const redirectUrl = new URL(authUrl);
    redirectUrl.searchParams.set("ui_locales", "en");

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("orivana-auth-return", returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Auth failed" },
      { status: 500 }
    );
  }
}
