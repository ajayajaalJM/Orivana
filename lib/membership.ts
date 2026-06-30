import type {
  CartMode,
  MemberTier,
  ProductVisibility,
  BulkPack,
} from "./membership-types";
import type { ShopifyMoney, ShopifyProduct } from "./shopify";
import { formatPrice } from "./shopify";

export const TIER_PRICING = {
  restaurantMultiplier: 0.85,
  wholesaleMultiplier: 0.72,
} as const;

export function isB2BTier(tier: MemberTier): boolean {
  return tier === "restaurant" || tier === "wholesale";
}

export function canAccessProduct(
  tier: MemberTier | null,
  visibility: ProductVisibility = "public"
): boolean {
  if (visibility === "public") return true;
  if (!tier) return false;
  if (visibility === "member") return true;
  if (visibility === "trade") return isB2BTier(tier);
  return false;
}

export function getProductVisibility(product: ShopifyProduct): ProductVisibility {
  return product.visibility ?? "public";
}

export function applyTierDiscount(
  amount: string,
  tier: MemberTier
): ShopifyMoney {
  const base = parseFloat(amount);
  let multiplier = 1;

  if (tier === "restaurant") multiplier = TIER_PRICING.restaurantMultiplier;
  if (tier === "wholesale") multiplier = TIER_PRICING.wholesaleMultiplier;

  return {
    amount: (base * multiplier).toFixed(2),
    currencyCode: "USD",
  };
}

export function getTierPrice(
  product: ShopifyProduct,
  tier: MemberTier | null,
  variantIndex = 0
): ShopifyMoney {
  const variant = product.variants[variantIndex] ?? product.variants[0];
  const retail = variant?.price ?? product.priceRange.minVariantPrice;

  if (!tier || tier === "individual") return retail;

  const tierPrice = product.tierPrices?.[tier]?.[variantIndex];
  if (tierPrice) return tierPrice;

  return applyTierDiscount(retail.amount, tier);
}

export function formatTierPrice(
  product: ShopifyProduct,
  tier: MemberTier | null,
  variantIndex = 0
): string {
  return formatPrice(getTierPrice(product, tier, variantIndex));
}

export function getBulkPacks(product: ShopifyProduct): BulkPack[] {
  return product.bulkPacks ?? [];
}

export function getCartMode(
  tier: MemberTier | null,
  chefSupplyMode: boolean
): CartMode {
  if (tier === "wholesale") return "trade-quote";
  if (tier === "restaurant" && chefSupplyMode) return "chef-supply";
  return "retail";
}

export function getCartLabel(mode: CartMode): string {
  const labels: Record<CartMode, string> = {
    retail: "Harvest Selection",
    "chef-supply": "Chef Supply Basket",
    "trade-quote": "Trade Allocation Request",
  };
  return labels[mode];
}

export function getCheckoutLabel(mode: CartMode): string {
  const labels: Record<CartMode, string> = {
    retail: "Complete Your Selection",
    "chef-supply": "Complete Supply Order",
    "trade-quote": "Request Invoice",
  };
  return labels[mode];
}

export function filterProductsForTier(
  products: ShopifyProduct[],
  tier: MemberTier | null
): ShopifyProduct[] {
  return products.filter((product) =>
    canAccessProduct(tier, getProductVisibility(product))
  );
}

export function getLockedProducts(
  products: ShopifyProduct[],
  tier: MemberTier | null
): ShopifyProduct[] {
  return products.filter(
    (product) => !canAccessProduct(tier, getProductVisibility(product))
  );
}
