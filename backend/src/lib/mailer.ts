import nodemailer from 'nodemailer';
import { env } from './env.js';

// Email is optional. With no SMTP config the app logs emails to the console
// (mock mode) so the flow works in development without a mail server.
const configured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

const transporter = configured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

export const emailConfigured = configured;

export async function sendEmail(opts: { to: string; subject: string; html: string; text?: string }) {
  if (!transporter) {
    console.log(`📧 [email:mock] → ${opts.to} | ${opts.subject}`);
    return;
  }
  await transporter.sendMail({ from: env.MAIL_FROM, ...opts });
}
