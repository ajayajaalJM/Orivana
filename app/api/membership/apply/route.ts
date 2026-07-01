import { NextResponse } from "next/server";
import { submitApplication } from "@/lib/membership-store";
import { submitMembershipApplicationToShopify } from "@/lib/shopify/admin";
import { isAdminApiConfigured } from "@/lib/shopify/admin";
import type { MembershipApplicationInput } from "@/lib/membership-types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MembershipApplicationInput;

    if (
      !body.email ||
      !body.password ||
      !body.name ||
      !body.businessName ||
      !body.businessType ||
      !body.location ||
      !body.monthlyVolume ||
      (body.tier !== "restaurant" && body.tier !== "wholesale")
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (isAdminApiConfigured()) {
      const result = await submitMembershipApplicationToShopify(body);
      if (!result.success) {
        return NextResponse.json({ error: result.error ?? "Application failed" }, { status: 400 });
      }

      const autoApprove = process.env.MEMBERSHIP_AUTO_APPROVE !== "false";
      return NextResponse.json({
        success: true,
        status: autoApprove ? "approved" : "pending",
        tier: body.tier,
        shopify: true,
      });
    }

    const member = submitApplication(body);

    return NextResponse.json({
      success: true,
      status: member.applicationStatus,
      tier: member.tier,
      shopify: false,
    });
  } catch {
    return NextResponse.json({ error: "Application failed" }, { status: 500 });
  }
}
