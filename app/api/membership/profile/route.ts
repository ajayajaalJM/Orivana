import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { updateMember } from "@/lib/membership-store";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updated = updateMember(session.user.id, {
    chefSupplyMode: body.chefSupplyMode,
    name: body.name,
  });

  if (!updated) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({
    chefSupplyMode: updated.chefSupplyMode,
    name: updated.name,
  });
}
