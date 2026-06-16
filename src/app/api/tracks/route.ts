import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tracks = await prisma.track.findMany({
    include: { tasks: { include: { assignee: true } }, files: true, stages: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(tracks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const track = await prisma.track.create({
    data: {
      name: body.name,
      status: body.status || 'Препродакшн',
      stages: {
        create: [
          { name: 'Препродакшн', color: 'blue', order: 0 },
          { name: 'Запись', color: 'red', order: 1 },
          { name: 'Эдитинг', color: 'orange', order: 2 },
          { name: 'Сведение', color: 'purple', order: 3 },
          { name: 'Мастеринг', color: 'pink', order: 4 },
          { name: 'Релиз', color: 'emerald', order: 5 },
        ]
      }
    },
    include: { tasks: { include: { assignee: true } }, files: true, stages: { orderBy: { order: 'asc' } } }
  });
  return NextResponse.json(track, { status: 201 });
}
