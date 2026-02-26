import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { PDFParse } from 'pdf-parse';
import type { TextResult } from 'pdf-parse';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const courseId = formData.get('courseId') as string;

  if (!file || !courseId) {
    return NextResponse.json({ error: 'Missing file or courseId' }, { status: 400 });
  }

  // 1. Upload file to Supabase Storage
  const filePath = `${user.id}/${courseId}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from('materials')
    .upload(filePath, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  // 2. Extract text from PDF
  let extractedText = '';
  try {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const textResult: TextResult = await parser.getText();
      extractedText = textResult.text;
      await parser.destroy();
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    }
  } catch {
    extractedText = '[Could not extract text from this file]';
  }

  // 3. Save to materials table
  const { data, error: dbError } = await supabaseAdmin
    .from('materials')
    .insert({
      course_id: courseId,
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      extracted_text: extractedText,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ material: data });
}
