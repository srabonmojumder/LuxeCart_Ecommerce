'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, Check, Mail, Truck, Calendar, ShieldCheck, User, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
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
            <div className="pt-32 min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center space-y-12 max-w-xl">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-48 h-48 mx-auto bg-primary/5 rounded-[4rem] flex items-center justify-center shadow-2xl"
                    >
                        <ArrowLeft className="w-16 h-16 text-primary/20" />
                    </motion.div>
                    <div className="space-y-6">
                        <h2 className="text-6xl md:text-8xl font-black text-primary tracking-tighter leading-[0.9]">
                            Void <br />Checkout.
                        </h2>
                        <p className="text-xl text-secondary font-medium leading-relaxed">
                            No items detected for processing.
                            Please return to the index to begin your selection.
                        </p>
                    </div>
                    <Link href="/products" className="btn-primary inline-flex">
                        Return to Index
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 md:pt-40 pb-48 min-h-screen bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
                    <div className="space-y-8">
                        <Link href="/cart" className="inline-flex items-center gap-6 text-[10px] font-black tracking-widest text-accent uppercase group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Selection
                        </Link>
                        <h1 className="text-6xl md:text-9xl font-black text-primary leading-[0.8] tracking-tighter">
                            Final <br />Sequence.
                        </h1>
                    </div>

                    <nav className="flex items-center gap-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black transition-all ${step <= 3 ? 'bg-primary text-white shadow-2xl' : 'bg-primary/5 text-primary/20'
                                    }`}>
                                    {step}
                                </div>
                                {step < 3 && <div className="w-12 h-0.5 bg-primary/10 rounded-full" />}
                            </div>
                        ))}
                    </nav>
                </header>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-24">

                    <div className="lg:col-span-8 space-y-24">

                        {/* Section: Identity */}
                        <section className="space-y-12">
                            <div className="flex items-center gap-6 border-b-2 border-primary pb-8">
                                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-accent">
                                    <User className="w-8 h-8" />
                                </div>
                                <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">01 / Identity</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Electronic Mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="user@luxecart.com"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Given Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="JOHN"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Family Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="DOE"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section: Logistics */}
                        <section className="space-y-12">
                            <div className="flex items-center gap-6 border-b-2 border-primary pb-8">
                                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-accent">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">02 / Logistics</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Residential Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="101 MINIMALIST DRIVE"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Administrative City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="LONDRES"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Postal Index</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="SW1A 1AA"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section: Transaction */}
                        <section className="space-y-12 p-12 bg-primary text-white rounded-[4rem] shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 space-y-12">
                                <div className="flex items-center justify-between border-b border-white/10 pb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-accent">
                                            <Lock className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-4xl font-black tracking-tighter uppercase">03 / Transaction</h2>
                                    </div>
                                    <div className="flex items-center gap-3 px-6 py-2 bg-accent/20 text-accent rounded-full text-[10px] font-black tracking-widest uppercase border border-accent/30">
                                        <ShieldCheck className="w-4 h-4" />
                                        SECURED
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Credential Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            required
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-8 py-6 text-xl font-black placeholder:text-white/20 focus:border-accent focus:outline-none transition-all tracking-[0.2em]"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            maxLength={16}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Temporal Limit</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            required
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-8 py-6 text-xl font-black placeholder:text-white/20 focus:border-accent focus:outline-none transition-all uppercase"
                                            placeholder="MM / YY"
                                            maxLength={5}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Security Matrix</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            required
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-8 py-6 text-xl font-black placeholder:text-white/20 focus:border-accent focus:outline-none transition-all"
                                            placeholder="000"
                                            maxLength={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
                        <section className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-primary/5 space-y-12">
                            <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">Manifest.</h2>

                            <div className="space-y-8 max-h-[30rem] overflow-y-auto no-scrollbar py-2">
                                {cart.map((item) => {
                                    const price = item.discount
                                        ? item.price * (1 - item.discount / 100)
                                        : item.price;

                                    return (
                                        <div key={item.id} className="flex justify-between items-center gap-6 group">
                                            <div className="relative w-16 h-20 bg-primary/5 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black tracking-tight text-primary uppercase truncate mb-1">{item.name}</p>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantity: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-black text-primary tracking-tighter">
                                                ${(price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-4 pt-10 border-t-2 border-primary/5">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Valuation</span>
                                    <span className="text-5xl font-black text-primary tracking-tighter leading-none">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                type="submit"
                                disabled={isProcessing}
                                className="w-full h-24 bg-accent text-white rounded-[2rem] font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-6 shadow-xl hover:bg-accent/90 transition-all disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        PROCESSING
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-6 h-6" />
                                        AUTHORIZE PAYMENT
                                    </>
                                )}
                            </motion.button>

                            <div className="flex items-center justify-center gap-8 pt-8 opacity-20">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <Lock className="w-6 h-6 text-primary" />
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase">End-to-End Secure</span>
                            </div>
                        </section>
                    </aside>
                </form>
            </div>
        </div>
    );
}
