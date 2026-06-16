import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await req.json();
    const updatedTrack = await prisma.track.update({
      where: { id },
      data: {
        name: body.name,
        status: body.status,
        compStartDate: body.compStartDate !== undefined ? (body.compStartDate ? new Date(body.compStartDate) : null) : undefined,
        compEndDate: body.compEndDate !== undefined ? (body.compEndDate ? new Date(body.compEndDate) : null) : undefined,
        rehStartDate: body.rehStartDate !== undefined ? (body.rehStartDate ? new Date(body.rehStartDate) : null) : undefined,
        rehEndDate: body.rehEndDate !== undefined ? (body.rehEndDate ? new Date(body.rehEndDate) : null) : undefined,
        recStartDate: body.recStartDate !== undefined ? (body.recStartDate ? new Date(body.recStartDate) : null) : undefined,
        recEndDate: body.recEndDate !== undefined ? (body.recEndDate ? new Date(body.recEndDate) : null) : undefined,
      }
    });
    return NextResponse.json(updatedTrack);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update track' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // First delete all tasks associated with this track
    await prisma.task.deleteMany({
      where: { trackId: id }
    });

    // Then delete the track
    await prisma.track.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 });
  }
}
