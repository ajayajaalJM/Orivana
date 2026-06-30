import { NextResponse } from "next/server";
import { submitApplication } from "@/lib/membership-store";
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

    const member = submitApplication(body);

    return NextResponse.json({
      success: true,
      status: member.applicationStatus,
      tier: member.tier,
    });
  } catch {
    return NextResponse.json({ error: "Application failed" }, { status: 500 });
  }
}
