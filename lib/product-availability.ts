import type { ShopifyProduct } from "./shopify/types";

export type ProductAvailabilityStatus = "available" | "coming_soon" | "sold_out";

const COMING_SOON_COLLECTIONS = new Set(["olive-oil", "honey", "gift-collections"]);

function parseAvailabilityStatus(value: string | undefined): ProductAvailabilityStatus | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "available" || normalized === "in_season") return "available";
  if (normalized === "coming_soon") return "coming_soon";
  if (normalized === "sold_out") return "sold_out";
  return undefined;
}

export function getProductAvailabilityStatus(product: ShopifyProduct): ProductAvailabilityStatus {
  const explicit = parseAvailabilityStatus(product.availabilityStatus);
  if (explicit) return explicit;

  if (product.tags.includes("coming-soon")) return "coming_soon";

  if (product.collections?.some((handle) => COMING_SOON_COLLECTIONS.has(handle))) {
    return "coming_soon";
  }

  if (product.variants.some((variant) => variant.availableForSale)) return "available";
  return "sold_out";
}

export function isComingSoonProduct(product: ShopifyProduct): boolean {
  return getProductAvailabilityStatus(product) === "coming_soon";
}

export function isProductPurchasable(product: ShopifyProduct): boolean {
  return (
    getProductAvailabilityStatus(product) === "available" &&
    product.variants.some((variant) => variant.availableForSale)
  );
}

/** Short label for coming-soon cards and pages — olive oil, honey, etc. */
export function getProductShortLabel(product: ShopifyProduct): string {
  const type = product.productType ?? "";

  if (type.includes("Olive Oil") || product.collections?.includes("olive-oil")) {
    return "Olive Oil";
  }
  if (type.includes("Honey") || product.collections?.includes("honey")) {
    return "Honey";
  }
  if (type.includes("Gift") || product.collections?.includes("gift-collections")) {
    return "Gift Collection";
  }
  if (type.includes("Medjool")) return "Medjool Dates";
  if (type.includes("Deglet")) return "Deglet Noor Dates";
  if (type.includes("Date") || product.collections?.includes("dates")) return "Dates";

  return type || "Harvest";
}

/** Human-readable variant sizes for collection and shop cards. */
export function getProductVariantLabels(product: ShopifyProduct): string | null {
  const labels = product.variants
    .map((variant) => variant.selectedOptions?.[0]?.value ?? variant.title)
    .filter((label) => label && label !== "Default Title" && label !== "Default");

  if (labels.length <= 1) return labels[0] ?? null;
  return labels.join(" · ");
}

export function getProductAvailabilityLabel(product: ShopifyProduct): string {
  const status = getProductAvailabilityStatus(product);
  if (status === "coming_soon") return "Coming Soon";
  if (status === "sold_out") return "Sold Out";
  return product.availability ?? "In Season";
}
