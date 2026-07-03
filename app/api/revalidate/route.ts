import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const secret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  if (!secret) {
    return NextResponse.json({ message: "Revalidation not configured" }, { status: 501 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/journal/[slug]", "page");
  revalidatePath("/recipes");
  revalidatePath("/recipes/[slug]", "page");
  revalidatePath("/collections/[handle]", "page");
  revalidatePath("/story");
  revalidatePath("/product/[id]", "page");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
