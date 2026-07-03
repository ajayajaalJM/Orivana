import type { BulkPack, ProductVisibility } from "../membership-types";
import {
  getProductAvailabilityLabel,
  type ProductAvailabilityStatus,
} from "../product-availability";
import {
  PRODUCT_METAFIELDS_QUERY,
  shopifyFetch,
} from "./graphql";
import { isShopifyLive } from "./live";
import { MOCK_PRODUCTS, findMockProduct } from "./mock-data";
import type {
  ShopifyImage,
  ShopifyMetafield,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyVariant,
} from "./types";

type RawProduct = Omit<ShopifyProduct, "images" | "variants" | "collections"> & {
  images?: { edges: { node: ShopifyImage }[] };
  variants?: { edges: { node: ShopifyVariant }[] };
  collections?: { edges: { node: { handle: string } }[] };
  metafields?: (ShopifyMetafield | null)[];
};

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml productType tags
  featuredImage { url altText width height }
  images(first: 10) { edges { node { url altText width height } } }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  variants(first: 20) {
    edges {
      node {
        id title availableForSale quantityAvailable weight weightUnit
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
  collections(first: 10) { edges { node { handle } } }
  ${PRODUCT_METAFIELDS_QUERY}
`;

function parseJsonList(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : value.split(",").map((s) => s.trim()).filter(Boolean);
  } catch {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

function parseBulkPacks(value: string | undefined): BulkPack[] | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as BulkPack[]) : undefined;
  } catch {
    return undefined;
  }
}

function applyMetafields(product: ShopifyProduct, metafields?: (ShopifyMetafield | null)[]): ShopifyProduct {
  if (!metafields?.length) return product;

  const map = new Map<string, string>();
  for (const field of metafields) {
    if (field?.key && field.value != null) map.set(field.key, field.value);
  }

  const visibility = map.get("visibility") as ProductVisibility | undefined;
  const giftReady = map.get("gift_ready");
  const availabilityStatus = map.get("availability_status") as ProductAvailabilityStatus | undefined;

  return {
    ...product,
    metafields: metafields.filter(Boolean) as ShopifyMetafield[],
    origin: map.get("origin") ?? product.origin,
    harvestRegion: map.get("harvest_region") ?? product.harvestRegion,
    producer: map.get("producer") ?? product.producer,
    harvest: map.get("harvest") ?? product.harvest,
    packaging: map.get("packaging") ?? product.packaging,
    visibility: visibility ?? product.visibility,
    availabilityStatus: availabilityStatus ?? product.availabilityStatus,
    giftReady: giftReady === "true" || giftReady === "1" ? true : product.giftReady ?? product.tags.includes("gift"),
    relatedProductHandles: parseJsonList(map.get("related_products")),
    recipeSlugs: parseJsonList(map.get("recipes")),
    journalSlugs: parseJsonList(map.get("journal_articles")),
    bulkPacks: parseBulkPacks(map.get("bulk_packs")) ?? product.bulkPacks,
  };
}

export function normalizeProduct(raw: RawProduct): ShopifyProduct {
  const images = raw.images?.edges?.map((e) => e.node) ?? [];
  const variants = raw.variants?.edges?.map((e) => e.node) ?? [];
  const collections = raw.collections?.edges?.map((e) => e.node.handle) ?? [];

  const product: ShopifyProduct = {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    productType: raw.productType,
    featuredImage: raw.featuredImage,
    tags: raw.tags ?? [],
    priceRange: raw.priceRange,
    images,
    variants,
    collections,
    collection: collections[0],
  };

  const withMetafields = applyMetafields(product, raw.metafields);

  return {
    ...withMetafields,
    availability: getProductAvailabilityLabel(withMetafields),
  };
}

export function formatPrice(money: ShopifyMoney): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  if (!(await isShopifyLive())) {
    return MOCK_PRODUCTS.slice(0, first);
  }

  const data = await shopifyFetch<{ products: { edges: { node: RawProduct }[] } }>(
    `query getProducts($first: Int!) {
      products(first: $first) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { first },
    { tags: ["products"], revalidate: 60 }
  );

  return data.products.edges.map(({ node }) => normalizeProduct(node));
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  if (!(await isShopifyLive())) {
    return findMockProduct(handle);
  }

  const data = await shopifyFetch<{ product: RawProduct | null }>(
    `query getProduct($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FIELDS}
      }
    }`,
    { handle },
    { tags: [`product-${handle}`], revalidate: 60 }
  );

  if (!data.product) return null;
  return normalizeProduct(data.product);
}

export async function getFeaturedProduct(): Promise<ShopifyProduct> {
  if (!(await isShopifyLive())) {
    return MOCK_PRODUCTS[0];
  }

  const data = await shopifyFetch<{ products: { edges: { node: RawProduct }[] } }>(
    `query getFeaturedProduct {
      products(first: 1, sortKey: BEST_SELLING) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    undefined,
    { tags: ["featured-product"], revalidate: 60 }
  );

  const product = data.products.edges[0]?.node;
  if (product) return normalizeProduct(product);

  return MOCK_PRODUCTS[0];
}

export async function getProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
  if (!handles.length) return [];

  const results = await Promise.all(handles.map((handle) => getProduct(handle)));
  return results.filter((p): p is ShopifyProduct => p !== null);
}

export async function findVariantProduct(variantId: string): Promise<{
  product: ShopifyProduct;
  variant: ShopifyVariant;
} | null> {
  if (await isShopifyLive()) {
    type VariantNode = {
      id: string;
      title: string;
      availableForSale: boolean;
      price: ShopifyMoney;
      product: RawProduct;
    };

    const data = await shopifyFetch<{ node: VariantNode | null }>(
      `query getVariant($id: ID!) {
        node(id: $id) {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount currencyCode }
            product {
              ${PRODUCT_FIELDS}
            }
          }
        }
      }`,
      { id: variantId },
      { cache: "no-store" }
    );

    if (!data.node?.product) return null;

    const product = normalizeProduct(data.node.product);
    const variant = product.variants.find((v) => v.id === variantId) ?? {
      id: data.node.id,
      title: data.node.title,
      availableForSale: data.node.availableForSale,
      price: data.node.price,
      selectedOptions: [],
    };

    return { product, variant };
  }

  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }

  return null;
}
