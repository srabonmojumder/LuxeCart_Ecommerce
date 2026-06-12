'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function PaymentForm({ onPaid }: { onPaid: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);

    const pay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setSubmitting(true);
        const { error } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
        if (error) {
            toast.error(error.message || 'Payment failed');
            setSubmitting(false);
        } else {
            // Webhook will mark the order PAID server-side; proceed to success.
            onPaid();
        }
    };

    return (
        <form onSubmit={pay} className="space-y-5">
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || submitting}
                className="w-full py-4 bg-accent text-white rounded-xl font-bold tracking-wider uppercase text-sm disabled:opacity-60"
            >
                {submitting ? 'Processing…' : 'Pay now'}
            </button>
        </form>
    );
}

/** Renders a Stripe PaymentElement for a PENDING order using a fresh PaymentIntent. */
export default function StripePayment({ orderId, onPaid }: { orderId: number; onPaid: () => void }) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.post<{ clientSecret: string }>('/payments/create-intent', { orderId }, true)
            .then((res) => setClientSecret(res.clientSecret))
            .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not start payment'));
    }, [orderId]);

    if (!stripePromise) return null;
    if (error) return <p className="text-hot text-sm font-medium">{error}</p>;
    if (!clientSecret) return <p className="text-secondary dark:text-gray-400 text-sm">Preparing secure payment…</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm onPaid={onPaid} />
        </Elements>
    );
}
