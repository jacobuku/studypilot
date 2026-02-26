import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, email, password, name } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (action === "login") {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const courseCount = await prisma.course.count({ where: { userId: user.id } });
    const limits: Record<string, number> = { free: 1, pro: 6, max: 20 };
    const prices: Record<string, number> = { free: 0, pro: 9.99, max: 20 };

    return NextResponse.json({
      token: signToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: {
          plan: user.plan,
          coursesUsed: courseCount,
          coursesLimit: limits[user.plan] || 1,
          price: prices[user.plan] || 0,
        },
      },
    });
  }

  if (action === "signup") {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name: name || "New User",
        passwordHash,
        plan: "free",
      },
    });

    return NextResponse.json({
      token: signToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: { plan: "free", coursesUsed: 0, coursesLimit: 1, price: 0 },
      },
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}
