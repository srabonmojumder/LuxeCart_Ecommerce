import LegalPageLayout from '@/components/legal/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Refund & Return Policy',
    description: 'How returns, refunds, and exchanges work at LuxeCart.',
};

export default function RefundPolicyPage() {
    return (
        <LegalPageLayout eyebrow="Policy" title="Refund & Return Policy" lastUpdated="May 30, 2026">
            <section>
                <h2>30-day returns</h2>
                <p>
                    Most items can be returned within <strong>30 days of delivery</strong>, in original
                    condition with packaging and tags intact. Items showing signs of use, missing parts,
                    or damaged through misuse may be refused or partially refunded.
                </p>
            </section>

            <section>
                <h2>Items that can&apos;t be returned</h2>
                <ul>
                    <li>Personalized or custom-made items.</li>
                    <li>Intimate items (e.g. earbuds, beauty products) once opened.</li>
                    <li>Gift cards.</li>
                    <li>Items marked &ldquo;final sale&rdquo; on the product page.</li>
                </ul>
            </section>

            <section>
                <h2>How to start a return</h2>
                <ul>
                    <li>Sign in and go to <strong>My Orders</strong>, find your order, click <strong>Request Return</strong>.</li>
                    <li>Choose a reason and add any details that help us process it.</li>
                    <li>We&apos;ll review and email return instructions within <strong>1 business day</strong>.</li>
                    <li>Pack the item securely and ship it back using the label or instructions provided.</li>
                </ul>
            </section>

            <section>
                <h2>Refund timeline</h2>
                <p>
                    Once we receive and inspect your return:
                </p>
                <ul>
                    <li>Refund issued to your original payment method within <strong>3 business days</strong>.</li>
                    <li>Depending on your bank, the credit appears in <strong>5–10 days</strong>.</li>
                    <li>You&apos;ll receive an email when the refund is processed.</li>
                </ul>
            </section>

            <section>
                <h2>Exchanges</h2>
                <p>
                    The fastest way to exchange is to return the original and place a new order. Returns
                    are processed independently of new purchases.
                </p>
            </section>

            <section>
                <h2>Damaged or wrong items</h2>
                <p>
                    If your order arrives damaged or you received the wrong product, contact us within
                    <strong> 7 days of delivery</strong> via the <a href="/contact">Contact page</a> with
                    photos. We&apos;ll arrange a free replacement or refund.
                </p>
            </section>

            <section>
                <h2>Return shipping costs</h2>
                <p>
                    For returns due to our error (damaged, defective, wrong item), we cover return shipping.
                    For other returns (change of mind), the return shipping cost is the customer&apos;s
                    responsibility.
                </p>
            </section>
        </LegalPageLayout>
    );
}
