import { shopifyFetch } from "./graphql";
import { isShopifyConfigured } from "./config";
import { isComingSoonProduct } from "../product-availability";
import {
  LEGACY_COLLECTION_HANDLES,
  MOCK_COLLECTIONS,
  MOCK_PRODUCTS,
} from "./mock-data";
import { fetchProductsFromStorefront } from "./products";
import type { ShopifyCollection, ShopifyProduct } from "./types";

const COLLECTION_FIELDS = `
  id handle title description
  image { url altText width height }
`;

export function resolveCollectionHandle(handle: string): string {
  return LEGACY_COLLECTION_HANDLES[handle] ?? handle;
}

const COMING_SOON_COLLECTION_HANDLES = new Set(["olive-oil", "honey", "gift-collections"]);

/** Legacy Shopify tags that map to permanent collection handles. */
const TAG_COLLECTION_MAP: Record<string, string> = {
  "desert-harvest": "dates",
  "liquid-gold": "olive-oil",
  "wild-honey": "honey",
  "seasonal-selection": "gift-collections",
};

function matchesCollectionTag(tags: string[], handle: string): boolean {
  if (tags.includes(handle)) return true;
  return tags.some((tag) => TAG_COLLECTION_MAP[tag] === handle);
}

/** Single collection tab/category for filtering — gift bundles stay under Gifts only. */
export function getPrimaryCollectionHandle(product: ShopifyProduct): string | null {
  const collections = product.collections ?? [];
  const tags = product.tags ?? [];
  const type = product.productType ?? "";

  if (
    collections.includes("gift-collections") ||
    tags.includes("gift") ||
    type.includes("Gift")
  ) {
    return "gift-collections";
  }

  for (const tag of tags) {
    const mapped = TAG_COLLECTION_MAP[tag];
    if (mapped) return mapped;
  }

  if (
    collections.includes("olive-oil") ||
    tags.includes("olive-oil") ||
    type.includes("Olive Oil")
  ) {
    return "olive-oil";
  }
  if (collections.includes("honey") || tags.includes("honey") || type.includes("Honey")) {
    return "honey";
  }
  if (
    collections.includes("dates") ||
    tags.includes("dates") ||
    tags.includes("medjool") ||
    tags.includes("deglet-noor") ||
    type.includes("Date")
  ) {
    return "dates";
  }

  return collections[0] ?? null;
}

export function productMatchesCollection(product: ShopifyProduct, handle: string): boolean {
  const resolved = resolveCollectionHandle(handle);
  const primary = getPrimaryCollectionHandle(product);

  if (primary) return primary === resolved;

  return (
    matchesCollectionTag(product.tags ?? [], resolved) ||
    product.collections?.includes(resolved) ||
    resolveCollectionHandle(product.collection ?? "") === resolved
  );
}

/** Keep at most one coming-soon product per olive oil, honey, and gifts category. */
export function limitComingSoonByCollection(products: ShopifyProduct[]): ShopifyProduct[] {
  const seenComingSoon = new Set<string>();

  return products.filter((product) => {
    if (!isComingSoonProduct(product)) return true;

    const primary = getPrimaryCollectionHandle(product);
    if (!primary || !COMING_SOON_COLLECTION_HANDLES.has(primary)) return true;

    if (seenComingSoon.has(primary)) return false;
    seenComingSoon.add(primary);
    return true;
  });
}

function filterProductsForCollection(products: ShopifyProduct[], handle: string): ShopifyProduct[] {
  const resolved = resolveCollectionHandle(handle);
  return limitComingSoonByCollection(
    products.filter((product) => productMatchesCollection(product, resolved))
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
    return filterProductsForCollection(MOCK_PRODUCTS, resolved).slice(0, first);
  }

  try {
    const catalog = await fetchProductsFromStorefront(50);
    return filterProductsForCollection(catalog, resolved).slice(0, first);
  } catch {
    return [];
  }
}
