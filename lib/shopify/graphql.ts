export { shopifyFetch, isShopifyConfigured, getStoreDomain, getApiVersion, getShopifyConfig, getStorefrontApiUrl } from "./client";
export type { ShopifyFetchOptions } from "./client";

export const IMAGE_FRAGMENT = `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

export const VARIANT_FRAGMENT = `
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    weight
    weightUnit
    price { ...MoneyFields }
    selectedOptions { name value }
  }
  ${MONEY_FRAGMENT}
`;

export const METAFIELD_IDENTIFIERS = [
  { namespace: "custom", key: "origin" },
  { namespace: "custom", key: "harvest_region" },
  { namespace: "custom", key: "producer" },
  { namespace: "custom", key: "harvest" },
  { namespace: "custom", key: "visibility" },
  { namespace: "custom", key: "packaging" },
  { namespace: "custom", key: "gift_ready" },
  { namespace: "custom", key: "related_products" },
  { namespace: "custom", key: "recipes" },
  { namespace: "custom", key: "journal_articles" },
  { namespace: "custom", key: "bulk_packs" },
];

export const PRODUCT_METAFIELDS_QUERY = `
  metafields(identifiers: [
    {namespace: "custom", key: "origin"},
    {namespace: "custom", key: "harvest_region"},
    {namespace: "custom", key: "producer"},
    {namespace: "custom", key: "harvest"},
    {namespace: "custom", key: "visibility"},
    {namespace: "custom", key: "packaging"},
    {namespace: "custom", key: "gift_ready"},
    {namespace: "custom", key: "related_products"},
    {namespace: "custom", key: "recipes"},
    {namespace: "custom", key: "journal_articles"},
    {namespace: "custom", key: "bulk_packs"}
  ]) {
    namespace
    key
    value
    type
  }
`;

export const CART_FRAGMENT = `
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
