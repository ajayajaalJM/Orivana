import { NextResponse } from "next/server";
import {
  getCurrentCart,
  addItemToCart,
  addMultipleToCart,
  updateCartLine,
  removeCartLine,
} from "@/lib/cart-server";

export async function GET() {
  try {
    const cart = await getCurrentCart();
    return NextResponse.json({ cart });
  } catch {
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.items && Array.isArray(body.items)) {
      const result = await addMultipleToCart(body.items);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, cart: result.cart });
    }

    const { variantId, quantity = 1 } = body;
    if (!variantId) {
      return NextResponse.json({ error: "Variant ID required" }, { status: 400 });
    }

    const result = await addItemToCart(variantId, quantity);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, cart: result.cart });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { lineId, quantity } = await request.json();
    if (!lineId || quantity === undefined) {
      return NextResponse.json({ error: "Line ID and quantity required" }, { status: 400 });
    }

    const result = await updateCartLine(lineId, quantity);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, cart: result.cart });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { lineId } = await request.json();
    if (!lineId) {
      return NextResponse.json({ error: "Line ID required" }, { status: 400 });
    }

    const result = await removeCartLine(lineId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, cart: result.cart });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
