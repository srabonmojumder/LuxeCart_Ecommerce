import { prisma } from './prisma.js';
import { env } from './env.js';
import { sendEmail } from './mailer.js';
import { getSettings } from './settings.js';

/**
 * Email customers who left items in their cart and haven't been reminded since.
 * Returns the number of reminders sent.
 */
export async function runAbandonedCartReminders(): Promise<number> {
  const cutoff = new Date(Date.now() - env.ABANDONED_CART_HOURS * 60 * 60 * 1000);
  // Don't pester carts older than a week.
  const floor = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const carts = await prisma.cart.findMany({
    where: {
      updatedAt: { lt: cutoff, gt: floor },
      items: { some: {} },
      OR: [{ reminderSentAt: null }, { reminderSentAt: { lt: prisma.cart.fields.updatedAt } }],
    },
    include: {
      user: { select: { email: true, displayName: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    take: 100,
  });

  const settings = await getSettings();
  let sent = 0;

  for (const cart of carts) {
    if (!cart.user?.email || cart.items.length === 0) continue;
    const list = cart.items.map((i) => `• ${i.product.name} × ${i.quantity}`).join('<br/>');
    const link = `${env.APP_URL}/cart`;
    const html =
      `<h2>You left something behind${cart.user.displayName ? `, ${cart.user.displayName}` : ''} 🛒</h2>` +
      `<p>Your cart at ${settings.storeName} is waiting for you:</p>` +
      `<p>${list}</p>` +
      `<p><a href="${link}" style="background:#c026d3;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;display:inline-block">Complete your order</a></p>`;
    try {
      await sendEmail({ to: cart.user.email, subject: `Your ${settings.storeName} cart is waiting`, html, text: `Complete your order: ${link}` });
      await prisma.cart.update({ where: { id: cart.id }, data: { reminderSentAt: new Date() } });
      sent++;
    } catch (e) {
      console.error('Abandoned-cart email failed:', e);
    }
  }
  return sent;
}

/**
 * Email store admins a digest of products at or below the low-stock threshold.
 * Returns the number of low-stock products found.
 */
export async function runLowStockDigest(): Promise<number> {
  const lowStock = await prisma.product.findMany({
    where: { isActive: true, stock: { lte: env.LOW_STOCK_THRESHOLD } },
    select: { name: true, stock: true, slug: true },
    orderBy: { stock: 'asc' },
    take: 100,
  });
  if (lowStock.length === 0) return 0;

  const settings = await getSettings();
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true } });
  const recipients = [...new Set([settings.supportEmail, ...admins.map((a) => a.email)].filter(Boolean))];
  if (recipients.length === 0) return lowStock.length;

  const rows = lowStock.map((p) => `<tr><td style="padding:4px 12px">${p.name}</td><td style="padding:4px 12px;text-align:right"><b>${p.stock}</b></td></tr>`).join('');
  const html =
    `<h2>Low-stock alert — ${lowStock.length} product(s)</h2>` +
    `<p>These products are at or below ${env.LOW_STOCK_THRESHOLD} units:</p>` +
    `<table style="border-collapse:collapse"><tr><th style="text-align:left;padding:4px 12px">Product</th><th style="text-align:right;padding:4px 12px">Stock</th></tr>${rows}</table>` +
    `<p><a href="${env.APP_URL}/admin/products">Manage inventory</a></p>`;

  for (const to of recipients) {
    try {
      await sendEmail({ to, subject: `⚠️ ${settings.storeName}: ${lowStock.length} product(s) low on stock`, html, text: `${lowStock.length} products are low on stock.` });
    } catch (e) {
      console.error('Low-stock digest email failed:', e);
    }
  }
  return lowStock.length;
}

/** Run all maintenance jobs and return a summary. */
export async function runMaintenance() {
  const [reminders, lowStock] = await Promise.all([runAbandonedCartReminders(), runLowStockDigest()]);
  const summary = { remindersSent: reminders, lowStockProducts: lowStock, at: new Date().toISOString() };
  console.log('🧹 Maintenance run:', summary);
  return summary;
}
