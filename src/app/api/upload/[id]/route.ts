import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const fileRecord = await prisma.fileRecord.findUnique({
      where: { id }
    });

    if (!fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Try to delete physical file if it exists
    try {
      // fileRecord.path usually looks like /uploads/filename.ext
      const filePath = path.join(process.cwd(), 'public', fileRecord.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('Failed to delete physical file:', e);
      // We continue to delete from DB even if physical file fails (e.g. on Vercel ephemeral storage)
    }

    await prisma.fileRecord.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
