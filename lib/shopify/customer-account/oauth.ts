import { getCustomerAccountConfig } from "./config";
import { discoverEndpoints } from "./discovery";
import {
  clearPkceCookie,
  getPkceCookie,
  setCustomerAccountSession,
  setPkceCookie,
  type CustomerAccountSessionPayload,
} from "./cookies";
import { generateCodeChallenge, generateCodeVerifier, generateState } from "./pkce";

export async function buildAuthorizationUrl(): Promise<string> {
  const config = getCustomerAccountConfig();
  if (!config) throw new Error("Customer Account API is not configured");

  const { openId } = await discoverEndpoints(config.storeDomain);
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = generateState();

  await setPkceCookie({ state, verifier });

  const url = new URL(openId.authorization_endpoint);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  return url.toString();
}

async function exchangeToken(body: URLSearchParams): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}> {
  const config = getCustomerAccountConfig();
  if (!config) throw new Error("Customer Account API is not configured");

  const { openId } = await discoverEndpoints(config.storeDomain);

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  // Confidential clients authenticate with Basic auth; public clients use PKCE in the body.
  if (config.clientType === "confidential" && config.clientSecret) {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  const res = await fetch(openId.token_endpoint, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  return res.json();
}

export async function exchangeAuthorizationCode(code: string, state: string): Promise<void> {
  const config = getCustomerAccountConfig();
  if (!config) throw new Error("Customer Account API is not configured");

  const pkce = await getPkceCookie();
  if (!pkce || pkce.state !== state) {
    throw new Error("Invalid OAuth state");
  }

  const tokenData = await exchangeToken(
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      code,
      code_verifier: pkce.verifier,
    })
  );

  await clearPkceCookie();

  const session: CustomerAccountSessionPayload = {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: Date.now() + (tokenData.expires_in ?? 3600) * 1000,
  };

  await setCustomerAccountSession(session);
}

export async function refreshAccessToken(refreshToken: string): Promise<CustomerAccountSessionPayload> {
  const config = getCustomerAccountConfig();
  if (!config) throw new Error("Customer Account API is not configured");

  const tokenData = await exchangeToken(
    new URLSearchParams({
      grant_type: "refresh_token",
      client_id: config.clientId,
      refresh_token: refreshToken,
    })
  );

  const session: CustomerAccountSessionPayload = {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token ?? refreshToken,
    expiresAt: Date.now() + (tokenData.expires_in ?? 3600) * 1000,
  };

  await setCustomerAccountSession(session);
  return session;
}

export async function logoutFromShopify(accessToken?: string): Promise<void> {
  const config = getCustomerAccountConfig();
  if (!config || !accessToken) return;

  try {
    const { openId } = await discoverEndpoints(config.storeDomain);
    if (openId.end_session_endpoint) {
      await fetch(openId.end_session_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: config.clientId,
          token: accessToken,
        }),
      });
    }
  } catch {
    /* optional endpoint */
  }
}
