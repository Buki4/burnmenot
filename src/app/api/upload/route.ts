import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'Demo';
    const trackId = formData.get('trackId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('burnmenot-files')
      .upload(uniqueName, file);

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('burnmenot-files')
      .getPublicUrl(uniqueName);

    const fileUrl = publicUrlData.publicUrl;

    const fileRecord = await prisma.fileRecord.create({
      data: {
        name: file.name,
        path: fileUrl,
        type: type,
        trackId: trackId || null
      }
    });

    return NextResponse.json(fileRecord, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  const files = await prisma.fileRecord.findMany({
    orderBy: { createdAt: 'desc' },
    include: { track: true }
  });
  return NextResponse.json(files);
}
