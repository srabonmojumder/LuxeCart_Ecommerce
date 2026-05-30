import LegalPageLayout from '@/components/legal/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How LuxeCart collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Privacy Policy" lastUpdated="May 30, 2026">
            <section>
                <h2>Overview</h2>
                <p>
                    LuxeCart (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
                    personal information we collect when you visit or buy from our store, how we use it,
                    and the choices you have. By using LuxeCart you agree to the terms below.
                </p>
            </section>

            <section>
                <h2>What we collect</h2>
                <h3>Information you give us</h3>
                <ul>
                    <li><strong>Account data:</strong> name, email, password (hashed), profile photo.</li>
                    <li><strong>Order data:</strong> shipping/billing address, phone, items purchased.</li>
                    <li><strong>Payment data:</strong> processed by Stripe — we never store full card numbers.</li>
                    <li><strong>Support messages:</strong> anything you send through our contact form or reviews.</li>
                </ul>

                <h3>Information collected automatically</h3>
                <ul>
                    <li>Browser type, device, language, and approximate location (from IP).</li>
                    <li>Pages viewed, products clicked, and time on site (used to improve the shop).</li>
                    <li>Cookies — see our <a href="/cookies">Cookie Policy</a>.</li>
                </ul>
            </section>

            <section>
                <h2>How we use it</h2>
                <ul>
                    <li>To fulfill orders, ship items, and provide customer support.</li>
                    <li>To send order confirmations, shipping updates, and (with consent) marketing.</li>
                    <li>To prevent fraud and keep accounts secure.</li>
                    <li>To improve the product based on aggregated, anonymized usage.</li>
                </ul>
            </section>

            <section>
                <h2>Sharing</h2>
                <p>
                    We do not sell your personal data. We share only what&apos;s needed with trusted processors:
                    Stripe (payments), our shipping carriers, our email provider, and analytics tools.
                    All operate under data-processing agreements.
                </p>
            </section>

            <section>
                <h2>Your rights</h2>
                <p>
                    You can access, correct, export, or delete your data at any time from your account
                    or by emailing us via the <a href="/contact">Contact page</a>. We respond within 7 days.
                </p>
            </section>

            <section>
                <h2>Retention</h2>
                <p>
                    Account data is kept while your account is active. Order records are kept for 7 years for
                    tax and warranty purposes, then deleted.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>
                    Questions? Reach us at <a href="/contact">our contact page</a> or write to the support
                    email shown in the site footer.
                </p>
            </section>
        </LegalPageLayout>
    );
}
