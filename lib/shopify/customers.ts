import { cookies } from "next/headers";
import { isShopifyConfigured, shopifyFetch } from "./graphql";
import type {
  CustomerAuthResult,
  ShopifyCustomer,
  ShopifyOrder,
  ShopifyUserError,
} from "./types";

export const CUSTOMER_TOKEN_COOKIE = "orivana-customer-token";

type RawCustomer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
};

type RawOrder = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
          image: { url: string; altText: string | null } | null;
          price: { amount: string; currencyCode: string };
          product: { handle: string; title: string };
        } | null;
      };
    }[];
  };
};

function mapCustomer(raw: RawCustomer): ShopifyCustomer {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone,
    acceptsMarketing: raw.acceptsMarketing,
  };
}

function mapOrder(raw: RawOrder): ShopifyOrder {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    processedAt: raw.processedAt,
    financialStatus: raw.financialStatus,
    fulfillmentStatus: raw.fulfillmentStatus,
    totalPrice: raw.totalPrice,
    lineItems: raw.lineItems.edges.map(({ node }) => ({
      title: node.title,
      quantity: node.quantity,
      variant: node.variant
        ? {
            id: node.variant.id,
            title: node.variant.title,
            image: node.variant.image,
            price: node.variant.price,
            product: node.variant.product,
          }
        : null,
    })),
  };
}

export async function getCustomerTokenFromCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CUSTOMER_TOKEN_COOKIE)?.value;
}

export async function setCustomerTokenCookie(token: string) {
  const store = await cookies();
  store.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearCustomerTokenCookie() {
  const store = await cookies();
  store.delete(CUSTOMER_TOKEN_COOKIE);
}

function userErrorMessage(errors: ShopifyUserError[] | undefined): string | undefined {
  return errors?.[0]?.message;
}

export async function registerCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}): Promise<CustomerAuthResult> {
  if (!isShopifyConfigured()) {
    return { success: false, error: "Shopify is not configured" };
  }

  try {
    const data = await shopifyFetch<{
      customerCreate: {
        customer: RawCustomer | null;
        customerUserErrors: ShopifyUserError[];
      };
    }>(
      `mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer { id firstName lastName email phone acceptsMarketing }
          customerUserErrors { field message }
        }
      }`,
      {
        input: {
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          acceptsMarketing: input.acceptsMarketing ?? false,
        },
      },
      { cache: "no-store" }
    );

    const error = userErrorMessage(data.customerCreate.customerUserErrors);
    if (error) return { success: false, error };
    if (!data.customerCreate.customer) {
      return { success: false, error: "Registration failed" };
    }

    return loginCustomer(input.email, input.password);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Registration failed" };
  }
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<CustomerAuthResult> {
  if (!isShopifyConfigured()) {
    return { success: false, error: "Shopify is not configured" };
  }

  try {
    const data = await shopifyFetch<{
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: ShopifyUserError[];
      };
    }>(
      `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken expiresAt }
          customerUserErrors { field message }
        }
      }`,
      { input: { email, password } },
      { cache: "no-store" }
    );

    const error = userErrorMessage(data.customerAccessTokenCreate.customerUserErrors);
    if (error) return { success: false, error };

    const token = data.customerAccessTokenCreate.customerAccessToken?.accessToken;
    if (!token) return { success: false, error: "Invalid credentials" };

    await setCustomerTokenCookie(token);
    const customer = await getCustomer(token);
    return { success: true, accessToken: token, customer: customer ?? undefined };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Login failed" };
  }
}

export async function logoutCustomer(accessToken?: string): Promise<void> {
  const token = accessToken ?? (await getCustomerTokenFromCookie());
  if (token && isShopifyConfigured()) {
    try {
      await shopifyFetch(
        `mutation customerAccessTokenDelete($customerAccessToken: String!) {
          customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
            deletedAccessToken
            userErrors { field message }
          }
        }`,
        { customerAccessToken: token },
        { cache: "no-store" }
      );
    } catch {
      /* token may already be expired */
    }
  }
  await clearCustomerTokenCookie();
}

export async function recoverCustomerPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isShopifyConfigured()) {
    return { success: false, error: "Shopify is not configured" };
  }

  try {
    const data = await shopifyFetch<{
      customerRecover: { customerUserErrors: ShopifyUserError[] };
    }>(
      `mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors { field message }
        }
      }`,
      { email },
      { cache: "no-store" }
    );

    const error = userErrorMessage(data.customerRecover.customerUserErrors);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Recovery failed" };
  }
}

export async function getCustomer(accessToken?: string): Promise<ShopifyCustomer | null> {
  const token = accessToken ?? (await getCustomerTokenFromCookie());
  if (!token || !isShopifyConfigured()) return null;

  try {
    const data = await shopifyFetch<{ customer: RawCustomer | null }>(
      `query getCustomer($token: String!) {
        customer(customerAccessToken: $token) {
          id firstName lastName email phone acceptsMarketing
        }
      }`,
      { token },
      { cache: "no-store" }
    );

    return data.customer ? mapCustomer(data.customer) : null;
  } catch {
    await clearCustomerTokenCookie();
    return null;
  }
}

export async function getCustomerOrders(
  accessToken?: string,
  first = 10
): Promise<ShopifyOrder[]> {
  const token = accessToken ?? (await getCustomerTokenFromCookie());
  if (!token || !isShopifyConfigured()) return [];

  try {
    const data = await shopifyFetch<{
      customer: { orders: { edges: { node: RawOrder }[] } } | null;
    }>(
      `query getCustomerOrders($token: String!, $first: Int!) {
        customer(customerAccessToken: $token) {
          orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                id orderNumber processedAt financialStatus fulfillmentStatus
                totalPrice { amount currencyCode }
                lineItems(first: 20) {
                  edges {
                    node {
                      title quantity
                      variant {
                        id title
                        image { url altText }
                        price { amount currencyCode }
                        product { handle title }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      { token, first },
      { cache: "no-store" }
    );

    if (!data.customer?.orders) return [];
    return data.customer.orders.edges.map(({ node }) => mapOrder(node));
  } catch {
    return [];
  }
}

export async function updateCustomerProfile(
  input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  },
  accessToken?: string
): Promise<{ success: boolean; customer?: ShopifyCustomer; error?: string }> {
  const token = accessToken ?? (await getCustomerTokenFromCookie());
  if (!token || !isShopifyConfigured()) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const data = await shopifyFetch<{
      customerUpdate: {
        customer: RawCustomer | null;
        customerUserErrors: ShopifyUserError[];
      };
    }>(
      `mutation customerUpdate($token: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $token, customer: $customer) {
          customer { id firstName lastName email phone acceptsMarketing }
          customerUserErrors { field message }
        }
      }`,
      { token, customer: input },
      { cache: "no-store" }
    );

    const error = userErrorMessage(data.customerUpdate.customerUserErrors);
    if (error) return { success: false, error };
    if (!data.customerUpdate.customer) return { success: false, error: "Update failed" };

    return { success: true, customer: mapCustomer(data.customerUpdate.customer) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}
