import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      status: body.status || 'Composition'
    },
    include: { tasks: { include: { assignee: true } }, files: true }
  });
  return NextResponse.json(track, { status: 201 });
}
