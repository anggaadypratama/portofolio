import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function main() {
  const email = 'dev@angga.com';
  const password = 'Mbv188Zk5*'; // Initial password
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
        password: hashedPassword,
    },
    create: {
      email,
      name: 'Admin',
      password: hashedPassword,
    },
  });

  console.log({ user });
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
