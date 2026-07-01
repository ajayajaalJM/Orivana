import { NextResponse } from "next/server";
import { logoutCustomer } from "@/lib/shopify/customers";

export async function POST() {
  try {
    await logoutCustomer();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
