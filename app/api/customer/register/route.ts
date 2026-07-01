import { NextResponse } from "next/server";
import { registerCustomer } from "@/lib/shopify/customers";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, acceptsMarketing } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await registerCustomer({
      email,
      password,
      firstName,
      lastName,
      acceptsMarketing,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Registration failed" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      customer: result.customer,
    });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
