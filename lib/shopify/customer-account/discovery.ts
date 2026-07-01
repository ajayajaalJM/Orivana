type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
};

type CustomerAccountApiConfig = {
  graphql_api: string;
};

const cache = new Map<string, { openId: OpenIdConfig; api: CustomerAccountApiConfig; at: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function discoverEndpoints(storeDomain: string) {
  const cached = cache.get(storeDomain);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached;
  }

  const [openIdRes, apiRes] = await Promise.all([
    fetch(`https://${storeDomain}/.well-known/openid-configuration`, { next: { revalidate: 3600 } }),
    fetch(`https://${storeDomain}/.well-known/customer-account-api`, { next: { revalidate: 3600 } }),
  ]);

  if (!openIdRes.ok) {
    throw new Error(`Failed to fetch OpenID configuration (${openIdRes.status})`);
  }
  if (!apiRes.ok) {
    throw new Error(`Failed to fetch Customer Account API configuration (${apiRes.status})`);
  }

  const openId = (await openIdRes.json()) as OpenIdConfig;
  const api = (await apiRes.json()) as CustomerAccountApiConfig;

  const entry = { openId, api, at: Date.now() };
  cache.set(storeDomain, entry);
  return entry;
}
