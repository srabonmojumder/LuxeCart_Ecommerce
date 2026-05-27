import type { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../lib/env.js';
import { sendEmail, emailConfigured } from '../lib/mailer.js';
import { getSettings } from '../lib/settings.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().toLowerCase().email('Valid email is required'),
  subject: z.string().trim().min(1, 'Subject is required').max(160),
  message: z.string().trim().min(5, 'Please write a longer message').max(5000),
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const renderInquiryEmail = ({ name, email, subject, message }: z.infer<typeof contactSchema>) => `
  <div style="font-family: Inter, Arial, sans-serif; color: #1f2937; max-width: 560px; margin: 0 auto;">
    <h2 style="margin: 0 0 8px; color: #685BC7;">New contact inquiry</h2>
    <p style="margin: 0 0 24px; color: #6b7280; font-size: 13px;">Submitted via the LuxeCart contact form</p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 8px 0; color: #6b7280; width: 90px;">From</td><td><b>${escapeHtml(name)}</b> &lt;${escapeHtml(email)}&gt;</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Subject</td><td><b>${escapeHtml(subject)}</b></td></tr>
    </table>
    <div style="margin-top: 20px; padding: 16px 20px; background: #f9fafb; border-left: 3px solid #685BC7; border-radius: 4px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</div>
    <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">Reply directly to <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a> — the From address on this notification is the store mailer.</p>
  </div>
`;

const renderAutoReply = (name: string, subject: string) => `
  <div style="font-family: Inter, Arial, sans-serif; color: #1f2937; max-width: 560px; margin: 0 auto;">
    <h2 style="margin: 0 0 8px; color: #685BC7;">Thanks, ${escapeHtml(name)}!</h2>
    <p style="line-height: 1.6;">We received your message and our team will get back to you within 24 hours.</p>
    <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">For your records, here&apos;s what you sent:</p>
    <div style="padding: 12px 16px; background: #f9fafb; border-radius: 8px; font-size: 14px;">
      <b>Subject:</b> ${escapeHtml(subject)}
    </div>
    <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">— LuxeCart Support</p>
  </div>
`;

/**
 * POST /api/contact — public; sends a contact-form message to the store's
 * support inbox (settings.supportEmail, fallback to SMTP_USER) and an
 * auto-reply to the sender. With no SMTP configured, the mailer logs to
 * console (mock mode) and the route still returns success.
 */
export const sendContact = asyncHandler(async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Invalid input';
    throw new HttpError(400, first);
  }
  const data = parsed.data;

  const settings = await getSettings();
  const supportEmail = settings?.supportEmail || env.SMTP_USER;
  if (!supportEmail) {
    throw new HttpError(500, 'Contact destination is not configured. Set settings.supportEmail or SMTP_USER.');
  }

  // Notify support
  await sendEmail({
    to: supportEmail,
    subject: `[Contact] ${data.subject}`,
    html: renderInquiryEmail(data),
    text: `New inquiry from ${data.name} <${data.email}>\nSubject: ${data.subject}\n\n${data.message}`,
  });

  // Auto-reply to the customer (best-effort — don't fail the request if it bounces)
  try {
    await sendEmail({
      to: data.email,
      subject: 'We received your message',
      html: renderAutoReply(data.name, data.subject),
      text: `Hi ${data.name},\n\nThanks for reaching out! We received your message and will get back to you within 24 hours.\n\n— LuxeCart Support`,
    });
  } catch (err) {
    console.warn('[contact] auto-reply failed:', err);
  }

  res.status(200).json({ success: true, mock: !emailConfigured });
});
