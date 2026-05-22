import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { stripe, isStripeConfigured } from '../lib/stripe.js';
import { env } from '../lib/env.js';

const intentSchema = z.object({ orderId: z.number().int().positive() });

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

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100),
    currency: 'usd',
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
    if (orderId) {
      await prisma.$transaction([
        prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } }),
        prisma.payment.update({ where: { orderId }, data: { status: 'succeeded' } }),
        prisma.orderEvent.create({ data: { orderId, status: 'PAID', note: 'Payment confirmed' } }),
      ]);
    }
  }

  res.json({ received: true });
});
