import type { MemberOrder } from "../../membership-types";
import { formatPrice } from "../products";
import type { CustomerAccountOrder } from "./customer";

export function mapCustomerAccountOrdersToMemberOrders(
  orders: CustomerAccountOrder[]
): MemberOrder[] {
  return orders.map((order) => ({
    id: order.name,
    date: new Date(order.processedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    total: formatPrice(order.totalPrice),
    status: order.fulfillmentStatus || order.financialStatus,
    items: order.lineItems.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unit: item.variantTitle,
    })),
  }));
}
