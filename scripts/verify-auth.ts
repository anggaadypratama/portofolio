
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { comparePassword, encrypt, decrypt } from '../lib/auth';

async function main() {
  console.log('Verifying login flow...');
  
  const email = 'dev@angga.com';
  const password = 'password';

  // 1. Fetch user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('FAIL: User not found in DB');
    return;
  }
  console.log('PASS: User found:', user.email);

  // 2. Verify password
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    console.error('FAIL: Password invalid');
    return;
  }
  console.log('PASS: Password valid');

  // 3. Test Token generation/verification
  const token = await encrypt({ id: user.id });
  console.log('PASS: Token generated');
  
  const payload = await decrypt(token);
  if (payload && payload.id === user.id) {
    console.log('PASS: Token verified');
  } else {
    console.error('FAIL: Token verification failed', payload);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
