import { getStoreDomain, getApiVersion } from "./config";
import type { MembershipApplicationInput } from "../membership-types";

function readEnv(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

export function isAdminApiConfigured(): boolean {
  return Boolean(getStoreDomain() && readEnv("SHOPIFY_ADMIN_ACCESS_TOKEN") && getApiVersion());
}

async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const domain = getStoreDomain();
  const token = readEnv("SHOPIFY_ADMIN_ACCESS_TOKEN");
  const version = getApiVersion();

  if (!domain || !token || !version) {
    throw new Error("Shopify Admin API is not configured");
  }

  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Shopify Admin API request failed (${res.status})`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Shopify Admin API error");
  }

  return json.data as T;
}

export async function submitMembershipApplicationToShopify(
  input: MembershipApplicationInput
): Promise<{ success: boolean; error?: string }> {
  if (!isAdminApiConfigured()) {
    return { success: false, error: "Shopify Admin API is not configured" };
  }

  const email = input.email.toLowerCase();
  const autoApprove = process.env.MEMBERSHIP_AUTO_APPROVE !== "false";
  const applicationStatus = autoApprove ? "approved" : "pending";

  try {
    const search = await adminFetch<{
      customers: { edges: { node: { id: string } }[] };
    }>(
      `query findCustomer($query: String!) {
        customers(first: 1, query: $query) {
          edges { node { id } }
        }
      }`,
      { query: `email:${email}` }
    );

    const customerId = search.customers.edges[0]?.node.id;

    const metafields = [
      { namespace: "custom", key: "membership_tier", type: "single_line_text_field", value: input.tier },
      {
        namespace: "custom",
        key: "application_status",
        type: "single_line_text_field",
        value: applicationStatus,
      },
      { namespace: "custom", key: "business_name", type: "single_line_text_field", value: input.businessName },
      { namespace: "custom", key: "business_type", type: "single_line_text_field", value: input.businessType },
      { namespace: "custom", key: "location", type: "single_line_text_field", value: input.location },
      { namespace: "custom", key: "monthly_volume", type: "single_line_text_field", value: input.monthlyVolume },
      {
        namespace: "custom",
        key: "chef_supply_mode",
        type: "boolean",
        value: input.tier === "restaurant" ? "true" : "false",
      },
      ...(input.notes
        ? [{ namespace: "custom", key: "application_notes", type: "single_line_text_field", value: input.notes }]
        : []),
    ];

    if (customerId) {
      const result = await adminFetch<{
        customerUpdate: { userErrors: { message: string }[] };
      }>(
        `mutation updateCustomer($input: CustomerInput!) {
          customerUpdate(input: $input) {
            userErrors { message }
          }
        }`,
        {
          input: {
            id: customerId,
            firstName: input.name.split(" ")[0],
            lastName: input.name.split(" ").slice(1).join(" ") || undefined,
            metafields,
          },
        }
      );

      const error = result.customerUpdate.userErrors[0]?.message;
      if (error) return { success: false, error };
      return { success: true };
    }

    const result = await adminFetch<{
      customerCreate: { userErrors: { message: string }[] };
    }>(
      `mutation createCustomer($input: CustomerInput!) {
        customerCreate(input: $input) {
          userErrors { message }
        }
      }`,
      {
        input: {
          email,
          firstName: input.name.split(" ")[0],
          lastName: input.name.split(" ").slice(1).join(" ") || undefined,
          metafields,
        },
      }
    );

    const error = result.customerCreate.userErrors[0]?.message;
    if (error) return { success: false, error };

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Application submission failed",
    };
  }
}
