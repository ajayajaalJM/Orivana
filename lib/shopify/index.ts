export {
  getApiVersion,
  isShopifyConfigured,
  getStoreDomain,
  getShopifyConfig,
  getStorefrontApiUrl,
  shopifyFetch,
} from "./client";

export type { ShopifyConfig, ShopifyFetchOptions } from "./client";

export type {
  ShopifyImage,
  ShopifyMoney,
  ShopifyMetafield,
  ShopifyVariant,
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCustomer,
  ShopifyOrder,
  ShopifyOrderLineItem,
  Cart,
  CartLine,
  CartLineMerchandise,
  CartCost,
  AddToCartResult,
  CustomerAuthResult,
} from "./types";

export {
  getProducts,
  getProduct,
  getFeaturedProduct,
  getProductsByHandles,
  formatPrice,
  normalizeProduct,
} from "./products";

export {
  getCollections,
  getCollection,
  getCollectionProducts,
  getCollectionShowcaseItems,
  resolveCollectionHandle,
  getPrimaryCollectionHandle,
  productMatchesCollection,
  limitComingSoonByCollection,
} from "./collections";

export type { CollectionShowcaseItem } from "./collections";

export {
  getCheckoutUrl,
  getCustomerAccountUrl,
  getForgotPasswordUrl,
} from "./checkout";

export { mapShopifyOrdersToMemberOrders } from "./order-mapper";
