import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const courseId = formData.get("courseId") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!courseId) return NextResponse.json({ error: "courseId is required" }, { status: 400 });

  const course = await prisma.course.findFirst({ where: { id: courseId, userId: user.id } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const uploadsDir = path.join(process.cwd(), "uploads", courseId);
  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(uploadsDir, `${Date.now()}_${safeName}`);
  await writeFile(filePath, buffer);

  let textContent = "";
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    textContent = buffer.toString("utf-8");
  }

  const sizeKB = file.size / 1024;
  const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;

  const courseFile = await prisma.courseFile.create({
    data: {
      name: file.name,
      type: file.type.includes("pdf") ? "pdf" : "notes",
      size: sizeStr,
      path: filePath,
      content: textContent,
      courseId,
    },
  });

  return NextResponse.json(
    {
      id: courseFile.id,
      name: courseFile.name,
      type: courseFile.type,
      size: courseFile.size,
      courseId,
      uploadedAt: courseFile.createdAt.toISOString(),
      status: "processed",
    },
    { status: 201 }
  );
}
