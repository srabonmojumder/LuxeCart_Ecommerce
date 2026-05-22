import { createApp } from './app.js';
import { env } from './lib/env.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 LuxeCart API listening on http://localhost:${env.PORT}/api`);
  console.log(`   Health check: http://localhost:${env.PORT}/api/health`);
});

async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
