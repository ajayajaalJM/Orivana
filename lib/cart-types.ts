import type { ShopifyMoney } from "./shopify/types";

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
