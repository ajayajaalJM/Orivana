import type { BulkPack, MemberTier, ProductVisibility } from "../membership-types";
import type { ProductAvailabilityStatus } from "../product-availability";

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

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  weight?: number;
  weightUnit?: string;
  price: ShopifyMoney;
  selectedOptions: { name: string; value: string }[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  productType?: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: ShopifyVariant[];
  tags: string[];
  collections: string[];
  /** @deprecated Use collections */
  collection?: string;
  metafields?: ShopifyMetafield[];
  visibility?: ProductVisibility;
  origin?: string;
  harvestRegion?: string;
  producer?: string;
  harvest?: string;
  availability?: string;
  availabilityStatus?: ProductAvailabilityStatus;
  giftReady?: boolean;
  packaging?: string;
  relatedProductHandles?: string[];
  recipeSlugs?: string[];
  journalSlugs?: string[];
  bulkPacks?: BulkPack[];
  tierPrices?: Partial<Record<Exclude<MemberTier, "individual">, ShopifyMoney[]>>;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products?: ShopifyProduct[];
}

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
}

export interface ShopifyOrderLineItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    image: ShopifyImage | null;
    price: ShopifyMoney;
    product: { handle: string; title: string };
  } | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: ShopifyMoney;
  lineItems: ShopifyOrderLineItem[];
}

export interface CartLineMerchandise {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  origin?: string;
  imageUrl: string | null;
  price: ShopifyMoney;
  availableForSale: boolean;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: CartLineMerchandise;
}

export interface CartCost {
  subtotalAmount: ShopifyMoney;
  totalAmount: ShopifyMoney;
}

export interface Cart {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: CartLine[];
  cost: CartCost;
}

export interface AddToCartResult {
  success: boolean;
  cart?: Cart;
  error?: string;
}

export interface CustomerAuthResult {
  success: boolean;
  customer?: ShopifyCustomer;
  accessToken?: string;
  error?: string;
}

export interface ShopifyUserError {
  field: string[] | null;
  message: string;
}
