import { NextRequest } from 'next/server';
import { getUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { streamClaude } from '@/lib/claude';
import { ASK_SYSTEM } from '@/lib/prompts';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { courseId, question } = await req.json();

  if (!question) {
    return new Response('Question is required', { status: 400 });
  }

  // 1. Get course materials for context
  let materialText = '';
  if (courseId) {
    const { data: materials } = await supabaseAdmin
      .from('materials')
      .select('extracted_text, file_name')
      .eq('course_id', courseId)
      .eq('user_id', user.id);

    materialText = materials
      ?.map(m => `--- ${m.file_name} ---\n${m.extracted_text}`)
      .join('\n\n') || '';
  }

  // 2. Stream response from Claude
  const systemPrompt = `${ASK_SYSTEM}\n\n${materialText ? `The student's course materials for context:\n${materialText.slice(0, 20000)}` : ''}`;

  const stream = await streamClaude(systemPrompt, question);

  // 3. Return as streaming response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
