import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Telegraf } from 'telegraf';

export async function GET(req: Request) {
  // Security check: ensure the request is from Vercel Cron
  // https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json({ message: 'Telegram credentials missing' });
  }

  const bot = new Telegraf(botToken);
  const now = new Date();
  
  // Find events happening in the next 24 hours
  const upcomingEvents = await prisma.event.findMany({
    where: {
      date: {
        gte: now,
        lte: new Date(now.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  });

  if (upcomingEvents.length > 0) {
    let message = '🔔 **Напоминание о предстоящих событиях (ближайшие 24ч):**\n\n';
    upcomingEvents.forEach(event => {
      const dateStr = new Intl.DateTimeFormat('ru-RU', { 
        weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(event.date);
      message += `📅 ${event.title} (${event.type})\n⏰ ${dateStr}\n\n`;
    });

    try {
      await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (e) {
      console.error('Failed to send Telegram message', e);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Cron job executed successfully', eventsNotified: upcomingEvents.length });
}
