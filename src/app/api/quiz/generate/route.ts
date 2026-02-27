import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await req.json();
    if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

    const { data: materials } = await supabase
      .from("materials")
      .select("extracted_text, file_name")
      .eq("course_id", courseId)
      .not("extracted_text", "is", null);

    if (!materials || materials.length === 0) {
      return NextResponse.json(
        { error: "No materials found. Upload a PDF first." },
        { status: 400 }
      );
    }

    const combinedText = materials
      .map((m) => `--- ${m.file_name} ---\n${m.extracted_text}`)
      .join("\n\n")
      .slice(0, 80000);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `Generate a 10-question multiple choice quiz from these course materials.

MATERIALS:
${combinedText}

Return ONLY valid JSON (no markdown, no backticks):
{
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Rules:
- Exactly 10 questions
- 4 options each (A/B/C/D)
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- Mix difficulty: 3 easy, 4 medium, 3 hard
- Test understanding, not memorization`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) quiz = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse quiz" }, { status: 500 });
    }

    const { data: saved, error: saveErr } = await supabase
      .from("quizzes")
      .insert({
        user_id: user.id,
        course_id: courseId,
        questions: quiz.questions,
      })
      .select()
      .single();

    if (saveErr) return NextResponse.json({ error: saveErr.message }, { status: 500 });

    return NextResponse.json({ quiz: saved }, { status: 201 });
  } catch (err: any) {
    console.error("Quiz generate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}