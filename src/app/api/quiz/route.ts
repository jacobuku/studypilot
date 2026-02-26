import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { askClaudeJSON } from '@/lib/claude';
import { QUIZ_SYSTEM } from '@/lib/prompts';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { courseId, topic, questionCount = 10 } = await req.json();

  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  }

  // 1. Get materials
  const { data: materials } = await supabaseAdmin
    .from('materials')
    .select('extracted_text, file_name')
    .eq('course_id', courseId)
    .eq('user_id', user.id);

  const materialText = materials
    ?.map(m => `--- ${m.file_name} ---\n${m.extracted_text}`)
    .join('\n\n') || '';

  // 2. Generate quiz with Claude
  const userMessage = `Course materials:\n${materialText.slice(0, 30000)}\n\n${topic ? `Focus on this topic: ${topic}\n\n` : ''}Generate ${questionCount} multiple-choice questions.`;

  try {
    const quiz = await askClaudeJSON(QUIZ_SYSTEM, userMessage);

    // 3. Save to database
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .insert({
        course_id: courseId,
        user_id: user.id,
        title: quiz.title,
        questions_json: quiz.questions,
      })
      .select()
      .single();

    if (error) throw error;

    // Return questions WITHOUT correct answers (don't leak answers to frontend)
    const safeQuestions = quiz.questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
    }));

    return NextResponse.json({
      quiz: { ...data, questions_json: safeQuestions }
    });
  } catch (err) {
    console.error('Quiz generation error:', err);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
