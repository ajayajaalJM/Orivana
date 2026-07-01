import { cookies } from "next/headers";

export const CART_ID_COOKIE = "orivana-cart-id";
export const MOCK_CART_COOKIE = "orivana-harvest-cart";

export async function getCartIdFromCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CART_ID_COOKIE)?.value;
}

export async function setCartIdCookie(cartId: string) {
  const store = await cookies();
  store.delete(MOCK_CART_COOKIE);
  store.set(CART_ID_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
}

export async function getMockCartFromCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(MOCK_CART_COOKIE)?.value;
}

export async function setMockCartCookie(cartJson: string) {
  const store = await cookies();
  store.set(MOCK_CART_COOKIE, cartJson, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
}

export async function clearCartCookies() {
  const store = await cookies();
  store.delete(CART_ID_COOKIE);
  store.delete(MOCK_CART_COOKIE);
}
