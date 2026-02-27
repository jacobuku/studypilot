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

    const { courseId, question, options, userAnswer, correctAnswer } = await req.json();

    let materialContext = "";
    if (courseId) {
      const { data: materials } = await supabase
        .from("materials")
        .select("extracted_text")
        .eq("course_id", courseId)
        .not("extracted_text", "is", null);

      if (materials && materials.length > 0) {
        materialContext = materials
          .map((m) => m.extracted_text)
          .join("\n\n")
          .slice(0, 40000);
      }
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are a patient tutor. A student got this question wrong. Explain why the correct answer is right and why their choice was wrong. Use simple language.

QUESTION: ${question}
OPTIONS: ${options.join(" | ")}
STUDENT CHOSE: ${options[userAnswer]}
CORRECT ANSWER: ${options[correctAnswer]}

${materialContext ? `COURSE MATERIALS FOR CONTEXT:\n${materialContext}` : ""}

Give a clear, step-by-step explanation in 3-5 sentences. Reference the course materials if relevant.`,
        },
      ],
    });

    const explanation =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ explanation });
  } catch (err: any) {
    console.error("Explain error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}