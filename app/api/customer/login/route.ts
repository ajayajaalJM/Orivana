import { NextResponse } from "next/server";
import { loginCustomer } from "@/lib/shopify/customers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await loginCustomer(email, password);
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Login failed" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      customer: result.customer,
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
