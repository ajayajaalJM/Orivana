import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeAuthorizationCode } from "@/lib/shopify/customer-account/oauth";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { getSiteUrl } from "@/lib/site";

export async function GET(request: Request) {
  if (!isCustomerAccountConfigured()) {
    return NextResponse.redirect(`${getSiteUrl() ?? ""}/membership/login?error=not_configured`);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      `${getSiteUrl() ?? ""}/membership/login?error=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(`${getSiteUrl() ?? ""}/membership/login?error=missing_code`);
  }

  try {
    await exchangeAuthorizationCode(code, state);

    const store = await cookies();
    const returnTo = store.get("orivana-auth-return")?.value ?? "/membership";
    store.delete("orivana-auth-return");

    return NextResponse.redirect(`${getSiteUrl() ?? ""}${returnTo}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "callback_failed";
    return NextResponse.redirect(
      `${getSiteUrl() ?? ""}/membership/login?error=${encodeURIComponent(message)}`
    );
  }
}
