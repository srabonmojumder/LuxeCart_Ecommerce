import LegalPageLayout from '@/components/legal/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'The rules and conditions for shopping at LuxeCart.',
};

export default function TermsPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Terms of Service" lastUpdated="May 30, 2026">
            <section>
                <h2>Acceptance of terms</h2>
                <p>
                    By accessing or using LuxeCart you agree to these Terms. If you don&apos;t agree, please
                    don&apos;t use the site. We may update these terms occasionally; the &ldquo;Last updated&rdquo; date
                    above will reflect the most recent revision.
                </p>
            </section>

            <section>
                <h2>Your account</h2>
                <ul>
                    <li>You must be at least 18 years old, or have a parent&apos;s permission.</li>
                    <li>Keep your password confidential — you&apos;re responsible for activity on your account.</li>
                    <li>One account per person. Don&apos;t create accounts for resale or scraping.</li>
                </ul>
            </section>

            <section>
                <h2>Orders and pricing</h2>
                <ul>
                    <li>All prices are shown in the currency selected at checkout and may exclude tax/shipping.</li>
                    <li>An order is only confirmed once we send a confirmation email.</li>
                    <li>We may decline or cancel an order if there&apos;s a pricing error, suspected fraud, or
                        stock issue. In that case we&apos;ll refund any charge promptly.</li>
                </ul>
            </section>

            <section>
                <h2>Payment</h2>
                <p>
                    Payments are processed by Stripe. By placing an order you authorize the charge for the
                    total shown. We do not store your full card details.
                </p>
            </section>

            <section>
                <h2>Shipping and returns</h2>
                <p>
                    See our <a href="/shipping">Shipping Policy</a> and{' '}
                    <a href="/refund-policy">Refund Policy</a> for full details. The short version: most orders
                    ship within 1–2 business days and can be returned within 30 days of delivery.
                </p>
            </section>

            <section>
                <h2>Content and reviews</h2>
                <p>
                    When you post reviews or feedback, you grant LuxeCart a non-exclusive, royalty-free
                    license to display, distribute and promote that content. Don&apos;t post anything illegal,
                    abusive, or that infringes someone else&apos;s rights — we may remove it.
                </p>
            </section>

            <section>
                <h2>Disclaimer</h2>
                <p>
                    LuxeCart is provided &ldquo;as is&rdquo;. We do our best to keep the site running smoothly and
                    information accurate, but we don&apos;t guarantee it&apos;ll be uninterrupted or error-free.
                </p>
            </section>

            <section>
                <h2>Liability</h2>
                <p>
                    To the maximum extent allowed by law, LuxeCart&apos;s liability for any claim related to a
                    product or your use of the site is limited to the amount you paid for the item in
                    question.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>
                    Questions about these Terms? Reach us via the <a href="/contact">Contact page</a>.
                </p>
            </section>
        </LegalPageLayout>
    );
}
