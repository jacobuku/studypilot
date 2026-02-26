import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Auth API — Stub endpoints
// Replace with your real auth provider (Clerk, NextAuth, Supabase Auth, etc.)
// ============================================================

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, email, password, name } = body;

  if (action === "login") {
    // TODO: Replace with real auth logic
    return NextResponse.json({
      token: "stub-jwt-token",
      user: {
        id: "user_1",
        name: "Student User",
        email,
        subscription: { plan: "pro", coursesUsed: 3, coursesLimit: 6, price: 9.99 },
      },
    });
  }

  if (action === "signup") {
    // TODO: Replace with real signup logic
    return NextResponse.json({
      token: "stub-jwt-token",
      user: {
        id: "user_" + Date.now(),
        name: name || "New User",
        email,
        subscription: { plan: "free", coursesUsed: 0, coursesLimit: 1, price: 0 },
      },
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE() {
  // TODO: Invalidate session/token
  return NextResponse.json({ success: true });
}
