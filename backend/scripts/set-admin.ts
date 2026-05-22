// Update the admin account's email/password without re-seeding.
// Usage: npm run set-admin -- <email> [password]   (or set ADMIN_EMAIL / ADMIN_PASSWORD)
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || '').trim();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || '';
  if (!email) {
    console.error('Provide an email: npm run set-admin -- you@example.com');
    process.exit(1);
  }

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, orderBy: { id: 'asc' } });
  if (!admin) {
    console.error('No admin user found. Run the seed first.');
    process.exit(1);
  }

  // If another account already uses this email, promote it instead of clashing.
  const clash = await prisma.user.findUnique({ where: { email } });
  if (clash && clash.id !== admin.id) {
    await prisma.user.update({ where: { id: clash.id }, data: { role: 'ADMIN' } });
    console.log(`"${email}" already exists — promoted that account to ADMIN.`);
    return;
  }

  await prisma.user.update({
    where: { id: admin.id },
    data: {
      email,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
  });
  console.log(`Admin updated → ${email}${password ? ' (password changed)' : ' (password unchanged)'}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
