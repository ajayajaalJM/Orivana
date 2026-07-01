export * from "./index";

// Server-only modules — import directly in API routes and server components:
//   @/lib/shopify/cart
//   @/lib/shopify/customers

export {
  createCart,
  getCart,
  getCurrentCart,
  addLineItem,
  addMultipleLineItems,
  updateLineQuantity,
  removeLineItem,
  addItemToCart,
  addMultipleToCart,
  updateCartLine,
  removeCartLine,
} from "./cart";

export {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  recoverCustomerPassword,
  getCustomer,
  getCustomerOrders,
  updateCustomerProfile,
} from "./customers";

export { resolveCheckoutUrl } from "./checkout-server";

export async function addToCart(variantId: string): Promise<{ success: boolean; checkoutUrl?: string }> {
  const { createCart } = await import("./cart");
  const result = await createCart([{ merchandiseId: variantId, quantity: 1 }]);
  return result.success && result.cart?.checkoutUrl
    ? { success: true, checkoutUrl: result.cart.checkoutUrl }
    : { success: false };
}
