import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const course = await prisma.course.findFirst({
      where: { id, userId: user.id },
      include: { files: { orderBy: { createdAt: "desc" } } },
    });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    return NextResponse.json({
      ...course,
      files: course.files.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        uploadedAt: f.createdAt.toISOString().split("T")[0],
        size: f.size,
      })),
    });
  }

  const courses = await prisma.course.findMany({
    where: { userId: user.id },
    include: { files: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    courses.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      instructor: c.instructor,
      color: c.color,
      progress: c.progress,
      files: c.files.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        uploadedAt: f.createdAt.toISOString().split("T")[0],
        size: f.size,
      })),
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, code, instructor } = body;

  if (!name || !code) {
    return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
  }

  const colors = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];
  const count = await prisma.course.count({ where: { userId: user.id } });

  const course = await prisma.course.create({
    data: { name, code, instructor: instructor || "", color: colors[count % colors.length], userId: user.id },
  });

  return NextResponse.json(
    { id: course.id, name: course.name, code: course.code, instructor: course.instructor, color: course.color, progress: 0, files: [] },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.course.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ success: true });
}
