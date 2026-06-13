import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from './prisma.js';

/** Loyalty economy — tweak here to change earn/redeem rates store-wide. */
export const POINT_VALUE = 0.01;        // currency value of 1 point ($0.01 → 100 pts = $1)
export const EARN_PER_CURRENCY = 1;     // points earned per 1 unit of order total
export const MIN_REDEEM = 100;          // minimum points a customer can redeem at once

/** Currency value of a points balance. */
export const pointsToCurrency = (points: number) => +(points * POINT_VALUE).toFixed(2);
/** Points needed to cover a given currency amount (floored). */
export const currencyToPoints = (amount: number) => Math.floor(amount / POINT_VALUE);

type Tx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

/** Get the user's loyalty account, creating an empty one on first touch. */
export async function getOrCreateAccount(userId: number, client: Tx = prisma) {
  return client.loyaltyAccount.upsert({ where: { userId }, create: { userId }, update: {} });
}

/** Award points (EARN). Updates balance + lifetime and logs a transaction. */
export async function earnPoints(
  tx: Tx,
  userId: number,
  points: number,
  opts: { orderId?: number; note?: string } = {},
) {
  if (points <= 0) return;
  const account = await getOrCreateAccount(userId, tx);
  await tx.loyaltyAccount.update({
    where: { id: account.id },
    data: { balance: { increment: points }, lifetime: { increment: points } },
  });
  await tx.loyaltyTransaction.create({
    data: { accountId: account.id, kind: 'EARN', points, orderId: opts.orderId, note: opts.note },
  });
}

/** Spend points (REDEEM). Throws if the balance is insufficient. */
export async function redeemPoints(
  tx: Tx,
  userId: number,
  points: number,
  opts: { orderId?: number; note?: string } = {},
) {
  if (points <= 0) return;
  const account = await getOrCreateAccount(userId, tx);
  if (account.balance < points) throw new Error('Insufficient loyalty points');
  await tx.loyaltyAccount.update({
    where: { id: account.id },
    data: { balance: { decrement: points } },
  });
  await tx.loyaltyTransaction.create({
    data: { accountId: account.id, kind: 'REDEEM', points: -points, orderId: opts.orderId, note: opts.note },
  });
}

export function serializeLoyalty(
  account: Prisma.LoyaltyAccountGetPayload<{ include: { transactions: true } }> | null,
) {
  return {
    balance: account?.balance ?? 0,
    lifetime: account?.lifetime ?? 0,
    value: pointsToCurrency(account?.balance ?? 0),
    pointValue: POINT_VALUE,
    minRedeem: MIN_REDEEM,
    transactions: (account?.transactions ?? []).map((t) => ({
      id: t.id,
      kind: t.kind,
      points: t.points,
      note: t.note,
      orderId: t.orderId,
      createdAt: t.createdAt,
    })),
  };
}
