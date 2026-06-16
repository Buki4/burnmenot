import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const { tracks } = await request.json();
    
    if (!Array.isArray(tracks)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Prisma doesn't support bulk updates with different values out of the box,
    // so we use a transaction to update each track's order sequentially.
    const updatePromises = tracks.map((track) => 
      prisma.track.update({
        where: { id: track.id },
        data: { order: track.order }
      })
    );

    await prisma.$transaction(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering tracks:', error);
    return NextResponse.json({ error: 'Failed to reorder tracks' }, { status: 500 });
  }
}
