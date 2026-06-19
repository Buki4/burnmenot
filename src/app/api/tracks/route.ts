import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tracks = await prisma.track.findMany({
    include: { tasks: { include: { assignee: true } }, files: true, stages: { orderBy: { order: 'asc' } } },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  });
  return NextResponse.json(tracks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    let stagesData = body.stages;
    if (!stagesData || !Array.isArray(stagesData)) {
      const today = new Date();
      stagesData = [
        { name: 'Препродакшн', color: 'blue', order: 0 },
        { name: 'Запись', color: 'red', order: 1 },
        { name: 'Сведение', color: 'purple', order: 2 },
        { name: 'Релиз', color: 'emerald', order: 3 },
      ].map((s, i) => {
        const start = new Date(today.getTime() + (i * 21) * 24 * 60 * 60 * 1000);
        const end = new Date(today.getTime() + ((i + 1) * 21) * 24 * 60 * 60 * 1000);
        return {
          ...s,
          startDate: start,
          endDate: end
        };
      });
    } else {
      stagesData = stagesData.map((s: any, i: number) => ({
        name: s.name,
        color: s.color || 'emerald',
        startDate: s.startDate ? new Date(s.startDate) : null,
        endDate: s.endDate ? new Date(s.endDate) : null,
        order: i
      }));
    }

    const track = await prisma.track.create({
      data: {
        name: body.name,
        status: body.status || 'Препродакшн',
        stages: {
          create: stagesData
        }
      },
      include: { tasks: { include: { assignee: true } }, files: true, stages: { orderBy: { order: 'asc' } } }
    });
    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 });
  }
}
