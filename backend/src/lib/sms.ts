import twilio from 'twilio';
import { env } from './env.js';

// ---- Phone formatting ----

/** Normalize a phone number to E.164 (handles Bangladeshi 01XXXXXXXXX → +8801XXXXXXXXX). */
export function toE164(raw: string): string {
  const p = raw.replace(/[\s\-()]/g, '');
  if (p.startsWith('+')) return p;
  if (p.startsWith('00')) return '+' + p.slice(2);
  if (p.startsWith('880')) return '+' + p;
  if (p.startsWith('0') && p.length === 11) return '+880' + p.slice(1); // BD mobile
  return '+' + p;
}

/** Digits with country code but no '+' (most BD HTTP gateways want this, e.g. 8801827621312). */
function digits(raw: string): string {
  return toE164(raw).replace('+', '');
}

// ---- Provider selection ----

type Provider = 'twilio' | 'bulksmsbd' | 'alphasms' | 'mock';

function resolveProvider(): Provider {
  const explicit = env.SMS_PROVIDER?.trim().toLowerCase();
  if (explicit === 'twilio' || explicit === 'bulksmsbd' || explicit === 'alphasms' || explicit === 'mock') {
    return explicit;
  }
  // Auto-detect from whichever credentials are present.
  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM) return 'twilio';
  if (env.BULKSMSBD_API_KEY) return 'bulksmsbd';
  if (env.ALPHASMS_API_KEY) return 'alphasms';
  return 'mock';
}

export const smsProvider = resolveProvider();
export const smsConfigured = smsProvider !== 'mock';

const twilioClient =
  smsProvider === 'twilio' ? twilio(env.TWILIO_ACCOUNT_SID!, env.TWILIO_AUTH_TOKEN!) : null;

// ---- Providers ----

async function sendViaTwilio(toE164Number: string, body: string) {
  await twilioClient!.messages.create({ from: env.TWILIO_FROM, to: toE164Number, body });
}

async function sendViaBulkSmsBd(to: string, body: string) {
  const url = new URL('https://bulksmsbd.net/api/smsapi');
  url.searchParams.set('api_key', env.BULKSMSBD_API_KEY!);
  url.searchParams.set('type', 'text');
  url.searchParams.set('number', digits(to));
  if (env.BULKSMSBD_SENDER_ID) url.searchParams.set('senderid', env.BULKSMSBD_SENDER_ID);
  url.searchParams.set('message', body);
  const res = await fetch(url, { method: 'GET' });
  const text = await res.text();
  if (!res.ok) throw new Error(`bulksmsbd HTTP ${res.status}: ${text}`);
}

async function sendViaAlphaSms(to: string, body: string) {
  const form = new URLSearchParams();
  form.set('api_key', env.ALPHASMS_API_KEY!);
  form.set('to', digits(to));
  form.set('msg', body);
  if (env.ALPHASMS_SENDER_ID) form.set('sender_id', env.ALPHASMS_SENDER_ID);
  const res = await fetch('https://api.sms.net.bd/sendsms', { method: 'POST', body: form });
  const text = await res.text();
  if (!res.ok) throw new Error(`alphasms HTTP ${res.status}: ${text}`);
}

// ---- Public API ----

export async function sendSms(to: string, body: string) {
  const number = toE164(to);
  switch (smsProvider) {
    case 'twilio':
      return sendViaTwilio(number, body);
    case 'bulksmsbd':
      return sendViaBulkSmsBd(number, body);
    case 'alphasms':
      return sendViaAlphaSms(number, body);
    default:
      console.log(`📱 [sms:mock] → ${number} | ${body}`);
  }
}
