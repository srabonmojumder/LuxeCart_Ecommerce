import LegalPageLayout from '@/components/legal/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'How LuxeCart uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Cookie Policy" lastUpdated="May 30, 2026">
            <section>
                <h2>What are cookies?</h2>
                <p>
                    Cookies are small text files a website stores on your browser. They let the site remember
                    your preferences (like dark mode), keep you signed in between visits, and help us
                    understand how the shop is used.
                </p>
            </section>

            <section>
                <h2>Cookies we use</h2>
                <h3>Essential (always on)</h3>
                <ul>
                    <li><strong>Auth & session:</strong> keep you signed in and protect against CSRF.</li>
                    <li><strong>Cart & wishlist:</strong> remember items even if you leave the tab.</li>
                    <li><strong>Theme:</strong> remembers your light/dark preference.</li>
                </ul>

                <h3>Analytics (optional)</h3>
                <ul>
                    <li><strong>Usage analytics:</strong> aggregated, anonymized page views and clicks so we
                        can improve what isn&apos;t working.</li>
                    <li><strong>Performance:</strong> measure load times and errors to fix slow pages.</li>
                </ul>

                <h3>Marketing (optional)</h3>
                <ul>
                    <li>If you accept marketing cookies, we may use them to show relevant ads on other sites
                        and measure campaign performance.</li>
                </ul>
            </section>

            <section>
                <h2>Your choices</h2>
                <p>
                    On your first visit, our cookie banner asks whether you&apos;d like to <strong>Accept All</strong>
                    or use <strong>Essential Only</strong>. You can change your choice anytime by clearing your
                    browser data and reloading the site. Browser settings also let you block or delete
                    cookies — note that essential cookies are required for the shop to work properly.
                </p>
            </section>

            <section>
                <h2>Third parties</h2>
                <p>
                    Some essential functions rely on cookies set by trusted partners (e.g. Stripe for
                    payment fraud-protection, Google for sign-in). They&apos;re bound by their own privacy
                    policies and only receive what they need to provide the service.
                </p>
            </section>

            <section>
                <h2>More info</h2>
                <p>
                    See our <a href="/privacy">Privacy Policy</a> for the full picture of how we handle
                    your data, and reach out via the <a href="/contact">Contact page</a> with any questions.
                </p>
            </section>
        </LegalPageLayout>
    );
}
