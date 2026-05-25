import { sendEmail } from './mailer.js';

const BRAND = 'LuxeCart';

/** Shared HTML shell so every transactional email looks consistent. */
function shell(heading: string, body: string, cta?: { text: string; url: string }) {
  return (
    `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1e1b2e">` +
    `<h1 style="font-size:22px;font-weight:800;letter-spacing:-0.02em">${BRAND}</h1>` +
    `<h2 style="font-size:18px;margin-top:24px">${heading}</h2>` +
    `<div style="font-size:15px;line-height:1.6;color:#3f3d56">${body}</div>` +
    (cta
      ? `<p style="margin:28px 0"><a href="${cta.url}" style="background:#c026d3;color:#fff;` +
        `text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;display:inline-block">${cta.text}</a></p>` +
        `<p style="font-size:12px;color:#8b8a9a">Or copy this link:<br/><span style="word-break:break-all">${cta.url}</span></p>`
      : '') +
    `<hr style="border:none;border-top:1px solid #eee;margin:28px 0"/>` +
    `<p style="font-size:12px;color:#8b8a9a">If you didn't request this, you can safely ignore this email.</p>` +
    `</div>`
  );
}

/** Fire-and-forget email verification link. */
export async function sendVerificationEmail(to: string, name: string | null, link: string) {
  const html = shell(
    `Verify your email${name ? `, ${name}` : ''}`,
    `<p>Welcome to ${BRAND}! Confirm your email address to secure your account and start shopping.</p>`,
    { text: 'Verify Email', url: link }
  );
  try {
    await sendEmail({ to, subject: `Verify your ${BRAND} email`, html, text: `Verify your email: ${link}` });
  } catch (e) {
    console.error('Verification email failed:', e);
  }
}

/** Fire-and-forget password reset link. */
export async function sendPasswordResetEmail(to: string, name: string | null, link: string) {
  const html = shell(
    `Reset your password${name ? `, ${name}` : ''}`,
    `<p>We received a request to reset your ${BRAND} password. This link expires in 1 hour.</p>`,
    { text: 'Reset Password', url: link }
  );
  try {
    await sendEmail({ to, subject: `Reset your ${BRAND} password`, html, text: `Reset your password: ${link}` });
  } catch (e) {
    console.error('Password reset email failed:', e);
  }
}
