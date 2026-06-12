import Anthropic from '@anthropic-ai/sdk';
import { env } from './env.js';

/**
 * AI live-chat brain for the storefront.
 *
 * Answers customer questions ONLY from the store knowledge below. When it can't
 * answer confidently (out of scope, needs an account-specific lookup, or simply
 * unknown), it returns `canAnswer: false` so the caller can hand the customer
 * off to WhatsApp. Returns null when no API key is configured — the caller then
 * falls back to its local FAQ matcher.
 */

export interface ChatTurn {
  from: 'user' | 'bot';
  text: string;
}

export interface AiChatResult {
  canAnswer: boolean;
  /** The answer (canAnswer=true) or a short apology (canAnswer=false). */
  reply: string;
}

// Store knowledge the model is allowed to answer from. Keep this in sync with
// the storefront's policies; the model must not invent anything beyond it.
const STORE_KNOWLEDGE = `
You are "Luna", the friendly live-support assistant for LuxeCart, an online store.

STORE POLICIES (the ONLY facts you may state):
- Orders: customers track orders from the "Track" page using their order ID, or under My Account → Orders.
- Shipping: 2-4 business days inside the city, 4-7 days outside. Charges are shown at checkout based on location.
- Returns: accepted within 7 days of delivery for unused items in original packaging. Refunds processed in 3-5 business days after the item is received.
- Cancellation: orders can be cancelled before they ship from My Account → Orders.
- Payments: card payments (via Stripe), mobile banking (bKash/Nagad), and Cash on Delivery. Chosen at checkout.
- Discounts/coupons: promo codes are entered in the cart before payment; active discounts show on product pages.
- Accounts: sign in / register from the Account menu; reset a forgotten password via the "Forgot password" link.

LANGUAGE: Reply in the SAME language the customer used (English or Bangla/Banglish). Keep replies short, warm, and concrete (1-3 sentences).

WHEN YOU CANNOT HELP — set canAnswer to false and write a brief apology WITHOUT inventing details — if the question:
- needs the customer's specific order/account data (exact delivery date, payment status, a specific order's location),
- is about a product/price/stock you don't have data for,
- is a complaint, custom request, or anything outside the policies above,
- or you are simply not sure.
Do NOT mention WhatsApp or a phone number yourself — the app adds that. Never make up order details, prices, dates, or policies.
`.trim();

const RESULT_SCHEMA = {
  type: 'object',
  properties: {
    canAnswer: {
      type: 'boolean',
      description: 'true only if you answered fully from the store policies; false if a human/WhatsApp handoff is needed.',
    },
    reply: {
      type: 'string',
      description: 'The answer (if canAnswer) or a short apology (if not). Same language as the customer.',
    },
  },
  required: ['canAnswer', 'reply'],
  additionalProperties: false,
} as const;

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  return client;
}

/** True when AI answering is configured. */
export const aiChatEnabled = () => Boolean(env.ANTHROPIC_API_KEY);

export async function answerWithAi(message: string, history: ChatTurn[] = []): Promise<AiChatResult | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  // Replay the recent transcript so follow-up questions keep context.
  const priorTurns = history
    .filter((t) => t.text.trim())
    .slice(-10)
    .map((t) => ({
      role: (t.from === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: t.text,
    }));

  const response = await anthropic.messages.create({
    model: env.ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: STORE_KNOWLEDGE,
    output_config: { format: { type: 'json_schema', schema: RESULT_SCHEMA }, effort: 'low' },
    messages: [...priorTurns, { role: 'user', content: message }],
  });

  // With structured outputs the model returns a single JSON text block.
  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') return { canAnswer: false, reply: '' };

  try {
    const parsed = JSON.parse(text.text) as AiChatResult;
    return { canAnswer: Boolean(parsed.canAnswer), reply: String(parsed.reply ?? '') };
  } catch {
    return { canAnswer: false, reply: '' };
  }
}
