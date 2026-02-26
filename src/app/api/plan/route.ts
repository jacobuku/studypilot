import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { askClaudeJSON } from '@/lib/claude';
import { STUDY_PLAN_SYSTEM } from '@/lib/prompts';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { courseId, examDate } = await req.json();

  if (!courseId || !examDate) {
    return NextResponse.json({ error: 'courseId and examDate are required' }, { status: 400 });
  }

  // 1. Get all materials for this course
  const { data: materials } = await supabaseAdmin
    .from('materials')
    .select('extracted_text, file_name')
    .eq('course_id', courseId)
    .eq('user_id', user.id);

  const materialText = materials
    ?.map(m => `--- ${m.file_name} ---\n${m.extracted_text}`)
    .join('\n\n') || 'No materials uploaded yet.';

  // 2. Generate study plan with Claude
  const userMessage = `Course materials:\n${materialText.slice(0, 30000)}\n\nExam date: ${examDate}\nToday's date: ${new Date().toISOString().split('T')[0]}\n\nPlease create a study plan from today until the exam date.`;

  try {
    const plan = await askClaudeJSON(STUDY_PLAN_SYSTEM, userMessage);

    // 3. Save to database
    const { data, error } = await supabaseAdmin
      .from('study_plans')
      .insert({
        course_id: courseId,
        user_id: user.id,
        exam_date: examDate,
        plan_json: plan,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ plan: data });
  } catch (err) {
    console.error('Study plan generation error:', err);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}
