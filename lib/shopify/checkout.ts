import { getStoreDomain } from "./config";

export function getCheckoutUrl(checkoutUrl: string | null | undefined): string | null {
  return checkoutUrl ?? null;
}

export function redirectToCheckout(checkoutUrl: string): string {
  return checkoutUrl;
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
