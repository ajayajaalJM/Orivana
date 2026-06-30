import { NextResponse } from "next/server";
import { registerMember } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await registerMember(email, password, name);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
