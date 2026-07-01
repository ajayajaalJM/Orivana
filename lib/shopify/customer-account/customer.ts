import type { ApplicationStatus, MemberTier } from "../../membership-types";
import { getCustomerAccountConfig } from "./config";
import { getCustomerAccountSessionCookie } from "./cookies";
import { discoverEndpoints } from "./discovery";
import { refreshAccessToken } from "./oauth";

export interface CustomerAccountMetafields {
  membershipTier?: MemberTier;
  applicationStatus?: ApplicationStatus;
  businessName?: string;
  chefSupplyMode?: boolean;
}

export interface CustomerAccountProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  metafields: CustomerAccountMetafields;
}

export interface CustomerAccountOrderLine {
  title: string;
  quantity: number;
  variantTitle?: string;
  imageUrl?: string | null;
  price?: { amount: string; currencyCode: string };
}

export interface CustomerAccountOrder {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: CustomerAccountOrderLine[];
}

const MEMBERSHIP_METAFIELDS = `
  metafields(identifiers: [
    {namespace: "custom", key: "membership_tier"},
    {namespace: "custom", key: "application_status"},
    {namespace: "custom", key: "business_name"},
    {namespace: "custom", key: "chef_supply_mode"}
  ]) {
    namespace
    key
    value
  }
`;

async function getValidAccessToken(): Promise<string | null> {
  const session = await getCustomerAccountSessionCookie();
  if (!session) return null;

  if (session.expiresAt > Date.now() + 60_000) {
    return session.accessToken;
  }

  if (!session.refreshToken) return null;

  try {
    const refreshed = await refreshAccessToken(session.refreshToken);
    return refreshed.accessToken;
  } catch {
    return null;
  }
}

export async function customerAccountFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const config = getCustomerAccountConfig();
  if (!config) throw new Error("Customer Account API is not configured");

  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error("Not authenticated");

  const { api } = await discoverEndpoints(config.storeDomain);

  const res = await fetch(api.graphql_api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Customer Account API request failed (${res.status})`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Customer Account API error");
  }

  return json.data as T;
}

function parseMetafields(
  fields?: { key: string; value: string }[] | null
): CustomerAccountMetafields {
  const map = new Map<string, string>();
  for (const field of fields ?? []) {
    if (field?.key) map.set(field.key, field.value);
  }

  const tier = map.get("membership_tier") as MemberTier | undefined;
  const status = map.get("application_status") as ApplicationStatus | undefined;

  return {
    membershipTier: tier ?? "individual",
    applicationStatus: status ?? "approved",
    businessName: map.get("business_name"),
    chefSupplyMode: map.get("chef_supply_mode") === "true",
  };
}

export async function getCustomerAccountProfile(): Promise<CustomerAccountProfile | null> {
  if (!getCustomerAccountConfig()) return null;

  try {
    const data = await customerAccountFetch<{
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        emailAddress: { emailAddress: string } | null;
        metafields: { key: string; value: string }[];
      } | null;
    }>(`query CustomerProfile {
      customer {
        id
        firstName
        lastName
        emailAddress { emailAddress }
        ${MEMBERSHIP_METAFIELDS}
      }
    }`);

    if (!data.customer) return null;

    return {
      id: data.customer.id,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      email: data.customer.emailAddress?.emailAddress ?? "",
      metafields: parseMetafields(data.customer.metafields),
    };
  } catch {
    return null;
  }
}

export async function getCustomerAccountOrders(first = 10): Promise<CustomerAccountOrder[]> {
  if (!getCustomerAccountConfig()) return [];

  try {
    const data = await customerAccountFetch<{
      customer: {
        orders: {
          nodes: {
            id: string;
            name: string;
            processedAt: string;
            financialStatus: string;
            fulfillmentStatus: string;
            totalPrice: { amount: string; currencyCode: string };
            lineItems: {
              nodes: {
                title: string;
                quantity: number;
                variantTitle: string | null;
                image: { url: string } | null;
                price: { amount: string; currencyCode: string } | null;
              }[];
            };
          }[];
        };
      } | null;
    }>(
      `query CustomerOrders($first: Int!) {
        customer {
          orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
            nodes {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount currencyCode }
              lineItems(first: 20) {
                nodes {
                  title
                  quantity
                  variantTitle
                  image { url }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }`,
      { first }
    );

    if (!data.customer?.orders?.nodes) return [];

    return data.customer.orders.nodes.map((order) => ({
      id: order.id,
      name: order.name,
      processedAt: order.processedAt,
      financialStatus: order.financialStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      totalPrice: order.totalPrice,
      lineItems: order.lineItems.nodes.map((line) => ({
        title: line.title,
        quantity: line.quantity,
        variantTitle: line.variantTitle ?? undefined,
        imageUrl: line.image?.url ?? null,
        price: line.price ?? undefined,
      })),
    }));
  } catch {
    return [];
  }
}

export async function isCustomerAccountAuthenticated(): Promise<boolean> {
  const token = await getValidAccessToken();
  return Boolean(token);
}
