import { shopifyFetch } from "./graphql";
import { isShopifyConfigured } from "./config";
import {
  LEGACY_COLLECTION_HANDLES,
  MOCK_COLLECTIONS,
  findMockProductsByCollection,
} from "./mock-data";
import { normalizeProduct, PRODUCT_FIELDS } from "./products";
import type { ShopifyCollection, ShopifyProduct } from "./types";

type RawCollection = Omit<ShopifyCollection, "products"> & {
  products?: { edges: { node: Parameters<typeof normalizeProduct>[0] }[] };
};

const COLLECTION_FIELDS = `
  id handle title description
  image { url altText width height }
`;

export function resolveCollectionHandle(handle: string): string {
  return LEGACY_COLLECTION_HANDLES[handle] ?? handle;
}

export function productMatchesCollection(product: ShopifyProduct, handle: string): boolean {
  const resolved = resolveCollectionHandle(handle);
  return (
    product.collections?.includes(resolved) ||
    resolveCollectionHandle(product.collection ?? "") === resolved
  );
}

export async function getCollections(first = 6): Promise<ShopifyCollection[]> {
  if (!isShopifyConfigured()) {
    return MOCK_COLLECTIONS.slice(0, first);
  }

  try {
    const data = await shopifyFetch<{ collections: { edges: { node: ShopifyCollection }[] } }>(
      `query getCollections($first: Int!) {
        collections(first: $first) {
          edges { node { ${COLLECTION_FIELDS} } }
        }
      }`,
      { first },
      { tags: ["collections"], revalidate: 120 }
    );

    return data.collections.edges.map((e) => e.node);
  } catch {
    return [];
  }
}

export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const resolved = resolveCollectionHandle(handle);

  if (!isShopifyConfigured()) {
    return MOCK_COLLECTIONS.find((c) => c.handle === resolved) ?? null;
  }

  try {
    const data = await shopifyFetch<{ collection: ShopifyCollection | null }>(
      `query getCollection($handle: String!) {
        collection(handle: $handle) {
          ${COLLECTION_FIELDS}
        }
      }`,
      { handle: resolved },
      { tags: [`collection-${resolved}`], revalidate: 120 }
    );

    return data.collection;
  } catch {
    return null;
  }
}

export async function getCollectionProducts(
  handle: string,
  first = 12
): Promise<ShopifyProduct[]> {
  const resolved = resolveCollectionHandle(handle);

  if (!isShopifyConfigured()) {
    return findMockProductsByCollection(resolved, first);
  }

  try {
    const data = await shopifyFetch<{ collection: RawCollection | null }>(
      `query getCollectionProducts($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                ${PRODUCT_FIELDS}
              }
            }
          }
        }
      }`,
      { handle: resolved, first },
      { tags: [`collection-products-${resolved}`], revalidate: 60 }
    );

    if (!data.collection?.products) return [];
    return data.collection.products.edges.map(({ node }) => normalizeProduct(node));
  } catch {
    return [];
  }
}
