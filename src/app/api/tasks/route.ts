import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { assignee: true, track: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      description: body.description,
      status: body.status || 'New',
      deadline: body.deadline ? new Date(body.deadline) : null,
      assigneeId: body.assigneeId,
      trackId: body.trackId
    },
    include: { assignee: true, track: true }
  });
  return NextResponse.json(task, { status: 201 });
}
