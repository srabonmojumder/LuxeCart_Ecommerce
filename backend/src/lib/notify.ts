import { sendEmail } from './mailer.js';
import { sendSms } from './sms.js';

interface ItemLite {
  name: string;
  quantity: number;
}

const ref = (id: number) => `LC-${String(id).padStart(4, '0')}`;

const STATUS_MESSAGE: Record<string, string> = {
  PENDING: 'We received your order.',
  PAID: 'Payment confirmed — thank you!',
  PROCESSING: 'Your order is being prepared.',
  SHIPPED: 'Your order is on the way!',
  DELIVERED: 'Your order has been delivered. Enjoy!',
  CANCELLED: 'Your order has been cancelled.',
  REFUNDED: 'Your order has been refunded.',
};

/** Fire-and-forget: notify the customer that their order was placed. */
export async function notifyOrderPlaced(p: {
  to: string;
  phone?: string | null;
  name?: string | null;
  orderId: number;
  total: number;
  items: ItemLite[];
}) {
  const r = ref(p.orderId);
  const list = p.items.map((i) => `• ${i.name} × ${i.quantity}`).join('<br/>');
  const html =
    `<h2>Thank you${p.name ? `, ${p.name}` : ''}! 🎉</h2>` +
    `<p>Your order <b>${r}</b> has been placed successfully.</p>` +
    `<p>${list}</p>` +
    `<p><b>Total: $${p.total.toFixed(2)}</b></p>` +
    `<p>You can track your order anytime from your account.</p>`;

  try {
    await sendEmail({
      to: p.to,
      subject: `Order ${r} confirmed`,
      html,
      text: `Your order ${r} is confirmed. Total $${p.total.toFixed(2)}.`,
    });
  } catch (e) {
    console.error('Order-placed email failed:', e);
  }

  if (p.phone) {
    try {
      await sendSms(p.phone, `LuxeCart: Order ${r} confirmed! Total $${p.total.toFixed(2)}. Track it in your account.`);
    } catch (e) {
      console.error('Order-placed SMS failed:', e);
    }
  }
}

/** Fire-and-forget: notify the customer about an order status change. */
export async function notifyOrderStatus(p: {
  to: string;
  phone?: string | null;
  name?: string | null;
  orderId: number;
  status: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  note?: string | null;
}) {
  const r = ref(p.orderId);
  const message = STATUS_MESSAGE[p.status] ?? `Status updated to ${p.status}.`;
  const trackLine = p.trackingNumber
    ? ` Tracking: ${p.trackingNumber}${p.carrier ? ` (${p.carrier})` : ''}.`
    : '';

  const html =
    `<h2>Order ${r} update</h2>` +
    `<p><b>${p.status}</b> — ${message}</p>` +
    (p.note ? `<p>${p.note}</p>` : '') +
    (p.trackingNumber ? `<p>Tracking: <b>${p.trackingNumber}</b>${p.carrier ? ` (${p.carrier})` : ''}</p>` : '');

  try {
    await sendEmail({
      to: p.to,
      subject: `Order ${r} — ${p.status}`,
      html,
      text: `Order ${r} is now ${p.status}. ${message}${trackLine}`,
    });
  } catch (e) {
    console.error('Status email failed:', e);
  }

  if (p.phone) {
    try {
      await sendSms(p.phone, `LuxeCart: Order ${r} is now ${p.status}. ${message}${trackLine}`);
    } catch (e) {
      console.error('Status SMS failed:', e);
    }
  }
}
