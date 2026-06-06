'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft } from 'lucide-react';
import { useOrder, useSettings } from '@/lib/hooks';
import { useAuthStore } from '@/store/useAuthStore';

const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

export default function InvoicePage() {
    const params = useParams();
    const id = params.id as string;
    const authStatus = useAuthStore((s) => s.status);
    const { order, isLoading } = useOrder(authStatus === 'authenticated' ? id : null);
    const { settings } = useSettings();

    const cur = settings?.currencySymbol ?? '$';
    const money = (n: number) => `${cur}${n.toFixed(2)}`;

    if (authStatus === 'loading' || (authStatus === 'authenticated' && isLoading)) {
        return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (authStatus !== 'authenticated' || !order) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4 text-center">
                <div className="space-y-3">
                    <h1 className="text-2xl font-medium text-primary dark:text-white">Invoice unavailable</h1>
                    <Link href="/account" className="text-accent font-bold hover:underline">Back to your orders</Link>
                </div>
            </div>
        );
    }

    const addr = order.shippingAddress as Record<string, string>;
    const ref = `LC-${String(order.id).padStart(4, '0')}`;

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 pb-24">
            {/* hide everything but #invoice when printing */}
            <style>{`@media print {
                body * { visibility: hidden !important; }
                #invoice, #invoice * { visibility: visible !important; }
                #invoice { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; }
                .no-print { display: none !important; }
            }`}</style>

            <div className="flex items-center justify-between mb-6 no-print">
                <Link href={`/orders/${order.id}`} className="inline-flex items-center gap-2 text-[10px] font-medium tracking-widest text-accent uppercase hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to order
                </Link>
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white dark:bg-accent text-xs font-medium uppercase tracking-widest hover:opacity-90">
                    <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
            </div>

            <div id="invoice" className="bg-white text-gray-900 border border-primary/10 rounded-2xl p-8 md:p-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight">{settings?.storeName ?? 'LuxeCart'}</h1>
                        {settings?.supportEmail && <p className="text-sm text-gray-500 mt-1">{settings.supportEmail}</p>}
                        {settings?.address && <p className="text-sm text-gray-500">{settings.address}</p>}
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Invoice</p>
                        <p className="text-2xl font-medium">{ref}</p>
                        <p className="text-sm text-gray-500 mt-1">{fmtDate(order.createdAt)}</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium uppercase tracking-widest">{order.status}</span>
                    </div>
                </div>

                {/* Bill to */}
                <div className="mb-8">
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">Bill to</p>
                    <p className="text-sm leading-relaxed">
                        {addr?.fullName}<br />
                        {addr?.line1}{addr?.line2 ? `, ${addr.line2}` : ''}<br />
                        {addr?.city}{addr?.state ? `, ${addr.state}` : ''} {addr?.postalCode}<br />
                        {addr?.country}{addr?.phone ? ` · ${addr.phone}` : ''}
                    </p>
                </div>

                {/* Items */}
                <table className="w-full text-sm mb-8">
                    <thead>
                        <tr className="border-b-2 border-gray-200 text-left text-xs uppercase tracking-widest text-gray-400">
                            <th className="py-2">Item</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right">Unit</th>
                            <th className="py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((it) => (
                            <tr key={it.productId} className="border-b border-gray-100">
                                <td className="py-3 font-semibold">{it.name}</td>
                                <td className="py-3 text-center">{it.quantity}</td>
                                <td className="py-3 text-right">{money(it.price)}</td>
                                <td className="py-3 text-right font-semibold">{money(it.price * it.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
                        {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span><span>−{money(order.discount)}</span></div>}
                        <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : money(order.shipping)}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Tax</span><span>{money(order.tax)}</span></div>
                        <div className="flex justify-between font-medium text-lg pt-2 border-t-2 border-gray-200"><span>Total</span><span>{money(order.total)}</span></div>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-10">Thank you for shopping with {settings?.storeName ?? 'LuxeCart'}!</p>
            </div>
        </div>
    );
}
