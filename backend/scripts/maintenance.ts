// One-off runner for maintenance jobs — wire to cron, e.g.:
//   0 * * * *  cd /path/to/backend && npm run maintenance
import { runMaintenance } from '../src/lib/maintenance.js';
import { prisma } from '../src/lib/prisma.js';

runMaintenance()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch(async (e) => {
    console.error('Maintenance failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
