import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await req.json();
    
    // First, update the base track fields
    const updatedTrack = await prisma.track.update({
      where: { id },
      data: {
        name: body.name,
        status: body.status,
      }
    });

    // If stages were provided, recreate them
    if (body.stages && Array.isArray(body.stages)) {
      await prisma.trackStage.deleteMany({
        where: { trackId: id }
      });
      
      if (body.stages.length > 0) {
        await prisma.trackStage.createMany({
          data: body.stages.map((stage: any, index: number) => ({
            trackId: id,
            name: stage.name,
            color: stage.color || 'emerald',
            startDate: stage.startDate ? new Date(stage.startDate) : null,
            endDate: stage.endDate ? new Date(stage.endDate) : null,
            order: index
          }))
        });
      }
    }

    // Fetch the final track with stages to return
    const finalTrack = await prisma.track.findUnique({
      where: { id },
      include: { stages: { orderBy: { order: 'asc' } }, tasks: { include: { assignee: true } }, files: true }
    });

    return NextResponse.json(finalTrack);
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
