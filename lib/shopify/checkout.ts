import { getStoreDomain } from "./config";

/**
 * Headless checkout URLs must bypass Online Store password protection.
 * Shopify recommends appending channel=headless-storefronts to cart checkout URLs.
 * @see https://community.shopify.dev/t/every-checkouturl-ends-up-with-password-page-site-under-construction/24378
 */
export function prepareCheckoutUrl(
  checkoutUrl: string | null | undefined
): string | null {
  if (!checkoutUrl?.trim()) return null;

  try {
    const url = new URL(checkoutUrl);
    if (!url.pathname.includes("/cart/c/") && !url.pathname.includes("/checkouts/")) {
      return checkoutUrl;
    }
    if (!url.searchParams.has("channel")) {
      url.searchParams.set("channel", "headless-storefronts");
    }
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

export function getCheckoutUrl(checkoutUrl: string | null | undefined): string | null {
  return prepareCheckoutUrl(checkoutUrl);
}

export function redirectToCheckout(checkoutUrl: string): string {
  return prepareCheckoutUrl(checkoutUrl) ?? checkoutUrl;
}

export function getCustomerAccountUrl(path = ""): string | null {
  const domain = getStoreDomain();
  if (!domain) return null;

  const storeHandle = domain.split(".")[0];
  if (!storeHandle) return null;

  const base = `https://shopify.com/${storeHandle}/account`;
  return path ? `${base}/${path.replace(/^\//, "")}` : base;
}

export function getForgotPasswordUrl(): string | null {
  return getCustomerAccountUrl("recover");
}
