import Fuse from 'fuse.js';

/**
 * Lightweight FAQ knowledge base for the live-chat widget.
 *
 * The bot tries to answer common questions instantly via fuzzy matching.
 * When nothing matches confidently, `matchFaq` returns null and the widget
 * falls back to WhatsApp (see WHATSAPP_NUMBER in LiveChat).
 */
export interface FaqEntry {
  /** Phrases a user might type — used for matching (not shown). */
  keywords: string[];
  /** The answer the bot replies with. */
  answer: string;
}

export const faqs: FaqEntry[] = [
  {
    keywords: ['hello', 'hi there', 'hey', 'assalamu alaikum', 'good morning', 'good evening', 'salam'],
    answer:
      'Hello! 👋 Welcome to LuxeCart. How can I help you today? You can ask about orders, shipping, returns, payment, or anything else.',
  },
  {
    keywords: ['how to order', 'how do i order', 'how to buy', 'place an order', 'purchase', 'how to checkout'],
    answer:
      'Easy! Browse products, add what you like to the cart, then go to the cart and press Checkout. Fill in your address, choose a payment method, and confirm — that’s it. 🛍️',
  },
  {
    keywords: ['original', 'authentic', 'genuine', 'real product', 'fake', 'quality'],
    answer:
      'Yes — all our products are 100% genuine and quality-checked before shipping. If anything arrives not as described, you’re covered by our 7-day return policy.',
  },
  {
    keywords: ['track my order', 'where is my order', 'order status', 'tracking', 'track order', 'shipment'],
    answer:
      'You can track your order from the Track page (top menu → Track) using your order ID. You can also see all orders under My Account → Orders.',
  },
  {
    keywords: ['return', 'refund', 'money back', 'return policy', 'exchange', 'send back'],
    answer:
      'We accept returns within 7 days of delivery for unused items in original packaging. Refunds are processed within 3–5 business days after we receive the item. See our Refund Policy page for full details.',
  },
  {
    keywords: ['shipping', 'delivery time', 'how long', 'delivery charge', 'shipping cost', 'when will i get'],
    answer:
      'Standard delivery takes 2–4 business days inside the city and 4–7 days outside. Shipping charges are shown at checkout based on your location.',
  },
  {
    keywords: ['payment', 'payment method', 'how to pay', 'bkash', 'card', 'cash on delivery', 'cod', 'stripe'],
    answer:
      'We accept card payments (via Stripe), mobile banking, and Cash on Delivery. You can choose your method at checkout.',
  },
  {
    keywords: ['cancel order', 'cancel my order', 'cancellation'],
    answer:
      'You can cancel an order before it ships from My Account → Orders. If it has already shipped, please contact us so we can help.',
  },
  {
    keywords: ['discount', 'coupon', 'promo code', 'offer', 'voucher', 'sale'],
    answer:
      'Active discounts are shown on product pages and applied at checkout. If you have a promo code, enter it in the cart before paying.',
  },
  {
    keywords: ['account', 'login', 'sign up', 'register', 'forgot password', 'reset password'],
    answer:
      'You can sign in or create an account from the Account menu. Forgot your password? Use the “Forgot password” link on the login page to reset it.',
  },
  {
    keywords: ['contact', 'phone number', 'email', 'support', 'talk to human', 'customer service'],
    answer:
      'Our support team is here to help! Send your message here and we’ll reply by email, or reach us instantly on WhatsApp using the button below.',
  },
];

const fuse = new Fuse(faqs, {
  keys: ['keywords'],
  threshold: 0.4, // a bit lenient so typos still match, but not "match anything"
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 3,
});

/**
 * Returns a confident FAQ answer for the user's message, or null if the bot
 * doesn't know — in which case the caller should offer the WhatsApp fallback.
 */
export function matchFaq(message: string): string | null {
  const q = message.trim();
  if (q.length < 3) return null;

  const [best] = fuse.search(q, { limit: 1 });
  // score: 0 = perfect, 1 = no match. Only answer when we're fairly sure.
  if (best && best.score !== undefined && best.score <= 0.55) {
    return best.item.answer;
  }
  return null;
}
