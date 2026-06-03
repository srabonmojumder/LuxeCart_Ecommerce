import { env } from './env.js';

/**
 * SSLCommerz — Bangladesh's most common payment aggregator. Its hosted checkout
 * page lets customers pay with cards, bKash, Nagad, Rocket and bank transfer.
 *
 * Optional, like Stripe: only "configured" when a store id + password are set.
 * Until then the storefront hides the option and orders fall back to COD/Stripe.
 */
export const isSslcommerzConfigured = Boolean(
  env.SSLCOMMERZ_STORE_ID && env.SSLCOMMERZ_STORE_PASSWORD,
);

const BASE = env.SSLCOMMERZ_SANDBOX
  ? 'https://sandbox.sslcommerz.com'
  : 'https://securepay.sslcommerz.com';

interface InitParams {
  orderId: number;
  amount: number;
  currency: string;
  customer: { name: string; email: string; phone?: string };
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
}

/** Create a hosted-checkout session; returns the GatewayPageURL to redirect to. */
export async function sslcommerzInit(p: InitParams): Promise<string> {
  if (!isSslcommerzConfigured) throw new Error('SSLCommerz is not configured');

  const body = new URLSearchParams({
    store_id: env.SSLCOMMERZ_STORE_ID as string,
    store_passwd: env.SSLCOMMERZ_STORE_PASSWORD as string,
    total_amount: p.amount.toFixed(2),
    currency: p.currency,
    tran_id: `LC-${p.orderId}-${Date.now()}`,
    success_url: p.successUrl,
    fail_url: p.failUrl,
    cancel_url: p.cancelUrl,
    ipn_url: p.ipnUrl,
    cus_name: p.customer.name || 'Customer',
    cus_email: p.customer.email || 'customer@example.com',
    cus_phone: p.customer.phone || 'N/A',
    cus_add1: 'N/A',
    cus_city: 'N/A',
    cus_country: 'Bangladesh',
    shipping_method: 'NO',
    product_name: `Order #${p.orderId}`,
    product_category: 'general',
    product_profile: 'general',
    // Echoed back on the callback so we know which order was paid.
    value_a: String(p.orderId),
  });

  const res = await fetch(`${BASE}/gwprocess/v4/api.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = (await res.json()) as { status?: string; GatewayPageURL?: string; failedreason?: string };
  if (data.status !== 'SUCCESS' || !data.GatewayPageURL) {
    throw new Error(data.failedreason || 'SSLCommerz session init failed');
  }
  return data.GatewayPageURL;
}

/** Validate a transaction by its val_id; returns the paid orderId, or null. */
export async function sslcommerzValidate(valId: string): Promise<number | null> {
  if (!isSslcommerzConfigured) return null;
  const url =
    `${BASE}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(valId)}` +
    `&store_id=${env.SSLCOMMERZ_STORE_ID}&store_passwd=${env.SSLCOMMERZ_STORE_PASSWORD}&format=json`;
  const res = await fetch(url);
  const data = (await res.json()) as { status?: string; value_a?: string };
  if ((data.status === 'VALID' || data.status === 'VALIDATED') && data.value_a) {
    return Number(data.value_a);
  }
  return null;
}
