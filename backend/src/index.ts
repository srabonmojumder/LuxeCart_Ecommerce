import { createApp } from './app.js';
import { env } from './lib/env.js';
import { prisma } from './lib/prisma.js';
import { runMaintenance } from './lib/maintenance.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 LuxeCart API listening on http://localhost:${env.PORT}/api`);
  console.log(`   Health check: http://localhost:${env.PORT}/api/health`);
});

// Optional in-process scheduler for maintenance jobs (abandoned-cart + low-stock).
// Enable with ENABLE_SCHEDULER=true; otherwise run them via `npm run maintenance` (cron).
let maintenanceTimer: ReturnType<typeof setInterval> | undefined;
if (env.ENABLE_SCHEDULER) {
  const HOUR = 60 * 60 * 1000;
  setTimeout(() => void runMaintenance().catch((e) => console.error('Maintenance failed:', e)), 60 * 1000);
  maintenanceTimer = setInterval(() => void runMaintenance().catch((e) => console.error('Maintenance failed:', e)), HOUR);
  console.log('🗓️  Maintenance scheduler enabled (hourly).');
}

async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  if (maintenanceTimer) clearInterval(maintenanceTimer);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
