import { getCurrentCart } from "./cart";
import { getCheckoutUrl } from "./checkout";

export async function resolveCheckoutUrl(): Promise<string | null> {
  const cart = await getCurrentCart();
  return getCheckoutUrl(cart.checkoutUrl);
}
