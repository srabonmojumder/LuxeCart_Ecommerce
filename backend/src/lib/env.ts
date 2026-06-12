import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  // Public URL of the storefront — used to build links in emails (verify, reset, etc.).
  APP_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().default('dev-access-secret'),
  JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // SSLCommerz (Bangladesh gateway — cards + bKash/Nagad/bank). Optional; when
  // unset the storefront simply hides it (like Stripe's mock mode).
  SSLCOMMERZ_STORE_ID: z.string().optional(),
  SSLCOMMERZ_STORE_PASSWORD: z.string().optional(),
  SSLCOMMERZ_SANDBOX: z.coerce.boolean().default(true),
  // Google OAuth (social login) — optional. Set the same client id on the frontend.
  GOOGLE_CLIENT_ID: z.string().optional(),
  // Background maintenance jobs (abandoned-cart reminders, low-stock digest).
  ENABLE_SCHEDULER: z.coerce.boolean().default(false),
  ABANDONED_CART_HOURS: z.coerce.number().min(1).default(4),
  LOW_STOCK_THRESHOLD: z.coerce.number().int().min(1).default(5),
  // AI live-chat (Anthropic) — optional. If unset, the chat widget falls back
  // to its local FAQ matcher + WhatsApp handoff (no AI answers).
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-opus-4-8'),
  // WhatsApp number shown when the bot can't answer (international format, no +).
  SUPPORT_WHATSAPP: z.string().default('8801827621312'),
  // Email (SMTP) — optional; if unset, emails are logged to the console.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default('LuxeCart <no-reply@luxecart.com>'),
  // SMS — optional. Pick a provider via SMS_PROVIDER, or leave empty to
  // auto-detect from whichever creds are set (mock if none).
  SMS_PROVIDER: z.string().optional(), // twilio | bulksmsbd | alphasms
  // Twilio (international)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM: z.string().optional(),
  // bulksmsbd.net (Bangladesh)
  BULKSMSBD_API_KEY: z.string().optional(),
  BULKSMSBD_SENDER_ID: z.string().optional(),
  // Alpha SMS — sms.net.bd (Bangladesh)
  ALPHASMS_API_KEY: z.string().optional(),
  ALPHASMS_SENDER_ID: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
};
