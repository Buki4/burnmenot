const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = botToken ? new Telegraf(botToken) : null;

const startTelegramBotAndCron = () => {
  if (!bot) {
    console.warn('TELEGRAM_BOT_TOKEN is not set. Telegram bot will not start.');
    return;
  }

  bot.start((ctx) => {
    ctx.reply('Welcome to BurnMeNotApp Bot! Your chat ID is: ' + ctx.chat.id);
  });

  bot.launch();
  console.log('Telegram bot started.');

  // Cron job to run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly event check...');
    const now = new Date();
    
    try {
      const events = await prisma.event.findMany({
        where: {
          date: {
            gte: now,
          }
        }
      });

      for (const event of events) {
        const timeDiff = event.date.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        const groupId = process.env.TELEGRAM_GROUP_CHAT_ID;
        if (!groupId) continue;

        if (hoursDiff > 23.5 && hoursDiff <= 24.5) {
          bot.telegram.sendMessage(groupId, `Напоминание: ${event.title} (${event.type}) состоится завтра!`);
        } else if (hoursDiff > 47.5 && hoursDiff <= 48.5) {
          bot.telegram.sendMessage(groupId, `Напоминание: ${event.title} (${event.type}) состоится через 2 дня!`);
        } else if (hoursDiff > 1.5 && hoursDiff <= 2.5) {
          bot.telegram.sendMessage(groupId, `🔥 Напоминание: ${event.title} (${event.type}) начнется через 2 часа!`);
        }
      }
    } catch (e) {
      console.error('Error in cron job', e);
    }
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

module.exports = { startTelegramBotAndCron, bot };
