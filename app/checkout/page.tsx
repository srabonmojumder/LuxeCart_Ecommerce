'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, Check, Mail, Truck, Calendar, ShieldCheck, User, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const router = useRouter();
    const cart = useStore((state) => state.cart);
    const getTotalPrice = useStore((state) => state.getTotalPrice);
    const clearCart = useStore((state) => state.clearCart);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = getTotalPrice();
    const shipping = totalPrice > 50 ? 0 : 10;
    const tax = totalPrice * 0.1;
    const finalTotal = totalPrice + shipping + tax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            clearCart();
            toast.success('Sequence completed successfully!');
            router.push('/order-success');
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="pt-24 md:pt-32 min-h-screen bg-white flex items-center justify-center px-4 pb-24">
                <div className="text-center space-y-8 max-w-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-primary/5 rounded-3xl flex items-center justify-center shadow-lg"
                    >
                        <ArrowLeft className="w-10 h-10 md:w-12 md:h-12 text-primary/20" />
                    </motion.div>
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                            Your cart is empty
                        </h2>
                        <p className="text-base text-secondary font-medium leading-relaxed">
                            Add some items to your cart before checking out.
                        </p>
                    </div>
                    <Link href="/products" className="inline-flex px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm tracking-wide">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 md:pt-32 pb-32 md:pb-40 min-h-screen bg-white">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 mb-8 md:mb-16">
                    <div className="space-y-4 md:space-y-6">
                        <Link href="/cart" className="inline-flex items-center gap-3 text-[10px] font-black tracking-widest text-accent uppercase group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Return to Cart
                        </Link>
                        <h1 className="text-3xl md:text-6xl font-black text-primary leading-tight tracking-tighter">
                            Checkout
                        </h1>
                    </div>

                    <nav className="flex items-center gap-3 md:gap-6">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center gap-2 md:gap-3">
                                <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-sm md:text-base transition-all ${step <= 3 ? 'bg-primary text-white shadow-lg' : 'bg-primary/5 text-primary/20'
                                    }`}>
                                    {step}
                                </div>
                                {step < 3 && <div className="w-6 md:w-10 h-0.5 bg-primary/10 rounded-full" />}
                            </div>
                        ))}
                    </nav>
                </header>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 md:gap-16">

                    <div className="lg:col-span-7 space-y-8 md:space-y-12">

                        {/* Section: Identity */}
                        <section className="space-y-5 md:space-y-8">
                            <div className="flex items-center gap-3 md:gap-4 border-b border-primary/20 pb-4 md:pb-6">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center text-accent">
                                    <User className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h2 className="text-lg md:text-2xl font-black text-primary tracking-tight">Contact Information</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section: Shipping */}
                        <section className="space-y-5 md:space-y-8">
                            <div className="flex items-center gap-3 md:gap-4 border-b border-primary/20 pb-4 md:pb-6">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center text-accent">
                                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h2 className="text-lg md:text-2xl font-black text-primary tracking-tight">Shipping Address</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Street Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="123 Main Street"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="New York"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section: Payment */}
                        <section className="space-y-5 md:space-y-8 p-5 md:p-8 bg-primary text-white rounded-2xl md:rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="relative z-10 space-y-5 md:space-y-8">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4 md:pb-6">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent">
                                            <Lock className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <h2 className="text-lg md:text-2xl font-black tracking-tight">Payment Details</h2>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent/20 text-accent rounded-full text-[9px] md:text-[10px] font-bold tracking-wider uppercase border border-accent/30">
                                        <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        <span className="hidden xs:inline">Secure</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            required
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 md:py-4 text-base md:text-lg font-bold placeholder:text-white/20 focus:border-accent focus:outline-none transition-all tracking-wider"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={16}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            required
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 md:py-4 text-base md:text-lg font-bold placeholder:text-white/20 focus:border-accent focus:outline-none transition-all"
                                            placeholder="MM/YY"
                                            maxLength={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            required
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 md:py-4 text-base md:text-lg font-bold placeholder:text-white/20 focus:border-accent focus:outline-none transition-all"
                                            placeholder="123"
                                            maxLength={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="lg:col-span-5 lg:sticky lg:top-28 h-fit order-first lg:order-last">
                        <section className="bg-gray-50 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-primary/5 space-y-5 md:space-y-8">
                            <h2 className="text-lg md:text-xl font-black text-primary tracking-tight">Order Summary</h2>

                            <div className="space-y-4 max-h-[200px] md:max-h-[280px] overflow-y-auto scrollbar-hide">
                                {cart.map((item) => {
                                    const price = item.discount
                                        ? item.price * (1 - item.discount / 100)
                                        : item.price;

                                    return (
                                        <div key={item.id} className="flex items-center gap-3 group">
                                            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs md:text-sm font-semibold text-primary truncate">{item.name}</p>
                                                <p className="text-[10px] md:text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-bold text-primary">
                                                ${(price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-primary/10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold text-primary">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-semibold text-primary">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-semibold text-primary">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                                    <span className="text-sm font-bold text-primary">Total</span>
                                    <span className="text-2xl md:text-3xl font-black text-primary">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: isProcessing ? 1 : 1.01 }}
                                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-4 md:py-5 bg-accent text-white rounded-xl md:rounded-2xl font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-3 shadow-lg hover:bg-accent/90 transition-all disabled:opacity-50 touch-manipulation"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Place Order
                                    </>
                                )}
                            </motion.button>

                            <div className="flex items-center justify-center gap-4 pt-2 opacity-40">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Secure Checkout</span>
                                <Lock className="w-4 h-4 text-primary" />
                            </div>
                        </section>
                    </aside>
                </form>
            </div>
        </div>
    );
}
