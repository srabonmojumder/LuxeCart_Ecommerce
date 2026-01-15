'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, Check, Mail, Truck, Calendar } from 'lucide-react';
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
            toast.success('Order placed successfully!');
            router.push('/order-success');
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        No Items to Checkout
                    </h2>
                    <Link href="/products">
                        <button className="btn-primary">Browse Products</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/cart" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Cart
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
                >
                    Checkout
                </motion.h1>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                                1
                            </div>
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Contact</span>
                        </div>
                        <div className="w-8 md:w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                                2
                            </div>
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Shipping</span>
                        </div>
                        <div className="w-8 md:w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                                3
                            </div>
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Payment</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="card-elevated"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Contact Information
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            We'll send your order confirmation here
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Shipping Address */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="card-elevated"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Shipping Address
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            First name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            placeholder="John"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Last name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            placeholder="Doe"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Street address
                                        </label>
                                        <input
                                            id="address"
                                            type="text"
                                            name="address"
                                            placeholder="123 Main Street"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            placeholder="New York"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            State/Province
                                        </label>
                                        <input
                                            id="state"
                                            type="text"
                                            name="state"
                                            placeholder="NY"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ZIP/Postal code
                                        </label>
                                        <input
                                            id="zipCode"
                                            type="text"
                                            name="zipCode"
                                            placeholder="10001"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Country
                                        </label>
                                        <input
                                            id="country"
                                            type="text"
                                            name="country"
                                            placeholder="United States"
                                            required
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="card-elevated"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Payment Information
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                        <Lock className="w-3 h-3 text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">Secure</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Card number
                                        </label>
                                        <input
                                            id="cardNumber"
                                            type="text"
                                            name="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                            maxLength={16}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Cardholder name
                                        </label>
                                        <input
                                            id="cardName"
                                            type="text"
                                            name="cardName"
                                            placeholder="John Doe"
                                            required
                                            value={formData.cardName}
                                            onChange={handleChange}
                                            className="input-field-lg"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Expiry date
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="expiryDate"
                                                    type="text"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    required
                                                    value={formData.expiryDate}
                                                    onChange={handleChange}
                                                    className="input-field-lg"
                                                    maxLength={5}
                                                />
                                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                CVV
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="cvv"
                                                    type="text"
                                                    name="cvv"
                                                    placeholder="123"
                                                    required
                                                    value={formData.cvv}
                                                    onChange={handleChange}
                                                    className="input-field-lg"
                                                    maxLength={3}
                                                />
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cart.map((item) => {
                                        const price = item.discount
                                            ? item.price * (1 - item.discount / 100)
                                            : item.price;

                                        return (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {item.name} x {item.quantity}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    ${(price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Tax</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span>${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: isProcessing ? 1 : 1.01 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full btn-primary mt-6 h-14 flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Place Order
                                        </>
                                    )}
                                </motion.button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                    Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
