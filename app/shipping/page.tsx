import LegalPageLayout from '@/components/legal/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipping Policy',
    description: 'Delivery times, shipping rates, and tracking for LuxeCart orders.',
};

export default function ShippingPage() {
    return (
        <LegalPageLayout eyebrow="Policy" title="Shipping Policy" lastUpdated="May 30, 2026">
            <section>
                <h2>Processing time</h2>
                <p>
                    Orders are processed within <strong>1–2 business days</strong> (Monday to Friday,
                    excluding holidays). You&apos;ll receive a shipping confirmation email with tracking
                    once your order leaves our warehouse.
                </p>
            </section>

            <section>
                <h2>Delivery estimates</h2>
                <ul>
                    <li><strong>Domestic Standard:</strong> 3–7 business days</li>
                    <li><strong>Domestic Express:</strong> 1–3 business days</li>
                    <li><strong>International:</strong> 7–21 business days (customs can extend this)</li>
                </ul>
                <p>
                    These are estimates, not guarantees. Carrier delays during holidays or weather events
                    can push delivery beyond the windows above.
                </p>
            </section>

            <section>
                <h2>Shipping rates</h2>
                <ul>
                    <li>Rates are calculated at checkout based on weight, destination, and selected speed.</li>
                    <li><strong>Free standard shipping</strong> applies above the threshold shown in your cart
                        (see the cart page for current promotions).</li>
                    <li>Express options are available at checkout for an additional fee.</li>
                </ul>
            </section>

            <section>
                <h2>Tracking your order</h2>
                <p>
                    Once shipped, you can track your package three ways:
                </p>
                <ul>
                    <li>Click the link in your shipping email.</li>
                    <li>Sign in and view <strong>My Orders</strong> → the live timeline updates as your
                        package moves.</li>
                    <li>Use the public <a href="/track">Track Order</a> page with your order number and
                        email — no sign-in required.</li>
                </ul>
            </section>

            <section>
                <h2>International orders</h2>
                <p>
                    We ship to 100+ countries. Customs, duties, and import taxes are the buyer&apos;s
                    responsibility and may be collected by the carrier at delivery. Refused packages
                    that return to us will be refunded minus shipping costs.
                </p>
            </section>

            <section>
                <h2>Lost or stuck packages</h2>
                <p>
                    If your tracking hasn&apos;t updated in 7+ business days, contact us via the
                    <a href="/contact"> Contact page</a> with your order number — we&apos;ll open an
                    investigation with the carrier.
                </p>
            </section>
        </LegalPageLayout>
    );
}
