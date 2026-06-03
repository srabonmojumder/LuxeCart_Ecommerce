import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { stripe, isStripeConfigured } from '../lib/stripe.js';
import { isSslcommerzConfigured, sslcommerzInit, sslcommerzValidate } from '../lib/sslcommerz.js';
import { getSettings } from '../lib/settings.js';
import { env } from '../lib/env.js';

const intentSchema = z.object({ orderId: z.number().int().positive() });

/** Mark an order paid (idempotent): order → PAID, payment → succeeded, log event. */
async function markOrderPaid(orderId: number, provider: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status === 'PAID') return;
  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } }),
    prisma.payment.update({ where: { orderId }, data: { status: 'succeeded', provider } }),
    prisma.orderEvent.create({ data: { orderId, status: 'PAID', note: 'Payment confirmed' } }),
  ]);
}

/** GET /api/payments/methods — which payment methods the storefront should offer. */
export const getPaymentMethods = asyncHandler(async (_req: Request, res: Response) => {
  res.json({
    data: {
      cod: true,                       // always available
      card: true,                      // Stripe when live, auto-confirm in mock mode
      stripeLive: isStripeConfigured,
      sslcommerz: isSslcommerzConfigured, // cards + bKash/Nagad/bank (Bangladesh)
    },
  });
});

/** POST /api/payments/create-intent — creates a Stripe PaymentIntent for an order. */
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  if (!isStripeConfigured || !stripe) {
    throw new HttpError(503, 'Stripe is not configured. Orders are auto-confirmed in mock mode.');
  }
  const parsed = intentSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const order = await prisma.order.findFirst({
    where: { id: parsed.data.orderId, userId: req.user!.sub },
    include: { payment: true },
  });
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.status === 'PAID') throw new HttpError(409, 'Order is already paid');

  const settings = await getSettings();
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100),
    currency: (settings.currencyCode || 'USD').toLowerCase(),
    metadata: { orderId: String(order.id), userId: String(req.user!.sub) },
  });

  await prisma.payment.update({
    where: { orderId: order.id },
    data: { stripeIntentId: intent.id, status: 'pending' },
  });

  res.json({ clientSecret: intent.client_secret });
});

/** POST /api/payments/webhook — Stripe sends raw body; signature is verified. */
export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    throw new HttpError(503, 'Stripe webhook not configured');
  }
  const signature = req.headers['stripe-signature'];
  if (!signature) throw new HttpError(400, 'Missing stripe-signature header');

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new HttpError(400, `Webhook signature verification failed: ${(err as Error).message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as { id: string; metadata?: { orderId?: string } };
    const orderId = Number(intent.metadata?.orderId);
    if (orderId) await markOrderPaid(orderId, 'stripe');
  }

  res.json({ received: true });
});

// ----------------------------- SSLCommerz (Bangladesh) -----------------------------

/** POST /api/payments/sslcommerz/init — start a hosted-checkout session for an order. */
export const initSslcommerz = asyncHandler(async (req: Request, res: Response) => {
  if (!isSslcommerzConfigured) throw new HttpError(503, 'SSLCommerz is not configured');
  const orderId = Number(req.body?.orderId);
  if (!orderId) throw new HttpError(400, 'orderId is required');

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.status === 'PAID') throw new HttpError(409, 'Order is already paid');

  const settings = await getSettings();
  const sa = (order.shippingAddress ?? {}) as Record<string, string>;
  const cb = `${req.protocol}://${req.get('host')}/api/payments/sslcommerz`;

  const url = await sslcommerzInit({
    orderId: order.id,
    amount: Number(order.total),
    currency: settings.currencyCode || 'BDT',
    customer: { name: sa.fullName ?? '', email: order.email ?? '', phone: sa.phone },
    successUrl: `${cb}/success`,
    failUrl: `${cb}/fail`,
    cancelUrl: `${cb}/cancel`,
    ipnUrl: `${cb}/ipn`,
  });

  await prisma.payment.update({ where: { orderId: order.id }, data: { provider: 'sslcommerz', status: 'pending' } });
  res.json({ url });
});

/** SSLCommerz redirects the browser back here on success (form POST). Validate → mark paid. */
export const sslcommerzSuccess = asyncHandler(async (req: Request, res: Response) => {
  const valId = (req.body?.val_id ?? req.query?.val_id) as string | undefined;
  const orderId = valId ? await sslcommerzValidate(valId) : null;
  if (orderId) await markOrderPaid(orderId, 'sslcommerz');
  res.redirect(`${env.APP_URL}/track?order=${orderId ?? ''}`);
});

export const sslcommerzFail = asyncHandler(async (_req: Request, res: Response) => {
  res.redirect(`${env.APP_URL}/checkout?payment=failed`);
});

export const sslcommerzCancel = asyncHandler(async (_req: Request, res: Response) => {
  res.redirect(`${env.APP_URL}/checkout?payment=cancelled`);
});

/** Server-to-server IPN — the authoritative confirmation. */
export const sslcommerzIpn = asyncHandler(async (req: Request, res: Response) => {
  const valId = req.body?.val_id as string | undefined;
  const orderId = valId ? await sslcommerzValidate(valId) : null;
  if (orderId) await markOrderPaid(orderId, 'sslcommerz');
  res.json({ received: true });
});
