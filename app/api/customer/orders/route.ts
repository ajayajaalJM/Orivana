import { NextResponse } from "next/server";
import { getCustomerOrders } from "@/lib/shopify/customers";

export async function GET() {
  try {
    const orders = await getCustomerOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
