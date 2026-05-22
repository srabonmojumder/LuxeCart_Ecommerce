// Sends a real test email + SMS to verify notification delivery.
// Usage: npm run notify:test  [email]  [phone]
// With SMTP/Twilio creds in .env it really delivers; otherwise it logs (mock).
import { sendEmail, emailConfigured } from '../src/lib/mailer.js';
import { sendSms, smsConfigured, smsProvider, toE164 } from '../src/lib/sms.js';

const email = process.argv[2] || 'srabonmozumder29@gmail.com';
const phone = process.argv[3] || '01827621312';

async function main() {
  console.log(`Email: ${emailConfigured ? '✅ configured (real send)' : '⚠️  not configured (mock/console)'}`);
  console.log(`SMS:   ${smsConfigured ? `✅ provider = ${smsProvider} (real send)` : `⚠️  provider = ${smsProvider} (mock/console)`}`);
  console.log(`\nSending test → ${email} and ${toE164(phone)}\n`);

  await sendEmail({
    to: email,
    subject: 'LuxeCart — test notification ✅',
    html: '<h2>LuxeCart notification test</h2><p>If you can read this, real <b>email</b> delivery is working. 🎉</p>',
    text: 'LuxeCart notification test — if you got this, real email delivery works!',
  });

  await sendSms(phone, 'LuxeCart: test message ✅ — if you got this, real SMS delivery works!');

  console.log('\nDone.');
}

main().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
