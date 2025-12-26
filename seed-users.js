const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Buat User ADMIN
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123', // Password Admin
      role: 'ADMIN',
    },
  });

  // 2. Buat User MANDOR
  await prisma.user.upsert({
    where: { username: 'mandor' },
    update: {},
    create: {
      username: 'mandor',
      password: 'mandor123', // Password Mandor
      role: 'MANDOR',
    },
  });

  console.log('✅ User Admin & Mandor berhasil dibuat!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());