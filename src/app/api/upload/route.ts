import { NextRequest, NextResponse } from "next/server";

// ============================================================
// File Upload API — Stub endpoint
// Replace with real file storage (S3, Supabase Storage, etc.)
// and a real PDF parsing pipeline.
//
// Flow:
//   1. Receive file + courseId
//   2. Store file in cloud storage
//   3. Parse file content (pdf-parse, textract, etc.)
//   4. Index content for RAG (vector database)
//   5. Return file metadata
// ============================================================

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const courseId = formData.get("courseId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  // TODO: Replace with real upload logic
  // 1. Upload to S3/Supabase Storage
  // 2. Parse PDF content: const text = await parsePDF(file)
  // 3. Chunk and embed: await indexForRAG(courseId, text)

  const fileMetadata = {
    id: "file_" + Date.now(),
    name: file.name,
    type: file.type.includes("pdf") ? "pdf" : "notes",
    size: `${(file.size / 1024).toFixed(0)} KB`,
    courseId,
    uploadedAt: new Date().toISOString(),
    status: "processed", // In reality: "uploading" → "processing" → "processed"
  };

  return NextResponse.json(fileMetadata, { status: 201 });
}
