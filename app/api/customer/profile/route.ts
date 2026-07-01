import { NextResponse } from "next/server";
import { getCustomer, updateCustomerProfile } from "@/lib/shopify/customers";

export async function GET() {
  try {
    const customer = await getCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await updateCustomerProfile(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Update failed" }, { status: 400 });
    }
    return NextResponse.json({ success: true, customer: result.customer });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
