import { cookies } from "next/headers";

export const PKCE_COOKIE = "orivana-oauth-pkce";
export const SESSION_COOKIE = "orivana-ca-session";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export interface PkcePayload {
  state: string;
  verifier: string;
}

export interface CustomerAccountSessionPayload {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export async function setPkceCookie(payload: PkcePayload) {
  const store = await cookies();
  store.set(PKCE_COOKIE, JSON.stringify(payload), {
    ...cookieOptions,
    maxAge: 60 * 10,
  });
}

export async function getPkceCookie(): Promise<PkcePayload | null> {
  const store = await cookies();
  const raw = store.get(PKCE_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PkcePayload;
  } catch {
    return null;
  }
}

export async function clearPkceCookie() {
  const store = await cookies();
  store.delete(PKCE_COOKIE);
}

export async function setCustomerAccountSession(payload: CustomerAccountSessionPayload) {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(payload), {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getCustomerAccountSessionCookie(): Promise<CustomerAccountSessionPayload | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CustomerAccountSessionPayload;
  } catch {
    return null;
  }
}

export async function clearCustomerAccountSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
