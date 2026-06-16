import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tracks = await prisma.track.findMany({
    include: { tasks: { include: { assignee: true } }, files: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(tracks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const track = await prisma.track.create({
    data: {
      name: body.name,
      status: body.status || 'Composition',
      compStartDate: body.compStartDate ? new Date(body.compStartDate) : null,
      compEndDate: body.compEndDate ? new Date(body.compEndDate) : null,
      rehStartDate: body.rehStartDate ? new Date(body.rehStartDate) : null,
      rehEndDate: body.rehEndDate ? new Date(body.rehEndDate) : null,
      recStartDate: body.recStartDate ? new Date(body.recStartDate) : null,
      recEndDate: body.recEndDate ? new Date(body.recEndDate) : null,
    },
    include: { tasks: { include: { assignee: true } }, files: true }
  });
  return NextResponse.json(track, { status: 201 });
}
