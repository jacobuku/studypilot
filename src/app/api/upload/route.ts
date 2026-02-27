import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, unlinkSync } from "fs";
import { execFileSync } from "child_process";
import { join } from "path";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const courseId = formData.get("courseId") as string | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!courseId) return NextResponse.json({ error: "courseId is required" }, { status: 400 });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = `${user.id}/${courseId}/${Date.now()}_${file.name}`;

    const { error: storageError } = await supabaseAdmin.storage
      .from("materials")
      .upload(filePath, fileBuffer, { contentType: file.type, upsert: false });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json({ error: "Failed to upload: " + storageError.message }, { status: 500 });
    }

    // Extract text using child process (bypasses webpack)
    let extractedText = "";
    if (file.type === "application/pdf") {
      try {
        const tmpPath = join("/tmp", `upload_${Date.now()}.pdf`);
        writeFileSync(tmpPath, fileBuffer);
        const workerPath = join(process.cwd(), "src/lib/parse-pdf-worker.cjs");
        extractedText = execFileSync("node", [workerPath, tmpPath], {
          encoding: "utf-8",
          timeout: 30000,
        });
        unlinkSync(tmpPath);
      } catch (e) {
        console.error("PDF parse error:", e);
      }
    }

    const { data: material, error: dbError } = await supabaseAdmin
      .from("materials")
      .insert({
        course_id: courseId,
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        extracted_text: extractedText || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json({ error: "Failed to save: " + dbError.message }, { status: 500 });
    }

    return NextResponse.json(material, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
