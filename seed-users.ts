import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = ['Влад', 'Никита', 'Даша', 'Гриша'];
  
  for (const name of users) {
    const existing = await prisma.user.findFirst({ where: { name } });
    if (!existing) {
      await prisma.user.create({ data: { name, role: 'Performer' } });
      console.log(`Created user: ${name}`);
    } else {
      console.log(`User already exists: ${name}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
