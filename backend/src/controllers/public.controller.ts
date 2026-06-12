import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { env } from '../lib/env.js';
import { getSettings } from '../lib/settings.js';
import { sendEmail, emailConfigured } from '../lib/mailer.js';
import { answerWithAi, aiChatEnabled } from '../lib/chatAi.js';

/** GET /api/stats — public storefront stats for the homepage counters. */
export const getPublicStats = asyncHandler(async (_req: Request, res: Response) => {
  const [products, customers, orders, ratingAgg] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.count(),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
  ]);

  res.json({
    data: {
      products,
      customers,
      orders,
      avgRating: Number((ratingAgg._avg.rating ?? 5).toFixed(1)),
      reviewCount: ratingAgg._count,
    },
  });
});

const notifyBackInStockSchema = z.object({
  productSlug: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
});

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * POST /api/notify-back-in-stock — record a customer's interest in being
 * pinged when a product comes back in stock. v1 just emails the support
 * inbox; a future iteration can persist these for batch send when stock
 * is replenished.
 */
export const notifyBackInStock = asyncHandler(async (req: Request, res: Response) => {
  const parsed = notifyBackInStockSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Valid email and product required');
  const { productSlug, email } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    select: { name: true, slug: true, image: true, inStock: true, stock: true },
  });
  if (!product) throw new HttpError(404, 'Product not found');

  const settings = await getSettings();
  const supportEmail = settings?.supportEmail || env.SMTP_USER;
  if (!supportEmail) throw new HttpError(500, 'Notification destination is not configured');

  await sendEmail({
    to: supportEmail,
    subject: `[Back-in-stock request] ${product.name}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; color: #1f2937; max-width: 540px; margin: 0 auto;">
        <h2 style="margin: 0 0 8px; color: #685BC7;">Back-in-stock request</h2>
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 20px;">A customer wants to be notified when this item is back in stock.</p>
        <table style="width:100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding:6px 0; color:#6b7280; width:90px;">Customer</td><td><b>${escape(email)}</b></td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Product</td><td><b>${escape(product.name)}</b></td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Slug</td><td>${escape(product.slug)}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Current stock</td><td>${product.stock}</td></tr>
        </table>
        <p style="margin-top:18px; color:#9ca3af; font-size:12px;">Reply directly to <a href="mailto:${escape(email)}">${escape(email)}</a> when the product is restocked.</p>
      </div>
    `,
    text: `${email} wants to be notified when "${product.name}" (${product.slug}) is back in stock.`,
  });

  res.status(200).json({ success: true, mock: !emailConfigured });
});

const chatSchema = z.object({
  // Optional — the widget no longer asks for an email; WhatsApp is the reply
  // channel. When present we add a reply-to so the team can email back too.
  email: z.string().trim().toLowerCase().email().optional(),
  name: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(z.object({ from: z.enum(['user', 'bot']), text: z.string().max(2000) }))
    .max(20)
    .optional(),
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * POST /api/chat-message — public; forwards a live-chat message (and the
 * preceding transcript, if any) to the store's support inbox. Rate-limited
 * upstream at the route layer.
 */
export const chatMessage = asyncHandler(async (req: Request, res: Response) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'A valid message is required');
  const { email, name, message, history } = parsed.data;

  // Customer label for the email — falls back to "Website visitor" with no email.
  const sender = email ? `${name ? `${name} ` : ''}<${email}>` : name || 'Website visitor';

  const settings = await getSettings();
  const supportEmail = settings?.supportEmail || env.SMTP_USER;
  if (!supportEmail) throw new HttpError(500, 'Support inbox is not configured');

  const transcriptHtml =
    history && history.length > 0
      ? `<div style="margin-top:18px; padding:12px 16px; background:#f9fafb; border-radius:8px; font-size:13px; color:#6b7280;">
          <p style="margin:0 0 8px; font-weight:700; color:#1f2937;">Conversation so far</p>
          ${history
            .map(
              (h) =>
                `<p style="margin:6px 0;"><b style="color:${h.from === 'user' ? '#685BC7' : '#6b7280'};">${h.from === 'user' ? 'Customer' : 'Bot'}:</b> ${escapeHtml(h.text)}</p>`
            )
            .join('')}
        </div>`
      : '';

  await sendEmail({
    to: supportEmail,
    subject: `[Live Chat] ${email || 'Website visitor'}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; color: #1f2937; max-width: 560px; margin: 0 auto;">
        <h2 style="margin: 0 0 8px; color: #685BC7;">New chat message</h2>
        <p style="margin: 0 0 20px; color: #6b7280; font-size: 13px;">Sent from the LuxeCart live-chat widget</p>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:8px 0; color:#6b7280; width:90px;">From</td><td><b>${escapeHtml(sender)}</b></td></tr>
        </table>
        <div style="margin-top:20px; padding:16px 20px; background:#f9fafb; border-left:3px solid #685BC7; border-radius:4px; white-space:pre-wrap; line-height:1.6;">${escapeHtml(message)}</div>
        ${transcriptHtml}
        ${email
          ? `<p style="margin-top:24px; color:#9ca3af; font-size:12px;">Reply directly to <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>.</p>`
          : `<p style="margin-top:24px; color:#9ca3af; font-size:12px;">No email provided — the customer was directed to WhatsApp.</p>`}
      </div>
    `,
    text: `New chat from ${sender}\n\n${message}`,
  });

  res.status(200).json({ success: true, mock: !emailConfigured });
});

const chatAiSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(z.object({ from: z.enum(['user', 'bot']), text: z.string().max(2000) }))
    .max(20)
    .optional(),
});

/**
 * POST /api/chat-ai — public; answers a customer question with the AI assistant,
 * grounded in store policies. Returns { canAnswer, reply, whatsapp }. When the
 * bot can't answer (or AI isn't configured), canAnswer is false and the widget
 * shows the WhatsApp handoff. Rate-limited upstream at the route layer.
 */
export const chatAi = asyncHandler(async (req: Request, res: Response) => {
  const parsed = chatAiSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'A message is required');
  const { message, history } = parsed.data;

  const whatsapp = env.SUPPORT_WHATSAPP;

  // No API key → let the frontend fall back to its local FAQ + WhatsApp.
  if (!aiChatEnabled()) {
    res.status(200).json({ data: { canAnswer: false, reply: '', whatsapp, aiEnabled: false } });
    return;
  }

  let result;
  try {
    result = await answerWithAi(message, history ?? []);
  } catch {
    // AI call failed (network, rate limit, etc.) — degrade gracefully to handoff.
    result = { canAnswer: false, reply: '' };
  }

  res.status(200).json({
    data: {
      canAnswer: Boolean(result?.canAnswer),
      reply: result?.reply ?? '',
      whatsapp,
      aiEnabled: true,
    },
  });
});

/** GET /api/testimonials?limit=8 — recent positive reviews across products. */
export const getTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 8, 20);
  const reviews = await prisma.review.findMany({
    where: { rating: { gte: 4 }, comment: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { displayName: true, photoURL: true } },
      product: { select: { name: true, slug: true, image: true } },
    },
  });

  res.json({
    data: reviews
      .filter((r) => (r.comment ?? '').trim().length > 0)
      .map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        author: r.user.displayName ?? 'Verified Buyer',
        avatar: r.user.photoURL ?? null,
        product: r.product.name,
        productSlug: r.product.slug,
        productImage: r.product.image,
        createdAt: r.createdAt,
      })),
  });
});
