import { NextResponse } from "next/server";
import { recoverCustomerPassword } from "@/lib/shopify/customers";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const result = await recoverCustomerPassword(email);
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Recovery failed" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a recovery email has been sent.",
    });
  } catch {
    return NextResponse.json({ error: "Recovery failed" }, { status: 500 });
  }
}
