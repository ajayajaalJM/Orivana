import type { MemberOrder } from "../membership-types";
import { formatPrice } from "./products";
import type { ShopifyOrder } from "./types";

export function mapShopifyOrdersToMemberOrders(orders: ShopifyOrder[]): MemberOrder[] {
  return orders.map((order) => ({
    id: `#${order.orderNumber}`,
    date: new Date(order.processedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    total: formatPrice(order.totalPrice),
    status: order.fulfillmentStatus || order.financialStatus,
    items: order.lineItems.map((item) => ({
      title: item.variant?.product.title ?? item.title,
      quantity: item.quantity,
      unit: item.variant?.title,
    })),
  }));
}
