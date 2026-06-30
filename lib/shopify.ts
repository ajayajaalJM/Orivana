import { images, img } from "./images";
import type { BulkPack, MemberTier, ProductVisibility } from "./membership-types";

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  selectedOptions: { name: string; value: string }[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: ShopifyVariant[];
  tags: string[];
  /** Primary and secondary collection handles — a selection may belong to multiple collections */
  collections: string[];
  /** @deprecated Use collections */
  collection?: string;
  visibility?: ProductVisibility;
  origin?: string;
  productType?: string;
  harvest?: string;
  availability?: string;
  giftReady?: boolean;
  packaging?: string;
  bulkPacks?: BulkPack[];
  tierPrices?: Partial<Record<Exclude<MemberTier, "individual">, ShopifyMoney[]>>;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2024-10";

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error("Shopify credentials not configured");
  }

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "Shopify API error");
  return json.data;
}

const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/1",
    handle: "medjool-dates-al-kufra",
    title: "Medjool Dates — Al Kufra Valley",
    description:
      "Hand-selected Medjool dates with soft caramel richness and a dense, syrup-like texture from deep southern desert groves.",
    featuredImage: {
      url: img(images.datesBowl),
      altText: "Medjool dates in a wooden bowl",
    },
    images: [
      { url: img(images.datesBowl), altText: "Medjool dates close-up" },
      { url: img(images.datesRows), altText: "Dates on stone surface" },
    ],
    priceRange: {
      minVariantPrice: { amount: "68.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "68.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/1",
        title: "500g",
        availableForSale: true,
        price: { amount: "68.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "500g" }],
      },
      {
        id: "gid://shopify/ProductVariant/1b",
        title: "1kg",
        availableForSale: true,
        price: { amount: "118.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "1kg" }],
      },
    ],
    tags: ["featured", "dates"],
    collections: ["dates"],
    origin: "Al Kufra Valley, Libya",
    productType: "Medjool Dates",
    harvest: "2025",
    availability: "In Season",
    packaging: "Ceramic Vessel",
    bulkPacks: [
      { label: "5kg Case", quantity: 5, unit: "kg" },
      { label: "10kg Case", quantity: 10, unit: "kg" },
      { label: "25kg Case", quantity: 25, unit: "kg" },
    ],
  },
  {
    id: "gid://shopify/Product/2",
    handle: "coastal-olive-oil",
    title: "Extra Virgin Olive Oil — Coastal Groves",
    description:
      "Cold-pressed within hours of harvest — green-gold intensity with a peppered finish from ancient Mediterranean orchards.",
    featuredImage: {
      url: img(images.oliveOil),
      altText: "Olive oil in glass bottle",
    },
    images: [
      { url: img(images.oliveOil), altText: "Olive oil bottle" },
      { url: img(images.oliveGrove), altText: "Olive branches" },
    ],
    priceRange: {
      minVariantPrice: { amount: "54.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "54.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/2",
        title: "500ml",
        availableForSale: true,
        price: { amount: "54.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "500ml" }],
      },
    ],
    tags: ["olive-oil"],
    collections: ["olive-oil"],
    origin: "Coastal Groves, Tunisia",
    productType: "Extra Virgin Olive Oil",
    harvest: "2025",
    availability: "In Season",
    packaging: "Glass Bottle",
    bulkPacks: [
      { label: "5L Case", quantity: 5, unit: "L" },
      { label: "10L Case", quantity: 10, unit: "L" },
      { label: "25L Case", quantity: 25, unit: "L" },
    ],
  },
  {
    id: "gid://shopify/Product/3",
    handle: "raw-wildflower-honey",
    title: "Raw Wildflower Honey — Mediterranean Hills",
    description:
      "Unprocessed honey gathered from wild thyme and rosemary — thick, luminous, holding the amber memory of a single season.",
    featuredImage: {
      url: img(images.honeyDipper),
      altText: "Raw honey dripping from spoon",
    },
    images: [
      { url: img(images.honeyDipper), altText: "Golden honey" },
      { url: img(images.honeycomb), altText: "Honeycomb texture" },
    ],
    priceRange: {
      minVariantPrice: { amount: "42.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "42.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/3",
        title: "350g",
        availableForSale: true,
        price: { amount: "42.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "350g" }],
      },
    ],
    tags: ["honey"],
    collections: ["honey"],
    origin: "Mediterranean Hills, Greece",
    productType: "Wildflower Honey",
    harvest: "2025",
    availability: "In Season",
    packaging: "Glass Jar",
    bulkPacks: [
      { label: "5kg Case", quantity: 5, unit: "kg" },
      { label: "10kg Case", quantity: 10, unit: "kg" },
    ],
  },
  {
    id: "gid://shopify/Product/4",
    handle: "deglet-noor-dates",
    title: "Deglet Noor Dates — Oasis Groves",
    description:
      "The 'date of light' — translucent amber skin with delicate honeyed sweetness and an elegant, firm texture.",
    featuredImage: {
      url: img(images.datesRows),
      altText: "Deglet Noor dates",
    },
    images: [
      { url: img(images.datesRows), altText: "Deglet Noor dates" },
    ],
    priceRange: {
      minVariantPrice: { amount: "48.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "48.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/4",
        title: "500g",
        availableForSale: true,
        price: { amount: "48.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "500g" }],
      },
    ],
    tags: ["dates"],
    collections: ["dates"],
    origin: "Oasis Groves, Tunisia",
    productType: "Deglet Noor Dates",
    harvest: "2025",
    availability: "In Season",
    packaging: "Stone Vessel",
  },
  {
    id: "gid://shopify/Product/5",
    handle: "seasonal-harvest-box",
    title: "Seasonal Selection — Spring Harvest",
    description:
      "A curated trio of dates, olive oil, and honey — limited seasonal batch reflecting the current harvest.",
    featuredImage: {
      url: img(images.mediterraneanSpread),
      altText: "Mediterranean food selection",
    },
    images: [
      { url: img(images.mediterraneanSpread), altText: "Seasonal harvest" },
    ],
    priceRange: {
      minVariantPrice: { amount: "145.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "145.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/5",
        title: "Default",
        availableForSale: true,
        price: { amount: "145.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Title", value: "Default Title" }],
      },
    ],
    tags: ["seasonal", "gift"],
    collections: ["gift-collections", "dates", "olive-oil", "honey"],
    visibility: "member",
    giftReady: true,
    productType: "Curated Gift Collection",
    harvest: "Spring 2025",
    availability: "Limited",
    packaging: "Luxury Gift Box",
  },
  {
    id: "gid://shopify/Product/6",
    handle: "private-autumn-allocation",
    title: "Private Harvest — Autumn Allocation",
    description:
      "An Inner Circle exclusive — limited autumn allocation of Medjool and Deglet Noor, reserved for members before public release.",
    featuredImage: {
      url: img(images.datesRows),
      altText: "Private autumn harvest allocation",
    },
    images: [{ url: img(images.datesRows), altText: "Autumn allocation" }],
    priceRange: {
      minVariantPrice: { amount: "185.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "185.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/6",
        title: "Limited Box",
        availableForSale: true,
        price: { amount: "185.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "Limited Box" }],
      },
    ],
    tags: ["exclusive", "seasonal"],
    collections: ["dates"],
    visibility: "member",
    origin: "Oasis Groves, Tunisia",
    productType: "Limited Harvest",
    harvest: "Autumn 2025",
    availability: "Limited",
    packaging: "Reserve Box",
  },
  {
    id: "gid://shopify/Product/7",
    handle: "export-reserve-dates",
    title: "Export Reserve — Bulk Date Selection",
    description:
      "Trade-only bulk allocation for distributors — pallet-ready Medjool selection with full origin documentation and export certification.",
    featuredImage: {
      url: img(images.datesBowl),
      altText: "Export reserve bulk dates",
    },
    images: [{ url: img(images.datesBowl), altText: "Export reserve" }],
    priceRange: {
      minVariantPrice: { amount: "890.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "890.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/7",
        title: "25kg × 20 cases",
        availableForSale: true,
        price: { amount: "890.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Volume", value: "25kg × 20 cases" }],
      },
    ],
    tags: ["trade", "bulk"],
    collections: ["dates"],
    visibility: "trade",
    origin: "Al Kufra Valley, Libya",
    productType: "Bulk Selection",
    harvest: "2025",
    availability: "Trade Only",
    packaging: "Export Case",
    bulkPacks: [{ label: "Pallet (20 cases)", quantity: 20, unit: "cases" }],
    tierPrices: {
      wholesale: [{ amount: "640.80", currencyCode: "USD" }],
    },
  },
  {
    id: "gid://shopify/Product/8",
    handle: "gift-dates-olive-oil",
    title: "Curated Gift — Dates & Olive Oil",
    description:
      "Two expressions of Mediterranean craft — Medjool dates beside cold-pressed olive oil, presented in a linen-lined gift box.",
    featuredImage: {
      url: img(images.mediterraneanSpread),
      altText: "Dates and olive oil gift collection",
    },
    images: [{ url: img(images.mediterraneanSpread), altText: "Gift collection" }],
    priceRange: {
      minVariantPrice: { amount: "118.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "118.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/8",
        title: "Gift Box",
        availableForSale: true,
        price: { amount: "118.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "Gift Box" }],
      },
    ],
    tags: ["gift"],
    collections: ["gift-collections", "dates", "olive-oil"],
    giftReady: true,
    productType: "Curated Gift Collection",
    harvest: "2025",
    availability: "In Season",
    packaging: "Luxury Gift Box",
  },
  {
    id: "gid://shopify/Product/9",
    handle: "gift-dates-honey",
    title: "Curated Gift — Dates & Honey",
    description:
      "Desert sweetness meets wild hillside amber — Deglet Noor dates paired with raw wildflower honey in refined presentation.",
    featuredImage: {
      url: img(images.datesBowl),
      altText: "Dates and honey gift collection",
    },
    images: [{ url: img(images.honeyDipper), altText: "Dates and honey" }],
    priceRange: {
      minVariantPrice: { amount: "92.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "92.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/9",
        title: "Gift Box",
        availableForSale: true,
        price: { amount: "92.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "Gift Box" }],
      },
    ],
    tags: ["gift"],
    collections: ["gift-collections", "dates", "honey"],
    giftReady: true,
    productType: "Curated Gift Collection",
    harvest: "2025",
    availability: "In Season",
    packaging: "Luxury Gift Box",
  },
  {
    id: "gid://shopify/Product/10",
    handle: "gift-olive-oil-honey",
    title: "Curated Gift — Olive Oil & Honey",
    description:
      "Liquid gold beside raw honey — an elegant pairing for the table, composed for gifting and quiet celebration.",
    featuredImage: {
      url: img(images.oliveOil),
      altText: "Olive oil and honey gift collection",
    },
    images: [{ url: img(images.oliveOil), altText: "Olive oil and honey" }],
    priceRange: {
      minVariantPrice: { amount: "96.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "96.00", currencyCode: "USD" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/10",
        title: "Gift Box",
        availableForSale: true,
        price: { amount: "96.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "Gift Box" }],
      },
    ],
    tags: ["gift"],
    collections: ["gift-collections", "olive-oil", "honey"],
    giftReady: true,
    productType: "Curated Gift Collection",
    harvest: "2025",
    availability: "In Season",
    packaging: "Luxury Gift Box",
  },
];

const MOCK_COLLECTIONS: ShopifyCollection[] = [
  {
    id: "gid://shopify/Collection/1",
    handle: "dates",
    title: "Dates",
    description:
      "Premium dates from desert groves and oasis valleys — where heat sculpts each fruit into concentrated sweetness.",
    image: { url: img(images.datesBowl, 800), altText: "Dates collection" },
  },
  {
    id: "gid://shopify/Collection/2",
    handle: "olive-oil",
    title: "Extra Virgin Olive Oil",
    description:
      "Cold-pressed olive oil from ancient groves — pressed within hours of harvest, preserving green intensity.",
    image: { url: img(images.oliveGrove, 800), altText: "Olive oil collection" },
  },
  {
    id: "gid://shopify/Collection/3",
    handle: "honey",
    title: "Raw Honey",
    description:
      "Raw honey from wild Mediterranean flora — unfiltered, unheated, gathered at the rhythm of the seasons.",
    image: { url: img(images.honeycomb, 800), altText: "Honey collection" },
  },
  {
    id: "gid://shopify/Collection/4",
    handle: "gift-collections",
    title: "Gift Collections",
    description:
      "Thoughtfully curated selections celebrating the finest harvests of the Mediterranean.",
    image: { url: img(images.mediterraneanSpread, 800), altText: "Gift collections" },
  },
];

/** Legacy handle redirects for old URLs */
const LEGACY_COLLECTION_HANDLES: Record<string, string> = {
  "desert-harvest": "dates",
  "liquid-gold": "olive-oil",
  "wild-honey": "honey",
  "seasonal-selection": "gift-collections",
};

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

export function formatPrice(money: ShopifyMoney): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(`
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id handle title description
              featuredImage { url altText width height }
              images(first: 5) { edges { node { url altText width height } } }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              variants(first: 10) {
                edges {
                  node {
                    id title availableForSale
                    price { amount currencyCode }
                    selectedOptions { name value }
                  }
                }
              }
              tags
            }
          }
        }
      }
    `, { first });

    return data.products.edges.map(({ node }) => ({
      ...node,
      images: (node as unknown as { images: { edges: { node: ShopifyImage }[] } }).images?.edges?.map((e) => e.node) ?? [],
      variants: (node as unknown as { variants: { edges: { node: ShopifyVariant }[] } }).variants?.edges?.map((e) => e.node) ?? [],
    }));
  } catch {
    return MOCK_PRODUCTS.slice(0, first);
  }
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct & { images: { edges: { node: ShopifyImage }[] }; variants: { edges: { node: ShopifyVariant }[] } } }>(`
      query getProduct($handle: String!) {
        product(handle: $handle) {
          id handle title description descriptionHtml
          featuredImage { url altText width height }
          images(first: 10) { edges { node { url altText width height } } }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          variants(first: 20) {
            edges {
              node {
                id title availableForSale
                price { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
          tags
        }
      }
    `, { handle });

    if (!data.product) return null;
    const p = data.product;
    return {
      ...p,
      images: p.images.edges.map((e) => e.node),
      variants: p.variants.edges.map((e) => e.node),
    };
  } catch {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
  }
}

export async function getFeaturedProduct(): Promise<ShopifyProduct> {
  const products = await getProducts(1);
  return products[0] ?? MOCK_PRODUCTS[0];
}

export async function getCollections(first = 6): Promise<ShopifyCollection[]> {
  try {
    const data = await shopifyFetch<{ collections: { edges: { node: ShopifyCollection }[] } }>(`
      query getCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id handle title description
              image { url altText width height }
            }
          }
        }
      }
    `, { first });

    return data.collections.edges.map((e) => e.node);
  } catch {
    return MOCK_COLLECTIONS.slice(0, first);
  }
}

export async function getCollectionProducts(handle: string, first = 12): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<{ collection: { products: { edges: { node: ShopifyProduct & { images: { edges: { node: ShopifyImage }[] }; variants: { edges: { node: ShopifyVariant }[] } } }[] } } }>(`
      query getCollectionProducts($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                id handle title description
                featuredImage { url altText }
                priceRange { minVariantPrice { amount currencyCode } }
                variants(first: 1) {
                  edges { node { id title availableForSale price { amount currencyCode } selectedOptions { name value } } }
                }
              }
            }
          }
        }
      }
    `, { handle, first });

    return data.collection.products.edges.map(({ node }) => ({
      ...node,
      images: node.images?.edges?.map((e) => e.node) ?? [],
      variants: node.variants.edges.map((e) => e.node),
      priceRange: node.priceRange ?? { minVariantPrice: node.variants.edges[0]?.node.price, maxVariantPrice: node.variants.edges[0]?.node.price },
    }));
  } catch {
    const resolved = resolveCollectionHandle(handle);
    return MOCK_PRODUCTS.filter((p) => productMatchesCollection(p, resolved)).slice(0, first);
  }
}

export async function createCart(variantId: string, quantity = 1): Promise<string | null> {
  try {
    const data = await shopifyFetch<{ cartCreate: { cart: { checkoutUrl: string }; userErrors: { message: string }[] } }>(`
      mutation cartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { message }
        }
      }
    `, { lines: [{ merchandiseId: variantId, quantity }] });

    return data.cartCreate.cart?.checkoutUrl ?? null;
  } catch {
    return null;
  }
}

export async function addToCart(variantId: string): Promise<{ success: boolean; checkoutUrl?: string }> {
  const checkoutUrl = await createCart(variantId);
  return checkoutUrl ? { success: true, checkoutUrl } : { success: false };
}
