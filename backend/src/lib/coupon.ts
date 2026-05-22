import type { Coupon } from '@prisma/client';

export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
}

/** Validate a coupon against an order subtotal and compute the discount. */
export function evaluateCoupon(coupon: Coupon | null, subtotal: number): CouponResult {
  if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
  if (!coupon.active) return { valid: false, discount: 0, message: 'This coupon is no longer active' };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: 'This coupon has expired' };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, message: 'This coupon has reached its usage limit' };
  }
  const min = Number(coupon.minSubtotal);
  if (subtotal < min) {
    return { valid: false, discount: 0, message: `Minimum order of $${min.toFixed(2)} required` };
  }
  const raw = coupon.type === 'PERCENT' ? (subtotal * Number(coupon.value)) / 100 : Number(coupon.value);
  const discount = Math.min(raw, subtotal);
  return { valid: true, discount: +discount.toFixed(2), message: 'Coupon applied' };
}
