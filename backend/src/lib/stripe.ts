import Stripe from 'stripe';
import { env } from './env.js';

// A key is only "real" if it looks like a Stripe secret key and isn't the
// placeholder shipped in .env.example. Otherwise we run in mock-payment mode.
const key = env.STRIPE_SECRET_KEY;
const hasRealKey = Boolean(key && key.startsWith('sk_') && !key.includes('xxx'));

// Stripe is optional: when no real key is configured the app runs in a
// "mock payment" mode so checkout still works end-to-end during development.
export const stripe = hasRealKey ? new Stripe(key as string) : null;

export const isStripeConfigured = Boolean(stripe);
