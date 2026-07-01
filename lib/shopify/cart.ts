import {
  getCartIdFromCookie,
  setCartIdCookie,
  getMockCartFromCookie,
  setMockCartCookie,
  clearCartCookies,
} from "../cart-cookie";
import { CART_FRAGMENT, isShopifyConfigured, shopifyFetch } from "./graphql";
import { findVariantProduct, formatPrice } from "./products";
import type { AddToCartResult, Cart, CartLine } from "./types";

export { formatPrice };

type ShopifyCartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: Cart["cost"];
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: { amount: string; currencyCode: string };
          product: {
            handle: string;
            title: string;
            featuredImage: { url: string; altText: string | null } | null;
          };
        };
      };
    }[];
  };
};

function parseOrigin(title: string): string | undefined {
  const parts = title.split("—");
  return parts[1]?.trim();
}

export function mapShopifyCart(node: ShopifyCartNode): Cart {
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    cost: node.cost,
    lines: node.lines.edges.map(({ node: line }) => ({
      id: line.id,
      quantity: line.quantity,
      merchandise: {
        variantId: line.merchandise.id,
        productHandle: line.merchandise.product.handle,
        productTitle: line.merchandise.product.title,
        variantTitle: line.merchandise.title,
        origin: parseOrigin(line.merchandise.product.title),
        imageUrl: line.merchandise.product.featuredImage?.url ?? null,
        price: line.merchandise.price,
        availableForSale: line.merchandise.availableForSale,
      },
    })),
  };
}

function emptyCart(): Cart {
  return {
    id: "",
    checkoutUrl: null,
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
    },
    lines: [],
  };
}

async function fetchShopifyCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCartNode | null }>(
    `${CART_FRAGMENT}
     query getCart($cartId: ID!) {
       cart(id: $cartId) { ...CartFields }
     }`,
    { cartId },
    { cache: "no-store" }
  );
  return data.cart ? mapShopifyCart(data.cart) : null;
}

async function getMockCart(): Promise<Cart> {
  const raw = await getMockCartFromCookie();
  if (!raw) return { ...emptyCart(), id: "mock-cart" };
  try {
    return JSON.parse(raw) as Cart;
  } catch {
    return { ...emptyCart(), id: "mock-cart" };
  }
}

async function saveMockCart(cart: Cart) {
  await setMockCartCookie(JSON.stringify(cart));
}

function recalculateMockCart(lines: CartLine[]): Cart {
  let total = 0;
  for (const line of lines) {
    total += parseFloat(line.merchandise.price.amount) * line.quantity;
  }
  const amount = total.toFixed(2);
  return {
    id: "mock-cart",
    checkoutUrl: null,
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    cost: {
      subtotalAmount: { amount, currencyCode: "USD" },
      totalAmount: { amount, currencyCode: "USD" },
    },
    lines,
  };
}

async function addToMockCart(variantId: string, quantity: number): Promise<Cart> {
  const found = await findVariantProduct(variantId);
  if (!found) throw new Error("Product not found");

  const { product, variant } = found;
  const cart = await getMockCart();
  const existing = cart.lines.find((l) => l.merchandise.variantId === variantId);

  let lines: CartLine[];
  if (existing) {
    lines = cart.lines.map((l) =>
      l.merchandise.variantId === variantId
        ? { ...l, quantity: l.quantity + quantity }
        : l
    );
  } else {
    lines = [
      ...cart.lines,
      {
        id: `mock-line-${variantId}`,
        quantity,
        merchandise: {
          variantId: variant.id,
          productHandle: product.handle,
          productTitle: product.title,
          variantTitle: variant.title,
          origin: product.origin ?? parseOrigin(product.title),
          imageUrl: product.featuredImage?.url ?? null,
          price: variant.price,
          availableForSale: variant.availableForSale,
        },
      },
    ];
  }

  const updated = recalculateMockCart(lines);
  await saveMockCart(updated);
  return updated;
}

