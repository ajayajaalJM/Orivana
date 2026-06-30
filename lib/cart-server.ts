import type { Cart, CartLine, AddToCartResult } from "./cart-types";
import {
  getCartIdFromCookie,
  setCartIdCookie,
  getMockCartFromCookie,
  setMockCartCookie,
} from "./cart-cookie";
import { formatPrice, getProducts } from "./shopify";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2024-10";

function isShopifyConfigured() {
  return Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN);
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "Shopify API error");
  return json.data;
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price { amount currencyCode }
              product {
                handle
                title
                featuredImage { url altText }
              }
            }
          }
        }
      }
    }
  }
`;

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

function mapShopifyCart(node: ShopifyCartNode): Cart {
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

async function fetchShopifyCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCartNode | null }>(
    `${CART_FRAGMENT}
     query getCart($cartId: ID!) {
       cart(id: $cartId) { ...CartFields }
     }`,
    { cartId }
  );
  return data.cart ? mapShopifyCart(data.cart) : null;
}

async function findVariant(variantId: string) {
  const products = await getProducts(20);
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) {
      return { product, variant };
    }
  }
  return null;
}

function emptyMockCart(): Cart {
  return {
    id: "mock-cart",
    checkoutUrl: null,
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
    },
    lines: [],
  };
}

async function getMockCart(): Promise<Cart> {
  const raw = await getMockCartFromCookie();
  if (!raw) return emptyMockCart();
  try {
    return JSON.parse(raw) as Cart;
  } catch {
    return emptyMockCart();
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
  const found = await findVariant(variantId);
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
    const newLine: CartLine = {
      id: `mock-line-${variantId}`,
      quantity,
      merchandise: {
        variantId: variant.id,
        productHandle: product.handle,
        productTitle: product.title,
        variantTitle: variant.title,
        origin: parseOrigin(product.title),
        imageUrl: product.featuredImage?.url ?? null,
        price: variant.price,
        availableForSale: variant.availableForSale,
      },
    };
    lines = [...cart.lines, newLine];
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

export async function getCurrentCart(): Promise<Cart> {
  if (isShopifyConfigured()) {
    const cartId = await getCartIdFromCookie();
    if (!cartId) return emptyMockCart();
    const cart = await fetchShopifyCart(cartId);
    return cart ?? emptyMockCart();
  }
  return getMockCart();
}

export async function addItemToCart(
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
        { lines: [{ merchandiseId: variantId, quantity }] }
      );

      if (data.cartCreate.userErrors?.length) {
        return { success: false, error: data.cartCreate.userErrors[0].message };
      }
      if (!data.cartCreate.cart) return { success: false, error: "Failed to create cart" };

      await setCartIdCookie(data.cartCreate.cart.id);
      return { success: true, cart: mapShopifyCart(data.cartCreate.cart) };
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
      { cartId, lines: [{ merchandiseId: variantId, quantity }] }
    );

    if (data.cartLinesAdd.userErrors?.length) {
      return { success: false, error: data.cartLinesAdd.userErrors[0].message };
    }
    if (!data.cartLinesAdd.cart) return { success: false, error: "Failed to update cart" };

    return { success: true, cart: mapShopifyCart(data.cartLinesAdd.cart) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Cart error" };
  }
}

export async function addMultipleToCart(
  items: { variantId: string; quantity?: number }[]
): Promise<AddToCartResult> {
  let lastCart: Cart | undefined;
  for (const item of items) {
    const result = await addItemToCart(item.variantId, item.quantity ?? 1);
    if (!result.success) return result;
    lastCart = result.cart;
  }
  return { success: true, cart: lastCart };
}

export async function updateCartLine(
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

    const data = await shopifyFetch<Record<string, { cart: ShopifyCartNode | null; userErrors: { message: string }[] }>>(
      `${CART_FRAGMENT}\n${mutation}`,
      variables
    );

    const result = data.cartLinesRemove ?? data.cartLinesUpdate;
    if (result.userErrors?.length) {
      return { success: false, error: result.userErrors[0].message };
    }
    if (!result.cart) return { success: false, error: "Failed to update cart" };

    return { success: true, cart: mapShopifyCart(result.cart) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Cart error" };
  }
}

export async function removeCartLine(lineId: string): Promise<AddToCartResult> {
  return updateCartLine(lineId, 0);
}

export { formatPrice };