async function updateMockLine(lineId: string, quantity: number): Promise<Cart> {
  const cart = await getMockCart();
  const lines =
    quantity <= 0
      ? cart.lines.filter((l) => l.id !== lineId)
      : cart.lines.map((l) => (l.id === lineId ? { ...l, quantity } : l));
  const updated = recalculateMockCart(lines);
  await saveMockCart(updated);
  return updated;
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<AddToCartResult> {
  if (!isShopifyConfigured()) {
    let cart = await getMockCart();
    for (const line of lines) {
      cart = await addToMockCart(line.merchandiseId, line.quantity);
    }
    return { success: true, cart };
  }

  try {
    const data = await shopifyFetch<{
      cartCreate: { cart: ShopifyCartNode | null; userErrors: { message: string }[] };
    }>(
      `${CART_FRAGMENT}
       mutation cartCreate($lines: [CartLineInput!]!) {
         cartCreate(input: { lines: $lines }) {
           cart { ...CartFields }
           userErrors { message }
         }
       }`,
      { lines },
      { cache: "no-store" }
    );

    if (data.cartCreate.userErrors?.length) {
      return { success: false, error: data.cartCreate.userErrors[0].message };
    }
    if (!data.cartCreate.cart) return { success: false, error: "Failed to create cart" };

    await setCartIdCookie(data.cartCreate.cart.id);
    return { success: true, cart: mapShopifyCart(data.cartCreate.cart) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Cart error" };
  }
}

export async function getCart(cartId?: string): Promise<Cart> {
  if (!isShopifyConfigured()) {
    return getMockCart();
  }

  const id = cartId ?? (await getCartIdFromCookie());
  if (!id) return emptyCart();

  try {
    const cart = await fetchShopifyCart(id);
    if (!cart) {
      await clearCartCookies();
      return emptyCart();
    }
    return cart;
  } catch {
    await clearCartCookies();
    return emptyCart();
  }
}

export async function getCurrentCart(): Promise<Cart> {
  return getCart();
}

export async function addLineItem(
  variantId: string,
  quantity = 1
): Promise<AddToCartResult> {
  try {
    if (!isShopifyConfigured()) {
      const cart = await addToMockCart(variantId, quantity);
      return { success: true, cart };
    }

    const cartId = await getCartIdFromCookie();

    if (!cartId) {
      return createCart([{ merchandiseId: variantId, quantity }]);
    }

    const data = await shopifyFetch<{
      cartLinesAdd: { cart: ShopifyCartNode | null; userErrors: { message: string }[] };
    }>(
      `${CART_FRAGMENT}
       mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
         cartLinesAdd(cartId: $cartId, lines: $lines) {
           cart { ...CartFields }
           userErrors { message }
         }
       }`,
      { cartId, lines: [{ merchandiseId: variantId, quantity }] },
      { cache: "no-store" }
    );

    if (data.cartLinesAdd.userErrors?.length) {
      const message = data.cartLinesAdd.userErrors[0].message;
      if (message.toLowerCase().includes("cart") && message.toLowerCase().includes("exist")) {
        await clearCartCookies();
        return createCart([{ merchandiseId: variantId, quantity }]);
      }
      return { success: false, error: message };
    }
    if (!data.cartLinesAdd.cart) return { success: false, error: "Failed to update cart" };

    return { success: true, cart: mapShopifyCart(data.cartLinesAdd.cart) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Cart error" };
  }
}

export async function addMultipleLineItems(
  items: { variantId: string; quantity?: number }[]
): Promise<AddToCartResult> {
  let lastCart: Cart | undefined;
  for (const item of items) {
    const result = await addLineItem(item.variantId, item.quantity ?? 1);
    if (!result.success) return result;
    lastCart = result.cart;
  }
  return { success: true, cart: lastCart };
}

export async function updateLineQuantity(
  lineId: string,
  quantity: number
): Promise<AddToCartResult> {
  try {
    if (!isShopifyConfigured()) {
      const cart = await updateMockLine(lineId, quantity);
      return { success: true, cart };
    }

    const cartId = await getCartIdFromCookie();
    if (!cartId) return { success: false, error: "No cart found" };

    const mutation =
      quantity <= 0
        ? `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
             cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
               cart { ...CartFields }
               userErrors { message }
             }
           }`
        : `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
             cartLinesUpdate(cartId: $cartId, lines: $lines) {
               cart { ...CartFields }
               userErrors { message }
             }
           }`;

    const variables =
      quantity <= 0
        ? { cartId, lineIds: [lineId] }
        : { cartId, lines: [{ id: lineId, quantity }] };

    const data = await shopifyFetch<
      Record<string, { cart: ShopifyCartNode | null; userErrors: { message: string }[] }>
    >(`${CART_FRAGMENT}\n${mutation}`, variables, { cache: "no-store" });

    const result = data.cartLinesRemove ?? data.cartLinesUpdate;
    if (result.userErrors?.length) {
      return { success: false, error: result.userErrors[0].message };
    }
    if (!result.cart) {
      await clearCartCookies();
      return { success: true, cart: emptyCart() };
    }

    return { success: true, cart: mapShopifyCart(result.cart) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Cart error" };
  }
}

export async function removeLineItem(lineId: string): Promise<AddToCartResult> {
  return updateLineQuantity(lineId, 0);
}

/** @deprecated Use addLineItem */
export async function addItemToCart(variantId: string, quantity = 1) {
  return addLineItem(variantId, quantity);
}

/** @deprecated Use addMultipleLineItems */
export async function addMultipleToCart(items: { variantId: string; quantity?: number }[]) {
  return addMultipleLineItems(items);
}

/** @deprecated Use updateLineQuantity */
export async function updateCartLine(lineId: string, quantity: number) {
  return updateLineQuantity(lineId, quantity);
}

/** @deprecated Use removeLineItem */
export async function removeCartLine(lineId: string) {
  return removeLineItem(lineId);
}
